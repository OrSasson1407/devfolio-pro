import Link from 'next/link'
import { auth } from '@/lib/auth'
import { LayoutDashboard, LogIn } from 'lucide-react'

export default async function Navbar() {
  const session = await auth()

  return (
    <nav className="fixed top-0 w-full z-50 border-b border-gray-800 bg-gray-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-violet-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-white font-bold text-lg">DevFolio Pro</span>
        </Link>

        <div className="flex items-center gap-6">
          <Link href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
            Pricing
          </Link>

          {session?.user ? (
            <Link 
              href="/dashboard"
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <Link 
              href="/login"
              className="flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}