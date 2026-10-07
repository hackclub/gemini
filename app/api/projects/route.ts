import { getPublicSubmissionsResponse } from "../../lib/submissions";

export async function GET() {
  return getPublicSubmissionsResponse();
}
