import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { PLANS } from '@/lib/stripe'
import { Check, Zap } from 'lucide-react'
import UpgradeButton from '@/components/dashboard/UpgradeButton'

export default async function BillingPage({
  searchParams,
}: {
  searchParams: { success?: string; canceled?: string }
}) {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: { subscription: true },
  })

  const isPro = user?.plan === 'PRO'
  const sub = user?.subscription

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-gray-400 mt-1">Manage your plan and subscription.</p>
      </div>

      {/* Success / canceled banners */}
      {searchParams.success && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 text-green-400 text-sm">
          🎉 You are now on Pro! Enjoy unlimited access.
        </div>
      )}
      {searchParams.canceled && (
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 text-yellow-400 text-sm">
          Checkout canceled. You are still on the Free plan.
        </div>
      )}

      {/* Current plan */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-white font-semibold mb-4">Current Plan</h2>
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
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

        {/* Free plan */}
        <div className={`bg-gray-900 rounded-xl border p-6 space-y-4 ${!isPro ? 'border-violet-500' : 'border-gray-800'}`}>
          <div>
            <h3 className="text-white font-bold text-lg">Free</h3>
            <p className="text-3xl font-black text-white mt-1">$0<span className="text-gray-500 text-base font-normal">/mo</span></p>
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

        {/* Pro plan */}
        <div className={`bg-gray-900 rounded-xl border p-6 space-y-4 ${isPro ? 'border-violet-500' : 'border-gray-800'}`}>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-white font-bold text-lg">Pro</h3>
              <span className="bg-violet-600 text-white text-xs px-2 py-0.5 rounded-full">Popular</span>
            </div>
            <p className="text-3xl font-black text-white mt-1">$9<span className="text-gray-500 text-base font-normal">/mo</span></p>
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
              <UpgradeButton />
            )}
          </div>
        </div>

      </div>
    </div>
  )
}