import { Star, ExternalLink, Globe, Briefcase } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

interface Project {
  id: string
  title: string
  description: string | null
  language: string | null
  stars: number
  url: string
  featured: boolean
}

interface Props {
  user: { name: string | null; avatar: string | null; username: string | null }
  portfolio: { 
    bio: string | null; 
    skills: string[]; 
    twitter: string | null;
    linkedin: string | null;
    github: string | null;
    website: string | null;
    projects: Project[] 
  }
}

export default function CorporateTheme({ user, portfolio }: Props) {
  const featured = portfolio.projects.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-200">
      <div className="bg-slate-900 text-white">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <div className="flex flex-col md:flex-row items-center gap-8">
            {user.avatar && (
              <img src={user.avatar} alt={user.name ?? ''} className="w-24 h-24 rounded shadow-lg border-2 border-slate-700" />
            )}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-blue-400 mt-1 font-medium flex items-center justify-center md:justify-start gap-2">
                <Briefcase className="w-4 h-4"/> Professional Portfolio
              </p>
              {portfolio.bio && <p className="text-slate-300 mt-4 max-w-2xl text-lg">{portfolio.bio}</p>}
            </div>
            
            {/* Social Links */}
            <div className="flex md:flex-col gap-4">
              {portfolio.github && (
                <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors">
                  <FaGithub className="w-5 h-5" /> <span className="hidden md:inline text-sm font-medium">GitHub</span>
                </a>
              )}
              {portfolio.linkedin && (
                <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors">
                  <FaLinkedin className="w-5 h-5" /> <span className="hidden md:inline text-sm font-medium">LinkedIn</span>
                </a>
              )}
              {portfolio.website && (
                <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors">
                  <Globe className="w-5 h-5" /> <span className="hidden md:inline text-sm font-medium">Website</span>
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b-2 border-blue-500 inline-block pb-2">Technical Expertise</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span key={skill} className="bg-white border border-slate-200 text-slate-700 font-medium text-sm px-4 py-2 rounded shadow-sm">
                  {skill}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {featured.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-slate-800 mb-6 border-b-2 border-blue-500 inline-block pb-2">Selected Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((project) => (
                <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer"
                  className="bg-white border border-slate-200 rounded p-6 shadow-sm hover:shadow-md hover:border-blue-300 transition-all group">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-slate-900 group-hover:text-blue-600 transition-colors">{project.title}</h3>
                    <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-500" />
                  </div>
                  {project.description && <p className="text-slate-600 text-sm mt-3">{project.description}</p>}
                  
                  <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
                    {project.language ? (
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                        {project.language}
                      </span>
                    ) : <span />}
                    {project.stars > 0 && (
                      <span className="flex items-center gap-1 text-sm text-slate-500 font-medium"><Star className="w-4 h-4 text-amber-400" />{project.stars}</span>
                    )}
                  </div>
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}