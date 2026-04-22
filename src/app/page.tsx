import Navbar from '@/components/shared/Navbar'
import Footer from '@/components/shared/Footer'
import PricingCard from '@/components/shared/PricingCard'
import { PLANS } from '@/lib/stripe'
import Link from 'next/link'
import { ArrowRight, GitBranch, Sparkles, BarChart } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col selection:bg-violet-500/30">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            <span>AI-Powered Developer Portfolios</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight max-w-4xl leading-tight">
            Ship your portfolio in <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-500">seconds</span>.
          </h1>
          <p className="mt-6 text-xl text-gray-400 max-w-2xl">
            Sync with GitHub, generate descriptions with AI, and track your views. Stand out to recruiters without writing a single line of CSS.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Link 
              href="/login" 
              className="bg-white text-gray-950 hover:bg-gray-100 px-8 py-4 rounded-xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
            >
              {/* BUG FIX: Swapped Github for GitBranch since Lucide removed brand icons */}
              <GitBranch className="w-5 h-5" />
              Continue with GitHub
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-gray-900 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white">Everything you need to stand out</h2>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800">
                {/* BUG FIX: Swapped Github for GitBranch */}
                <GitBranch className="w-10 h-10 text-violet-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">One-Click Sync</h3>
                <p className="text-gray-400">Instantly import your repositories, top languages, and contribution graph directly from GitHub.</p>
              </div>
              <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800">
                <Sparkles className="w-10 h-10 text-violet-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">AI Generation</h3>
                <p className="text-gray-400">Let Anthropic's Claude generate a professional bio, project descriptions, and skill tags for you.</p>
              </div>
              <div className="bg-gray-950 p-8 rounded-2xl border border-gray-800">
                <BarChart className="w-10 h-10 text-violet-400 mb-6" />
                <h3 className="text-xl font-bold text-white mb-3">Advanced Analytics</h3>
                <p className="text-gray-400">Track profile views, map visitor countries, and see where your traffic is coming from.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-24 px-6 max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">Simple, transparent pricing</h2>
            <p className="text-gray-400 text-lg">Start for free, upgrade when you need more power.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <PricingCard 
              name={PLANS.FREE.name} 
              price={PLANS.FREE.price} 
              features={PLANS.FREE.features} 
            />
            <PricingCard 
              name={PLANS.PRO.name} 
              price={PLANS.PRO.price} 
              features={PLANS.PRO.features} 
              isPro={true}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}