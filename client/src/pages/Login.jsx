import { Eye, EyeOff, LockKeyhole, Mail, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "./components/AuthLayout.jsx";
import { useAuth } from "./components/AuthContext.jsx";

function Login() {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setApiError("");
  };

  const validate = () => {
    const nextErrors = {};
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Please enter a valid email address.";
    if (!form.password) nextErrors.password = "Password is required.";
    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setApiError("");
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(location.state?.from?.pathname || "/dashboard", {
        replace: true,
      });
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setApiError(
        error.response?.data?.message || "Unable to log in. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AuthLayout variant="login">
      <div className="mt-4 text-center">
        <h1 className="text-[28px] font-extrabold tracking-[-0.03em] sm:text-[32px]">
          Welcome back!
        </h1>
        <p className="mt-1 text-[15px] text-slate-600">
          Login to your Sweety account
        </p>
      </div>
      <form className="mt-6 space-y-4" noValidate onSubmit={handleSubmit}>
        {apiError && (
          <div
            className="flex items-start gap-3 rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
            role="alert"
          >
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 fill-red-600 text-white" />
            <span>{apiError}</span>
          </div>
        )}
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              className={`h-12 w-full rounded-lg border bg-white pl-12 pr-4 text-[15px] outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-violet-600 focus:ring-violet-100"}`}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={updateField}
              aria-invalid={Boolean(errors.email)}
            />
          </div>
          {errors.email && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-bold" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              className={`h-12 w-full rounded-lg border bg-white pl-12 pr-12 text-[15px] outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-violet-600 focus:ring-violet-100"}`}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Enter your password"
              value={form.password}
              onChange={updateField}
              aria-invalid={Boolean(errors.password)}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-violet-700"
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-2 text-sm font-medium text-red-600">
              {errors.password}
            </p>
          )}
        </div>
        <button
          className="flex h-12 w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-800 text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-5 text-center text-sm text-slate-700">
        Don&apos;t have an account?{" "}
        <Link
          className="font-bold text-violet-700 transition hover:text-violet-900"
          to="/signup"
        >
          Sign up
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Login;
