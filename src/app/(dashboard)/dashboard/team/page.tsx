import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { Users, Plus, Shield, Mail, CheckCircle2, ArrowRight } from 'lucide-react'

export const metadata = {
  title: 'Team Management — DevFolio Pro',
}

export default async function TeamPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  // FIX 1: Bypass TS Cache with (prisma as any)
  const membership = await (prisma as any).orgMember.findFirst({
    where: { userId: session.user.id },
    include: {
      org: {
        include: {
          members: {
            include: {
              user: {
                include: { portfolio: true }
              }
            }
          }
        }
      }
    }
  })

  // Upsell State: User does not belong to an organization
  if (!membership) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center space-y-4 pt-12 pb-8">
          <div className="w-16 h-16 bg-violet-600/10 text-violet-500 flex items-center justify-center rounded-2xl mx-auto mb-6">
            <Users className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-white">Scale your Bootcamp or Agency</h1>
          <p className="text-gray-400 max-w-lg mx-auto text-lg">
            Manage student cohorts, standardise portfolio branding, and track placement analytics all under a single organisational billing plan.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-3">
            <Shield className="w-6 h-6 text-emerald-400" />
            <h3 className="text-white font-semibold">Centralised Billing</h3>
            <p className="text-sm text-gray-400">Pay for your entire cohort with one invoice. Add or remove seats dynamically.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-3">
            <Mail className="w-6 h-6 text-blue-400" />
            <h3 className="text-white font-semibold">1-Click Invites</h3>
            <p className="text-sm text-gray-400">Easily invite students via email links to instantly provision their Pro accounts.</p>
          </div>
          <div className="bg-gray-900 border border-gray-800 p-6 rounded-xl space-y-3">
            <CheckCircle2 className="w-6 h-6 text-violet-400" />
            <h3 className="text-white font-semibold">Cohort Analytics</h3>
            <p className="text-sm text-gray-400">See which students are getting views and clicks from recruiters in real-time.</p>
          </div>
        </div>

        <div className="mt-12 text-center bg-gray-900 border border-gray-800 rounded-xl p-8">
          <h2 className="text-xl font-bold text-white mb-2">Ready to create a Team?</h2>
          <p className="text-sm text-gray-400 mb-6">Upgrade to the Team Plan to unlock cohort management.</p>
          <Link href="/dashboard/billing" className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-medium px-6 py-3 rounded-lg transition-colors">
            Upgrade to Team Plan <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    )
  }

  // Dashboard State: User is in an organization
  const { org, role } = membership
  const isAdmin = role === 'ADMIN'

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">{org.name} Workspace</h1>
          <p className="text-gray-400 mt-1">Manage your team members and cohort portfolios.</p>
        </div>
        {isAdmin && (
          <button className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Invite Members
          </button>
        )}
      </div>

      <div className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex justify-between items-center bg-gray-950">
          <h2 className="text-white font-semibold">Active Members ({org.members.length})</h2>
          {isAdmin && <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded">Admin View</span>}
        </div>
        
        <div className="divide-y divide-gray-800">
          {/* FIX 2: Explicitly type member as 'any' to satisfy TS */}
          {org.members.map((member: any) => (
            <div key={member.id} className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-800/50 transition-colors">
              <div className="flex items-center gap-4">
                <img 
                  src={member.user.image || `https://ui-avatars.com/api/?name=${member.user.name}&background=random`} 
                  alt="" 
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{member.user.name || member.user.username}</p>
                    {member.role === 'ADMIN' && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded">
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{member.user.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {member.user.portfolio ? (
                  <Link 
                    href={`/${member.user.username}`} 
                    target="_blank"
                    className="text-sm text-violet-400 hover:text-violet-300 font-medium"
                  >
                    View Portfolio
                  </Link>
                ) : (
                  <span className="text-sm text-gray-600">No portfolio yet</span>
                )}
                
                {isAdmin && member.userId !== session.user.id && (
                  <button className="text-sm text-gray-500 hover:text-red-400 transition-colors">
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}