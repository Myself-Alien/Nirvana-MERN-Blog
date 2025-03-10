import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Home from "./pages/Home"; 
import BlogDetails from "./pages/BlogDetails"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:id" element={<BlogDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
