import { Link } from 'react-router-dom'

function SessionExpired() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50 px-4 text-center text-slate-950">
      <section className="w-full max-w-lg rounded-3xl border border-violet-100 bg-white p-10 shadow-xl shadow-violet-100">
        <h1 className="text-3xl font-bold">Session Expired</h1>
        <p className="mt-3 text-slate-600">Your session has expired. Please login again to continue.</p>
        <Link className="mt-8 inline-block rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white" to="/login">Login Again</Link>
      </section>
    </main>
  )
}

export default SessionExpired
