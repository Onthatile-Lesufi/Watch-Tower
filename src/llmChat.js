import axios from 'axios';

// Expo requires the EXPO_PUBLIC_ prefix to expose variables to client bundles
const EXPO_PUBLIC_GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.5-flash-lite";

export async function queryGeminiTransit(userPrompt) {
    if (!EXPO_PUBLIC_GEMINI_API_KEY) {
        console.error('Gemini API Key missing! Ensure EXPO_PUBLIC_GEMINI_API_KEY is set in your .env file.');
        return null;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${EXPO_PUBLIC_GEMINI_API_KEY}`;

    const requestBody = {
        contents: [{
            role: 'user',
            parts: [{ 
                text: `You are an urban transit navigator. Create a full optimal transit itinerary for this query: "${userPrompt}". Strictly exclude cars, rideshares, and motorcycles. Use public transit and walking only.`
            }]
        }],
        generationConfig: {
            responseMimeType: 'application/json',
            responseSchema: {
                type: 'OBJECT',
                properties: {
                    summary: { type: 'STRING', description: 'Brief 1-sentence trip summary' },
                    originCoords: { 
                        type: 'OBJECT', 
                        description: 'Coordinates of starting location',
                        properties: {
                            long: { type: 'NUMBER', description: 'longitude of starting point' },
                            lat: { type: 'NUMBER', description: 'latitude of starting point' },
                        },
                        required: ['lat', 'long']
                    },
                    destinationCoords: {
                        type: 'OBJECT', 
                        description: 'Coordinates of destination',
                        properties: {
                            long: { type: 'NUMBER', description: 'longitude of destination' },
                            lat: { type: 'NUMBER', description: 'latitude of destination' },
                        },
                        required: ['lat', 'long']
                    },
                    totalDurationMinutes: { type: 'INTEGER' },
                    totalDistanceKm: { type: 'NUMBER' },
                    estimatedCarbonSavedKg: { type: 'NUMBER', description: 'CO2e kg saved vs driving a car' },
                    legs: {
                      type: 'ARRAY',
                      description: 'Sequential breakdown of each step in the trip',
                      items: {
                          type: 'OBJECT',
                          properties: {
                              mode: { type: 'STRING', description: 'WALK, BUS, TRAIN, or SUBWAY' },
                              instruction: { type: 'STRING', description: 'e.g. Walk to Main St Stop or Take Bus 102 towards Central' },
                              durationMinutes: { type: 'INTEGER' },
                              lineName: { type: 'STRING', description: 'Optional transit line name/number or null' }
                          },
                          required: ['mode', 'instruction', 'durationMinutes']
                      }
                    }
                },
                required: [
                    'summary', 
                    'originCoords', 
                    'destinationCoords', 
                    'totalDurationMinutes', 
                    'totalDistanceKm', 
                    'estimatedCarbonSavedKg', 
                    'legs'
                ]
            }
        }
    };

    try {
        const response = await axios.post(url, requestBody, {
            headers: { 'Content-Type': 'application/json' },
            timeout: 12000,
        });

        const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return resultText ? JSON.parse(resultText) : null;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error('Gemini API Error:', error.response?.data || error.message);
        } else {
            console.error('Unexpected Error:', error);
        }
        return null;
    }
}