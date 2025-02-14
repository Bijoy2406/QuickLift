import { useState } from "react";
import "../styles/login.css";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", { email, password });
      localStorage.setItem("token", response.data.token);
      setSuccessMessage(`Welcome back, ${response.data.user.name}!`);
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000); // Redirect after 2 seconds
    } catch (err) {
      setError(err.response.data.error || "An error occurred");
    }
  };

  return (
    <div className="form-container">
      <h2>Login to QuickLift</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
      <form onSubmit={handleSubmit}>
        <label>Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        
        <button type="submit">Login</button>
      </form>
      <p>Don't have an account? <Link to="/register">Register</Link></p>
    </div>
  );
}

export default Login;