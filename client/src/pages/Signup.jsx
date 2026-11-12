import {
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  TriangleAlert,
  UserRound,
} from "lucide-react";
import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import AuthLayout from "./components/AuthLayout.jsx";
import { useAuth } from "./components/AuthContext.jsx";

function Signup() {
  const { user, loading, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Please enter a valid email address.";
    if (!form.password) nextErrors.password = "Password is required.";
    else if (form.password.length < 8)
      nextErrors.password = "Password must be at least 8 characters.";
    if (!form.confirmPassword)
      nextErrors.confirmPassword = "Confirm password is required.";
    else if (form.password !== form.confirmPassword)
      nextErrors.confirmPassword = "Passwords do not match.";
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
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      navigate("/dashboard", { replace: true });
    } catch (error) {
      setErrors(error.response?.data?.errors || {});
      setApiError(
        error.response?.data?.message ||
          "Unable to create your account. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputClass = (field) =>
    `h-11 w-full rounded-lg border bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-slate-400 focus:ring-4 ${errors[field] ? "border-red-500 focus:border-red-500 focus:ring-red-100" : "border-slate-300 focus:border-violet-600 focus:ring-violet-100"}`;

  return (
    <AuthLayout variant="signup">
      <div className="mt-4 text-center">
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] sm:text-[30px]">
          Create Your Account
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Sign up to get started with Sweety.
        </p>
      </div>
      <form className="mt-4 space-y-2.5" noValidate onSubmit={handleSubmit}>
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
          <label className="mb-1.5 block text-sm font-bold" htmlFor="name">
            Name
          </label>
          <div className="relative">
            <UserRound className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              className={inputClass("name")}
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              placeholder="Enter your name"
              value={form.name}
              onChange={updateField}
            />
          </div>
          {errors.name && (
            <p className="mt-1.5 text-sm font-medium text-red-600">
              {errors.name}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              className={inputClass("email")}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={updateField}
            />
          </div>
          {errors.email && (
            <p className="mt-1.5 text-sm font-medium text-red-600">
              {errors.email}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-bold" htmlFor="password">
            Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              className={`${inputClass("password")} pr-12`}
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              value={form.password}
              onChange={updateField}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-700"
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
            <p className="mt-1.5 text-sm font-medium text-red-600">
              {errors.password}
            </p>
          )}
        </div>
        <div>
          <label
            className="mb-1.5 block text-sm font-bold"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
            <input
              className={`${inputClass("confirmPassword")} pr-12`}
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Confirm your password"
              value={form.confirmPassword}
              onChange={updateField}
            />
            <button
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-violet-700"
              type="button"
              onClick={() => setShowConfirmPassword((current) => !current)}
              aria-label={
                showConfirmPassword
                  ? "Hide confirm password"
                  : "Show confirm password"
              }
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5" />
              ) : (
                <Eye className="h-5 w-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1.5 text-sm font-medium text-red-600">
              {errors.confirmPassword}
            </p>
          )}
        </div>
        <button
          className="mt-1 flex h-11 w-full items-center justify-center rounded-lg bg-gradient-to-r from-violet-600 to-purple-800 text-base font-bold text-white shadow-lg shadow-violet-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          type="submit"
          disabled={submitting}
        >
          {submitting ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="mt-3 text-center text-sm text-slate-700">
        Already have an account?{" "}
        <Link
          className="font-bold text-violet-700 transition hover:text-violet-900"
          to="/login"
        >
          Login
        </Link>
      </p>
    </AuthLayout>
  );
}

export default Signup;
