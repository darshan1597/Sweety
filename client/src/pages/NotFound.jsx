import { FileSearch, House } from 'lucide-react'
import { Link } from 'react-router-dom'
import Logo from './components/Logo.jsx'

function NotFound() {
  return <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fbfaff] px-4 text-center text-[#11102f]"><div className="absolute left-8 top-8"><Logo compact /></div><div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-[70%] rounded-[50%] bg-violet-100/70" /><div className="pointer-events-none absolute -bottom-40 right-[-10%] h-72 w-[65%] rounded-[50%] bg-violet-200/45" /><section className="relative w-full max-w-[520px] rounded-2xl border border-violet-200 bg-white px-8 py-10 shadow-xl shadow-violet-100/70"><span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-violet-100"><FileSearch className="h-14 w-14 text-violet-500" /></span><h1 className="mt-6 text-2xl font-extrabold">404 - Page Not Found</h1><p className="mx-auto mt-3 max-w-sm leading-6 text-slate-600">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p><Link className="mx-auto mt-7 flex h-12 max-w-[300px] items-center justify-center gap-2 rounded-lg border-2 border-violet-600 font-bold text-violet-700 transition hover:bg-violet-50" to="/dashboard"><House className="h-5 w-5" />Go to Dashboard</Link></section></main>
}

export default NotFound
