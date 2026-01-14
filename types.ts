
export interface Project {
  id: string;
  name: string;
  description: string;
  longDescription?: string;
  problemSolved?: string;
  techStack: string[];
  imageUrl: string;
  repoUrl?: string;
  liveDemoUrl?: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface PortfolioData {
  name: string;
  profession: string;
  skills: Skill[];
  projects: Project[];
  email: string;
  bio: string;
}
