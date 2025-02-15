import { Routes, Route, Link, Navigate } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} /> {/* Redirect root to login */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={<Homepage />} />
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;
