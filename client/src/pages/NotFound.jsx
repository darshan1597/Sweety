import { Link } from 'react-router-dom'

function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50 px-4 text-center text-slate-950">
      <section className="w-full max-w-lg rounded-3xl border border-violet-100 bg-white p-10 shadow-xl shadow-violet-100">
        <p className="text-lg font-bold text-violet-700">404</p>
        <h1 className="mt-2 text-3xl font-bold">Page Not Found</h1>
        <p className="mt-3 text-slate-600">The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <Link className="mt-8 inline-block rounded-xl border border-violet-700 px-6 py-3 font-semibold text-violet-700" to="/dashboard">Go to Dashboard</Link>
      </section>
    </main>
  )
}

export default NotFound
