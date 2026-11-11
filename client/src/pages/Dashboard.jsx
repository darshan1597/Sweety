import { Link } from 'react-router-dom'

function Dashboard() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-950">
      <section className="mx-auto max-w-6xl rounded-3xl border border-violet-100 bg-white p-8 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div><p className="text-xl font-bold text-violet-800">Sweety</p><h1 className="mt-4 text-3xl font-bold">Dashboard</h1></div>
          <Link className="rounded-xl bg-violet-700 px-5 py-3 font-semibold text-white" to="/reports">View reports</Link>
        </div>
        <p className="mt-8 rounded-xl bg-violet-50 p-4 text-violet-800">Reading management will be implemented after authentication.</p>
      </section>
    </main>
  )
}

export default Dashboard
