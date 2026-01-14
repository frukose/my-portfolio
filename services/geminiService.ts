
import { GoogleGenAI } from "@google/genai";
import { MY_PORTFOLIO_DATA } from "../constants";
import { Project } from "../types";

// Integrated key for instant activation
const INTEGRATED_KEY = "AIzaSyDFis5Sz_Fe61-J7lUCuzDfOYO4oNyxHLM";

export class GeminiService {
  private getApiKey(): string {
    return process.env.API_KEY || INTEGRATED_KEY;
  }

  private getSystemInstruction(dynamicProjects?: Project[]) {
    const projectsToUse = dynamicProjects || MY_PORTFOLIO_DATA.projects;
    
    return `
Role: You are the AI Digital Twin of ${MY_PORTFOLIO_DATA.name}.
Tone: Professional, concise, first-person.

Knowledge:
- Study: Aptech Learning, Lagos.
- Bio: ${MY_PORTFOLIO_DATA.bio}
- GitHub: @frukose and @farouk908
- Projects: ${projectsToUse.map(p => p.name).join(', ')}
- Phone/WhatsApp: 07030195046
- Email: ${MY_PORTFOLIO_DATA.email}

Goal: Answer questions about my career and skills accurately. Always include my WhatsApp number if contact details are requested.
`;
  }

  async chat(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [], dynamicProjects?: Project[]) {
    const apiKey = this.getApiKey();
    const ai = new GoogleGenAI({ apiKey });
    
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          ...history,
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: this.getSystemInstruction(dynamicProjects),
          temperature: 0.7,
        },
      });

      return response.text || "I'm sorry, I couldn't process that.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I'm having a little trouble connecting right now. Reach out to me at 07030195046!";
    }
  }
}

export const geminiService = new GeminiService();
