import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../App.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        username,
        password,
      });
      localStorage.setItem("adminToken", res.data.token);
      navigate("/admin");
    } catch (err) {
      setError("Invalid username or password");
    }
  };

  return (
    <div className="container-fluid login_bg d-flex flex-column min-vh-100 justify-content-center align-items-center">
      <div className="login_box">
        <h3 className="text-center">Admin Login</h3>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <div className="row g-0 mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="Username"
              required
            />
            </div>
            <div className="row g-0">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
          </div>
          <div className="row g-0">
          <button type="submit" className="btn btn-primary mt-2">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
