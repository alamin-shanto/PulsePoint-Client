import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import axios from "axios";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import AuthContext from "../../Context/AuthContext";

const AddBlog = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);

  const imageBBApiKey = "YOUR_IMAGEBB_API_KEY"; // <-- Replace with your real ImageBB API key

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${imageBBApiKey}`,
        formData
      );
      setThumbnailUrl(res.data.data.url);
      toast.success("Thumbnail uploaded successfully");
    } catch (error) {
      toast.error("Thumbnail upload failed", error.message);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      await axiosSecure.post("/blogs", {
        title,
        thumbnail: thumbnailUrl,
        content,
        status: "draft", // default status
        authorId: user._id,
      });
      toast.success("Blog created successfully");
      navigate("/dashboard/content-management");
    } catch {
      toast.error("Failed to create blog");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add Blog</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-2">Title *</label>
          <input
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="Blog title"
          />
        </div>

        <div>
          <label className="block font-medium mb-2">Thumbnail Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleThumbnailUpload}
            disabled={uploading}
            className="file-input file-input-bordered w-full"
          />
          {uploading && (
            <p className="text-sm mt-1 text-gray-500">Uploading...</p>
          )}
          {thumbnailUrl && (
            <img
              src={thumbnailUrl}
              alt="Thumbnail preview"
              className="mt-2 max-h-48 rounded-md"
            />
          )}
        </div>

        <div>
          <label className="block font-medium mb-2">Content *</label>
          <JoditEditor
            value={content}
            onChange={(newContent) => setContent(newContent)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Create Blog
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
