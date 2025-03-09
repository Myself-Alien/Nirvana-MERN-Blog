import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Footer from "./Footer";
import TopPanel from "./TopPanel";

const BlogDetails = () => {
  const { id } = useParams(); // Get blog ID from URL
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    fetch(`http://localhost:5000/api/blogs/${id}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch blog");
        }
        return res.json();
      })
      .then((data) => {
        setBlog(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

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
