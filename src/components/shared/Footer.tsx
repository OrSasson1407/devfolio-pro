import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="border-t border-gray-800 bg-gray-950 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-violet-600 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">D</span>
          </div>
          <span className="text-gray-400 font-medium text-sm">© {new Date().getFullYear()} DevFolio Pro. All rights reserved.</span>
        </div>
        
        <div className="flex gap-6">
          <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Terms</Link>
          <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Privacy</Link>
          <Link href="#" className="text-gray-500 hover:text-white text-sm transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  )
}