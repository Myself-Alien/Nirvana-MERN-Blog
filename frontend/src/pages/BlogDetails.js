import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Footer from "./Footer";
import TopPanel from "./TopPanel";

const BlogDetails = () => {
  const { slug } = useParams(); // ✅ Ensure slug is captured correctly
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log("Slug from URL:", slug); // ✅ Debugging output

  useEffect(() => {
    if (!slug) {
      setError("Invalid slug.");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5000/api/blogs/${slug}`)
      .then((res) => {
        console.log("API Response:", res.data); // ✅ Debug API response
        setBlog(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching blog:", err);
        setError("Blog not found.");
        setLoading(false);
      });
  }, [slug]);

  if (loading) return <h2>Loading...</h2>;
  if (error) return <h2>Error: {error}</h2>;
  if (!blog) return <h2>Blog not found</h2>;

  return (
    <div className="container-fluid g-0">
      <TopPanel />
      <div className="container mt-4 mb-4">
        <h1>{blog.title}</h1>
        <p>
          <strong>Author:</strong> {blog.author}
        </p>
        <p>
          <strong>Posted on:</strong>{" "}
          {new Date(blog.createdAt).toLocaleString()}
        </p>
        {blog.image && (
          <img
            src={`http://localhost:5000${blog.image}`}
            alt={blog.title}
            width="100%"
            loading="lazy" // ✅ Enables lazy loading
            style={{ maxWidth: "100%", height: "auto" }} // Responsive optimization
          />
        )}
        <p className="description">
          {blog.description.charAt(0).toUpperCase() + blog.description.slice(1)}
        </p>
      </div>
      <Footer />
    </div>
  );
};

export default BlogDetails;
