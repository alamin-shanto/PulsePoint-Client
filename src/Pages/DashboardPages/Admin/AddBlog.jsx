import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import JoditEditor from "jodit-react";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";

const AddBlog = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const editor = useRef(null);

  const [title, setTitle] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [content, setContent] = useState("");

  const [uploading, setUploading] = useState(false);

  // Handle file input change
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setThumbnailFile(e.target.files[0]);
      setThumbnailUrl(""); // clear URL if file chosen
    }
  };

  // Upload image file to backend or convert to base64 (depending on backend)
  // For now, we assume backend accepts multipart form data for thumbnail file upload
  // If your backend requires base64 or separate upload endpoint, adjust accordingly.
  const uploadThumbnailFile = async () => {
    if (!thumbnailFile) return null;

    // Example: Uploading file using FormData
    try {
      setUploading(true);
      const formData = new FormData();
      formData.append("thumbnail", thumbnailFile);

      const res = await axiosSecure.post("/upload-thumbnail", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setUploading(false);
      // Assuming response contains the uploaded image URL
      return res.data.url;
    } catch (error) {
      setUploading(false);
      toast.error("Thumbnail upload failed", error.message);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      toast.error("Title and content are required");
      return;
    }

    let finalThumbnailUrl = thumbnailUrl;

    if (thumbnailFile) {
      const uploadedUrl = await uploadThumbnailFile();
      if (!uploadedUrl) return; // upload failed
      finalThumbnailUrl = uploadedUrl;
    }

    try {
      await axiosSecure.post("/blogs", {
        title,
        thumbnail: finalThumbnailUrl,
        content,
        status: "draft", // new blogs start as draft
      });

      toast.success("Blog created successfully");
      navigate("/dashboard/content-management");
    } catch (error) {
      toast.error("Failed to create blog", error.message);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Add New Blog</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block font-medium mb-1" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            type="text"
            className="input input-bordered w-full"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {/* Thumbnail URL or File Upload */}
        <div>
          <label className="block font-medium mb-1">Thumbnail Image</label>
          <input
            type="url"
            placeholder="Paste image URL here"
            className="input input-bordered w-full mb-2"
            value={thumbnailUrl}
            onChange={(e) => {
              setThumbnailUrl(e.target.value);
              setThumbnailFile(null);
            }}
          />
          <div className="divider">OR</div>
          <input type="file" accept="image/*" onChange={handleFileChange} />
          {thumbnailFile && (
            <p className="mt-2 text-sm text-gray-600">
              Selected file: {thumbnailFile.name}
            </p>
          )}
        </div>

        {/* Content Editor */}
        <div>
          <label className="block font-medium mb-1">Content</label>
          <JoditEditor
            ref={editor}
            value={content}
            onChange={(newContent) => setContent(newContent)}
            config={{
              readonly: false,
              height: 300,
            }}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className={`btn btn-primary ${uploading ? "btn-disabled" : ""}`}
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Create Blog"}
        </button>
      </form>
    </div>
  );
};

export default AddBlog;
