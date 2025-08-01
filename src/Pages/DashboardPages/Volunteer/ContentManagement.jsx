import { useContext, useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import AuthContext from "../../../Context/AuthContext";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const ContentManagementVolunteer = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();
  useContext(AuthContext);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axiosSecure.get("/blogs");
        setBlogs(res.data);
        setLoading(false);
      } catch (err) {
        toast.error("Failed to fetch blogs.", err.message);
      }
    };
    fetchBlogs();
  }, [axiosSecure]);

  if (loading) return <p className="text-center">Loading blogs...</p>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">
        Content Management (Volunteer)
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white rounded-md shadow-md">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4">Title</th>
              <th className="py-2 px-4">Status</th>
              <th className="py-2 px-4">Author</th>
              <th className="py-2 px-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {blogs.map((blog) => (
              <tr key={blog._id} className="border-t hover:bg-gray-50">
                <td className="py-2 px-4">{blog.title}</td>
                <td className="py-2 px-4">{blog.status}</td>
                <td className="py-2 px-4">{blog.authorName}</td>
                <td className="py-2 px-4 space-x-2">
                  <Link
                    to={`/dashboard/content-management/edit-blog/${blog._id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </Link>

                  {/* Restricted actions */}
                  <span
                    className="text-gray-400 cursor-not-allowed"
                    title="Only admins can publish blogs"
                  >
                    Publish
                  </span>
                  <span
                    className="text-gray-400 cursor-not-allowed"
                    title="Only admins can delete blogs"
                  >
                    Delete
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentManagementVolunteer;
