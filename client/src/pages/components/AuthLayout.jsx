import { CalendarDays, ChartNoAxesColumnIncreasing, ShieldCheck } from 'lucide-react'
import GlucoseIllustration from './GlucoseIllustration.jsx'
import Logo from './Logo.jsx'

function AuthLayout({ children, variant = 'login' }) {
  const isLogin = variant === 'login'

  return (
    <main className="relative h-dvh overflow-hidden bg-white text-[#10112f]">
      <div className="pointer-events-none absolute -left-20 -top-20 h-64 w-64 rounded-full bg-violet-100/60 blur-3xl lg:hidden" />
      <div className="pointer-events-none absolute -bottom-24 right-0 h-72 w-72 rounded-full bg-fuchsia-100/60 blur-3xl lg:hidden" />

      <section className="relative grid h-full w-full overflow-hidden bg-white lg:grid-cols-2">
        <aside className="relative hidden overflow-visible bg-gradient-to-br from-[#f2edff] via-[#eee7ff] to-[#ddd0ff] lg:block">
          <div className="absolute -left-[18%] top-[38%] h-[37%] w-[118%] rounded-[50%] bg-white/28" />
          <div className="absolute -bottom-[15%] -left-[12%] h-[42%] w-[120%] rounded-[50%] bg-violet-300/20" />
          <div className="pointer-events-none absolute -right-10 top-1/2 z-0 h-[138%] w-20 -translate-y-1/2 rounded-[50%] bg-[#e8deff]" />

          <div className="absolute left-[8%] top-[5%] z-10 h-[42%] w-[76%]">
            <GlucoseIllustration />
          </div>

          <div className="absolute left-[7vw] top-[55%] z-10 w-[72%] max-w-[470px]">
            <h2 className="max-w-md text-[31px] font-extrabold leading-[1.12] tracking-[-0.02em] text-[#21106a]">{isLogin ? <>Track Your<br />Blood Glucose</> : <>Take Control of<br />Your Health</>}</h2>
            <p className="mt-3 max-w-md text-[15px] leading-6 text-[#252340]">{isLogin ? 'Record your daily readings, view reports and stay in control of your health.' : 'Create your Sweety account to record readings, view reports and stay healthy.'}</p>
            <div className="mt-6 grid grid-cols-3 divide-x divide-violet-300/60 text-center text-[13px] font-medium text-[#21154f]">
              <div className="flex flex-col items-center gap-3 px-2"><CalendarDays className="h-7 w-7 text-violet-600" /><span>Log Readings</span></div>
              <div className="flex flex-col items-center gap-3 px-2"><ChartNoAxesColumnIncreasing className="h-7 w-7 text-violet-600" /><span>{isLogin ? 'View Reports' : 'Track Progress'}</span></div>
              <div className="flex flex-col items-center gap-3 px-2"><ShieldCheck className="h-7 w-7 text-violet-600" /><span>Stay Healthy</span></div>
            </div>
          </div>
        </aside>

        <div className="relative z-30 flex h-full items-center justify-center overflow-hidden px-6 py-5 sm:px-10 lg:px-12">
          <div className="pointer-events-none absolute -top-24 left-[-15%] h-52 w-[75%] rounded-[50%] bg-violet-100/70 lg:hidden" />
          <div className="pointer-events-none absolute -bottom-28 right-[-10%] h-48 w-[85%] rounded-[50%] bg-violet-100/80 lg:hidden" />
          <div className="relative w-full max-w-[400px]"><Logo />{children}</div>
        </div>
      </section>
    </main>
  )
}

export default AuthLayout
