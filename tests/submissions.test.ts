import { afterEach, describe, expect, mock, test } from "bun:test";
import { NextRequest } from "next/server";
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
function request(authorization?: string) {
  return new NextRequest("http://localhost/api/submission", {
    headers: authorization ? { authorization } : {},
  });
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

  test("legacy endpoint fails closed without a secret", async () => {
    configure();
    delete process.env.API_SECRET_KEY;
    const response = await legacyGET(request());
    expect(response.status).toBe(503);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(select).not.toHaveBeenCalled();
  });

  test("missing, wrong, malformed, or query-string secrets cannot read Airtable", async () => {
    configure();
    for (const header of [undefined, "Bearer wrong", "synthetic-secret", "Basic synthetic-secret", "Bearer synthetic-secret-extra"]) {
      expect((await legacyGET(request(header))).status).toBe(401);
    }
    expect((await legacyGET(new NextRequest("http://localhost/api/submission?API_SECRET_KEY=synthetic-secret"))).status).toBe(401);
    expect(select).not.toHaveBeenCalled();
  });

  test("authenticated legacy response still excludes private data", async () => {
    configure();
    const response = await legacyGET(request("Bearer synthetic-secret"));
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual([publicProject]);
    expect(select).toHaveBeenCalledWith({ view: "Granted", fields: PUBLIC_SUBMISSION_FIELDS });
  });

  test("unauthenticated gallery requests and returns only public fields", async () => {
    configure();
    delete process.env.API_SECRET_KEY;
    const response = await publicGET();
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toEqual([publicProject]);
    expect(select).toHaveBeenCalledWith({ view: "Granted", fields: PUBLIC_SUBMISSION_FIELDS });
  });

  test("gallery without Airtable credentials fails without querying", async () => {
    delete process.env.AIRTABLE_API_KEY;
    delete process.env.AIRTABLE_BASE_ID;
    expect((await publicGET()).status).toBe(503);
    expect(select).not.toHaveBeenCalled();
  });
});
