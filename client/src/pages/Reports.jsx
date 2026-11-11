import { Link } from 'react-router-dom'

function Reports() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <section className="mx-auto max-w-6xl rounded-3xl border border-violet-100 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xl font-bold text-violet-800">Sweety</p><h1 className="mt-4 text-3xl font-bold">Reports</h1></div>
          <Link className="rounded-xl border border-violet-700 px-5 py-3 font-semibold text-violet-700" to="/dashboard">Back to readings</Link>
        </div>
        <p className="mt-8 rounded-xl bg-violet-50 p-4 text-violet-800">Daily and monthly reports will be implemented in the reports phase.</p>
      </section>
    </main>
  )
}

export default Reports
