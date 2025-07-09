import Airtable from "airtable";
import { NextRequest, NextResponse } from "next/server";

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(
  process.env.AIRTABLE_BASE_ID as string
);

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const body = await request.json();
    
    return new Promise<Response>((resolve) => {
      base("Email Submissions").create([{ fields: { Email: body.email } }], (err: Error | null) => {
        if (err) {
          console.error(err);
          resolve(NextResponse.json({ error: "Something went wrong" }, { status: 500 }));
        } else {
          resolve(NextResponse.json({ message: "Email submitted" }, { status: 200 }));
        }
      });
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}