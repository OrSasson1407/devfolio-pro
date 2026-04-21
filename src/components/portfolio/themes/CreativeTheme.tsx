import { Star, ExternalLink } from 'lucide-react'

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
  portfolio: { bio: string | null; skills: string[]; projects: Project[] }
}

export default function CreativeTheme({ user, portfolio }: Props) {
  const featured = portfolio.projects.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-950 via-gray-900 to-blue-950 text-white">
      <div className="max-w-4xl mx-auto px-6 py-20 space-y-20">

        {/* Hero */}
        <div className="text-center space-y-6">
          {user.avatar && (
            <img src={user.avatar} alt={user.name ?? ''} className="w-28 h-28 rounded-full mx-auto ring-4 ring-violet-500 ring-offset-4 ring-offset-violet-950" />
          )}
          <div>
            <h1 className="text-5xl font-black bg-gradient-to-r from-violet-400 to-blue-400 bg-clip-text text-transparent">
              {user.name}
            </h1>
            <p className="text-gray-400 mt-2">@{user.username}</p>
          </div>
          {portfolio.bio && (
            <p className="text-gray-300 max-w-2xl mx-auto text-lg leading-relaxed">{portfolio.bio}</p>
          )}
        </div>

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <div className="text-center">
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-6">Tech Stack</h2>
            <div className="flex flex-wrap gap-3 justify-center">
              {portfolio.skills.map((skill) => (
                <span key={skill} className="bg-white/10 backdrop-blur border border-white/20 text-white text-sm px-4 py-2 rounded-full">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-xs font-bold text-violet-400 uppercase tracking-widest mb-8 text-center">Featured Work</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {featured.map((project) => (
                <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer"
                  className="block bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 hover:border-violet-500/50 transition-all group">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-white group-hover:text-violet-300 transition-colors">{project.title}</h3>
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1 text-yellow-400"><Star className="w-3 h-3" />{project.stars}</span>
                      )}
                      <ExternalLink className="w-4 h-4" />
                    </div>
                  </div>
                  {project.description && <p className="text-gray-400 text-sm leading-relaxed">{project.description}</p>}
                  {project.language && (
                    <span className="inline-block mt-4 text-xs bg-violet-500/20 text-violet-300 border border-violet-500/30 px-3 py-1 rounded-full">
                      {project.language}
                    </span>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm">
          Built with <span className="text-violet-400 font-medium">DevFolio Pro</span>
        </div>
      </div>
    </div>
  )
}