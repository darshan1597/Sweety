import { Droplet, Heart } from 'lucide-react'

function Logo({ compact = false }) {
  return (
    <div className="flex items-center justify-center gap-2.5 cursor-pointer">
      <span className={`${compact ? 'h-9 w-8' : 'h-11 w-10'} relative flex items-center justify-center`}>
        <Droplet className="absolute inset-0 h-full w-full fill-violet-600 text-violet-600" />
        <Heart className={`${compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} relative mt-1 fill-white text-white`} />
      </span>
      <span className={`${compact ? 'text-2xl' : 'text-[28px]'} font-extrabold tracking-[-0.03em] text-[#3f0ca3]`}>Sweety</span>
    </div>
  )
}

export default Logo
