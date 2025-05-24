import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_GOOGLE_GEMINI_API_KEY });

async function generateTravelPlanFromData(formData) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents : `
Generate a travel plan strictly in JSON format only. Do not include any explanation, comments, or text outside the JSON. 

Inputs:
- Location: ${formData.location}
- Duration: ${formData.noOfDays} days
- Number of People: ${formData.noOfpeople}
- Budget: ${formData.budget}

Required JSON schema:
{
  "hotels": [
    {
      "hotelName": "string",
      "hotelAddress": "string",
      "price": number,
      "hotelImageUrl": "string",
      "geoCoordinates": { "lat": number, "lng": number },
      "rating": number,
      "description": "string"
    }
  ],
  "travelPlan": {
    "day1": [
      {
        "placeName": "string",
        "placeDetails": "string",
        "placeImageUrl": "string",
        "geoCoordinates": { "lat": number, "lng": number },
        "ticketPricing": number,
        "rating": number,
        "timeToTravel": "string",
        "bestTimeToVisit": "string"
      }
    ],
    "day2": [...],
    "day3": [...]
  }
}

Important:
-Don't return any empty fields.If only one day is there, then return only that day.
-For each day atleast 3 places must be there.
- All fields must be present.
-Give atleast 8 hotel recommendations with their details.
- Respond with only the raw JSON (no markdown, no explanations).
`

  });
  const textPart=response.text;
  const jsonString = textPart.replace(/```json\n/i, '').replace(/```$/i, '');
  const jsonData = JSON.parse(jsonString);
  return jsonData;
  
}

export default generateTravelPlanFromData;
