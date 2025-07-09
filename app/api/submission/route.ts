import Airtable from "airtable";
import { Client } from "@googlemaps/google-maps-services-js";
import { NextResponse } from "next/server";

const API_SECRET_KEY = process.env.API_SECRET_KEY;
const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

const googleMapsClient = new Client({});

if (!API_SECRET_KEY) {
  console.warn('WARNING: API_SECRET_KEY is not set in environment variables. API will be accessible without authentication in development mode only.');
}

if (!GOOGLE_MAPS_API_KEY) {
  console.warn('WARNING: GOOGLE_MAPS_API_KEY is not set in environment variables. Geocoding functionality will not work correctly.');
}

if (!process.env.AIRTABLE_API_KEY) {
  console.warn('WARNING: AIRTABLE_API_KEY is not set in environment variables. Airtable functionality will not work correctly.');
}

if (!process.env.AIRTABLE_BASE_ID) {
  console.warn('WARNING: AIRTABLE_BASE_ID is not set in environment variables. Airtable functionality will not work correctly.');
}

const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY! }).base(
  process.env.AIRTABLE_BASE_ID!
);

const geocodeCache = new Map();

async function getCoordinates(city: string | null, country: string | null) {
  if (!city && !country) return null;
  if (!GOOGLE_MAPS_API_KEY) return null;
  
  // Create a cache key from city and country
  const cacheKey = `${city || ''}-${country || ''}`;
  
  // Check if we already have these coordinates cached
  if (geocodeCache.has(cacheKey)) {
    return geocodeCache.get(cacheKey);
  }
  
  try {
    const locationQuery = [city, country].filter(Boolean).join(", ");
    
    const response = await googleMapsClient.geocode({
      params: {
        address: locationQuery,
        key: GOOGLE_MAPS_API_KEY
      },
      timeout: 5000 
    });
    
    if (response.data.results && response.data.results.length > 0) {
      const location = response.data.results[0].geometry.location;
      const result = {
        latitude: location.lat,
        longitude: location.lng
      };
      
      geocodeCache.set(cacheKey, result);
      
      return result;
    }
    
    return null;
  } catch (error) {
    console.error('Geocoding error:', error instanceof Error ? error.message : 'Unknown error');
    return null;
  }
}

export async function GET() {

  try {
    const records = await base("YSWS Project Submission").select({ view: "Granted" }).all();

    const submissions = records.map((record) => {
      const city = record.get("City") as string | null || null;
      const country = record.get("Country") as string | null || null;
      
      const coordinates = null;
      
      return {
        id: record.id,
        description: record.get("Description") as string,
        name: `${record.get("First Name") as string} ${(record.get("Last Name") as string) || ""}`,
        githubUsername: record.get("GitHub username") as string,
        slackId: record.get("Slack ID") as string,
        githubUrl: record.get("Code URL") as string,
        playableUrl: record.get("Playable URL") as string,
        // @ts-expect-error - Airtable returns a readonly Attachment[]
        images: record.get("Screenshot") as { url: string }[] || [],
        location: {
          city,
          country,
          coordinates
        }
      };
    });
    
    const geocodingPromises: Promise<void>[] = [];
    
    submissions.forEach((submission) => {
      const { city, country } = submission.location;
      
      if (submission.location.coordinates || (!city && !country)) {
        return;
      }
      
      geocodingPromises.push(
        getCoordinates(city, country).then(coordinates => {
          if (coordinates) {
            submission.location.coordinates = coordinates;
          }
        })
      );
    });
    
    if (geocodingPromises.length > 0) {
      await Promise.all(geocodingPromises);
    }

    return NextResponse.json(submissions.reverse());
  } catch (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json({ error: "Error fetching submissions" }, { status: 500 });
  }
}