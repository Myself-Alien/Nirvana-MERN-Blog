import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Admin from "./pages/Admin";
import Login from "./pages/Login";
import Home from "./pages/Home"; // Import Home page
import BlogDetails from "./pages/BlogDetails"; // Import the new Blog Details page

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} /> {/* ✅ Fix: Add home route */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog/:id" element={<BlogDetails />} /> {/* Blog Details Page */}
        
      </Routes>
    </Router>
  );
}

export default App;
