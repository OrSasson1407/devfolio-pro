interface StatsCardProps {
  label: string
  value: string | number
  sub?: string
  icon: React.ReactNode
  color: string
}

export default function StatsCard({ label, value, sub, icon, color }: StatsCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-5 flex items-center gap-4">
      <div className={`${color} p-3 rounded-lg`}>{icon}</div>
      <div>
        <p className="text-gray-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold">{value}</p>
        {sub && <p className="text-gray-500 text-xs mt-0.5">{sub}</p>}
      </div>
    </div>
  )
}