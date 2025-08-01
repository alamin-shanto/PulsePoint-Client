import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import AuthContext from "../../../Context/AuthContext";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const VolunteerContentManagement = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  useContext(AuthContext);

  useEffect(() => {
    axiosSecure
      .get("/blogs")
      .then((res) => {
        setBlogs(res.data);
        setLoading(false);
      })
      .catch((err) => {
        toast.error("Failed to load blogs.");
        console.error(err);
        setLoading(false);
      });
  }, [axiosSecure]);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="p-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Content Management</h2>
        <Link
          to="/dashboard/content-management/add-blog"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add Blog
        </Link>
      </div>

      {blogs.length === 0 ? (
        <p>No blogs found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2">Title</th>
                <th className="px-4 py-2">Author</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog._id} className="border-t border-gray-200">
                  <td className="px-4 py-2">{blog.title}</td>
                  <td className="px-4 py-2">{blog.author || "N/A"}</td>
                  <td className="px-4 py-2 capitalize">{blog.status}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Link
                      to={`/dashboard/content-management/edit/${blog._id}`}
                      className="text-blue-600 hover:underline"
                    >
                      Edit
                    </Link>
                    {/* Volunteer can't publish or delete */}
                    <button
                      className="text-gray-400 cursor-not-allowed"
                      disabled
                      title="Only admin can publish"
                    >
                      Publish
                    </button>
                    <button
                      className="text-gray-400 cursor-not-allowed"
                      disabled
                      title="Only admin can delete"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default VolunteerContentManagement;
