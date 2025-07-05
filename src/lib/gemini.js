import { GoogleGenAI, Type } from "@google/genai";

// Initialize Gemini AI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

/**
 * Judge flirt message and provide AI scoring with structured output
 * @param {string} flirtText - The flirt message to judge
 * @param {Object} profileInfo - User profile information for context
 * @returns {Promise<Object>} - Structured response with score and feedback
 */
export async function judgeFlirt(flirtText, profileInfo = {}) {
  const { name = "someone", bio = "", hobbies = [], traits = [] } = profileInfo;

  const prompt = `
    Judge this flirt message on a scale of 1-10 based on creativity, humor, charm, and appropriateness.
    
    Flirt message: "${flirtText}"
    
    Context about the person:
    - Name: ${name}
    - Bio: ${bio}
    - Hobbies: ${hobbies.join(", ")}
    - Personality traits: ${traits.join(", ")}
    
    Provide a score (1-10) and a constructive feedback (2 short sentences max).
  `;

  const response = await ai.models.generateContent({
    model: process.env.GOOGLE_GENAI_MODEL_ID,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          score: {
            type: Type.NUMBER,
            description: "Score from 1-10 rating the flirt quality",
          },
          feedback: {
            type: Type.STRING,
            description:
              "Constructive feedback about the flirt (2 short sentences max)",
          },
        },
        propertyOrdering: ["score", "feedback"],
      },
    },
  });

  return JSON.parse(response.text);
}

/**
 * Generate flirt suggestions that the user can send to someone they're interested in
 * @param {Object} userProfile - The user's own profile information to inform their flirting style
 * @returns {Promise<Array>} - Array of flirt messages the user can send
 */
export async function getFlirtSuggestions(userProfile = {}) {
  const { name = "someone", bio = "", hobbies = [], traits = [] } = userProfile;

  const prompt = `
    Generate 5 flirt messages for someone to send to a person they're interested in. The tone should be:
    - Confident but playful  
    - Witty with clever wordplay  
    - Slightly mysterious or bold  
    - Rhythmic and smooth (like poetry or a catchy hook)  

    **Inspiration Examples:**  
    - "No paint in sight and you're still drawing my attention."  
    - "How am I supposed to plan our wedding without your number?"  
    - "Hi, my name is [X], but you can call me tomorrow."  
    - "Aside from being this good looking, what else do you do in your spare time?"  

    **Sender’s Context (Optional):**  
    - Name: ${name}  
    - Bio: ${bio}  
    - Hobbies: ${hobbies.join(", ")}  
    - Traits: ${traits.join(", ")}  

    **Rules:**  
    1. Avoid overused pickup lines.  
    2. If no context is given, make them universally charming.  
    3. Prioritize creativity and flow over explicitness.  
  `;

  const response = await ai.models.generateContent({
    model: process.env.GOOGLE_GENAI_MODEL_ID,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            text: {
              type: Type.STRING,
              description: "The flirt message text",
            },
            style: {
              type: Type.STRING,
              description: "Playful, witty, mysterious, or bold",
            },
            estimatedScore: {
              type: Type.NUMBER,
              description: "Estimated charm score (1-10)",
            },
          },
          propertyOrdering: ["text", "style", "estimatedScore"],
        },
      },
    },
  });

  return JSON.parse(response.text);
}

/**
 * Judge and score user profile information
 * @param {Object} profileInfo - User profile information to judge
 * @returns {Promise<Object>} - Structured response with profile score and feedback
 */
export async function judgeProfile(profileInfo = {}) {
  const { name = "someone", bio = "", hobbies = [], traits = [] } = profileInfo;

  const prompt = `
    Analyze this dating profile and provide an attractiveness/appeal score (1-10) with constructive feedback (2 short sentences max):
    
    Profile Information:
    - Name: ${name}
    - Bio: ${bio}
    - Hobbies: ${hobbies.join(", ")}
    - Personality traits: ${traits.join(", ")}
    
    Consider factors like completeness, authenticity, appeal, and how well the profile showcases personality. If name is "someone" and bio, hobbies, traits are empty, score it zero and suggest to fill out the profile. Otherwise, provide a score based on the provided information.
  `;

  const response = await ai.models.generateContent({
    model: process.env.GOOGLE_GENAI_MODEL_ID,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          profileScore: {
            type: Type.NUMBER,
            description: "Profile score from 1-10",
          },
          feedback: {
            type: Type.STRING,
            description:
              "Constructive feedback on the profile (2 short sentences max)",
          },
        },
        propertyOrdering: ["profileScore", "feedback"],
      },
    },
  });

  return JSON.parse(response.text);
}
