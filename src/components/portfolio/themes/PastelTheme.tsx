import { Star, ExternalLink, Globe } from 'lucide-react'
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

export default function PastelTheme({ user, portfolio }: Props) {
  const featured = portfolio.projects.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-rose-50 text-slate-800 font-sans">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-16">

        {/* Hero */}
        <div className="flex flex-col items-center text-center gap-6">
          {user.avatar && (
            <img src={user.avatar} alt={user.name ?? ''} className="w-32 h-32 rounded-full border-4 border-white shadow-xl shadow-rose-200/50" />
          )}
          <div>
            <h1 className="text-4xl font-extrabold text-slate-800">{user.name}</h1>
            <p className="text-rose-500 font-medium mt-2">@{user.username}</p>
            {portfolio.bio && <p className="text-slate-600 mt-4 max-w-2xl mx-auto leading-relaxed text-lg">{portfolio.bio}</p>}
            
            {/* Social Links */}
            <div className="flex items-center justify-center gap-5 mt-6">
              {portfolio.github && (
                <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-600 hover:text-rose-500 rounded-full shadow-sm hover:shadow-md transition-all">
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {portfolio.linkedin && (
                <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-600 hover:text-blue-500 rounded-full shadow-sm hover:shadow-md transition-all">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {portfolio.twitter && (
                <a href={portfolio.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-600 hover:text-sky-400 rounded-full shadow-sm hover:shadow-md transition-all">
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {portfolio.website && (
                <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-white text-slate-600 hover:text-emerald-500 rounded-full shadow-sm hover:shadow-md transition-all">
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <div className="text-center">
            <div className="flex flex-wrap justify-center gap-3">
              {portfolio.skills.map((skill) => (
                <span key={skill} className="bg-white text-rose-600 font-medium text-sm px-4 py-2 rounded-2xl shadow-sm border border-rose-100">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Featured Work</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((project) => (
                <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl hover:shadow-rose-100/50 hover:-translate-y-1 transition-all duration-300 border border-rose-50 group">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-lg text-slate-800 group-hover:text-rose-500 transition-colors">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-slate-400">
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1 bg-amber-50 text-amber-600 px-2 py-1 rounded-lg font-medium"><Star className="w-3 h-3" />{project.stars}</span>
                      )}
                      <div className="p-2 bg-rose-50 text-rose-400 rounded-full group-hover:bg-rose-500 group-hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </div>
                    </div>
                  </div>
                  {project.description && <p className="text-slate-500 text-sm mt-4 leading-relaxed">{project.description}</p>}
                  {project.language && (
                    <span className="inline-block mt-4 text-xs font-bold bg-slate-50 text-slate-500 px-3 py-1.5 rounded-xl uppercase tracking-wider">
                      {project.language}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}