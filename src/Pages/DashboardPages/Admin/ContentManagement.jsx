import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { toast } from "react-toastify";
import AuthContext from "../../Context/AuthContext";

const PAGE_SIZE = 6;

const ContentManagement = () => {
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const [blogs, setBlogs] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosSecure.get("/blogs");
        setBlogs(res.data);
      } catch (error) {
        toast.error("Failed to load blogs", error.message);
      }
    };

    fetchBlogs();
  }, [axiosSecure]);

  // Filtering blogs by status
  const filteredBlogs =
    statusFilter === "all"
      ? blogs
      : blogs.filter((blog) => blog.status === statusFilter);

  // Pagination logic
  const totalPages = Math.ceil(filteredBlogs.length / PAGE_SIZE);
  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  // Publish/unpublish blog
  const togglePublish = async (blog) => {
    if (user.role !== "admin") {
      toast.error("Only admins can change blog status");
      return;
    }
    const newStatus = blog.status === "draft" ? "published" : "draft";
    try {
      await axiosSecure.patch(`/blogs/${blog._id}/status`, {
        status: newStatus,
      });
      toast.success(
        `Blog ${newStatus === "published" ? "published" : "unpublished"}`
      );
      setBlogs((prev) =>
        prev.map((b) => (b._id === blog._id ? { ...b, status: newStatus } : b))
      );
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Delete blog
  const deleteBlog = async (id) => {
    if (user.role !== "admin") {
      toast.error("Only admins can delete blogs");
      return;
    }
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this blog?"
    );
    if (!confirmDelete) return;
    try {
      await axiosSecure.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      setBlogs((prev) => prev.filter((b) => b._id !== id));
    } catch {
      toast.error("Failed to delete blog");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <button
          onClick={() => navigate("/dashboard/content-management/add-blog")}
          className="btn btn-primary"
        >
          + Add Blog
        </button>
      </div>

      {/* Filter */}
      <div className="mb-4">
        <label htmlFor="statusFilter" className="mr-2 font-medium">
          Filter by Status:
        </label>
        <select
          id="statusFilter"
          className="select select-bordered w-40"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="all">All</option>
          <option value="draft">Draft</option>
          <option value="published">Published</option>
        </select>
      </div>

      {/* Blog List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {paginatedBlogs.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No blogs found.
          </p>
        )}
        {paginatedBlogs.map((blog) => (
          <div
            key={blog._id}
            className="border rounded-lg shadow p-4 flex flex-col"
          >
            <img
              src={blog.thumbnail || "/default-thumbnail.png"}
              alt={blog.title}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="font-semibold text-lg mb-1">{blog.title}</h3>
            <p
              className="text-sm text-gray-600 mb-2 line-clamp-3"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
            <div className="mt-auto flex justify-between items-center">
              <span
                className={`badge ${
                  blog.status === "published"
                    ? "badge-success"
                    : "badge-warning"
                } capitalize`}
              >
                {blog.status}
              </span>
              <div className="flex gap-2">
                {user.role === "admin" && (
                  <>
                    <button
                      onClick={() => togglePublish(blog)}
                      className={`btn btn-sm ${
                        blog.status === "draft" ? "btn-success" : "btn-warning"
                      }`}
                    >
                      {blog.status === "draft" ? "Publish" : "Unpublish"}
                    </button>
                    <button
                      onClick={() => deleteBlog(blog._id)}
                      className="btn btn-sm btn-error"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 space-x-3">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="btn btn-outline btn-sm"
          >
            Prev
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "btn-primary" : "btn-outline"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="btn btn-outline btn-sm"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ContentManagement;
