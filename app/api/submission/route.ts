import { getPublicSubmissionsResponse } from "../../lib/submissions";

// Public gallery data only: the shared serializer excludes private fields.
export async function GET() {
  return getPublicSubmissionsResponse();
}
