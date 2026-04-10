import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Starforce from "./pages/Starforce";

function App() {
  return (
    <BrowserRouter basename="/Eluminent.github.io">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/starforce" element={<Starforce />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
