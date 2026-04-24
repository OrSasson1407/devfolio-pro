import { Star, ExternalLink } from 'lucide-react'
import Image from 'next/image'

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

export default function TerminalTheme({ user, portfolio }: Props) {
  const featured = portfolio.projects.filter((p) => p.featured)

  return (
    <div className="min-h-screen bg-gray-950 text-green-400 font-mono">
      <div className="max-w-3xl mx-auto px-6 py-20 space-y-10">

        {/* Header */}
        <div className="space-y-1">
          <p className="text-gray-500 text-sm">$ whoami</p>
          <div className="flex items-center gap-4">
            {user.avatar && (
              <Image 
                src={user.avatar} 
                alt={user.name ?? ''} 
                width={64}
                height={64}
                className="w-16 h-16 rounded border-2 border-green-800" 
              />
            )}
            <div>
              <h1 className="text-2xl font-bold text-green-300">{user.name}</h1>
              <p className="text-green-700">@{user.username}</p>
            </div>
          </div>
          {portfolio.bio && (
            <div className="mt-4">
              <p className="text-gray-500 text-sm">$ cat bio.txt</p>
              <p className="text-green-300 mt-1">{portfolio.bio}</p>
            </div>
          )}
        </div>

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm mb-2">$ ls skills/</p>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span key={skill} className="border border-green-800 text-green-400 text-sm px-3 py-1 rounded">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Projects */}
        {featured.length > 0 && (
          <div>
            <p className="text-gray-500 text-sm mb-3">$ ls projects/</p>
            <div className="space-y-4">
              {featured.map((project, i) => (
                <a key={project.id} href={project.url} target="_blank" rel="noopener noreferrer"
                  className="block border border-green-900 rounded p-4 hover:border-green-600 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="text-green-300 font-bold">
                      <span className="text-green-700 mr-2">[{i + 1}]</span>
                      {project.title}
                    </span>
                    <div className="flex items-center gap-3 text-green-700 text-sm">
                      {project.stars > 0 && (
                        <span className="flex items-center gap-1"><Star className="w-3 h-3" />{project.stars}</span>
                      )}
                      <ExternalLink className="w-3 h-3" />
                    </div>
                  </div>
                  {project.description && <p className="text-green-700 text-sm mt-2">{project.description}</p>}
                  {project.language && <p className="text-green-900 text-xs mt-2">lang: {project.language}</p>}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 text-green-900 text-sm">
          <p>$ exit</p>
          <p className="mt-1">{`// built with DevFolio Pro`}</p>
        </div>
      </div>
    </div>
  )
}