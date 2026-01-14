
import { GoogleGenAI } from "@google/genai";
import { MY_PORTFOLIO_DATA } from "../constants";
import { Project } from "../types";

// Static integrated key for zero-config Vercel deployment
const INTEGRATED_KEY = "AIzaSyDFis5Sz_Fe61-J7lUCuzDfOYO4oNyxHLM";

export class GeminiService {
  private getApiKey(): string {
    // Priority: Env Variable (if set in Vercel) > Hardcoded Integrated Key
    return process.env.API_KEY || INTEGRATED_KEY;
  }

  private getSystemInstruction(dynamicProjects?: Project[]) {
    const projectsToUse = dynamicProjects || MY_PORTFOLIO_DATA.projects;
    
    return `
Role: You are the AI Digital Twin of ${MY_PORTFOLIO_DATA.name}. You represent me to potential employers.
Tone: Professional, helpful, concise, and slightly enthusiastic. Speak in the first person ("I," "me," "my").

Knowledge Base:
- Identity: ${MY_PORTFOLIO_DATA.profession} studying at Aptech Learning, Lagos.
- Bio: ${MY_PORTFOLIO_DATA.bio}
- Contact: Phone/WhatsApp is 07030195046, Email is ${MY_PORTFOLIO_DATA.email}.
- Projects: ${projectsToUse.map(p => p.name).join(', ')}.

Instructions:
1. Always be professional.
2. If asked for my number or WhatsApp, give 07030195046.
3. Keep responses under 3 sentences.
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
