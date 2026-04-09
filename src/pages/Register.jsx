import { useState } from "react";
import axios from "axios";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      await axios.post("http://localhost:3001/register", {
        username,
        password
      });

      setMessage("User registered successfully!");
    } catch (err) {
      setMessage("Error registering user");
    }
  }

  return (
    <div>
      <h2>Register</h2>

      <form onSubmit={handleRegister}>
        <p>Username</p>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <br/>
        <p>Password</p>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <br/>
        <button type="submit">Register</button>
      </form>

      {message && <p>{message}</p>}
    </div>
  );
}

export default Register;