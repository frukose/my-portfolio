
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
    <div className="animate-fade-in">
      <section className="home-section">
        <div className="hero-blob"></div>
        <div className="status-badge">
          <span className="status-dot"></span>
          Open to New Opportunities
        </div>
        <h1 className="hero-title">
          Olorunishola <br/> <span>Farouk.</span>
        </h1>
        <p className="hero-text">
          Specializing in Full Stack Development at <span>Aptech Learning</span>. 
          I build scalable backend logic and seamless frontend interfaces.
        </p>
        <div className="hero-actions">
          <button onClick={() => navigate('projects')} className="btn btn-primary">
            View Projects
          </button>
          <button onClick={() => navigate('contact')} className="btn btn-outline">
            Get In Touch
          </button>
        </div>
      </section>
    </div>
  );

  const renderAbout = () => (
    <div className="animate-slide-right section-container about-section">
      <h2 className="section-title">The <span>Architect</span> behind the code.</h2>
      <div className="about-grid">
        <div className="about-content">
          <div className="about-text">
            <p>{MY_PORTFOLIO_DATA.bio}</p>
          </div>
          <div className="info-cards">
            <div className="info-card default">
              <h4>Philosophy</h4>
              <p>"Code is for humans to read, and only incidentally for machines to execute."</p>
            </div>
            <div className="info-card primary">
              <h4>Focus</h4>
              <p>Modern Web Architecture</p>
            </div>
          </div>
        </div>
        <div className="about-image">
          <img src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&q=80&w=800" alt="Software Engineering" />
        </div>
      </div>
    </div>
  );

  const renderSkills = () => (
    <div className="animate-slide-left section-container">
      <h2 className="section-title text-center">Technical <span>Stack.</span></h2>
      <div className="skills-grid">
        {MY_PORTFOLIO_DATA.skills.map((skill, idx) => (
          <div key={idx} className="skill-card">
            <h3>{skill.category}</h3>
            <div className="skill-tags">
              {skill.items.map((item, i) => (
                <span key={i} className="skill-tag">
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
    <div className="animate-zoom section-container">
      <h2 className="section-title">Featured <span>Works.</span></h2>
      <div className="projects-grid">
        {(isLoadingProjects ? Array(3).fill(null) : projects).map((project, i) => (
          project ? (
            <div key={project.id} className="project-card">
              <div className="project-img-wrapper">
                 <img src={project.imageUrl} alt={project.name} className="project-img" />
              </div>
              <div className="project-content">
                <h3>{project.name}</h3>
                <p>{project.description}</p>
                <button onClick={() => setSelectedProject(project)} className="btn-view">Explore Project</button>
              </div>
            </div>
          ) : (
            <div key={i} className="skeleton-loader"></div>
          )
        ))}
      </div>
    </div>
  );

  const renderContact = () => (
    <div className="animate-fade-in section-container">
      <div className="contact-wrapper">
        <div className="contact-left">
          <h2>Work <span>Together.</span></h2>
          <div className="contact-info">
            <div className="contact-item">
              <div className="contact-icon icon-whatsapp"><i className="fab fa-whatsapp"></i></div>
              <a href={`https://wa.me/${MY_PORTFOLIO_DATA.phone}`} target="_blank" className="contact-link">{MY_PORTFOLIO_DATA.phone}</a>
            </div>
            <div className="contact-item">
              <div className="contact-icon icon-email"><i className="fas fa-envelope"></i></div>
              <a href={`mailto:${MY_PORTFOLIO_DATA.email}`} className="contact-link">{MY_PORTFOLIO_DATA.email}</a>
            </div>
          </div>
        </div>
        <div className="contact-form-container">
          <form onSubmit={handleFormSubmit} className="form-group">
            <input type="text" required className="form-input" placeholder="Your Name" />
            <input type="email" required className="form-input" placeholder="Email" />
            <textarea rows={4} required className="form-input" placeholder="How can I help?"></textarea>
            <button className="btn-submit">Send Inquiry</button>
          </form>
        </div>
      </div>
    </div>
  );

  return (
    <div className="wrapper">
      <nav className="navbar">
        <div className="nav-container">
          <button onClick={() => navigate('home')} className="nav-logo">
            <span>O</span>F.
          </button>
          <div className="nav-links">
            {(['about', 'skills', 'projects', 'contact'] as Page[]).map(page => (
              <button key={page} onClick={() => navigate(page)} className={`nav-link ${currentPage === page ? 'active' : ''}`}>{page}</button>
            ))}
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-btn"><i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'}`}></i></button>
        </div>
        {isMenuOpen && (
          <div className="mobile-menu">
            {(['about', 'skills', 'projects', 'contact'] as Page[]).map(page => (
              <button key={page} onClick={() => navigate(page)}>{page}</button>
            ))}
          </div>
        )}
      </nav>

      <main className="main-content">
        {currentPage === 'home' && renderHome()}
        {currentPage === 'about' && renderAbout()}
        {currentPage === 'skills' && renderSkills()}
        {currentPage === 'projects' && renderProjects()}
        {currentPage === 'contact' && renderContact()}
      </main>

      {selectedProject && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button onClick={() => setSelectedProject(null)} className="close-btn"><i className="fas fa-times"></i></button>
            <div>
               <img src={selectedProject.imageUrl} alt={selectedProject.name} className="modal-img" />
               <h3 className="modal-title">{selectedProject.name}</h3>
               <div className="modal-tech">
                  {selectedProject.techStack.map((tech, i) => (
                    <span key={i} className="modal-tech-tag">{tech}</span>
                  ))}
               </div>
               <p className="modal-desc">{selectedProject.longDescription || selectedProject.description}</p>
               {selectedProject.problemSolved && (
                 <div className="modal-impact">
                    <h4 className="impact-label">Impact</h4>
                    <p className="impact-text">"{selectedProject.problemSolved}"</p>
                 </div>
               )}
            </div>
            <div className="modal-actions">
              <a href={selectedProject.repoUrl} target="_blank" rel="noopener noreferrer" className="btn-github">
                <i className="fab fa-github"></i> Source Code
              </a>
              <button onClick={() => handleShare(selectedProject)} className="btn-share">
                {isCopied ? 'Link Copied!' : 'Share Project'}
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">
        <div className="footer-socials">
           <a href="https://github.com/frukose" target="_blank" className="footer-social"><i className="fab fa-github"></i></a>
           <a href={`mailto:${MY_PORTFOLIO_DATA.email}`} className="footer-social"><i className="fas fa-envelope"></i></a>
        </div>
        <p className="footer-copy">&copy; {new Date().getFullYear()} Olorunishola Farouk &bull; Lagos, Nigeria</p>
      </footer>
    </div>
  );
};

export default App;
