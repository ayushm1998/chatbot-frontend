import { useState } from "react";
import apiRequest from '../utils/apiRequest';

const ChatLogin = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
        var response = await apiRequest("http://localhost:3000/login/token", "POST" ,email).catch(err => console.log(err.error.message))
      localStorage.setItem("token", response.data.data.token); // Store token
      setUser(data.user); // Set user state
    } catch (err) {
      setError(err.error || "Login failed");
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold">Login</h2>
      <form onSubmit={handleLogin} className="flex flex-col gap-2">
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2">Login</button>
      </form>
      {error && <p className="text-red-500">{error}</p>}
    </div>
  );
};

export default ChatLogin;
