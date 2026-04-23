import { Check } from 'lucide-react'
import Link from 'next/link'

interface PricingCardProps {
  name: string
  price: number
  features: string[]
  isPro?: boolean
  interval?: 'month' | 'year' // NEW
}

export default function PricingCard({ name, price, features, isPro, interval = 'month' }: PricingCardProps) {
  return (
    <div className={`p-8 rounded-2xl border bg-gray-900 flex flex-col h-full ${
      isPro ? 'border-violet-500 shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]' : 'border-gray-800'
    }`}>
      {isPro && (
        <span className="bg-violet-600 text-white text-xs font-bold px-3 py-1 rounded-full w-fit mb-4">
          MOST POPULAR
        </span>
      )}
      <h3 className="text-xl font-bold text-white">{name}</h3>
      <div className="mt-4 flex items-baseline text-5xl font-extrabold text-white">
        ${price}
        <span className="ml-1 text-xl font-medium text-gray-500">/{interval === 'year' ? 'yr' : 'mo'}</span>
      </div>
      
      <ul className="mt-8 space-y-4 flex-1">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3">
            <Check className={`w-5 h-5 shrink-0 ${isPro ? 'text-violet-400' : 'text-gray-500'}`} />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>

      <Link 
        href="/login" 
        className={`mt-8 w-full block text-center py-3 px-6 rounded-lg font-medium transition-colors ${
          isPro 
            ? 'bg-violet-600 hover:bg-violet-700 text-white' 
            : 'bg-gray-800 hover:bg-gray-700 text-white'
        }`}
      >
        Get Started
      </Link>
    </div>
  )
}