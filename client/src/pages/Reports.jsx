import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, CalendarDays, Check, CookingPot, ForkKnife, List, Moon, Pencil, Sigma, Sun } from 'lucide-react'
import { createElement, useState } from 'react'
import AppLayout from './components/AppLayout.jsx'

const reportReadings = [
  { slot: 'Morning (fasting)', value: 98, time: '07:30 AM', icon: Sun, color: 'text-amber-500' },
  { slot: 'After breakfast', value: 132, time: '09:45 AM', icon: ForkKnife, color: 'text-emerald-500' },
  { slot: 'After lunch', value: 118, time: '01:20 PM', icon: CookingPot, color: 'text-emerald-500' },
  { slot: 'After dinner', value: null, time: 'Not recorded yet', icon: Moon, color: 'text-violet-700' },
]

const today = new Date().toLocaleDateString('en-CA')
const tabLabels = { daily: 'Daily', mtd: 'Month-to-date', previous: 'Previous month' }

function shiftDate(value, amount) { const date = new Date(`${value}T00:00:00Z`); date.setUTCDate(date.getUTCDate() + amount); return date.toISOString().slice(0, 10) }
function prettyDate(value) { return new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) }
function shortDate(value) { return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) }

function StatCard({ icon, label, value, tone, count = false }) {
  const colors = { red: 'border-red-200 bg-red-50 text-red-500', green: 'border-emerald-200 bg-emerald-50 text-emerald-600', violet: 'border-violet-200 bg-violet-50 text-violet-700', blue: 'border-blue-200 bg-blue-50 text-blue-600' }
  return <div className={`flex min-h-[82px] items-center gap-3 rounded-xl border p-4 ${colors[tone]}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/70">{createElement(icon, { className: 'h-5 w-5' })}</span><div className="text-[#11102f]"><p className="text-xs">{label}</p><p className="mt-1 text-xl font-extrabold">{value}{!count && <span className="ml-1 text-sm font-semibold">mg/dl</span>}</p></div></div>
}

function Reports() {
  const [tab, setTab] = useState('daily')
  const [selectedDate, setSelectedDate] = useState('2026-10-15')
  const stats = tab === 'previous' ? { high: 156, low: 88, average: '117.3', count: 28 } : tab === 'mtd' ? { high: 148, low: 92, average: '118.5', count: 12 } : { high: 132, low: 98, average: '116.0', count: '3 of 4' }
  const dateLabel = tab === 'daily' ? prettyDate(selectedDate) : tab === 'mtd' ? `Oct 1 – ${shortDate(selectedDate)}` : 'Sep 1 – Sep 30, 2026'

  return (
    <AppLayout pageTitle="Reports" pageSubtitle="View and analyze your blood glucose readings.">
      <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-8 lg:py-7 xl:px-12">
        <div className="lg:hidden"><h1 className="text-2xl font-extrabold">Reports</h1></div>

        <div className="mt-5 grid grid-cols-3 rounded-xl border border-violet-200 bg-white p-1.5 lg:mt-0">
          {Object.entries(tabLabels).map(([key, label]) => <button className={`flex h-11 items-center justify-center gap-2 rounded-lg text-xs font-bold transition sm:text-sm ${tab === key ? 'bg-gradient-to-r from-violet-600 to-purple-700 text-white shadow-md shadow-violet-200' : 'hover:bg-violet-50'}`} key={key} type="button" onClick={() => setTab(key)}><CalendarDays className="hidden h-5 w-5 sm:block" /><span className="lg:hidden">{key === 'mtd' ? 'MTD' : key === 'previous' ? 'Prev. Month' : label}</span><span className="hidden lg:inline">{label}</span></button>)}
        </div>

        <div className="mt-5 flex items-center gap-2"><button className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:border-violet-400" type="button" onClick={() => setSelectedDate((value) => shiftDate(value, -1))} aria-label="Previous date"><ArrowLeft className="h-5 w-5" /></button><label className="relative flex h-11 flex-1 cursor-pointer items-center justify-center gap-3 rounded-lg border border-slate-300 bg-white text-xs font-semibold sm:max-w-[280px] sm:text-sm"><CalendarDays className="h-5 w-5" /><span>{dateLabel}</span>{tab !== 'previous' && <input className="absolute inset-0 cursor-pointer opacity-0" type="date" value={selectedDate} max={today} onChange={(event) => event.target.value && setSelectedDate(event.target.value)} aria-label="Select report date" />}</label><button className="flex h-11 w-11 items-center justify-center rounded-lg border border-slate-200 bg-white transition hover:border-violet-400 disabled:opacity-40" type="button" onClick={() => setSelectedDate((value) => shiftDate(value, 1))} disabled={selectedDate >= today} aria-label="Next date"><ArrowRight className="h-5 w-5" /></button></div>

        <section className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4"><StatCard icon={ArrowUp} label="Highest" value={stats.high} tone="red" /><StatCard icon={ArrowDown} label="Lowest" value={stats.low} tone="green" /><StatCard icon={Sigma} label="Average" value={stats.average} tone="violet" /><StatCard icon={List} label="Readings" value={stats.count} tone="blue" count /></section>

        {tab === 'previous' ? <PreviousMonth /> : <ReadingsTable monthly={tab === 'mtd'} />}
      </div>
    </AppLayout>
  )
}

function ReadingsTable({ monthly }) {
  return <section className="mt-6 overflow-hidden rounded-2xl border border-violet-200 bg-white p-4 sm:p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-3 text-lg font-extrabold"><span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-700">{monthly ? <CalendarDays className="h-5 w-5" /> : <List className="h-5 w-5" />}</span>{monthly ? 'Month-to-date Readings' : 'Daily Readings'}</h2>{monthly && <span className="hidden text-sm sm:block">Oct 1 – Oct 15, 2026</span>}</div><div className="mt-4 hidden grid-cols-[1.2fr_1fr_1fr_48px] rounded-lg bg-violet-50 px-4 py-2 text-sm font-bold lg:grid">{monthly ? <span>Date / Time Slot</span> : <span>Time Slot</span>}<span>Reading (mg/dl)</span><span>Recorded At</span><span /></div><div className="divide-y divide-slate-200">{reportReadings.map((reading) => { const Icon = reading.icon; return <div className="grid grid-cols-[1fr_auto] items-center gap-3 py-3 lg:grid-cols-[1.2fr_1fr_1fr_48px] lg:px-4" key={reading.slot}><div className="flex items-center gap-3"><Icon className={`h-6 w-6 shrink-0 ${reading.color}`} /><div><p className="text-sm font-bold">{reading.slot}</p>{monthly && <p className="mt-0.5 text-xs text-slate-500 lg:hidden">Oct 15, 2026</p>}</div></div><span className={`rounded-full px-3 py-1 text-center text-xs font-bold lg:w-[62px] ${reading.value ? reading.value > 125 ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>{reading.value || '—'}<span className="ml-1 lg:hidden">{reading.value && 'mg/dl'}</span></span><span className="hidden text-center text-sm lg:block">{reading.time}</span><button className="hidden h-9 w-10 items-center justify-center rounded-lg border border-slate-300 lg:flex" type="button"><Pencil className="h-4 w-4" /></button></div>})}</div></section>
}

function PreviousMonth() {
  return <section className="mt-6 rounded-2xl border border-violet-200 bg-white p-5"><div className="flex items-center justify-between"><h2 className="flex items-center gap-3 text-lg font-extrabold"><CalendarDays className="h-6 w-6 text-violet-700" />Previous Month Report</h2><span className="text-sm">Sep 1 – Sep 30, 2026</span></div><div className="mt-5 rounded-xl bg-violet-50/70 p-5"><div className="flex h-48 items-end gap-2 border-b border-l border-violet-200 px-3"><span className="h-[42%] flex-1 rounded-t bg-violet-300" /><span className="h-[64%] flex-1 rounded-t bg-violet-400" /><span className="h-[52%] flex-1 rounded-t bg-violet-300" /><span className="h-[78%] flex-1 rounded-t bg-violet-600" /><span className="h-[61%] flex-1 rounded-t bg-violet-400" /><span className="h-[86%] flex-1 rounded-t bg-purple-700" /><span className="h-[70%] flex-1 rounded-t bg-violet-500" /></div><p className="mt-3 text-center text-xs text-slate-500">Weekly glucose reading averages</p></div></section>
}

export default Reports
