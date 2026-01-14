
import { MY_PORTFOLIO_DATA } from './constants';
import { ChatBubble } from './components/ChatBubble';
import { Project } from './types';
import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });

  useEffect(() => {
    const fetchGitHubProjects = async () => {
      setIsLoadingProjects(true);
      const accounts = ['frukose', 'farouk908'];
      
      try {
        const allReposPromises = accounts.map(account => 
          fetch(`https://api.github.com/users/${account}/repos?sort=updated&per_page=10`)
            .then(res => res.json())
        );

        const results = await Promise.all(allReposPromises);
        const mergedRepos = results.flat()
          .filter((repo: any) => !repo.fork) // Only original projects
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count); // Sort by popularity/stars

        const mappedProjects: Project[] = mergedRepos.map((repo: any) => {
          // Determine a placeholder image based on the main language
          const lang = repo.language?.toLowerCase() || 'code';
          let imageUrl = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200`; // Default code
          
          if (lang.includes('java')) imageUrl = `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200`;
          if (lang.includes('javascript') || lang.includes('typescript')) imageUrl = `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200`;
          if (lang.includes('react')) imageUrl = `https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200`;

          return {
            id: repo.id.toString(),
            name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
            description: repo.description || "A project developed as part of my professional journey in software engineering.",
            techStack: [repo.language, ...(repo.topics || [])].filter(Boolean),
            imageUrl: imageUrl,
            repoUrl: repo.html_url,
            liveDemoUrl: repo.homepage || "#",
            longDescription: `${repo.description || 'No description available.'} This repository is part of my ${repo.owner.login} GitHub profile. It has ${repo.stargazers_count} stars and was last updated on ${new Date(repo.updated_at).toLocaleDateString()}.`,
            problemSolved: repo.description ? `Focused on providing a clean implementation of ${repo.name} using ${repo.language || 'modern coding standards'}.` : "Demonstrating clean code and efficient project structure."
          };
        });

        setProjects(mappedProjects.slice(0, 9)); // Show top 9 projects
      } catch (error) {
        console.error("Error fetching projects:", error);
        // Fallback to static data if API fails
        setProjects(MY_PORTFOLIO_DATA.projects);
      } finally {
        setIsLoadingProjects(false);
      }
    };

    fetchGitHubProjects();
  }, []);

  const closeModal = () => setSelectedProject(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert("Thank you! Since this is a portfolio demo, the message hasn't been sent, but in a production app, I'd receive your email immediately.");
    setFormState({ name: '', email: '', message: '' });
  };

  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-40 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <span className="text-xl font-bold text-indigo-600">{MY_PORTFOLIO_DATA.name}</span>
          <div className="hidden md:flex gap-8 text-gray-600 font-medium">
            <a href="#about" className="hover:text-indigo-600 transition-colors">About</a>
            <a href="#skills" className="hover:text-indigo-600 transition-colors">Skills</a>
            <a href="#projects" className="hover:text-indigo-600 transition-colors">Projects</a>
            <a href="#contact" className="hover:text-indigo-600 transition-colors">Contact</a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-b from-indigo-50 to-white">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 mb-6">
            Building the <span className="text-indigo-600">Future</span> from Lagos.
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
            Hi, I'm {MY_PORTFOLIO_DATA.name}, a {MY_PORTFOLIO_DATA.profession} at Aptech Learning. I craft digital experiences with a focus on learning and innovation.
          </p>
          <div className="flex gap-4 justify-center">
            <a href="#projects" className="bg-indigo-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
              View My Work
            </a>
            <div className="flex gap-2">
              <a href="https://github.com/frukose" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-full font-semibold hover:border-indigo-600 transition-all flex items-center gap-2">
                <i className="fab fa-github"></i> @frukose
              </a>
              <a href="https://github.com/farouk908" target="_blank" rel="noopener noreferrer" className="bg-white text-gray-900 border border-gray-200 px-6 py-3 rounded-full font-semibold hover:border-indigo-600 transition-all flex items-center gap-2">
                <i className="fab fa-github"></i> @farouk908
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img 
              src="https://picsum.photos/seed/farouk/800/800" 
              alt={MY_PORTFOLIO_DATA.name} 
              className="rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                  <i className="fas fa-graduation-cap text-indigo-600"></i>
                </div>
                <div>
                  <p className="text-sm text-gray-500 font-medium">Studying at</p>
                  <p className="font-bold text-gray-900">Aptech Learning</p>
                </div>
              </div>
            </div>
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-6">About Me</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              {MY_PORTFOLIO_DATA.bio}
            </p>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Location</h4>
                <p className="text-gray-600">Lagos, Nigeria</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Education</h4>
                <p className="text-gray-600">Advanced Diploma in Software Engineering</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">My Toolkit</h2>
          <p className="text-gray-600">Technologies I'm mastering at Aptech.</p>
        </div>
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {MY_PORTFOLIO_DATA.skills.map((skill, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold mb-6 text-indigo-600">{skill.category}</h3>
              <div className="flex flex-wrap gap-2">
                {skill.items.map((item, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-medium">
                    {item}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">Live Repositories</h2>
          <p className="text-gray-600">Dynamically fetched from my GitHub profiles.</p>
        </div>
        
        {isLoadingProjects ? (
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="bg-gray-100 animate-pulse h-80 rounded-3xl"></div>
            ))}
          </div>
        ) : (
          <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
            {projects.map((project) => (
              <div key={project.id} className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 hover:-translate-y-2 transition-all duration-300">
                <div className="relative overflow-hidden h-48">
                  <img 
                    src={project.imageUrl} 
                    alt={project.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold text-gray-900 shadow-sm">
                    {project.techStack[0] || 'Project'}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.techStack.slice(0, 3).map((tech, i) => (
                      <span key={i} className="text-[10px] uppercase tracking-wider font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-gray-900 capitalize">{project.name}</h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-2">
                    {project.description}
                  </p>
                  <button 
                    onClick={() => setSelectedProject(project)}
                    className="text-indigo-600 font-bold text-sm flex items-center gap-2 group-hover:gap-3 transition-all"
                  >
                    View Project Details <i className="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm transition-opacity" onClick={closeModal}></div>
          <div className="relative bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/20 hover:bg-black/40 text-white rounded-full flex items-center justify-center transition-colors shadow-lg"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
            
            <img 
              src={selectedProject.imageUrl} 
              alt={selectedProject.name} 
              className="w-full h-64 md:h-80 object-cover"
            />
            
            <div className="p-8">
              <div className="flex flex-wrap gap-2 mb-4">
                {selectedProject.techStack.map((tech, i) => (
                  <span key={i} className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-wide">
                    {tech}
                  </span>
                ))}
              </div>
              <h3 className="text-3xl font-extrabold text-gray-900 mb-4 capitalize">{selectedProject.name}</h3>
              
              <div className="mb-8">
                <h4 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-2">
                  <i className="fas fa-info-circle"></i> Overview
                </h4>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {selectedProject.longDescription || selectedProject.description}
                </p>
              </div>

              {selectedProject.problemSolved && (
                <div className="mb-8 p-6 bg-indigo-50 rounded-2xl border border-indigo-100">
                  <h4 className="text-sm font-bold text-indigo-800 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <i className="fas fa-lightbulb"></i> Note
                  </h4>
                  <p className="text-indigo-900/80 leading-relaxed italic">
                    "{selectedProject.problemSolved}"
                  </p>
                </div>
              )}
              
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href={selectedProject.repoUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-indigo-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  <i className="fab fa-github"></i>
                  Source Code
                </a>
                {selectedProject.liveDemoUrl && selectedProject.liveDemoUrl !== "#" && (
                  <a 
                    href={selectedProject.liveDemoUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex-1 bg-white text-gray-900 border border-gray-200 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:border-indigo-600 transition-colors"
                  >
                    <i className="fas fa-external-link-alt"></i>
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 bg-indigo-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl font-extrabold mb-6">Let's start a <span className="text-indigo-400">Conversation</span></h2>
              <p className="text-xl text-indigo-100 mb-10 leading-relaxed max-w-lg">
                I'm currently seeking internship opportunities and entry-level roles. Whether you have a question or just want to say hi, my inbox is always open!
              </p>
              <div className="space-y-6 mb-12">
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-800/50 flex items-center justify-center border border-indigo-700 group-hover:bg-indigo-600 transition-colors">
                    <i className="fas fa-envelope text-xl text-indigo-300"></i>
                  </div>
                  <div>
                    <p className="text-indigo-300 text-sm font-medium uppercase tracking-wider">Email Me</p>
                    <a href={`mailto:${MY_PORTFOLIO_DATA.email}`} className="text-lg font-bold hover:text-indigo-400 transition-colors">{MY_PORTFOLIO_DATA.email}</a>
                  </div>
                </div>
                <div className="flex items-center gap-5 group">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-800/50 flex items-center justify-center border border-indigo-700 group-hover:bg-indigo-600 transition-colors">
                    <i className="fas fa-map-marker-alt text-xl text-indigo-300"></i>
                  </div>
                  <div>
                    <p className="text-indigo-300 text-sm font-medium uppercase tracking-wider">Based In</p>
                    <p className="text-lg font-bold">Lagos, Nigeria</p>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <a href="https://www.linkedin.com/in/farouk-olorunishola-545a20356" target="_blank" rel="noopener noreferrer" className="bg-indigo-900/50 border border-indigo-800 p-6 rounded-3xl hover:border-indigo-400 hover:bg-indigo-900 transition-all group">
                  <i className="fab fa-linkedin text-2xl mb-4 text-indigo-400 group-hover:scale-110 transition-transform"></i>
                  <p className="font-bold">LinkedIn</p>
                  <p className="text-sm text-indigo-300">Professional Profile</p>
                </a>
                <div className="flex flex-col gap-2">
                  <a href="https://github.com/frukose" target="_blank" rel="noopener noreferrer" className="bg-indigo-900/50 border border-indigo-800 p-3 rounded-2xl hover:border-indigo-400 hover:bg-indigo-900 transition-all flex items-center gap-3">
                    <i className="fab fa-github text-lg text-indigo-400"></i>
                    <span className="text-sm font-bold">frukose</span>
                  </a>
                  <a href="https://github.com/farouk908" target="_blank" rel="noopener noreferrer" className="bg-indigo-900/50 border border-indigo-800 p-3 rounded-2xl hover:border-indigo-400 hover:bg-indigo-900 transition-all flex items-center gap-3">
                    <i className="fab fa-github text-lg text-indigo-400"></i>
                    <span className="text-sm font-bold">farouk908</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/10 p-8 md:p-10 rounded-[2.5rem] shadow-2xl">
              <form onSubmit={handleFormSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-indigo-200 mb-2">Your Name</label>
                  <input type="text" required value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} placeholder="Jane Doe" className="w-full bg-indigo-900/30 border border-indigo-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-200 mb-2">Email Address</label>
                  <input type="email" required value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} placeholder="jane@example.com" className="w-full bg-indigo-900/30 border border-indigo-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-indigo-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-indigo-200 mb-2">Message</label>
                  <textarea rows={4} required value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})} placeholder="Tell me about your project or inquiry..." className="w-full bg-indigo-900/30 border border-indigo-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-indigo-400 resize-none"></textarea>
                </div>
                <button type="submit" className="w-full bg-indigo-500 hover:bg-indigo-400 text-white py-5 rounded-xl font-bold text-lg transition-all shadow-lg shadow-indigo-900 flex items-center justify-center gap-3 active:scale-[0.98]">
                  <i className="fas fa-paper-plane"></i> Send Message
                </button>
              </form>
              <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-indigo-300 font-medium">Available for work</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-clock text-indigo-400"></i>
                  <span className="text-sm text-indigo-300 font-medium">&lt; 24h response</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="py-12 bg-white border-t border-gray-100 text-center">
        <p className="text-gray-500 text-sm">© {new Date().getFullYear()} {MY_PORTFOLIO_DATA.name} | Aptech Learning Lagos.</p>
      </footer>

      <ChatBubble dynamicProjects={projects} />
    </div>
  );
};

export default App;
