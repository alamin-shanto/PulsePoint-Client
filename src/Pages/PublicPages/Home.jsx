import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";

const HomePage = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  // Contact form state
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [formStatus, setFormStatus] = useState(null);

  const handleInputChange = (e) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    // Here you can add form submission logic like API call

    // Dummy feedback for now
    setFormStatus("Thank you for contacting us!");
    setContactForm({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-red-600 text-white flex justify-between items-center px-6 py-3 shadow-md">
        <div className="flex items-center space-x-6">
          <Link to="/" className="font-bold text-xl hover:text-red-300">
            BloodConnect
          </Link>
          <Link to="/donation-requests" className="hover:text-red-300">
            Donation Requests
          </Link>
          <Link to="/blogs" className="hover:text-red-300">
            Blog
          </Link>
          {user && (
            <Link to="/funding-links" className="hover:text-red-300">
              Funding Links
            </Link>
          )}
        </div>

        <div className="relative">
          {!user ? (
            <Link
              to="/login"
              className="bg-white text-red-600 font-semibold px-4 py-1 rounded hover:bg-red-100"
            >
              Login
            </Link>
          ) : (
            <div className="dropdown dropdown-end">
              <label
                tabIndex={0}
                className="cursor-pointer flex items-center space-x-2"
              >
                <img
                  src={user.avatar || "/default-avatar.png"}
                  alt="avatar"
                  className="w-8 h-8 rounded-full"
                />
                <span>{user.name}</span>
              </label>
              <ul
                tabIndex={0}
                className="dropdown-content menu p-2 shadow bg-white rounded-box w-40 text-black mt-2"
              >
                <li>
                  <Link to="/dashboard">Dashboard</Link>
                </li>
                <li>
                  <button
                    onClick={() => {
                      logout();
                      navigate("/");
                    }}
                    className="text-red-600"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>

      {/* Banner */}
      <header className="bg-red-100 flex flex-col items-center justify-center text-center py-20 px-6 space-y-6">
        <h1 className="text-4xl font-extrabold text-red-700">
          Save Lives by Donating Blood
        </h1>
        <p className="max-w-xl text-gray-700">
          Join our community to help those in need and find donors near you.
        </p>
        <div className="space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="btn btn-primary"
          >
            Join as a Donor
          </button>
          <button
            onClick={() => navigate("/search")}
            className="btn btn-outline btn-primary"
          >
            Search Donors
          </button>
        </div>
      </header>

      {/* Featured Section */}
      <section className="bg-white py-16 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center text-red-600">
          Why Donate Blood?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Save Lives</h3>
            <p>
              Your donation can help save up to three lives. Blood is always in
              demand for emergencies, surgeries, and chronic illnesses.
            </p>
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Healthy Habit</h3>
            <p>
              Regular blood donation helps maintain healthy iron levels and
              stimulates new blood cell production.
            </p>
          </div>
          <div className="p-6 border rounded shadow hover:shadow-lg transition">
            <h3 className="text-xl font-semibold mb-2">Community Support</h3>
            <p>
              Join a community of donors committed to supporting patients in
              need and spreading awareness.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us Section */}
      <section className="bg-red-50 py-16 px-6 max-w-3xl mx-auto w-full">
        <h2 className="text-3xl font-bold mb-6 text-center text-red-700">
          Contact Us
        </h2>
        <form
          onSubmit={handleContactSubmit}
          className="space-y-4 max-w-md mx-auto"
        >
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={contactForm.name}
            onChange={handleInputChange}
            required
            className="input input-bordered w-full"
          />
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={contactForm.email}
            onChange={handleInputChange}
            required
            className="input input-bordered w-full"
          />
          <textarea
            name="message"
            placeholder="Your Message"
            value={contactForm.message}
            onChange={handleInputChange}
            required
            className="textarea textarea-bordered w-full"
            rows={4}
          />
          <button type="submit" className="btn btn-primary w-full">
            Send Message
          </button>
          {formStatus && (
            <p className="mt-4 text-center text-green-600 font-medium">
              {formStatus}
            </p>
          )}
        </form>
        <div className="mt-10 text-center text-red-700 font-semibold">
          Or call us at: <a href="tel:+1234567890">+1 (234) 567-890</a>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-red-700 text-white py-10 px-6 mt-auto">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-lg mb-4">BloodConnect</h3>
            <p>Dedicated to connecting donors and recipients to save lives.</p>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:underline">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/donation-requests" className="hover:underline">
                  Donation Requests
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:underline">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:underline">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:underline">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Info</h3>
            <p>Email: support@bloodconnect.org</p>
            <p>Phone: +1 (234) 567-890</p>
            <p>Address: 123 Blood St, Health City, USA</p>
          </div>
        </div>
        <div className="mt-8 text-center text-sm text-red-300">
          &copy; {new Date().getFullYear()} BloodConnect. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
