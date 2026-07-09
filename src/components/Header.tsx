import { Link, useLocation } from 'react-router-dom'
import { Coffee, MapPin, Search, Settings, FileJson, BookOpen, Rocket } from 'lucide-react'

export default function Header() {
  const location = useLocation()
  const isHome = location.pathname === '/'

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur-sm border-b-2 border-ink/10">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 bg-red rounded-wobbly-sm flex items-center justify-center border-2 border-ink group-hover:rotate-3 transition-transform">
            <Coffee className="w-5 h-5 text-paper-light" />
          </div>
          <span className="font-display text-2xl text-ink hidden sm:inline">广州咖啡手册</span>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-4 py-2 rounded-wobbly-sm font-body text-sm border-2 transition-all hover:-translate-y-0.5 hover:shadow-paper ${
              isHome
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper-light text-ink border-ink'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              首页
            </span>
          </Link>
          <Link
            to="/explore"
            className={`px-4 py-2 rounded-wobbly-sm font-body text-sm border-2 transition-all hover:-translate-y-0.5 hover:shadow-paper ${
              location.pathname === '/explore' || location.pathname.startsWith('/cafe/')
                ? 'bg-ink text-paper border-ink'
                : 'bg-paper-light text-ink border-ink'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Search className="w-4 h-4" />
              探店
            </span>
          </Link>
          <Link
            to="/assignment"
            className={`px-4 py-2 rounded-wobbly-sm font-body text-sm border-2 transition-all hover:-translate-y-0.5 hover:shadow-paper ${
              location.pathname === '/assignment'
                ? 'bg-red text-paper border-red'
                : 'bg-paper-light text-ink border-ink'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              作业
            </span>
          </Link>
          <Link
            to="/admin"
            className={`px-4 py-2 rounded-wobbly-sm font-body text-sm border-2 transition-all hover:-translate-y-0.5 hover:shadow-paper ${
              location.pathname === '/admin'
                ? 'bg-red text-paper border-red'
                : 'bg-paper-light text-ink border-ink'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Settings className="w-4 h-4" />
              管理
            </span>
          </Link>
          <Link
            to="/api-docs"
            className={`px-4 py-2 rounded-wobbly-sm font-body text-sm border-2 transition-all hover:-translate-y-0.5 hover:shadow-paper ${
              location.pathname === '/api-docs'
                ? 'bg-red text-paper border-red'
                : 'bg-paper-light text-ink border-ink'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <FileJson className="w-4 h-4" />
              API
            </span>
          </Link>
          <Link
            to="/deployment"
            className={`px-4 py-2 rounded-wobbly-sm font-body text-sm border-2 transition-all hover:-translate-y-0.5 hover:shadow-paper ${
              location.pathname === '/deployment'
                ? 'bg-red text-paper border-red'
                : 'bg-paper-light text-ink border-ink'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <Rocket className="w-4 h-4" />
              部署
            </span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
