import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import Header from "./components/Header"; // Import Header
import Help from "./pages/Help";
import { AuthProvider } from './context/AuthContext';

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === "/login"; // Hide header only on login page

  return (
    <AuthProvider>
      {!hideHeader && <Header />}  {/* Header will be shown on all pages except login */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
