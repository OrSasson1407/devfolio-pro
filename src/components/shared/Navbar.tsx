import Link from 'next/link'
import Logo from './Logo'
import { auth } from '@/lib/auth'

export default async function Navbar() {
  const session = await auth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Logo size="md" href="/" showPro={true} />

        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/#features"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Features
          </Link>
          <Link
            href="/#pricing"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/discover"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            Discover
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {session ? (
            <Link
              href="/dashboard"
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/login"
              className="bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Get Started
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}