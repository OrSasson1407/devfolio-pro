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

export default function GlassmorphismTheme({ user, portfolio }: Props) {
  const featured = portfolio.projects.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 text-white font-sans overflow-hidden relative">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/30 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-yellow-400/30 rounded-full blur-3xl mix-blend-screen pointer-events-none"></div>

      <div className="max-w-4xl mx-auto px-6 py-20 space-y-12 relative z-10">

        {/* Hero Card */}
        <div className="backdrop-blur-xl bg-white/10 border border-white/20 rounded-3xl p-10 shadow-2xl">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {user.avatar && (
              <img src={user.avatar} alt={user.name ?? ''} className="w-28 h-28 rounded-full border-4 border-white/30 shadow-xl" />
            )}
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold tracking-tight">{user.name}</h1>
              <p className="text-white/70 font-medium mt-1">@{user.username}</p>
              {portfolio.bio && <p className="text-white/90 mt-4 max-w-xl text-lg leading-relaxed">{portfolio.bio}</p>}
              
              {/* Social Links */}
              <div className="flex items-center justify-center md:justify-start gap-4 mt-6">
                {portfolio.github && (
                  <a href={portfolio.github} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all">
                    <FaGithub className="w-5 h-5 text-white" />
                  </a>
                )}
                {portfolio.linkedin && (
                  <a href={portfolio.linkedin} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all">
                    <FaLinkedin className="w-5 h-5 text-white" />
                  </a>
                )}
                {portfolio.twitter && (
                  <a href={portfolio.twitter} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all">
                    <FaTwitter className="w-5 h-5 text-white" />
                  </a>
                )}
                {portfolio.website && (
                  <a href={portfolio.website} target="_blank" rel="noopener noreferrer" className="p-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full transition-all">
                    <Globe className="w-5 h-5 text-white" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white/80 uppercase tracking-widest mb-6 ml-2">Technologies</h2>
            <div className="flex flex-wrap gap-3">
              {portfolio.skills.map((skill) => (
                <span key={skill} className="backdrop-blur-md bg-white/10 border border-white/20 text-white font-medium text-sm px-5 py-2 rounded-full shadow-lg">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-white/80 uppercase tracking-widest mb-6 ml-2">Showcase</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featured.map((project) => (
                <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer"
                  className="block backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl p-6 shadow-xl hover:bg-white/20 hover:-translate-y-1 transition-all group">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-xl text-white">{project.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-white/60 group-hover:text-white transition-colors">
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1 font-medium"><Star className="w-4 h-4 text-yellow-300" />{project.stars}</span>
                      )}
                      <ExternalLink className="w-5 h-5" />
                    </div>
                  </div>
                  {project.description && <p className="text-white/80 text-sm mt-3 leading-relaxed">{project.description}</p>}
                  {project.language && (
                    <span className="inline-block mt-5 text-xs font-semibold bg-black/20 text-white/90 px-3 py-1.5 rounded-lg">
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