const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { default: chalk } = require("chalk");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Ensure 'uploads' folder exists
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

mongoose.connect("mongodb://127.0.0.1:27017/blogDB")
  .then(() => console.log(chalk.bgRed.blue("Connected to MongoDB")))
  .catch((err) => console.error("MongoDB connection error:", err));

  const BlogSchema = new mongoose.Schema({
    title: String,
    description: String,
    author: String,
    image: String,
    slug: { type: String, unique: true }, // ✅ Add slug field
    createdAt: { type: Date, default: Date.now },
  });
  
  // Function to generate slug from title
  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/ /g, "-")
      .replace(/[^\w-]+/g, "");
  };
  
  

const Blog = mongoose.model("Blog", BlogSchema);

// Configure Multer for image storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique file name
  },
});

const upload = multer({ storage });

// Create Blog Post API with Image Upload
const slugify = (title) => {
  return title.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
};

app.post("/api/blogs", upload.single("image"), async (req, res) => {
  try {
    const { title, description, author } = req.body;
    const slug = generateSlug(title); // ✅ Generate slug from title
    const existingBlog = await Blog.findOne({ slug });

    if (existingBlog) {
      return res.status(400).json({ message: "A blog with this title already exists!" });
    }

    const imagePath = req.file ? `/uploads/${req.file.filename}` : "";
    const newBlog = new Blog({ title, description, author, image: imagePath, slug });
    
    await newBlog.save();
    res.status(201).json({ message: "Blog added successfully!", blog: newBlog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Fetch Blog Posts API
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
// ✅ Fetch a single blog by ID
app.get("/api/blogs/:slug", async (req, res) => {
  try {
    const blog = await Blog.findOne({ slug: req.params.slug }); // ✅ Find by slug instead of ID
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json(blog);
  } catch (error) {
    res.status(500).json({ error: "Invalid blog slug" });
  }
});




// Delete Blog API
app.delete("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    // Remove the image file if it exists
    if (blog.image) {
      const imagePath = path.join(__dirname, blog.image);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    res.json({ message: "Blog deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Edit Blog API
app.put("/api/blogs/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, author } = req.body;
    let updateData = { title, description, author };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const blog = await Blog.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!blog) return res.status(404).json({ message: "Blog not found" });

    res.json({ message: "Blog updated successfully!", blog });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/api/login", (req, res) => {
    console.log("Login Request Received:", req.body); // Debugging log
  
    const { username, password } = req.body;
  
    if (username === "admin" && password === "password") {
      res.json({ success: true, token: "admin-secret-token" });
    } else {
      res.status(401).json({ success: false, message: "Invalid credentials" });
    }
  });
  
  
app.listen(5000, () => console.log(chalk.bgMagentaBright.red("Server running on port 5000")));
