import { BarChart3, House, LogOut, Menu, UserRound, X } from 'lucide-react'
import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import Logo from './Logo.jsx'
import { useAuth } from './AuthContext.jsx'

const navClass = ({ isActive }) => `flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition ${isActive ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md shadow-violet-200' : 'text-[#171434] hover:bg-violet-50'}`

function AppLayout({ children, pageTitle, pageSubtitle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const handleLogout = async () => { await logout(); navigate('/login', { replace: true }) }

  return (
    <main className="min-h-dvh bg-[#fbfaff] text-[#11102f]">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[190px] overflow-hidden border-r border-violet-100 bg-white px-5 py-8 lg:flex lg:flex-col"><Logo compact /><nav className="mt-12 space-y-2"><NavLink className={navClass} to="/dashboard"><House className="h-5 w-5" />Readings</NavLink><NavLink className={navClass} to="/reports"><BarChart3 className="h-5 w-5" />Reports</NavLink></nav><div className="pointer-events-none absolute -bottom-20 -left-20 h-44 w-72 rounded-[50%] bg-violet-100" /><div className="pointer-events-none absolute -bottom-28 left-14 h-44 w-72 rounded-[50%] bg-violet-200/70" /></aside>
      <header className="flex h-20 items-center justify-between border-b border-violet-100 bg-white px-5 lg:hidden"><button className="rounded-lg p-2 hover:bg-violet-50" type="button" aria-label="Open navigation" onClick={() => setDrawerOpen(true)}><Menu className="h-6 w-6" /></button><Logo compact /><span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100"><UserRound className="h-5 w-5 text-violet-800" /></span></header>
      {drawerOpen && <div className="fixed inset-0 z-50 bg-slate-950/35 lg:hidden" role="presentation" onClick={() => setDrawerOpen(false)}><aside className="flex h-full w-[82%] max-w-[320px] flex-col bg-white p-5 shadow-2xl" onClick={(event) => event.stopPropagation()}><div className="flex items-center justify-between"><Logo compact /><button className="rounded-lg p-2 hover:bg-violet-50" type="button" onClick={() => setDrawerOpen(false)}><X className="h-5 w-5" /></button></div><div className="mt-8 flex items-center gap-3 border-b border-violet-100 pb-5"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100"><UserRound className="h-5 w-5 text-violet-700" /></span><div><p className="font-bold">{user?.name || 'Darshan Kumar'}</p><p className="text-xs text-slate-500">{user?.email || 'darshan@example.com'}</p></div></div><nav className="mt-5 space-y-2" onClick={() => setDrawerOpen(false)}><NavLink className={navClass} to="/dashboard"><House className="h-5 w-5" />Readings</NavLink><NavLink className={navClass} to="/reports"><BarChart3 className="h-5 w-5" />Reports</NavLink></nav><button className="mt-auto flex items-center gap-3 border-t border-violet-100 px-4 pt-5 font-semibold text-red-600" type="button" onClick={handleLogout}><LogOut className="h-5 w-5" />Logout</button></aside></div>}
      <div className="lg:ml-[190px]"><header className="hidden h-[116px] items-center justify-between border-b border-violet-100 bg-white px-8 lg:flex xl:px-12"><div><h1 className="text-[26px] font-extrabold tracking-[-0.02em]">{pageTitle || <>Good evening, {user?.name?.split(' ')[0] || 'Darshan'}!</>}</h1><p className="mt-1 text-sm text-slate-600">{pageSubtitle || 'Track, record and manage your blood glucose readings.'}</p></div><div className="flex items-center gap-4"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100"><UserRound className="h-5 w-5 text-violet-800" /></span><span className="text-sm font-semibold">{user?.name || 'Darshan Kumar'}</span><button className="flex items-center gap-2 rounded-lg border border-red-400 px-4 py-2.5 text-sm font-semibold text-red-600 hover:bg-red-50" type="button" onClick={handleLogout}><LogOut className="h-4 w-4" />Logout</button></div></header><div className="pb-24 lg:pb-0">{children}</div></div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid h-[72px] grid-cols-2 border-t border-violet-100 bg-white lg:hidden"><NavLink className={({ isActive }) => `flex flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? 'text-violet-700' : 'text-slate-600'}`} to="/dashboard"><House className="h-5 w-5" />Readings</NavLink><NavLink className={({ isActive }) => `flex flex-col items-center justify-center gap-1 text-xs font-semibold ${isActive ? 'text-violet-700' : 'text-slate-600'}`} to="/reports"><BarChart3 className="h-5 w-5" />Reports</NavLink></nav>
    </main>
  )
}

export default AppLayout
