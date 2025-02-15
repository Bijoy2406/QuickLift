import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password_confirm: "",
    role: "user",
    car_number: "",
    car_details: "",
    preferred_location: "",
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8000/api/register", formData);
      navigate("/login");
    } catch (err) {
      if (err.response) {
        setError(err.response.data.error || "An error occurred");
      } else if (err.request) {
        setError("No response received from server. Please try again.");
      } else {
        setError("An error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="main-content">
      <div className="form-container">
        <h2>Create Your QuickLift Account</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          
          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          
          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />
          
          <label>Confirm Password</label>
          <input type="password" name="password_confirm" value={formData.password_confirm} onChange={handleChange} required />
          
          <label>Register as</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="rider">Rider</option>
            <option value="user">User</option>
          </select>

          {formData.role === "rider" && (
            <>
              <label>Car Number</label>
              <input type="text" name="car_number" value={formData.car_number} onChange={handleChange} />
              <label>Car Details</label>
              <input type="text" name="car_details" value={formData.car_details} onChange={handleChange} />
            </>
          )}

          {formData.role === "user" && (
            <>
              <label>Preferred Location</label>
              <input type="text" name="preferred_location" value={formData.preferred_location} onChange={handleChange} />
            </>
          )}

          <button type="submit">Register</button>
        </form>
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
}

export default Register;
