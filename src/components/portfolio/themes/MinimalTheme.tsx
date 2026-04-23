import { Star, ExternalLink, Globe, MonitorPlay } from 'lucide-react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'
import ContributionHeatmap from '../ContributionHeatmap'

interface Project {
  id: string
  title: string
  description: string | null
  language: string | null
  stars: number
  url: string
  featured: boolean
  demoUrl?: string | null // NEW
}

interface CustomSectionItem {
  id: string
  title: string
  subtitle: string
  date: string
  description: string
}

interface CustomSection {
  id: string
  title: string
  items: CustomSectionItem[]
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
    customSections: any; 
    contributions: any; 
    projects: Project[] 
  }
}

export default function MinimalTheme({ user, portfolio }: Props) {
  const featured = portfolio.projects.filter((p) => p.featured)
  const sections: CustomSection[] = Array.isArray(portfolio.customSections) 
    ? portfolio.customSections 
    : []

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

        {/* Custom Sections (Work, Education, etc.) */}
        {sections.length > 0 && (
          <div className="space-y-12">
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">{section.title}</h2>
                <div className="space-y-8">
                  {section.items.map((item) => (
                    <div key={item.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-gray-100">
                      {/* Timeline dot */}
                      <span className="absolute left-[-3px] top-2 w-2 h-2 rounded-full bg-gray-300 ring-4 ring-white" />
                      
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        {item.date && (
                          <span className="text-sm text-gray-400 whitespace-nowrap">{item.date}</span>
                        )}
                      </div>
                      {item.subtitle && <p className="text-sm font-medium text-gray-600 mt-0.5">{item.subtitle}</p>}
                      {item.description && <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap">{item.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects (UPDATED: Now contains embedded iframe support) */}
        {featured.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4">Projects</h2>
            <div className="space-y-6">
              {featured.map((project) => (
                <div key={project.id} className="border border-gray-200 rounded-xl overflow-hidden hover:border-gray-400 transition-colors group">
                  
                  {/* Top Text Details */}
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <a href={project.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-gray-900 group-hover:text-black">
                        {project.title}
                      </a>
                      <div className="flex items-center gap-3 text-sm text-gray-400">
                        {project.stars > 0 && (
                          <span className="flex items-center gap-1"><Star className="w-3 h-3" />{project.stars}</span>
                        )}
                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                    
                    {project.description && <p className="text-gray-500 text-sm mt-2">{project.description}</p>}
                    
                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {project.language && (
                        <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          {project.language}
                        </span>
                      )}
                      
                      {project.demoUrl && (
                        <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 transition-colors">
                          <MonitorPlay className="w-3.5 h-3.5" /> Open App
                        </a>
                      )}
                    </div>
                  </div>

                  {/* NEW: Live Iframe Preview */}
                  {project.demoUrl && project.demoUrl.startsWith('http') && (
                    <div className="w-full aspect-video border-t border-gray-100 bg-gray-50">
                      <iframe 
                        src={project.demoUrl} 
                        className="w-full h-full pointer-events-auto" 
                        sandbox="allow-scripts allow-same-origin"
                        loading="lazy"
                        title={`${project.title} Live Demo`}
                      />
                    </div>
                  )}

                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contribution Heatmap */}
        {portfolio.contributions && (
          <div className="pt-8">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">Activity</h2>
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
              <ContributionHeatmap data={portfolio.contributions} />
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