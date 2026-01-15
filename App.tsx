import { MY_PORTFOLIO_DATA } from './constants';
import { Project } from './types';
import React, { useState, useEffect } from 'react';

type Page = 'home' | 'about' | 'skills' | 'projects' | 'contact';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(true);
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
            longDescription: `${repo.description || 'No description available.'} This project highlights my proficiency in ${repo.language || 'modern software patterns'}.`,
            problemSolved: repo.description ? `Directly addressed the need for ${repo.description.toLowerCase()}.` : `Streamlined complex workflows.`
          };
        });
        setProjects(mappedProjects.length > 0 ? mappedProjects : MY_PORTFOLIO_DATA.projects);
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
    alert('Message Received! I will get back to you shortly.');
  };

  const handleShare = async (project: Project) => {
    const shareData = {
      title: project.name,
      text: project.description,
      url: project.repoUrl || window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) {}
    } else {
      try {
        await navigator.clipboard.writeText(`${shareData.text} ${shareData.url}`);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      } catch (err) {}
    }
  };

  const renderHome = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <section className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] -z-10 animate-pulse"></div>
        <div className="inline-flex items-center gap-2 px-5 py-2 mb-8 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-black tracking-widest uppercase shadow-sm">
          <span className="w-2 h-2 bg-indigo-600 rounded-full animate-ping"></span>
          Open to New Opportunities
        </div>
        <h1 className="text-6xl md:text-9xl font-black text-gray-900 mb-8 tracking-tighter leading-none">
          Olorunishola <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-blue-500">Farouk.</span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-500 max-w-3xl mb-12 leading-relaxed font-medium">
          Specializing in Full Stack Development at <span className="text-gray-900 font-bold border-b-2 border-indigo-400">Aptech Learning</span>. 
          I build scalable backend logic and seamless frontend interfaces.
        </p>
        <div className="flex flex-wrap gap-5 justify-center">
          <button onClick={() => navigate('projects')} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-lg hover:bg-indigo-700 transition-all shadow-2xl shadow-indigo-200 active:scale-95">
            View Projects
          </button>
          <button onClick={() => navigate('contact')} className="bg-white text-gray-900 border-2 border-gray-100 px-12 py-5 rounded-2xl font-black text-lg hover:border-indigo-600 transition-all active:scale-95">
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-in fade-in slide-in-from-right-8 duration-700 py-16 px-6 max-w-6xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tight">The <span className="text-indigo-600">Architect</span> behind the code.</h2>
      <div className="grid lg:grid-cols-3 gap-16">
        <div className="lg:col-span-2 space-y-8 text-xl text-gray-600 leading-relaxed font-medium">
          <p>{MY_PORTFOLIO_DATA.bio}</p>
          <div className="grid md:grid-cols-2 gap-8 pt-8">
            <div className="p-8 bg-white rounded-[2rem] border border-gray-100 shadow-sm">
              <h4 className="text-indigo-600 font-black uppercase text-xs tracking-widest mb-4">Philosophy</h4>
              <p className="text-gray-900 font-bold leading-snug">"Code is for humans to read, and only incidentally for machines to execute."</p>
            </div>
            <div className="p-8 bg-indigo-600 rounded-[2rem] text-white shadow-xl shadow-indigo-100">
              <h4 className="text-white/60 font-black uppercase text-xs tracking-widest mb-4">Focus</h4>
              <p className="text-white font-bold text-2xl">Modern Web Architecture</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" className="rounded-[3rem] shadow-2xl grayscale" alt="Software Engineering" />
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="animate-in fade-in slide-in-from-left-8 duration-700 py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight text-center">Technical <span className="text-indigo-600">Stack.</span></h2>
      <div className="grid lg:grid-cols-3 gap-10">
        {MY_PORTFOLIO_DATA.skills.map((skill, idx) => (
          <div key={idx} className="bg-white p-12 rounded-[3rem] shadow-sm border border-gray-100">
            <h3 className="text-3xl font-black mb-8 text-gray-900">{skill.category}</h3>
            <div className="flex flex-wrap gap-3">
              {skill.items.map((item, i) => (
                <span key={i} className="px-5 py-2.5 rounded-xl text-sm font-black bg-indigo-50 text-indigo-600 border border-indigo-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderProjects = () => (
    <div className="animate-in fade-in zoom-in-95 duration-700 py-16 px-6 max-w-7xl mx-auto">
      <h2 className="text-5xl md:text-7xl font-black mb-12 tracking-tight">Featured <span className="text-indigo-600">Works.</span></h2>
      <div className="grid md:grid-cols-3 gap-10">
        {(isLoadingProjects ? Array(3).fill(null) : projects).map((project, i) => (
          project ? (
            <div key={project.id} className="bg-white rounded-[3rem] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-full group">
              <div className="overflow-hidden">
                 <img src={project.imageUrl} alt={project.name} className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              </div>
              <div className="p-10 flex flex-col flex-1">
                <h3 className="text-3xl font-black mb-4 capitalize">{project.name}</h3>
                <p className="text-gray-500 text-lg mb-8 line-clamp-2">{project.description}</p>
                <button onClick={() => setSelectedProject(project)} className="mt-auto w-full py-5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-indigo-600 transition-colors">Explore Project</button>
              </div>
            </div>
          ) : (
            <div key={i} className="bg-gray-100 rounded-[3rem] h-[500px] animate-pulse"></div>
          )
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 py-16 px-6 max-w-7xl mx-auto">
      <div className="bg-gray-900 rounded-[4rem] p-10 md:p-20 text-white grid lg:grid-cols-2 gap-20 overflow-hidden relative shadow-3xl">
        <div className="relative z-10">
          <h2 className="text-5xl md:text-8xl font-black mb-8 leading-none tracking-tighter">Work <span className="text-indigo-400">Together.</span></h2>
          <div className="space-y-10">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10"><i className="fab fa-whatsapp text-3xl text-emerald-400"></i></div>
              <a href={`https://wa.me/${MY_PORTFOLIO_DATA.phone}`} target="_blank" className="text-2xl font-black">{MY_PORTFOLIO_DATA.phone}</a>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center border border-white/10"><i className="fas fa-envelope text-3xl text-indigo-400"></i></div>
              <a href={`mailto:${MY_PORTFOLIO_DATA.email}`} className="text-2xl font-black break-all">{MY_PORTFOLIO_DATA.email}</a>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-[3rem] p-10 text-gray-900 relative z-10">
          <form onSubmit={handleFormSubmit} className="space-y-8">
            <input type="text" required className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-5 focus:border-indigo-600 outline-none font-bold" placeholder="Your Name" />
            <input type="email" required className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-5 focus:border-indigo-600 outline-none font-bold" placeholder="Email" />
            <textarea rows={4} required className="w-full bg-gray-50 border-2 border-gray-50 rounded-2xl px-6 py-5 focus:border-indigo-600 outline-none font-bold" placeholder="How can I help?"></textarea>
            <button className="w-full py-6 bg-indigo-600 text-white rounded-[1.5rem] font-black text-xl hover:bg-indigo-700 transition-colors shadow-lg">Send Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      <nav className="fixed top-0 left-0 right-0 h-24 bg-white/80 backdrop-blur-2xl z-[60] border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-8 h-full flex items-center justify-between">
          <button onClick={() => navigate('home')} className="text-3xl font-black text-gray-900 tracking-tighter hover:text-indigo-600 transition-colors">
            <span className="text-indigo-600">O</span>F.
          </button>
          <div className="hidden md:flex items-center gap-12">
            {(['about', 'skills', 'projects', 'contact'] as Page[]).map(page => (
              <button key={page} onClick={() => navigate(page)} className={`text-[11px] font-black uppercase tracking-widest transition-all ${currentPage === page ? 'text-indigo-600 border-b-2 border-indigo-600 pb-1' : 'text-gray-400 hover:text-gray-900'}`}>{page}</button>
            ))}
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden text-2xl"><i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i></button>
        </div>
        {isMenuOpen && (
          <div className="md:hidden bg-white p-8 flex flex-col gap-6 shadow-xl border-b border-gray-100 animate-in slide-in-from-top-2">
            {(['about', 'skills', 'projects', 'contact'] as Page[]).map(page => (
              <button key={page} onClick={() => navigate(page)} className="text-2xl font-black uppercase text-left">{page}</button>
            ))}
          </div>
        )}
      </nav>

      <main className="pt-24 min-h-screen">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'about' && renderAbout()}
        {currentPage === 'skills' && renderSkills()}
        {currentPage === 'projects' && renderProjects()}
        {currentPage === 'contact' && renderContact()}
      </main>

      {selectedProject && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-gray-950/90 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="relative bg-white rounded-[3rem] w-full max-w-4xl p-12 overflow-y-auto max-h-[90vh] animate-in zoom-in-95 duration-500">
            <button onClick={() => setSelectedProject(null)} className="absolute top-8 right-8 text-3xl hover:text-indigo-600 transition-colors"><i className="fas fa-times"></i></button>
            <div className="mb-10">
               <img src={selectedProject.imageUrl} alt={selectedProject.name} className="w-full h-80 object-cover rounded-[2rem] mb-10 shadow-lg" />
               <h3 className="text-5xl font-black mb-6 capitalize">{selectedProject.name}</h3>
               <div className="flex flex-wrap gap-2 mb-8">
                  {selectedProject.techStack.map((tech, i) => (
                    <span key={i} className="px-4 py-1.5 bg-gray-100 rounded-full text-xs font-black text-gray-600 uppercase tracking-widest">{tech}</span>
                  ))}
               </div>
               <p className="text-xl text-gray-600 mb-8 leading-relaxed">{selectedProject.longDescription || selectedProject.description}</p>
               {selectedProject.problemSolved && (
                 <div className="p-8 bg-indigo-50 rounded-3xl border border-indigo-100 mb-10">
                    <h4 className="text-indigo-600 font-black uppercase text-xs tracking-widest mb-3">Impact</h4>
                    <p className="text-gray-900 font-bold italic">"{selectedProject.problemSolved}"</p>
                 </div>
               )}
            </div>
            <div className="flex flex-wrap gap-4">
              <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="bg-gray-900 text-white px-10 py-5 rounded-2xl font-black hover:bg-indigo-600 transition-colors flex items-center gap-3">
                <i className="fab fa-github"></i> Source Code
              </a>
              <button onClick={() => handleShare(selectedProject)} className="border-2 border-gray-100 px-10 py-5 rounded-2xl font-black hover:border-indigo-600 transition-all">
                {isCopied ? 'Link Copied!' : 'Share Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="py-20 border-t border-gray-100 text-center bg-white">
        <div className="mb-8 flex justify-center gap-8">
           <a href="https://github.com/frukose" target="_blank" className="text-gray-400 hover:text-gray-900 transition-colors text-2xl"><i className="fab fa-github"></i></a>
           <a href={`mailto:${MY_PORTFOLIO_DATA.email}`} className="text-gray-400 hover:text-gray-900 transition-colors text-2xl"><i className="fas fa-envelope"></i></a>
        </div>
        <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.4em]">&copy; {new Date().getFullYear()} Olorunishola Farouk &bull; Lagos, Nigeria</p>
      </footer>
    </div>
  );
};

export default App;