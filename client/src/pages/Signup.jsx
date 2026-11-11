import { Link } from 'react-router-dom'

function Signup() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-violet-50 px-4 py-10 text-slate-950">
      <section className="w-full max-w-md rounded-3xl border border-violet-100 bg-white p-8 shadow-xl shadow-violet-100">
        <p className="text-center text-3xl font-bold text-violet-800">Sweety</p>
        <h1 className="mt-8 text-center text-3xl font-bold">Create Your Account</h1>
        <p className="mt-2 text-center text-slate-600">Sign up to get started with Sweety.</p>
        <p className="mt-8 rounded-xl bg-violet-50 p-4 text-center text-sm text-violet-800">Signup form will be implemented in the authentication phase.</p>
        <p className="mt-6 text-center text-sm text-slate-600">Already have an account? <Link className="font-semibold text-violet-700" to="/login">Login</Link></p>
      </section>
    </main>
  )
}

export default Signup
