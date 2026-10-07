import { createHash, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { getPublicSubmissionsResponse } from "../../lib/submissions";

export async function GET(request: NextRequest) {
  const secret = process.env.API_SECRET_KEY;
  if (!secret) {
    return NextResponse.json({ error: "Submission API is disabled" }, {
      status: 503, headers: { "Cache-Control": "no-store" },
    });
  }

  const authorization = request.headers.get("authorization") || "";
  const digest = (value: string) => createHash("sha256").update(value).digest();
  if (!timingSafeEqual(digest(authorization), digest(`Bearer ${secret}`))) {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers: { "Cache-Control": "no-store", "WWW-Authenticate": "Bearer" },
    });
  }

  // Even authenticated callers receive only the public project projection.
  return getPublicSubmissionsResponse();
}
