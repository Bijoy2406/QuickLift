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

  // Placeholder for setUser function
  const setUser = (user) => {
    console.log("User set:", user);
    // Implement your user state management logic here
  };

  // Handle login by saving data in localStorage
  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email,
        password
      });

      // Store the token and userId in local storage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.userId); // Store userId

      // Optionally, set user state if using context
      setUser(response.data.user);
      navigate('/'); // Redirect to homepage or wherever you want
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  // Handle form submission and send the login request to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/login', {
        email: email,
        password: password
      });

      // Save the token and user data in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userId", response.data.user.userId); // Store userId
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