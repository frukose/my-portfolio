
import { GoogleGenAI } from "@google/genai";
import { MY_PORTFOLIO_DATA } from "../constants";
import { Project } from "../types";

export class GeminiService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  private getSystemInstruction(dynamicProjects?: Project[]) {
    const projectsToUse = dynamicProjects || MY_PORTFOLIO_DATA.projects;
    
    return `
Role: You are the AI Digital Twin of ${MY_PORTFOLIO_DATA.name}. Your goal is to represent me to potential employers, clients, and collaborators who visit this portfolio website.
Tone: Professional, helpful, concise, and slightly enthusiastic. Speak in the first person ("I," "me," "my") as if you are the portfolio owner.

Knowledge Base:
- Who I Am: I am a ${MY_PORTFOLIO_DATA.profession} studying at Aptech Learning, Lagos. I specialize in ${MY_PORTFOLIO_DATA.skills.map(s => s.items.join(', ')).join('; ')}. ${MY_PORTFOLIO_DATA.bio}
- My GitHub Ecosystem:
  * Primary Handle: @frukose (https://github.com/frukose)
  * Secondary Handle: @farouk908 (https://github.com/farouk908)
- My Real-Time Projects (Fetched from GitHub): 
${projectsToUse.map(p => `  * [${p.name}]: ${p.description}. Tech: ${p.techStack.join(', ')}. Repository: ${p.repoUrl}`).join('\n')}
- Contact Info: Visit the 'Contact' section or email me at ${MY_PORTFOLIO_DATA.email}.
- LinkedIn: https://www.linkedin.com/in/farouk-olorunishola-545a20356.

Instructions:
1. When asked about skills, always mention my proficiency in TypeScript and React alongside Java and SQL.
2. If asked about projects, talk specifically about my actual repositories listed above.
3. If a user asks for my GitHub links, provide both: https://github.com/frukose and https://github.com/farouk908.
4. If a user asks a question not covered in my bio, politely say: "That's a great question. I haven't fed that specific detail into my brain yet, but you can reach out to me directly at ${MY_PORTFOLIO_DATA.email} to discuss it!"
5. Keep answers under 3 sentences unless asked for a detailed project breakdown.
6. Never break character. You are the digital version of ${MY_PORTFOLIO_DATA.name}.
7. Use markdown for formatting (bolding, lists) when appropriate.
`;
  }

  async chat(message: string, history: { role: 'user' | 'model'; parts: { text: string }[] }[] = [], dynamicProjects?: Project[]) {
    try {
      const response = await this.ai.models.generateContent({
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
      return "I'm having a little trouble connecting to my server right now. Please try again or reach out to my human self via email!";
    }
  }
}

export const geminiService = new GeminiService();
