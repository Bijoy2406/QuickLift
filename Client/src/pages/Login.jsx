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

  // Handle login by saving data in localStorage
  const handleLogin = async (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem('userId', data.user.id.toString());
    localStorage.setItem('userRole', data.user.role);
  };

  // Handle form submission and send the login request to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/login", { email, password });
      // Save the token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      setSuccessMessage(`Welcome back, ${response.data.user.name}!`);
      handleLogin(response.data); // Call the handleLogin function to save user data

      // Redirect to the homepage after a delay
      setTimeout(() => {
        navigate("/homepage");
      }, 2000); 
    } catch (err) {
      setError(err.response.data.error || "An error occurred");
    }
  };

  return (
    <div className="main-content">
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
    </div>
  );
}

export default Login;
