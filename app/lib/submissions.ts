import Airtable from "airtable";
import { NextResponse } from "next/server";
import { PUBLIC_SUBMISSION_FIELDS, toPublicSubmission } from "./public-submission";

export async function getPublicSubmissionsResponse() {
  const headers = { "Cache-Control": "no-store" };
  if (!process.env.AIRTABLE_API_KEY || !process.env.AIRTABLE_BASE_ID) {
    return NextResponse.json({ error: "Gallery is unavailable" }, { status: 503, headers });
  }

  try {
    const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_ID);
    const records = await base("YSWS Project Submission").select({
      view: "Granted",
      fields: PUBLIC_SUBMISSION_FIELDS,
    }).all();
    return NextResponse.json(records.map(toPublicSubmission).reverse(), { headers });
  } catch {
    // Do not log upstream payloads, which may contain private Airtable data.
    console.error("Error fetching public projects");
    return NextResponse.json({ error: "Error fetching projects" }, { status: 500, headers });
  }
}
