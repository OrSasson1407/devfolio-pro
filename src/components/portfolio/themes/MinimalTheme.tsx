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

export default function MinimalTheme({ user, portfolio }: Props) {
  const featured = portfolio.projects.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-16">

        {/* Hero */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {user.avatar && (
            <img src={user.avatar} alt={user.name ?? ''} className="w-20 h-20 rounded-full border-4 border-gray-100" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mt-1">@{user.username}</p>
            {portfolio.bio && <p className="text-gray-700 mt-3 max-w-xl">{portfolio.bio}</p>}
            
            {/* Social Links */}
            <div className="flex items-center gap-4 mt-4">
              {portfolio.github && (
                <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-900 transition-colors">
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {portfolio.linkedin && (
                <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-600 transition-colors">
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {portfolio.twitter && (
                <a href={portfolio.twitter} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-sky-500 transition-colors">
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {portfolio.website && (
                <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-emerald-600 transition-colors">
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span key={skill} className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Projects</h2>
            <div className="space-y-4">
              {featured.map((project) => (
                <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer"
                  className="block border border-gray-200 rounded-xl p-5 hover:border-gray-400 transition-colors group">
                  <div className="flex items-start justify-between">
                    <h3 className="font-semibold text-gray-900 group-hover:text-black">{project.title}</h3>
                    <div className="flex items-center gap-3 text-sm text-gray-400">
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{project.stars}</span>
                      )}
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                  {project.description && <p className="text-gray-500 text-sm mt-2">{project.description}</p>}
                  {project.language && (
                    <span className="inline-block mt-3 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                      {project.language}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400">
          Built with <span className="text-violet-500 font-medium">DevFolio Pro</span>
        </div>
      </div>
    </div>
  )
}