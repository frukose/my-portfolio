
import { MY_PORTFOLIO_DATA } from './constants';
import { ChatBubble } from './components/ChatBubble';
import { Project } from './types';
import React, { useState, useEffect } from 'react';

type Page = 'home' | 'about' | 'skills' | 'projects' | 'contact';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
  const [formState, setFormState] = useState({ name: '', email: '', message: '' });
  const [isCopied, setIsCopied] = useState(false);

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
          .filter((repo: any) => !repo.fork)
          .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count);

        const mappedProjects: Project[] = mergedRepos.map((repo: any) => {
          const lang = repo.language?.toLowerCase() || 'code';
          let imageUrl = `https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=1200`;
          if (lang.includes('java')) imageUrl = `https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=1200`;
          if (lang.includes('javascript') || lang.includes('typescript')) imageUrl = `https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=1200`;
          if (lang.includes('react')) imageUrl = `https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=1200`;

          return {
            id: repo.id.toString(),
            name: repo.name.replace(/-/g, ' ').replace(/_/g, ' '),
            description: repo.description || "A professional software engineering project.",
            techStack: [repo.language, ...(repo.topics || [])].filter(Boolean),
            imageUrl: imageUrl,
            repoUrl: repo.html_url,
            liveDemoUrl: repo.homepage || "#",
            longDescription: `${repo.description || 'No description available.'} This project highlights my proficiency in ${repo.language || 'modern software patterns'}. It was developed to solve architectural challenges while maintaining high code quality.`,
            problemSolved: repo.description ? `Directly addressed the need for ${repo.description.toLowerCase()} by implementing an efficient, scalable solution.` : `Streamlined complex workflows using ${repo.language || 'clean code'} principles.`
          };
        });
        setProjects(mappedProjects);
      } catch (error) {
        setProjects(MY_PORTFOLIO_DATA.projects);
      } finally {
        setIsLoadingProjects(false);
      }
    };
    fetchGitHubProjects();
  }, []);

  const navigate = (page: Page) => {
    setCurrentPage(page);
    setIsMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert('Message Received! I will get back to you shortly at ' + formState.email);
    setFormState({ name: '', email: '', message: '' });
  };

  const handleShare = async (project: Project) => {
    const shareData = {
      title: `Project: ${project.name}`,
      text: `Check out ${project.name}, a project by Olorunishola Farouk. ${project.description}`,
      url: project.repoUrl || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Share cancelled or failed', err);
      }
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy text: ', err);
      }
    }
  };

  const renderHome = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-black tracking-widest uppercase shadow-sm">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
          Ready for New Challenges
        </div>
        <h1 className="text-6xl md:text-9xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
          Olorunishola <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Farouk.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mb-12 leading-relaxed font-medium">
          I bridge the gap between complex backend logic and intuitive frontend experiences. 
          Currently refining my craft at <span className="text-gray-900 font-bold border-b-2 border-indigo-400">Aptech Learning</span>.
        </p>
        <div className="flex flex-wrap gap-5 justify-center">
          <button onClick={() => navigate('projects')} className="group bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95 flex items-center gap-3">
            View Projects <i className="fas fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
          </button>
          <button onClick={() => navigate('contact')} className="bg-white text-gray-900 border-2 border-gray-100 px-12 py-5 rounded-2xl font-black text-lg hover:border-indigo-600 transition-all active:scale-95">
            Let's Talk
          </button>
        </div>
      </section>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-700 py-16 px-6 max-w-6xl mx-auto">
      <div className="mb-20">
        <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">The <span className="text-indigo-600">Architect</span> behind the code.</h2>
        <div className="grid lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-8 text-xl text-gray-600 leading-relaxed font-medium">
            <p className="first-letter:text-5xl first-letter:font-black first-letter:text-indigo-600 first-letter:mr-3 first-letter:float-left">
              {MY_PORTFOLIO_DATA.bio}
            </p>
            <p>
              My approach to software is rooted in clean code and efficient architecture. Whether I'm designing a database schema in SQL or building a responsive component in React, I prioritize long-term maintainability and user-centric design.
            </p>
            <div className="grid md:grid-cols-2 gap-8 pt-8">
              <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
                <h4 className="text-indigo-600 font-black uppercase text-xs tracking-widest mb-4">Philosophy</h4>
                <p className="text-gray-900 font-bold leading-snug">"Simple is better than complex. Functional is better than just beautiful."</p>
              </div>
              <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
                <h4 className="text-white/60 font-black uppercase text-xs tracking-widest mb-4">Location</h4>
                <p className="text-white font-bold text-2xl">Lagos, Nigeria</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="sticky top-32">
              <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" alt="Tech" />
              <div className="mt-8 flex gap-4">
                <div className="flex-1 p-6 bg-white rounded-2xl text-center border border-gray-100">
                  <p className="text-3xl font-black text-indigo-600">Aptech</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Training</p>
                </div>
                <div className="flex-1 p-6 bg-white rounded-2xl text-center border border-gray-100">
                  <p className="text-3xl font-black text-indigo-600">2024</p>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Active Year</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="animate-in fade-in slide-in-from-left-8 duration-700 py-16 px-6 max-w-7xl mx-auto">
      <div className="text-center mb-24">
        <h2 className="text-5xl md:text-7xl font-black mb-6 tracking-tight">The <span className="text-indigo-600">Toolkit.</span></h2>
        <p className="text-gray-500 text-xl font-medium max-w-2xl mx-auto">A specialized selection of technologies I've mastered to build scalable and modern web applications.</p>
      </div>
      <div className="grid lg:grid-cols-3 gap-10">
        {MY_PORTFOLIO_DATA.skills.map((skill, idx) => {
          const accents = [
            { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'fa-layer-group', border: 'border-blue-100', dot: 'bg-blue-600' },
            { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'fa-server', border: 'border-emerald-100', dot: 'bg-emerald-600' },
            { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'fa-database', border: 'border-orange-100', dot: 'bg-orange-600' }
          ][idx];
          
          return (
            <div key={idx} className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100 hover:shadow-2xl hover:border-indigo-100 transition-all group flex flex-col h-full">
              <div className={`w-16 h-16 ${accents.bg} ${accents.text} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <i className={`fas ${accents.icon} text-2xl`}></i>
              </div>
              <h3 className="text-3xl font-black mb-2 text-gray-900">{skill.category}</h3>
              <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mb-8">Specialization</p>
              <div className="flex flex-wrap gap-3 mt-auto">
                {skill.items.map((item, i) => (
                  <span key={i} className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${accents.bg} ${accents.text} border ${accents.border} hover:scale-105 active:scale-95 cursor-default`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${accents.dot}`}></span>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="animate-in fade-in zoom-in-95 duration-700 py-16 px-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
        <div>
          <h2 className="text-5xl md:text-7xl font-black mb-4 tracking-tight">Recent <span className="text-indigo-600">Work.</span></h2>
          <p className="text-gray-500 text-xl font-medium">Real-time repository data from my development environment.</p>
        </div>
        <div className="flex gap-4">
          <div className="px-6 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-3">
             <i className="fab fa-github text-indigo-600 text-xl"></i>
             <span className="font-black text-sm uppercase tracking-widest">{projects.length} Total</span>
          </div>
        </div>
      </div>
      
      {isLoadingProjects ? (
        <div className="grid md:grid-cols-3 gap-10">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="bg-white border border-gray-100 h-[500px] rounded-[3rem] p-8 flex flex-col justify-between">
              <div className="w-full h-48 bg-gray-50 rounded-2xl animate-pulse"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-50 w-3/4 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-50 w-full rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-10">
          {projects.map((project) => (
            <div key={project.id} className="group bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 hover:shadow-2xl hover:-translate-y-3 transition-all duration-500 flex flex-col h-full">
              <div className="relative h-64 overflow-hidden">
                <img src={project.imageUrl} alt={project.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
              <div className="p-10 flex flex-col flex-1">
                <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                  {project.techStack.slice(0, 3).map((tech, i) => (
                    <span key={i} className="whitespace-nowrap bg-indigo-50 text-indigo-600 px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                      {tech}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-black mb-4 text-gray-900 capitalize leading-tight line-clamp-2">{project.name}</h3>
                <p className="text-gray-500 text-lg mb-8 line-clamp-2 font-medium">{project.description}</p>
                <button onClick={() => setSelectedProject(project)} className="mt-auto w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-all flex items-center justify-center gap-3">
                   View Case Study <i className="fas fa-arrow-right text-xs"></i>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const renderContact = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-16 px-6 max-w-7xl mx-auto">
      <div className="bg-gray-900 rounded-[4rem] p-10 md:p-20 text-white grid lg:grid-cols-2 gap-20 overflow-hidden relative shadow-3xl">
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-3xl -ml-64 -mb-64"></div>
        <div className="relative z-10 flex flex-col justify-center">
          <h2 className="text-5xl md:text-8xl font-black mb-8 leading-none tracking-tighter">Let's <span className="text-indigo-400">Connect.</span></h2>
          <p className="text-2xl text-indigo-100/60 mb-16 font-medium leading-relaxed">I'm currently available for internships and junior full-stack roles in Lagos or remote environments.</p>
          <div className="space-y-10">
            <div className="flex items-center gap-8 group">
              <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10 group-hover:bg-indigo-600 group-hover:border-indigo-500 transition-all">
                <i className="fas fa-paper-plane text-2xl text-indigo-400 group-hover:text-white"></i>
              </div>
              <div>
                <p className="text-indigo-400 text-xs font-black uppercase tracking-widest mb-1">Direct Email</p>
                <a href={`mailto:${MY_PORTFOLIO_DATA.email}`} className="text-2xl md:text-3xl font-black hover:text-indigo-300 transition-colors break-all">{MY_PORTFOLIO_DATA.email}</a>
              </div>
            </div>
            <div className="flex gap-6 pt-10">
              <a href="https://github.com/frukose" target="_blank" className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all border border-white/10"><i className="fab fa-github text-3xl"></i></a>
              <a href="https://github.com/farouk908" target="_blank" className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all border border-white/10"><i className="fab fa-github text-3xl"></i></a>
              <a href="https://www.linkedin.com/in/farouk-olorunishola-545a20356" target="_blank" className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center hover:bg-white hover:text-gray-900 transition-all border border-white/10"><i className="fab fa-linkedin text-3xl"></i></a>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[3rem] p-10 md:p-14 text-gray-900 shadow-2xl relative z-10">
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Full Name</label>
              <input type="text" required value={formState.name} onChange={(e) => setFormState({...formState, name: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-5 focus:ring-0 focus:border-indigo-600 outline-none font-bold transition-all" placeholder="Enter your name" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Email Address</label>
              <input type="email" required value={formState.email} onChange={(e) => setFormState({...formState, email: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-5 focus:ring-0 focus:border-indigo-600 outline-none font-bold transition-all" placeholder="your@email.com" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-2">Your Message</label>
              <textarea rows={4} required value={formState.message} onChange={(e) => setFormState({...formState, message: e.target.value})} className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-5 focus:ring-0 focus:border-indigo-600 outline-none font-bold transition-all resize-none" placeholder="What are you working on?"></textarea>
            </div>
            <button className="w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-100 active:scale-95 flex items-center justify-center gap-4">
               Send Message <i className="fas fa-paper-plane text-sm"></i>
            </button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] selection:bg-indigo-600 selection:text-white pb-24 md:pb-0">
      <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-2xl z-[60] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <button onClick={() => navigate('home')} className="text-3xl font-black text-gray-900 tracking-tighter flex items-center gap-1">
            <span className="text-indigo-600">O</span>F<span className="text-indigo-600 text-4xl leading-none">.</span>
          </button>
          
          <div className="hidden md:flex items-center gap-12">
            {(['about', 'skills', 'projects', 'contact'] as Page[]).map(page => (
              <button 
                key={page} 
                onClick={() => navigate(page)}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative group ${currentPage === page ? 'text-indigo-600' : 'text-gray-400 hover:text-gray-900'}`}
              >
                {page}
                <span className={`absolute -bottom-2 left-0 w-full h-0.5 bg-indigo-600 scale-x-0 group-hover:scale-x-100 transition-transform ${currentPage === page ? 'scale-x-100' : ''}`}></span>
              </button>
            ))}
          </div>

          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden w-12 h-12 flex items-center justify-center text-gray-900 bg-gray-50 rounded-xl">
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars-staggered'} text-xl`}></i>
          </button>
        </div>

        {isMenuOpen && (
          <div className="md:hidden absolute top-24 left-0 right-0 bg-white border-b border-gray-100 p-8 flex flex-col gap-8 animate-in slide-in-from-top-4 duration-300 shadow-xl">
            {(['about', 'skills', 'projects', 'contact'] as Page[]).map(page => (
              <button key={page} onClick={() => navigate(page)} className="text-2xl font-black uppercase text-left tracking-tighter hover:text-indigo-600 transition-colors">{page}</button>
            ))}
          </div>
        )}
      </nav>

      <main className="relative z-10 pt-24 min-h-screen">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'about' && renderAbout()}
        {currentPage === 'skills' && renderSkills()}
        {currentPage === 'projects' && renderProjects()}
        {currentPage === 'contact' && renderContact()}
      </main>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-gray-950/90 backdrop-blur-xl transition-opacity animate-in fade-in duration-300" onClick={() => setSelectedProject(null)}></div>
          <div className="relative bg-white rounded-[4rem] w-full max-w-5xl max-h-[90vh] overflow-y-auto shadow-3xl animate-in zoom-in-95 duration-500 no-scrollbar">
            <div className="relative h-80 md:h-[450px]">
              <img src={selectedProject.imageUrl} alt={selectedProject.name} className="w-full h-full object-cover" />
              <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 w-14 h-14 bg-white/10 hover:bg-white/20 text-white rounded-2xl flex items-center justify-center transition-all backdrop-blur-2xl border border-white/20"><i className="fas fa-times text-2xl"></i></button>
            </div>
            <div className="p-12 md:p-20">
              <div className="flex flex-wrap gap-3 mb-8">
                {selectedProject.techStack.map((tech, i) => (
                  <span key={i} className="px-5 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-[11px] font-black uppercase tracking-widest border border-indigo-100">{tech}</span>
                ))}
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-gray-900 mb-8 capitalize leading-tight tracking-tighter">{selectedProject.name}</h3>
              
              <div className="grid lg:grid-cols-5 gap-16 items-start">
                <div className="lg:col-span-3 space-y-12">
                  <div>
                    <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-600 mb-6 flex items-center gap-3">
                      <span className="w-8 h-[2px] bg-indigo-600"></span>
                      Project Narrative
                    </h4>
                    <p className="text-2xl text-gray-600 leading-relaxed font-medium">{selectedProject.longDescription || selectedProject.description}</p>
                  </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                  {selectedProject.problemSolved && (
                    <div className="p-10 bg-indigo-50 rounded-[3rem] border border-indigo-100 shadow-sm relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full -mr-12 -mt-12"></div>
                      <h4 className="text-[11px] font-black uppercase tracking-widest text-indigo-800 mb-6 flex items-center gap-3">
                        <i className="fas fa-bolt"></i> Problem Addressed
                      </h4>
                      <p className="text-indigo-900 font-bold italic leading-relaxed text-lg">
                        "{selectedProject.problemSolved}"
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-col gap-4">
                    <a href={selectedProject.repoUrl} target="_blank" className="bg-gray-900 text-white py-6 rounded-2xl font-black text-center hover:bg-indigo-600 transition-all shadow-xl shadow-gray-200 active:scale-95 flex items-center justify-center gap-4">
                      <i className="fab fa-github text-2xl"></i> Inspect Code
                    </a>
                    <button 
                      onClick={() => handleShare(selectedProject)} 
                      className={`py-6 rounded-2xl font-black text-center transition-all active:scale-95 flex items-center justify-center gap-4 border-2 ${isCopied ? 'bg-emerald-50 border-emerald-500 text-emerald-600' : 'bg-white text-gray-900 border-gray-100 hover:border-indigo-600'}`}
                    >
                      <i className={`fas ${isCopied ? 'fa-check' : 'fa-share-nodes'} text-xl`}></i>
                      {isCopied ? 'Link Copied!' : 'Share Project'}
                    </button>
                    {selectedProject.liveDemoUrl && selectedProject.liveDemoUrl !== "#" && (
                      <a href={selectedProject.liveDemoUrl} target="_blank" className="bg-white text-gray-900 border-2 border-gray-100 py-6 rounded-2xl font-black text-center hover:border-indigo-600 transition-all active:scale-95 flex items-center justify-center gap-4">
                        <i className="fas fa-external-link-alt"></i> Live Experience
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <ChatBubble dynamicProjects={projects} />
      
      <footer className="py-20 border-t border-gray-100 text-center bg-white">
        <div className="max-w-7xl mx-auto px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-gray-400 font-black text-xs uppercase tracking-[0.3em]">&copy; {new Date().getFullYear()} Olorunishola Farouk</p>
          <div className="flex gap-10">
            <a href="https://github.com/frukose" className="text-gray-400 hover:text-indigo-600 transition-colors font-black text-xs uppercase tracking-widest">GitHub One</a>
            <a href="https://github.com/farouk908" className="text-gray-400 hover:text-indigo-600 transition-colors font-black text-xs uppercase tracking-widest">GitHub Two</a>
            <a href="https://www.linkedin.com/in/farouk-olorunishola-545a20356" target="_blank" className="text-gray-400 hover:text-indigo-600 transition-colors font-black text-xs uppercase tracking-widest">LinkedIn</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
