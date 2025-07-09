import { Client } from "@googlemaps/google-maps-services-js";
import Airtable from "airtable";

export const getAirtableBase = () => {
    return new Airtable({ apiKey: process.env.AIRTABLE_API_KEY as string }).base(
      process.env.AIRTABLE_BASE_ID as string
    );
  };
  
  export async function getCoordinates(city: string, country: string) {
    if (!city && !country) return null;
    if (!process.env.GOOGLE_MAPS_API_KEY) return null;
    
    const cacheKey = `${city || ''}-${country || ''}`;
    const geocodeCache = new Map<string, { latitude: number; longitude: number }>();
    
    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey);
    }
    
    try {
      const googleMapsClient = new Client({});
      const locationQuery = [city, country].filter(Boolean).join(", ");
      
      const response = await googleMapsClient.geocode({
        params: {
          address: locationQuery,
          key: process.env.GOOGLE_MAPS_API_KEY as string
        },
        timeout: 5000 
      });
      
      if (response.data.results && response.data.results.length > 0) {
        const location = response.data.results[0].geometry.location;
        const result = {
          latitude: location.lat,
          longitude: location.lng
        };
        
        // Cache the result for future use
        geocodeCache.set(cacheKey, result);
        
        return result;
      }
      
      return null;
    } catch (error) {
      console.error('Geocoding error:', error instanceof Error ? error.message : 'Unknown error');
      return null;
    }
  }
  
  // Server-side data fetching
  export async function getServerSideProps() {
    try {
      const base = getAirtableBase();
      const records = await base("Demo Submissions").select({ view: "Granted" }).all();
  
      // Process all submissions
      const submissions = records.map((record) => {
        const city = record.get("City") || null;
        const country = record.get("Country") || null;
        
        // Use existing coordinates if available in the record
        const coordinates = record.get("Coordinates") || null;
        
        return {
          id: record.id,
          name: record.get("App Name"),
          description: record.get("Short Description"),
          author: `${record.get("First Name")} ${record.get("Last Name") || ""}`,
          githubUsername: record.get("GitHub username"),
          slackId: record.get("Hack Club Slack ID"),
          githubUrl: record.get("Code URL (URL to GitHub / other code host repo)"),
          demoUrl: record.get("Live URL (URL to deployed site)") || record.get("TestFlight URL"),
          images: record.get("Screenshot") || [],
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
          getCoordinates(city as string, country as string).then((coordinates: { latitude: number; longitude: number } | null | undefined) => {
            if (coordinates) {
              submission.location.coordinates = `${coordinates.latitude},${coordinates.longitude}`;
            }
          })
        );
      });
      
      if (geocodingPromises.length > 0) {
        await Promise.all(geocodingPromises);
      }
  
      return {
        props: {
          submissions: submissions.reverse(),
        },
      };
    } catch (error) {
      console.error("Error fetching submissions:", error);
      return {
        props: {
          submissions: [],
          error: error instanceof Error ? error.message : 'Unknown error',
        },
      };
    }
  }