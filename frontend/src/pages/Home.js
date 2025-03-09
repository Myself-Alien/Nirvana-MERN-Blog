import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Footer from "./Footer";
import TopPanel from "./TopPanel";

const Home = () => {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((res) => setBlogs(res.data));
  }, []);

  return (
    <div>
      <TopPanel />
      <div className="container-fluid bg">
        <div className="container">
          {blogs.map((blog) => (
            <div className="row pt-4 pb-2 p-3" key={blog._id}>
              <div className="col-md-4">
                <Link to={`/blog/${blog._id}`}>
                  {blog.image && (
                    <img
                      src={`http://localhost:5000${blog.image}`}
                      alt={blog.title}
                      className="img-fluid"
                      style={{ cursor: "pointer" }} // Makes it look clickable
                    />
                  )}
                </Link>
              </div>
              <div className="col-md-8">
                <h2>
                  <Link
                    to={`/blog/${blog._id}`}
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    {blog.title}
                  </Link>
                </h2>
                <p>
                  <strong>Posted on:</strong>{" "}
                  {new Date(blog.createdAt).toLocaleString()}
                </p>
                <p>
                  <strong>Author:</strong> {blog.author}
                </p>
                <p>
                  {blog.description
                    ? blog.description.substring(0, 200) + "..."
                    : "No description available"}
                </p>
                {/* Shows only a short preview */}
                <Link to={`/blog/${blog._id}`}>
                  <button className="btn btn-primary mt-2">Read More...</button>{" "}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
