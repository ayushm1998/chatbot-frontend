import React, { useState } from "react";
import axios from "axios";
import api from "../helper/apiURL.json"


const LoginForm = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(api.URL.login, {
        email,
        password,
      });
      const token = response.data.data;
      
      localStorage.setItem("token", token);
      setUser({ token, email });
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    }
  };

  const handleGuestLogin = () => {
    setUser({ token: "eyJhbGciOiJIUzI1NiJ9.eyJzdHVkZW50SWQiOiIwMDAwMDAwMDAiLCJzY29wZSI6Imd1ZXN0IiwiZW1haWwiOiJndWVzdEBjc3VzLmVkdSJ9.YVTclh_hl1r_-TaKwdBqyhffwP6_OFWlAf2nHv9sphA", email: "guest@csus.edu" });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h2 align="center">Welcome to IPGE</h2>
        {error && <p className="error-message">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
          <button onClick={handleGuestLogin} className="guest-button">
          Enter as Guest
        </button>
        </form>
        
      </div>
    </div>
  );
};

export default LoginForm;
