import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";
import Logo from "./Logo.jsx";

function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#fbfaff] px-4 text-center">
        <div>
          <Logo />
          <div className="mx-auto mt-10 h-12 w-12 animate-spin rounded-full border-4 border-violet-200 border-t-violet-700" />
          <h1 className="mt-6 text-xl font-bold text-[#10112f]">
            Checking session...
          </h1>
          <p className="mt-2 text-slate-600">Please wait a moment.</p>
        </div>
      </main>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return <Outlet />;
}

export default ProtectedRoute;
