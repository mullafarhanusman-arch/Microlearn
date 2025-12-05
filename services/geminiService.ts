
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Microlesson, AudienceLevel } from "../types";
import { SYSTEM_PERSONA } from "../constants";

// Define the response schema
const lessonSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: "A catchy but academic title for the microlesson." },
    targetAudience: { type: Type.STRING, description: "The audience level this was generated for." },
    objective: { type: Type.STRING, description: "A single sentence starting with an action verb (e.g., Explain, Identify)." },
    keyConcepts: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "3-5 distinct bullet points defining core concepts."
    },
    content: { 
      type: Type.STRING, 
      description: "The main explanatory text. MUST be detailed, comprehensive, and go into depth. Use markdown (bolding/italics) for readability." 
    },
    researchPapers: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          source: { type: Type.STRING, description: "Publisher, Journal, or Website name" },
          date: { type: Type.STRING, description: "Year or recent date" },
          summary: { type: Type.STRING, description: "One sentence summary of the finding" },
          url: { type: Type.STRING, description: "URL if available from the context" }
        }
      },
      description: "3 latest research papers or key industry developments found in the context."
    },
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "A rigorous multiple-choice knowledge check question." },
          options: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Exactly 4 options: One correct answer and three plausible distractors."
          },
          correctIndex: { type: Type.INTEGER, description: "The index (0-3) of the correct answer." },
          explanation: { type: Type.STRING, description: "Brief explanation of why the correct answer is right." }
        },
        required: ["question", "options", "correctIndex", "explanation"]
      },
      description: "A comprehensive quiz containing between 5 and 10 questions assessing the lesson content."
    },
    isValid: { type: Type.BOOLEAN, description: "True if the topic was valid, False if nonsense/violation." },
    errorMessage: { type: Type.STRING, description: "If invalid, the reason why." }
  },
  required: ["title", "objective", "keyConcepts", "content", "quiz", "isValid"]
};

// Helper: Perform a search to get latest context
// We use a separate call because we cannot mix `googleSearch` tool with `responseSchema` (JSON mode) in a single request effectively.
async function performResearch(ai: GoogleGenAI, topic: string): Promise<string> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Find 3 distinct, latest (last 2 years) research papers, key breakthroughs, or authoritative articles regarding: "${topic}". 
      For each, provide the Title, Source, Date, and a brief summary of the key finding.`,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });
    return response.text || "No specific research found.";
  } catch (e) {
    console.warn("Research step failed, proceeding with internal knowledge.", e);
    return "Research unavailable.";
  }
}

export const generateMicrolesson = async (
  topic: string,
  audience: string
): Promise<Microlesson | null> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelId = 'gemini-2.5-flash';

    // Step 1: Gather Research Context (Search Grounding)
    // We strictly separate this to ensure we get real web results before synthesizing the JSON.
    const researchContext = await performResearch(ai, topic);

    // Step 2: Synthesize Lesson (JSON Mode)
    const prompt = `
      Input Topic: "${topic}"
      Target Audience Level: "${audience}"
      
      Research Context (Use this to populate the 'researchPapers' field and enrich the 'content'):
      ${researchContext}

      Generate a structured microlesson based on these inputs.
      The 'content' section must be DETAILED and COMPREHENSIVE, effectively summarizing the topic with depth.
      Include the research papers found in the context in the 'researchPapers' array.
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_PERSONA,
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.3,
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned from Gemini");

    const data = JSON.parse(jsonText);

    if (!data.isValid) {
      throw new Error(data.errorMessage || "Invalid Topic or Constraint Violation.");
    }

    return {
      title: data.title,
      targetAudience: data.targetAudience,
      objective: data.objective,
      keyConcepts: data.keyConcepts,
      content: data.content,
      quiz: data.quiz,
      researchPapers: data.researchPapers
    };

  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
};
