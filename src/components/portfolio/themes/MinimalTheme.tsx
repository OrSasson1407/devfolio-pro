'use client'

import { Star, ExternalLink, Globe, FileDown } from 'lucide-react'
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
  demoUrl?: string | null
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

interface ContributionData {
  totalContributions: number
  totalCommits: number
  totalPRs: number
  totalIssues: number
  days: { date: string; count: number }[]
}

interface Props {
  user: { name: string | null; avatar: string | null; username: string | null }
  portfolio: {
    bio: string | null
    skills: string[]
    contactEmail: string | null
    twitter: string | null
    linkedin: string | null
    github: string | null
    website: string | null
    customSections: CustomSection[] | unknown
    contributions: ContributionData | null | unknown
    projects: Project[]
  }
}

export default function MinimalTheme({ user, portfolio }: Props) {
  const featuredProjects = portfolio.projects.filter((p) => p.featured)

  const sections: CustomSection[] = Array.isArray(portfolio.customSections)
    ? (portfolio.customSections as CustomSection[])
    : []

  const contributions =
    portfolio.contributions &&
    typeof portfolio.contributions === 'object' &&
    'days' in (portfolio.contributions as object)
      ? (portfolio.contributions as ContributionData)
      : null

  const trackClick = (eventType: string, targetName: string, targetUrl?: string) => {
    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: user.username,
        eventType,
        targetName,
        targetUrl,
      }),
    }).catch(console.error)
  }

  const handleDownloadPDF = () => {
    trackClick('PDF_DOWNLOAD', 'Resume PDF')
    window.print()
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans print:bg-white print:text-black">

      {/* Download PDF Button */}
      <div className="max-w-3xl mx-auto px-6 pt-10 flex justify-end print:hidden">
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors shadow-sm"
        >
          <FileDown className="w-4 h-4" />
          Download PDF
        </button>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10 space-y-12 print:py-0 print:space-y-8">

        {/* Hero */}
        <div className="flex flex-col sm:flex-row items-start gap-6">
          {user.avatar && (
            <img
              src={user.avatar}
              alt={user.name ?? ''}
              className="w-20 h-20 rounded-full border-4 border-gray-100 print:border-gray-300"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500 mt-1">@{user.username}</p>
            {portfolio.bio && (
              <p className="text-gray-700 mt-3 max-w-xl print:text-black">{portfolio.bio}</p>
            )}

            {/* Social Links */}
            <div className="flex items-center gap-4 mt-4 print:hidden">
              {portfolio.github && (
                <a
                  href={portfolio.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('SOCIAL_CLICK', 'GitHub', portfolio.github!)}
                  className="text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <FaGithub className="w-5 h-5" />
                </a>
              )}
              {portfolio.linkedin && (
                <a
                  href={portfolio.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('SOCIAL_CLICK', 'LinkedIn', portfolio.linkedin!)}
                  className="text-gray-400 hover:text-blue-600 transition-colors"
                >
                  <FaLinkedin className="w-5 h-5" />
                </a>
              )}
              {portfolio.twitter && (
                <a
                  href={portfolio.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('SOCIAL_CLICK', 'Twitter/X', portfolio.twitter!)}
                  className="text-gray-400 hover:text-sky-500 transition-colors"
                >
                  <FaTwitter className="w-5 h-5" />
                </a>
              )}
              {portfolio.website && (
                <a
                  href={portfolio.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackClick('SOCIAL_CLICK', 'Website', portfolio.website!)}
                  className="text-gray-400 hover:text-emerald-600 transition-colors"
                >
                  <Globe className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Print-only Social Links */}
            <div className="hidden print:flex flex-col gap-1 mt-4 text-sm text-gray-600">
              {portfolio.website && <p>🌐 {portfolio.website}</p>}
              {portfolio.github && <p>🐙 {portfolio.github}</p>}
              {portfolio.linkedin && <p>💼 {portfolio.linkedin}</p>}
              {portfolio.contactEmail && <p>📧 {portfolio.contactEmail}</p>}
            </div>
          </div>
        </div>

        {/* Skills */}
        {portfolio.skills.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 print:text-gray-500">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {portfolio.skills.map((skill) => (
                <span
                  key={skill}
                  className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full print:border print:border-gray-300 print:bg-transparent"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Custom Sections (Work, Education) */}
        {sections.length > 0 && (
          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.id}>
                <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6 print:text-gray-500">
                  {section.title}
                </h2>
                <div className="space-y-6">
                  {section.items.map((item) => (
                    <div
                      key={item.id}
                      className="relative pl-6 before:absolute before:left-0 before:top-2 before:bottom-0 before:w-[2px] before:bg-gray-100 print:before:bg-gray-300 print:break-inside-avoid"
                    >
                      <span className="absolute left-[-3px] top-2 w-2 h-2 rounded-full bg-gray-300 ring-4 ring-white print:bg-gray-400" />
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1 sm:gap-4">
                        <h3 className="font-semibold text-gray-900">{item.title}</h3>
                        {item.date && (
                          <span className="text-sm text-gray-400 whitespace-nowrap print:text-gray-600">
                            {item.date}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-sm font-medium text-gray-600 mt-0.5">{item.subtitle}</p>
                      )}
                      {item.description && (
                        <p className="text-sm text-gray-500 mt-2 whitespace-pre-wrap print:text-black">
                          {item.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Projects */}
        {featuredProjects.length > 0 && (
          <div>
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-4 print:text-gray-500">
              Selected Projects
            </h2>
            <div className="space-y-4">
              {featuredProjects.map((project) => (
                <div
                  key={project.id}
                  className="border border-gray-200 rounded-xl overflow-hidden print:border-gray-300 print:break-inside-avoid"
                >
                  <div className="p-5">
                    <div className="flex items-start justify-between">
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackClick('PROJECT_CLICK', project.title, project.url)}
                        className="font-semibold text-gray-900 print:text-black"
                      >
                        {project.title}
                      </a>
                      <div className="flex items-center gap-3 text-sm text-gray-400 print:hidden">
                        {project.stars > 0 && (
                          <span className="flex items-center gap-1">
                            <Star className="w-3 h-3" />{project.stars}
                          </span>
                        )}
                        <a
                          href={project.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-gray-900 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    {project.description && (
                      <p className="text-gray-500 text-sm mt-2 print:text-black">
                        {project.description}
                      </p>
                    )}

                    <div className="flex flex-wrap items-center gap-3 mt-3">
                      {project.language && (
                        <span className="inline-block text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full print:bg-transparent print:border print:border-gray-300">
                          {project.language}
                        </span>
                      )}
                      <span className="hidden print:inline-block text-xs text-gray-500 ml-auto">
                        {project.url.replace('https://', '')}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Contribution Heatmap - Hidden in PDF */}
        {contributions && (
          <div className="pt-8 print:hidden">
            <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-widest mb-6">
              Activity
            </h2>
            <div className="border border-gray-200 rounded-xl p-6 bg-gray-50/50">
              <ContributionHeatmap data={contributions} />
            </div>
          </div>
        )}

        <div className="border-t border-gray-100 pt-8 text-center text-sm text-gray-400 print:hidden">
          Built with <span className="text-violet-500 font-medium">DevFolio Pro</span>
        </div>
      </div>
    </div>
  )
}