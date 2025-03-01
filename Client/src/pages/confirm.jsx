import React from "react";
import { useNavigate } from "react-router-dom";

const ConfirmationPage = () => {
  const navigate = useNavigate();

  return (
    <div className="confirmation">
      <h2>✅ Ride Confirmed!</h2>
      <p>Your driver will arrive soon.</p>
      <button onClick={() => navigate("/")}>Go to Homepage</button>
    </div>
  );
};

export default ConfirmationPage;
