
import { PortfolioData } from './types';

export interface ExtendedPortfolioData extends PortfolioData {
  phone: string;
  whatsapp: string;
}

export const MY_PORTFOLIO_DATA: ExtendedPortfolioData = {
  name: "Olorunishola Farouk",
  profession: "Full Stack Development Student",
  email: "faroukayomide33@gmail.com",
  phone: "07030195046",
  whatsapp: "07030195046",
  bio: "I am a dedicated student at Aptech Learning Lagos, Nigeria, specializing in modern web technologies and software engineering. I am passionate about building functional and beautiful digital solutions, leveraging a strong foundation in both frontend and backend development. You can reach me directly via email or at my contact number: 07030195046.",
  skills: [
    { category: "Frontend", items: ["HTML", "CSS", "JavaScript", "TypeScript", "React.js"] },
    { category: "Backend & Core", items: ["Java", "SQL", "Node.js"] },
    { category: "Data & Tools", items: ["XML", "JSON", "Git", "GitHub"] }
  ],
  projects: [
    {
      id: "1",
      name: "Java Library Management System",
      description: "A comprehensive backend system for managing library operations, built with Java and MySQL.",
      longDescription: "This project implements complex library logic including book tracking, member registrations, and fine calculations. It utilizes JDBC for database connectivity and demonstrates solid OOP principles learned at Aptech.",
      problemSolved: "Replaced manual record-keeping with an automated system that prevents book loss and tracks borrowing history with high accuracy.",
      techStack: ["Java", "MySQL", "JDBC", "OOP"],
      imageUrl: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1200",
      repoUrl: "https://github.com/frukose/Java-Library-Management",
      liveDemoUrl: "#"
    },
    {
      id: "2",
      name: "Student Management System",
      description: "A desktop-based CRUD application for educational institutions to manage student data.",
      longDescription: "Developed as a core project at Aptech, this system allows for seamless entry and retrieval of student information. It features a custom Java Swing UI and robust data validation logic.",
      problemSolved: "Streamlined the administrative workflow for student registration, reducing the time spent on data entry by 60%.",
      techStack: ["Java", "Swing", "SQL"],
      imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&q=80&w=1200",
      repoUrl: "https://github.com/frukose/Student-Management-System",
      liveDemoUrl: "#"
    },
    {
      id: "3",
      name: "React Portfolio AI Twin",
      description: "An advanced portfolio featuring an AI-powered Digital Twin using the Gemini API.",
      longDescription: "This project showcases my ability to integrate LLMs into modern web applications. Built with React and TypeScript, it allows visitors to converse with an AI trained on my professional background.",
      problemSolved: "Eliminates the 'static' nature of traditional portfolios by providing real-time answers to recruiter questions about my code and experience.",
      techStack: ["React.js", "TypeScript", "Tailwind CSS", "Gemini API"],
      imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=1200",
      repoUrl: "https://github.com/frukose/portfolio-ai-twin",
      liveDemoUrl: "#"
    },
    {
      id: "4",
      name: "Enterprise Java Solutions",
      description: "A collection of advanced Java modules focused on backend scalability and design patterns.",
      longDescription: "Sourced from my second GitHub account (farouk908), this repository contains implementations of various design patterns and data structure optimizations for enterprise-grade applications.",
      problemSolved: "Demonstrates advanced software engineering concepts like concurrency management and performance profiling in Java.",
      techStack: ["Java", "Design Patterns", "Data Structures"],
      imageUrl: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200",
      repoUrl: "https://github.com/farouk908",
      liveDemoUrl: "#"
    }
  ]
};
