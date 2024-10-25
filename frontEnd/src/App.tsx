import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './View/Login';
import { DashBoard } from './View/DashBoard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Login Page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* DashBoard Page */}
        <Route
          path="/dashboard"
          element={<DashBoard />}
        />

        {/* Default */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  )
}

export default App
