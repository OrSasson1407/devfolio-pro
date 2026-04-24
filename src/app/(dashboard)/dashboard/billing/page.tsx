import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/lib/stripe'
import { Check } from 'lucide-react'
import Link from 'next/link'
import UpgradeButton from '@/components/dashboard/UpgradeButton'
import ManageButton from '@/components/dashboard/ManageButton'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; canceled?: string; interval?: string }>
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  const isPro = user?.plan === 'PRO'
  const sub = user?.subscription

  const params = await searchParams
  const isAnnual = params.interval === 'year'

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-gray-400 mt-1">Manage your plan and subscription.</p>
      </div>

      {params.success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
          🎉 You are now on Pro! Enjoy unlimited access.
        </div>
      )}
      {params.canceled && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-400 text-sm">
          Checkout canceled. You are still on the Free plan.
        </div>
      )}

      {/* Current Plan */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-white font-semibold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${isPro ? 'bg-violet-600 text-white' : 'bg-gray-700 text-gray-300'}`}>
              {isPro ? 'Pro' : 'Free'}
            </div>
            {isPro && sub && (
              <p className="text-gray-400 text-sm">
                Renews {new Date(sub.currentPeriodEnd).toLocaleDateString()}
              </p>
            )}
          </div>
          {isPro && <ManageButton />}
        </div>
      </div>

      {/* Monthly / Annual Toggle */}
      {!isPro && (
        <div className="flex justify-center mt-8 mb-2">
          <div className="bg-gray-900 p-1.5 rounded-xl border border-gray-800 flex items-center">
            <Link
              href="?interval=month"
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all ${!isAnnual ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Monthly
            </Link>
            <Link
              href="?interval=year"
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${isAnnual ? 'bg-violet-600 text-white shadow-lg' : 'text-gray-400 hover:text-gray-200'}`}
            >
              Annually
              <span className={`text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider font-bold ${isAnnual ? 'bg-white/20 text-white' : 'bg-emerald-500/20 text-emerald-400'}`}>
                2 Months Free
              </span>
            </Link>
          </div>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Free */}
        <div className={`bg-gray-900 rounded-xl border p-6 space-y-4 ${!isPro ? 'border-violet-500' : 'border-gray-800'}`}>
          <div>
            <h3 className="text-white font-bold text-lg">Free</h3>
            <p className="text-3xl font-black text-white mt-1">
              $0<span className="text-gray-500 text-base font-normal">/mo</span>
            </p>
          </div>
          <ul className="space-y-2">
            {PLANS.FREE.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-gray-500 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          {!isPro && (
            <div className="pt-2">
              <span className="text-sm text-violet-400 font-medium">Current plan</span>
            </div>
          )}
        </div>

        {/* Pro */}
        <div className={`bg-gray-900 rounded-xl border p-6 space-y-4 ${isPro ? 'border-violet-500 shadow-[0_0_30px_-5px_rgba(139,92,246,0.15)]' : 'border-gray-800'}`}>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg">Pro</h3>
              <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
            </div>
            <p className="text-3xl font-black text-white mt-1">
              ${isAnnual ? '90' : '9'}
              <span className="text-gray-500 text-base font-normal">/{isAnnual ? 'yr' : 'mo'}</span>
            </p>
          </div>
          <ul className="space-y-2">
            {PLANS.PRO.features.map((f) => (
              <li key={f} className="flex items-center gap-2 text-gray-300 text-sm">
                <Check className="w-4 h-4 text-violet-400 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
          <div className="pt-2">
            {isPro ? (
              <span className="text-sm text-violet-400 font-medium">Current plan</span>
            ) : (
              <UpgradeButton interval={isAnnual ? 'year' : 'month'} />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}