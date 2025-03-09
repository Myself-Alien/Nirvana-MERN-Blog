import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Admin = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [author, setAuthor] = useState("");
  const [image, setImage] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [editingId, setEditingId] = useState(null); // Track the blog being edited
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/login");
    }
    fetchBlogs();
  }, [navigate]);

  const fetchBlogs = async () => {
    const res = await axios.get("http://localhost:5000/api/blogs");
    setBlogs(res.data);
  };

  const handleFileChange = (e) => {
    setImage(e.target.files[0]); // Get selected image file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);
    if (image) {
      formData.append("image", image);
    }

    try {
      if (editingId) {
        // Update existing blog
        await axios.put(
          `http://localhost:5000/api/blogs/${editingId}`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );
        alert("Blog updated successfully!");
      } else {
        // Create new blog
        await axios.post("http://localhost:5000/api/blogs", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        alert("Blog added successfully!");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setAuthor("");
      setImage(null);
      setEditingId(null); // Clear edit mode
      fetchBlogs();
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to process the request");
    }
  };

  const handleEdit = (blog) => {
    setTitle(blog.title);
    setDescription(blog.description);
    setAuthor(blog.author);
    setEditingId(blog._id); // Set the ID of the blog being edited
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this blog?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/blogs/${id}`);
      fetchBlogs();
    } catch (error) {
      console.error("Error deleting blog:", error);
      alert("Failed to delete blog");
    }
  };

  return (
    <div className="container-fluid g-0">
      <nav className="navbar top_logo">
        <div className="container">
          <div className="position-relative">
            <h1>Nirvana</h1>
            <span className="admin_text">Admin Panel</span>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              navigate("/login");
            }}
            className="btn btn-danger"
          >
            Logout
          </button>
        </div>
      </nav>
      <div className="container mt-3">
        <h3>{editingId ? "Edit Blog" : "Add a New Blog"}</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            className="form-control mb-2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="form-control mb-2"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Author"
            className="form-control mb-2"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <input type="file" className="form-control mb-2" onChange={handleFileChange} accept="image/*" />
          <button type="submit" className="btn btn-primary">
            {editingId ? "Update Blog" : "Add Blog"}
          </button>
        </form>
      </div>

     <div className="container mt-4">
     <h3>Blog List</h3>
      {blogs.map((blog) => (
        <div key={blog._id} className="border p-3 mt-2">
          <h4>{blog.title}</h4>
          <p>{blog.description}</p>
          <p>
            <strong>Author:</strong> {blog.author}
          </p>
          {blog.image && (
            <img
              src={`http://localhost:5000${blog.image}`}
              alt={blog.title}
              width="100"
            />
          )}
          <p>
            <strong>Posted on:</strong>{" "}
            {new Date(blog.createdAt).toLocaleString()}
          </p>{" "}
          {/* FIX: Uses saved timestamp */}
          <button onClick={() => handleEdit(blog)} className="btn btn-warning me-1">Edit</button>
          <button onClick={() => handleDelete(blog._id)} className="btn btn-danger me-1">Delete</button>
        </div>
      ))}
     </div>
    </div>
  );
};

export default Admin;
