import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import { Search, Star, ExternalLink, Code2 } from 'lucide-react'

// Allow the page to accept search query parameters
interface Props {
  searchParams: Promise<{ q?: string }>
}

export const metadata = {
  title: 'Discover Developers — DevFolio Pro',
  description: 'Explore top developer portfolios built with DevFolio Pro.',
}

export default async function DiscoverPage({ searchParams }: Props) {
  const { q } = await searchParams
  
  const query = q?.toLowerCase()

  // Fetch only portfolios that opted into the directory
  const portfolios = await prisma.portfolio.findMany({
    where: {
      isPublicDirectory: true,
      ...(query && {
        OR: [
          { user: { name: { contains: query, mode: 'insensitive' } } },
          { user: { username: { contains: query, mode: 'insensitive' } } },
          { skills: { has: query } },
          { bio: { contains: query, mode: 'insensitive' } },
        ],
      }),
    },
    include: {
      user: true,
      projects: {
        where: { featured: true },
        take: 3, // Preview up to 3 featured projects
        orderBy: { stars: 'desc' }
      }
    },
    orderBy: {
      updatedAt: 'desc'
    },
    take: 50 // Limit to top 50 recently updated
  })

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-20">
        <div className="max-w-6xl mx-auto px-6 space-y-12">
          
          {/* Header & Search */}
          <div className="flex flex-col items-center text-center space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Discover <span className="text-violet-500">Developers</span>
            </h1>
            <p className="text-gray-400 max-w-2xl text-lg">
              Explore portfolios from talented developers around the world. Find your next hire or get inspired for your own site.
            </p>

            <form className="w-full max-w-xl relative mt-4">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                <Search className="w-5 h-5 text-gray-500" />
              </div>
              <input
                type="text"
                name="q"
                defaultValue={query}
                placeholder="Search by name, skill (e.g. React), or role..."
                className="w-full bg-gray-900 border border-gray-800 rounded-full py-4 pl-12 pr-4 text-gray-200 placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
              />
              <button type="submit" className="absolute inset-y-2 right-2 bg-violet-600 hover:bg-violet-500 text-white px-6 rounded-full font-medium transition-colors">
                Search
              </button>
            </form>
          </div>

          {/* Directory Grid */}
          {portfolios.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {portfolios.map((portfolio) => (
                <Link 
                  key={portfolio.id} 
                  href={`/${portfolio.user.username}`}
                  className="bg-gray-900 border border-gray-800 hover:border-violet-500/50 rounded-2xl p-6 transition-all hover:-translate-y-1 group flex flex-col h-full"
                >
                  <div className="flex items-start gap-4">
                    {portfolio.user.avatar ? (
                      <img src={portfolio.user.avatar} alt="" className="w-14 h-14 rounded-full border-2 border-gray-800 group-hover:border-violet-500 transition-colors" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center">
                        <span className="text-xl font-bold text-gray-400">{portfolio.user.name?.[0] || '?'}</span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h2 className="text-lg font-bold text-white truncate">{portfolio.user.name}</h2>
                      <p className="text-sm text-gray-500 truncate">@{portfolio.user.username}</p>
                    </div>
                    {portfolio.openToWork && (
                      <span className="shrink-0 bg-green-500/10 text-green-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                        Hire Me
                      </span>
                    )}
                  </div>

                  <p className="mt-4 text-sm text-gray-400 line-clamp-2 min-h-[40px]">
                    {portfolio.bio || "Full-stack developer building cool things."}
                  </p>

                  {/* Skills (Show up to 4) */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {portfolio.skills.slice(0, 4).map(skill => (
                      <span key={skill} className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded-md">
                        {skill}
                      </span>
                    ))}
                    {portfolio.skills.length > 4 && (
                      <span className="text-xs bg-gray-800 text-gray-500 px-2 py-1 rounded-md">
                        +{portfolio.skills.length - 4}
                      </span>
                    )}
                  </div>

                  <div className="mt-auto pt-6">
                    <div className="border-t border-gray-800 pt-4 flex items-center justify-between text-sm text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Code2 className="w-4 h-4" /> {portfolio.projects.length} Featured
                      </span>
                      <span className="flex items-center gap-1 text-violet-400 font-medium group-hover:text-violet-300 transition-colors">
                        View Portfolio <ExternalLink className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-gray-900 border border-gray-800 rounded-2xl">
              <p className="text-gray-400">No portfolios found matching your search.</p>
              <Link href="/discover" className="text-violet-500 hover:text-violet-400 text-sm font-medium mt-2 inline-block">
                Clear search
              </Link>
            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}