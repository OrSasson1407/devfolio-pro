import Link from 'next/link'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  href?: string
  showPro?: boolean
}

export default function Logo({ size = 'md', href = '/', showPro = true }: LogoProps) {
  const sizes = {
    sm: { icon: 24, text: 14, dot: 5 },
    md: { icon: 32, text: 18, dot: 6 },
    lg: { icon: 48, text: 28, dot: 8 },
  }

  const s = sizes[size]

  const content = (
    <div className="flex items-center gap-2.5 select-none">
      {/* Icon */}
      <div
        className="relative flex items-center justify-center bg-violet-600 rounded-xl shrink-0"
        style={{ width: s.icon, height: s.icon }}
      >
        <span
          className="text-white font-bold leading-none"
          style={{ fontFamily: 'Georgia, serif', fontSize: s.icon * 0.58 }}
        >
          D
        </span>
        <span
          className="absolute bg-violet-300 rounded-full"
          style={{
            width: s.dot,
            height: s.dot,
            top: s.dot * 0.3,
            right: s.dot * 0.3,
          }}
        />
      </div>

      {/* Wordmark */}
      <div className="flex items-baseline gap-0" style={{ fontFamily: 'Georgia, serif', fontSize: s.text, fontWeight: 700 }}>
        <span className="text-white">Dev</span>
        <span className="text-violet-400">Folio</span>
        {showPro && (
          <span
            className="ml-1.5 bg-violet-600 text-white rounded px-1.5 py-0.5 leading-none"
            style={{ fontSize: s.text * 0.5, fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
          >
            PRO
          </span>
        )}
      </div>
    </div>
  )

  if (!href) return content

  return (
    <Link href={href} className="hover:opacity-90 transition-opacity">
      {content}
    </Link>
  )
}