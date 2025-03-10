import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../App.css";
import Footer from "./Footer";
import TopPanel from "./TopPanel";

const Home = () => {
  const [blogs, setBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // ✅ State for search input
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  ); // ✅ Retrieve dark mode from storage

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/blogs")
      .then((res) => setBlogs(res.data));
  }, []);

  // 🔍 Filter blogs based on the search query
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // 🌓 Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode((prevMode) => {
      const newMode = !prevMode;
      localStorage.setItem("darkMode", newMode); // ✅ Save to localStorage
      return newMode;
    });
  };

  return (
    <div className={darkMode ? "dark-mode" : "light-mode"}>
      <TopPanel />

      {/* 🌓 Dark Mode Toggle */}
      <div className="container text-end mt-3">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider round"></span> Dark Mode
        </label>
      </div>

      <div className="container-fluid bg">
        <div className="container">
          {/* 🔍 Search Bar */}
          <div className="row pt-4 pb-2">
            <div className="col-md-12">
              <input
                type="text"
                className="form-control"
                placeholder="Search blogs by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* 📌 Blog List */}
          {filteredBlogs.length > 0 ? (
            filteredBlogs.map((blog) => (
              <div
                className="row pt-4 pb-2 p-3"
                key={blog._id}
                style={{ display: "flex", alignItems: "stretch" }}
              >
                {/* Blog Image */}
                <div className="col-md-4">
                  <Link to={`/blog/${blog.slug}`}>
                    {blog.image && (
                      <img
                        src={`http://localhost:5000${blog.image}`}
                        alt={blog.title}
                        className="blog-thumbnail"
                        loading="lazy"
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    )}
                  </Link>
                </div>

                {/* Blog Content - Fixed Height & Button at Bottom */}
                <div
                  className="col-md-8 d-flex flex-column"
                  style={{ height: "100%" }}
                >
                  <div style={{ flexGrow: 1 }}>
                    <h2 className="blog-title">
                      <Link to={`/blog/${blog.slug}`} className="text-dark">
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

                    {/* Force Description to be max 3 lines */}
                    <p className="blog-description">
                      {blog.description
                        ? blog.description.substring(0, 150) + "..."
                        : "No description available"}
                    </p>
                  </div>
                  {/* "Read More" Button Always at Bottom */}
                  <div>
                    <Link
                      to={`/blog/${blog.slug}`}
                      className="read-more btn btn-primary"
                    >
                      Read More
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h3 className="text-center mt-4">No blogs found</h3>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
