import { afterEach, describe, expect, mock, test } from "bun:test";
import { PUBLIC_SUBMISSION_FIELDS, toPublicSubmission } from "../app/lib/public-submission";

const fields: Record<string, unknown> = {
  "First Name": "PRIVATE_FIRST", "Last Name": "PRIVATE_LAST",
  "Slack ID": "PRIVATE_SLACK", City: "PRIVATE_CITY", Country: "PRIVATE_COUNTRY",
  Address: "PRIVATE_ADDRESS", Coordinates: "PRIVATE_COORDINATES", Email: "PRIVATE_EMAIL",
  Description: "A synthetic Android project", "GitHub username": "public-handle",
  "Code URL": "https://github.com/example/app", "Playable URL": "https://example.com/app",
  Screenshot: [{ url: "https://example.com/screenshot.png", filename: "PRIVATE_FILENAME", extra: "PRIVATE_METADATA" }],
};
const record = { id: "recSynthetic", get: (field: string) => fields[field] };
const select = mock(() => ({ all: async () => [record] }));
mock.module("airtable", () => ({
  default: class {
    base() { return () => ({ select }); }
  },
}));
const { GET: legacyGET } = await import("../app/api/submission/route");
const { GET: publicGET } = await import("../app/api/projects/route");
const originalEnv = { ...process.env };

afterEach(() => {
  for (const key of ["API_SECRET_KEY", "AIRTABLE_API_KEY", "AIRTABLE_BASE_ID"]) {
    if (originalEnv[key] === undefined) delete process.env[key];
    else process.env[key] = originalEnv[key];
  }
  select.mockClear();
});

function configure() {
  process.env.API_SECRET_KEY = "synthetic-secret";
  process.env.AIRTABLE_API_KEY = "synthetic-airtable-token";
  process.env.AIRTABLE_BASE_ID = "synthetic-base";
}
const publicProject = {
  id: "recSynthetic", name: "public-handle", description: "A synthetic Android project",
  githubUrl: "https://github.com/example/app", playableUrl: "https://example.com/app",
  images: [{ url: "https://example.com/screenshot.png" }],
};

describe("submission privacy", () => {
  test("projection excludes private fields and attachment metadata", () => {
    const accessed: string[] = [];
    expect(toPublicSubmission({ id: record.id, get(field) { accessed.push(field); return fields[field]; } })).toEqual(publicProject);
    expect(accessed.sort()).toEqual([...PUBLIC_SUBMISSION_FIELDS].sort());
    expect(JSON.stringify(toPublicSubmission(record))).not.toContain("PRIVATE_");
  });

  test("missing public fields do not fall back to legal names", () => {
    expect(toPublicSubmission({ id: "empty", get: () => undefined })).toEqual({
      id: "empty", name: "Android app", description: "", githubUrl: "", playableUrl: "", images: [],
    });
  });

  test("submissions are public without a secret and exclude private data", async () => {
    configure();
    delete process.env.API_SECRET_KEY;
    const response = await legacyGET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual([publicProject]);
    expect(select).toHaveBeenCalledWith({ view: "Granted" });
  });

  test("missing optional fields cannot reject the Airtable query or leak names", async () => {
    configure();
    select.mockImplementationOnce(() => ({ all: async () => [{
      id: "recOptionalFieldsMissing",
      get: (field: string) => field === "GitHub username" ? undefined : fields[field],
    }] }));
    const response = await publicGET();
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload[0].name).toBe("Android app");
    expect(JSON.stringify(payload)).not.toContain("PRIVATE_");
    expect(select).toHaveBeenCalledWith({ view: "Granted" });
  });

  test("unauthenticated gallery returns only public fields", async () => {
    configure();
    delete process.env.API_SECRET_KEY;
    const response = await publicGET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual([publicProject]);
    expect(select).toHaveBeenCalledWith({ view: "Granted" });
  });

  test("gallery without Airtable credentials fails without querying", async () => {
    delete process.env.AIRTABLE_API_KEY;
    delete process.env.AIRTABLE_BASE_ID;
    expect((await publicGET()).status).toBe(503);
    expect(select).not.toHaveBeenCalled();
  });
});
