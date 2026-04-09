import { useState } from "react";
import axios from "axios";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:3001/login", {
        username,
        password
      });

      // 🔑 store token
      localStorage.setItem("token", res.data.token);

      setMessage("Login successful!");
    } catch (err) {
      setMessage(err.response?.data || "Login failed");
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleLogin}>
        <p>Username</p>
        <input
          value={username}
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />

        <p>Password</p>
        <input
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <br />
        <button type="submit">Login</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Login;