import { useState, useRef } from "react";
import JoditEditor from "jodit-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../Hooks/useAxiosSecure";

const BlogPage = () => {
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState(""); // stores URL or base64
  const [content, setContent] = useState("");

  const [thumbnailInputType, setThumbnailInputType] = useState("file"); // or "url"
  const [thumbnailFile, setThumbnailFile] = useState(null); // File object

  const handleThumbnailFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      // Preview as base64
      const reader = new FileReader();
      reader.onload = () => setThumbnail(reader.result);
      reader.readAsDataURL(file);
    } else {
      setThumbnailFile(null);
      setThumbnail("");
    }
  };

  const handleThumbnailUrlChange = (e) => {
    setThumbnail(e.target.value);
    setThumbnailFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter the blog title.");
      return;
    }
    if (!content.trim()) {
      toast.error("Please enter the blog content.");
      return;
    }

    // Prepare blog data
    let thumbnailToSend = thumbnail;

    // If file uploaded, you might want to send the base64 or upload separately
    // Here we'll send base64 string if file upload used
    // In real app, better to upload image to server/cloud separately
    if (thumbnailFile && thumbnail) {
      thumbnailToSend = thumbnail; // base64 string
    } else if (!thumbnail) {
      thumbnailToSend = ""; // empty if none
    }

    const newBlog = {
      title: title.trim(),
      thumbnail: thumbnailToSend,
      content,
      status: "draft", // default draft
    };

    try {
      const response = await axiosSecure.post("/blogs", newBlog);
      if (response.status === 201 || response.status === 200) {
        toast.success(
          "Blog created successfully. It is currently in draft status."
        );
        navigate("/dashboard/content-management");
      } else {
        throw new Error("Failed to create blog");
      }
    } catch (error) {
      toast.error("Error creating blog: " + (error.message || "Unknown error"));
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Add New Blog</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label htmlFor="title" className="block mb-1 font-medium">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            placeholder="Enter blog title"
            required
          />
        </div>

        {/* Thumbnail input type toggle */}
        <div>
          <label className="block mb-1 font-medium">Thumbnail Image</label>
          <div className="mb-2 flex space-x-4">
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                thumbnailInputType === "file"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setThumbnailInputType("file")}
            >
              Upload from PC
            </button>
            <button
              type="button"
              className={`px-4 py-2 rounded ${
                thumbnailInputType === "url"
                  ? "bg-red-600 text-white"
                  : "bg-gray-200"
              }`}
              onClick={() => setThumbnailInputType("url")}
            >
              Paste Image URL
            </button>
          </div>

          {/* Conditional input */}
          {thumbnailInputType === "file" ? (
            <input
              type="file"
              accept="image/*"
              onChange={handleThumbnailFileChange}
              className="block w-full text-sm text-gray-600"
            />
          ) : (
            <input
              type="url"
              value={thumbnail}
              onChange={handleThumbnailUrlChange}
              placeholder="Paste image URL here"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-600"
            />
          )}

          {/* Thumbnail preview */}
          {thumbnail && (
            <img
              src={thumbnail}
              alt="Thumbnail preview"
              className="mt-3 w-48 h-32 object-cover rounded border"
            />
          )}
        </div>

        {/* Content */}
        <div>
          <label className="block mb-1 font-medium">Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={{
              readonly: false,
              height: 400,
              toolbarSticky: false,
              placeholder: "Write your blog content here...",
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-red-600 hover:bg-red-700 text-white font-semibold px-6 py-3 rounded"
        >
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default BlogPage;
