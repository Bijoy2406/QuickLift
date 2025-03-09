import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Homepage from "./pages/Homepage";
import Profile from "./pages/Profile";
import RequestRide from "./pages/RequestRide"; // Add this import
import AcceptRide from "./pages/AcceptRide";

import Header from "./components/Header";
import Help from "./pages/Help";
import { AuthProvider } from './context/AuthContext';

function App() {
  const location = useLocation();
  const hideHeader = location.pathname === "/login" || location.pathname === "/register";

  return (
    <AuthProvider>
      {!hideHeader && <Header />}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/homepage" element={<Homepage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/help" element={<Help />} />
          <Route path="/request-ride" element={<RequestRide />} /> {/* Add this route */}
          <Route path="/accept-ride" element={<AcceptRide />} />
          
        </Routes>
      </div>
    </AuthProvider>
  );
}

export default App;