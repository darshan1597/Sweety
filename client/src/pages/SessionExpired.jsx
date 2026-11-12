import { LockKeyhole, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import Logo from "./components/Logo.jsx";

function SessionExpired() {
  return (
    <main className="relative flex min-h-dvh items-center justify-center overflow-hidden bg-[#fbfaff] px-4 text-center text-[#11102f]">
      <div className="absolute left-8 top-8">
        <Logo compact />
      </div>
      <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-[70%] rounded-[50%] bg-violet-100/70" />
      <div className="pointer-events-none absolute -bottom-40 right-[-10%] h-72 w-[65%] rounded-[50%] bg-violet-200/45" />
      <section className="relative w-full max-w-[470px] rounded-2xl border border-violet-200 bg-white px-8 py-10 shadow-xl shadow-violet-100/70">
        <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-violet-100">
          <LockKeyhole className="h-10 w-10 text-violet-500" />
        </span>
        <h1 className="mt-6 text-2xl font-extrabold">Session Expired</h1>
        <p className="mx-auto mt-3 max-w-sm leading-6 text-slate-600">
          Your session has expired. Please login again to continue.
        </p>
        <Link
          className="mt-7 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-violet-600 to-purple-700 font-bold text-white shadow-lg shadow-violet-200 cursor-pointer"
          to="/login"
        >
          <LogIn className="h-5 w-5" />
          Login Again
        </Link>
      </section>
    </main>
  );
}

export default SessionExpired;
