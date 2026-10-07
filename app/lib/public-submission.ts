export interface PublicSubmission {
  id: string;
  name: string;
  description: string;
  githubUrl: string;
  playableUrl: string;
  images: { url: string }[];
}

export const PUBLIC_SUBMISSION_FIELDS = [
  "Description", "GitHub username", "Code URL", "Playable URL", "Screenshot",
];

interface ProjectRecord {
  id: string;
  get(field: string): unknown;
}

const stringValue = (value: unknown) => typeof value === "string" ? value : "";

// Explicitly allowlist public fields. Never spread Airtable fields or expose IDV
// names, Slack IDs, addresses, cities, countries, or coordinates here.
export function toPublicSubmission(record: ProjectRecord): PublicSubmission {
  const screenshots = record.get("Screenshot");
  return {
    id: record.id,
    name: stringValue(record.get("GitHub username")) || "Android app",
    description: stringValue(record.get("Description")),
    githubUrl: stringValue(record.get("Code URL")),
    playableUrl: stringValue(record.get("Playable URL")),
    images: Array.isArray(screenshots)
      ? screenshots.flatMap((image) =>
          image && typeof image.url === "string" ? [{ url: image.url }] : [])
      : [],
  };
}
