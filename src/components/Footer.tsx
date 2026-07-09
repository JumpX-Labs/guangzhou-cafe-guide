import { Heart, Camera } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-16 py-10 border-t-2 border-dashed border-ink/20 bg-paper">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="font-hand text-2xl text-ink mb-2">Guangzhou Cafe Guide</p>
        <p className="font-body text-sm text-ink-soft mb-4">
          手绘广州街巷里的咖啡角落，仅供探店参考。
        </p>
        <div className="flex items-center justify-center gap-4 text-ink-soft">
          <span className="flex items-center gap-1">
            <Heart className="w-4 h-4 text-red fill-red" />
            用咖啡丈量城市
          </span>
          <span className="font-hand text-lg">@gzcafeguide</span>
          <Camera className="w-4 h-4" />
        </div>
        <div className="mt-6 text-xs text-ink-soft/70">
          © 2026 广州咖啡馆探店手册
        </div>
      </div>

      {/* Decorative stamps */}
      <div className="absolute top-4 right-6 w-16 h-16 border-2 border-ink/20 rounded-full flex items-center justify-center rotate-12 opacity-60">
        <span className="font-hand text-xs text-ink/50">coffee</span>
      </div>
      <div className="absolute bottom-4 left-6 w-12 h-12 border-2 border-ink/20 rounded-full flex items-center justify-center -rotate-12 opacity-60">
        <span className="font-hand text-xs text-ink/50">GZ</span>
      </div>
    </footer>
  )
}
