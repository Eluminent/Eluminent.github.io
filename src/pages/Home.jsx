import { Link } from "react-router-dom";
import "./Home.css";

export default function Home() {
  return (
    <div className="home-bg">

      <div className="page">

        {/* NAVBAR */}
        <header className="navbar">
          <div className="logo">Chris Liu</div>
          <nav>
            <Link to="/starforce">Starforce Simulator</Link>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </nav>
        </header>

        {/* HERO */}
        <section className="hero">

          {/* LEFT SIDE */}
          <div className="profile">
            <img
              src="/PFP.jpg"
              alt="profile"
              className="profile-img"
            />

            <h2>Kuan "Chris" Liu</h2>
            <h3>Software Engineer</h3>
            <p>Toronto, Canada</p>
          </div>

          {/* RIGHT SIDE */}
          <div className="content">
            <h1>About Me</h1>
            <p>
              I am a software engineer with a strong background in full-stack
              development, AI, and systems design. I enjoy building scalable
              applications and solving complex problems.
            </p>

            <button className="btn">Download CV</button>

            <div className="grid">
              <div>
                <h2>Interests</h2>
                <ul>
                  <li>Full Stack Development</li>
                  <li>Game Development</li>
                  <li>Artificial Intelligence</li>
                </ul>
              </div>

              <div>
                <h2>Education</h2>
                <ul>
                  <li><strong>University of Toronto</strong></li>
                  <li>Mathematics</li>
                  <li>Computer Science</li>
                  <li>Statistics</li>
                </ul>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
}

// function Home() {
//   return (
//     <div>
//       <h1>Welcome to My Site</h1>

//       <Link to="/starforce">Go to Starforce Simulator</Link>
//       <br />
//       <Link to="/login">Login</Link>
//       <br />
//       <Link to="/register">Register</Link>
//     </div>
//   );
// }

// export default Home;