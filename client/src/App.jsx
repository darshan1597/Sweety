import { Navigate, Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import Login from './pages/Login.jsx'
import NotFound from './pages/NotFound.jsx'
import Reports from './pages/Reports.jsx'
import SessionExpired from './pages/SessionExpired.jsx'
import Signup from './pages/Signup.jsx'
import ProtectedRoute from './pages/components/ProtectedRoute.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
      </Route>
      <Route path="/session-expired" element={<SessionExpired />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
