'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import Logo from '@/components/shared/Logo'
import {
  LayoutDashboard,
  Edit3,
  BarChart2,
  CreditCard,
  LogOut,
  User,
  ExternalLink,
  FileText,
  Sparkles,
  Users,
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/editor', label: 'Editor', icon: Edit3 },
  { href: '/dashboard/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/dashboard/team', label: 'Team', icon: Users },
  { href: '/dashboard/ai-tools', label: 'AI Tools', icon: Sparkles },
  { href: '/dashboard/cover-letter', label: 'Cover Letter', icon: FileText },
  { href: '/dashboard/billing', label: 'Billing', icon: CreditCard },
]

interface SidebarProps {
  user: {
    name?: string | null
    email?: string | null
    image?: string | null
    username?: string | null
  }
}

export default function Sidebar({ user }: SidebarProps) {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gray-900 border-r border-gray-800 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <Logo size="sm" href="/dashboard" showPro={true} />
      </div>

      {/* Nav */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? 'bg-violet-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
              {href === '/dashboard/ai-tools' && !active && (
                <span className="ml-auto text-[10px] font-semibold bg-violet-500/20 text-violet-300 px-1.5 py-0.5 rounded-full">
                  NEW
                </span>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User + actions */}
      <div className="p-4 border-t border-gray-800 space-y-2">
        <Link
          href={`/${user.username ?? ''}`}
          target="_blank"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          View Portfolio
        </Link>

        <div className="flex items-center gap-3 px-3 py-2">
          {user.image ? (
            <img
              src={user.image}
              alt={user.name ?? ''}
              className="w-8 h-8 rounded-full"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
              <User className="w-4 h-4 text-gray-400" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm text-white font-medium truncate">{user.name}</p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
          </div>
        </div>

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}