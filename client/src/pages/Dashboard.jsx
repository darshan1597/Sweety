import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CalendarDays, Check, CookingPot, ForkKnife, List, Moon, Pencil, Plus, Sigma, Sun, Trash2, X } from 'lucide-react'
import { createElement, useState } from 'react'
import AppLayout from './components/AppLayout.jsx'

const readings = [
  { slot: 'Morning (fasting)', value: 98, time: '07:30 AM', icon: Sun, color: 'text-amber-500' },
  { slot: 'After breakfast', value: 132, time: '09:45 AM', icon: ForkKnife, color: 'text-emerald-500' },
  { slot: 'After lunch', value: 118, time: '01:20 PM', icon: CookingPot, color: 'text-emerald-500' },
  { slot: 'After dinner', value: null, time: '', icon: Moon, color: 'text-violet-700' },
]

const today = new Date().toLocaleDateString('en-CA')

function formatSelectedDate(dateValue) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${dateValue}T00:00:00Z`))
}

function shiftDate(dateValue, amount) {
  const date = new Date(`${dateValue}T00:00:00Z`)
  date.setUTCDate(date.getUTCDate() + amount)
  return date.toISOString().slice(0, 10)
}

function ReadingModal({ mode, reading, onClose }) {
  const editing = mode === 'edit'
  const deleting = mode === 'delete'
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/25 px-4 backdrop-blur-[2px]">
      <section className="w-full max-w-[430px] rounded-2xl border border-violet-100 bg-white p-6 shadow-2xl">
        <div className="flex items-center justify-between"><h2 className="flex items-center gap-3 text-xl font-extrabold">{deleting && <Trash2 className="h-6 w-6 text-red-500" />}{deleting ? 'Delete Reading' : editing ? 'Edit Reading' : 'Add Reading'}</h2><button className="rounded-lg p-1 hover:bg-slate-100" type="button" onClick={onClose}><X className="h-5 w-5" /></button></div>
        {deleting ? <><p className="mt-6 text-sm leading-6 text-slate-700">Are you sure you want to delete this reading?<br />This action cannot be undone.</p><div className="mt-7 flex justify-end gap-3"><button className="h-11 rounded-lg border border-slate-300 px-7 font-semibold" type="button" onClick={onClose}>Cancel</button><button className="h-11 rounded-lg bg-red-600 px-8 font-semibold text-white" type="button" onClick={onClose}>Delete</button></div></> : <form className="mt-6 space-y-4" onSubmit={(event) => { event.preventDefault(); onClose() }}><div><label className="mb-2 block text-sm font-bold" htmlFor="slot">Time Slot</label><select className="h-12 w-full rounded-lg border border-slate-300 bg-white px-4 outline-none focus:border-violet-600" id="slot" defaultValue={reading?.slot || 'After dinner'}><option>Morning (fasting)</option><option>After breakfast</option><option>After lunch</option><option>After dinner</option></select></div><div><label className="mb-2 block text-sm font-bold" htmlFor="value">Glucose Value (mg/dl)</label><input className="h-12 w-full rounded-lg border border-slate-300 px-4 outline-none focus:border-violet-600" id="value" type="number" min="40" max="600" defaultValue={reading?.value || ''} placeholder="Enter glucose value" /><p className="mt-2 text-xs text-slate-600">Enter a value between 40 and 600 mg/dl.</p></div><div className="flex justify-end gap-3 pt-2"><button className="h-11 rounded-lg border border-slate-300 px-7 font-semibold" type="button" onClick={onClose}>Cancel</button><button className="h-11 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-7 font-semibold text-white shadow-md shadow-violet-200" type="submit">{editing ? 'Save Changes' : 'Add Reading'}</button></div></form>}
      </section>
    </div>
  )
}

function Summary({ icon, label, value, tone, noUnit = false }) {
  const colors = { red: 'bg-red-50 text-red-500', green: 'bg-emerald-50 text-emerald-600', violet: 'bg-violet-50 text-violet-700', blue: 'bg-blue-50 text-blue-600' }
  return <div className="flex items-center gap-3 px-2 md:px-5"><span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${colors[tone]}`}>{createElement(icon, { className: 'h-5 w-5' })}</span><div><p className="text-xs text-slate-600">{label}</p><p className="mt-1 font-extrabold">{value}{!noUnit && <span className="ml-1 text-xs font-medium">mg/dl</span>}</p></div></div>
}

function Dashboard() {
  const [dialog, setDialog] = useState(null)
  const [selectedDate, setSelectedDate] = useState('2026-10-15')
  const goToPreviousDay = () => setSelectedDate((current) => shiftDate(current, -1))
  const goToNextDay = () => setSelectedDate((current) => shiftDate(current, 1))

  return (
    <AppLayout>
      <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7 xl:px-12">
        <div className="lg:hidden"><h1 className="text-2xl font-extrabold leading-7">Good evening,<br />Darshan 👋</h1></div>
        <div className="mt-5 flex items-center gap-2 lg:mt-0"><button className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:border-violet-400 hover:text-violet-700" type="button" onClick={goToPreviousDay} aria-label="Previous day"><ArrowLeft className="h-5 w-5" /></button><label className="relative flex h-11 flex-1 cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white text-sm font-semibold transition hover:border-violet-400 sm:max-w-[270px]"><CalendarDays className="h-5 w-5" /><span>{formatSelectedDate(selectedDate)}</span><input className="absolute inset-0 cursor-pointer opacity-0" type="date" value={selectedDate} max={today} onChange={(event) => event.target.value && setSelectedDate(event.target.value)} aria-label="Select reading date" /></label><button className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:border-violet-400 hover:text-violet-700 disabled:cursor-not-allowed disabled:opacity-40" type="button" onClick={goToNextDay} disabled={selectedDate >= today} aria-label="Next day"><ArrowRight className="h-5 w-5" /></button><button className="ml-auto hidden h-11 items-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 px-6 font-semibold text-white shadow-md shadow-violet-200 lg:flex" type="button" onClick={() => setDialog({ mode: 'add' })}><Plus className="h-5 w-5" />Add Reading</button></div>
        <section className="mt-5 rounded-2xl border border-violet-200 bg-violet-50/40 px-5 py-4"><div className="flex items-end justify-between"><div><h2 className="font-extrabold">Daily Progress</h2><p className="mt-1 text-sm text-slate-700">3 of 4 readings recorded</p></div><strong className="text-violet-900">75%</strong></div><div className="mt-3 h-3 overflow-hidden rounded-full bg-violet-200"><div className="h-full w-3/4 rounded-full bg-gradient-to-r from-violet-600 to-purple-700" /></div></section>
        <section className="mt-4 grid gap-2 lg:mt-5 lg:grid-cols-4 lg:gap-3">
          {readings.map((reading) => { const Icon = reading.icon; return <article className={`rounded-xl border px-3 py-3 lg:min-h-[190px] lg:rounded-2xl lg:p-4 ${reading.value ? 'border-emerald-200 bg-emerald-50/60' : 'border-violet-200 bg-violet-50/60'}`} key={reading.slot}><div className="flex items-center gap-3 lg:items-start"><Icon className={`h-7 w-7 shrink-0 lg:h-8 lg:w-8 ${reading.color}`} /><div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold leading-5 lg:text-base">{reading.slot}</h3>{reading.value ? <><p className="text-xs text-slate-700 lg:mt-5 lg:text-2xl lg:font-extrabold lg:text-[#11102f]">{reading.value} <span className="lg:text-sm lg:font-medium">mg/dl</span><span className="lg:hidden"> · {reading.time}</span></p><p className="mt-1 hidden text-sm lg:block">{reading.time}</p></> : <p className="text-xs text-slate-600 lg:mt-5 lg:text-sm">Not recorded yet</p>}</div>{reading.value ? <><span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-white lg:h-6 lg:w-6"><Check className="h-3.5 w-3.5 lg:h-4 lg:w-4" /></span><ArrowRight className="h-4 w-4 lg:hidden" /></> : <button className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-300 bg-white text-violet-700 lg:hidden" type="button" onClick={() => setDialog({ mode: 'add', reading })}><Plus className="h-5 w-5" /></button>}</div>{reading.value ? <div className="mt-3 hidden justify-end gap-2 lg:flex"><button className="flex h-10 w-12 items-center justify-center rounded-lg border border-slate-300 bg-white" type="button" onClick={() => setDialog({ mode: 'edit', reading })}><Pencil className="h-4 w-4" /></button><button className="flex h-10 w-12 items-center justify-center rounded-lg border border-slate-300 bg-white text-red-500" type="button" onClick={() => setDialog({ mode: 'delete', reading })}><Trash2 className="h-4 w-4" /></button></div> : <button className="mt-6 hidden h-10 w-full items-center justify-center gap-2 rounded-lg border border-violet-500 bg-white font-semibold text-violet-700 lg:flex" type="button" onClick={() => setDialog({ mode: 'add', reading })}><Plus className="h-5 w-5" />Add</button>}</article> })}
        </section>
        <section className="mt-5 hidden rounded-2xl border border-violet-200 bg-white p-5 lg:block"><h2 className="flex items-center gap-3 text-lg font-extrabold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700"><List className="h-5 w-5" /></span>Daily Summary</h2><div className="mt-5 grid grid-cols-4 divide-x divide-slate-200"><Summary icon={ArrowUp} label="Highest" value="132" tone="red" /><Summary icon={ArrowDown} label="Lowest" value="98" tone="green" /><Summary icon={Sigma} label="Average" value="116.0" tone="violet" /><Summary icon={List} label="Total Readings" value="3 of 4" tone="blue" noUnit /></div></section>
      </div>
      {dialog && <ReadingModal mode={dialog.mode} reading={dialog.reading} onClose={() => setDialog(null)} />}
    </AppLayout>
  )
}

export default Dashboard
