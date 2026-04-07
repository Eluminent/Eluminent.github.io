import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      <h1>Welcome to My Site</h1>

      <Link to="/starforce">Go to Starforce Simulator</Link>
      <br />
      <Link to="/login">Login</Link>
      <br />
      <Link to="/register">Register</Link>
    </div>
  );
}

export default Home;