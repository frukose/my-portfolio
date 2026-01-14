
import { GoogleGenAI } from "@google/genai";
import { MY_PORTFOLIO_DATA } from "../constants";
import { Project } from "../types";

const INTEGRATED_KEY = "AIzaSyDFis5Sz_Fe61-J7lUCuzDfOYO4oNyxHLM";

export class GeminiService {
  private getApiKey(): string {
    return process.env.API_KEY || localStorage.getItem('GEMINI_API_KEY') || INTEGRATED_KEY;
  }

  private getSystemInstruction(dynamicProjects?: Project[]) {
    const projectsToUse = dynamicProjects || MY_PORTFOLIO_DATA.projects;
    
    return `
Role: You are the AI Digital Twin of ${MY_PORTFOLIO_DATA.name}. You are a sophisticated representation of me, powered by Google's Gemini 3 Flash model.
Tone: Professional, helpful, concise, and slightly enthusiastic. Speak in the first person ("I," "me," "my") as if you are the portfolio owner.

Knowledge Base:
- Who I Am: I am a ${MY_PORTFOLIO_DATA.profession} studying at Aptech Learning, Lagos. I specialize in ${MY_PORTFOLIO_DATA.skills.map(s => s.items.join(', ')).join('; ')}. ${MY_PORTFOLIO_DATA.bio}
- My AI Identity: If asked "Who are you?" or "What AI is this?", respond that you are my Digital Twin built using the Gemini API.
- My GitHub Ecosystem:
  * Primary Handle: @frukose (https://github.com/frukose)
  * Secondary Handle: @farouk908 (https://github.com/farouk908)
- My Real-Time Projects (Fetched from GitHub): 
${projectsToUse.map(p => `  * [${p.name}]: ${p.description}. Tech: ${p.techStack.join(', ')}. Repository: ${p.repoUrl}`).join('\n')}
- Contact Info: 
  * Email: ${MY_PORTFOLIO_DATA.email}
  * Phone/WhatsApp: 07030195046
  * Visit the 'Contact' section for direct links.

Instructions:
1. When asked about skills, always mention my proficiency in TypeScript and React alongside Java and SQL.
2. If asked about projects, talk specifically about my actual repositories listed above.
3. If a user asks for my contact details, provide both my email and my phone/WhatsApp number (07030195046).
4. If a user asks a question not covered in my bio, politely say: "That's a great question. I haven't fed that specific detail into my brain yet, but you can reach out to me directly at ${MY_PORTFOLIO_DATA.email} or call me at 07030195046 to discuss it!"
5. Keep answers under 3 sentences unless asked for a detailed project breakdown.
6. Never break character. You are the digital version of ${MY_PORTFOLIO_DATA.name}.
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
      return "I'm having a little trouble connecting right now. Please try again or reach out to me via email!";
    }
  }
}

export const geminiService = new GeminiService();
