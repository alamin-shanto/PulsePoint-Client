import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../../Context/AuthContext";
import useAxiosSecure from "../../Hooks/useAxiosSecure";
import AOS from "aos";
import "aos/dist/aos.css";

const HomePage = () => {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();

  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formStatus, setFormStatus] = useState(null);
  const [search, setSearch] = useState({ bloodGroup: "", district: "" });
  const [donors, setDonors] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleInputChange = (e) =>
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  const handleContactSubmit = (e) => {
    e.preventDefault();
    setFormStatus("Thank you for contacting us!");
    setContactForm({ name: "", email: "", message: "" });
  };
  const handleSearchChange = (e) =>
    setSearch({ ...search, [e.target.name]: e.target.value });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const fetchDonors = async () => {
      if (search.bloodGroup && search.district) {
        setSearchLoading(true);
        try {
          const res = await axiosSecure.get(
            `/donors?bloodGroup=${search.bloodGroup}&district=${search.district}`
          );
          setDonors(res.data || []);
        } catch (err) {
          console.error("Failed to fetch donors:", err);
        } finally {
          setSearchLoading(false);
        }
      } else setDonors([]);
    };
    fetchDonors();
  }, [search, axiosSecure]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-red-700/80 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="font-extrabold text-2xl hover:text-red-300 transition duration-300"
          >
            Pulse Point
          </Link>
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/donation-requests"
              className="hover:text-red-300 transition duration-300"
            >
              Donation Requests
            </Link>
            <Link
              to="/blogs"
              className="hover:text-red-300 transition duration-300"
            >
              Blog
            </Link>
            {user && (
              <Link
                to="/dashboard/fundings"
                className="hover:text-red-300 transition duration-300"
              >
                Funding Links
              </Link>
            )}
          </div>
          <div className="hidden md:flex relative">
            {!user ? (
              <div className="space-x-4">
                <Link
                  to="/login"
                  className="bg-white text-red-700 font-semibold px-5 py-2 rounded-full shadow hover:bg-red-100 hover:text-red-800 transition"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-red-700 font-semibold px-5 py-2 rounded-full shadow hover:bg-red-100 hover:text-red-800 transition"
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="dropdown dropdown-end">
                <label
                  tabIndex={0}
                  className="cursor-pointer flex items-center space-x-3 select-none"
                >
                  <img
                    src={
                      user.photoURL ||
                      "https://res.cloudinary.com/duic0gfkw/image/upload/v1754083513/avatar-default-svgrepo-com_thzca7.svg"
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full border-2 border-white shadow-md"
                  />
                  <span className="font-semibold">{user.name}</span>
                </label>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu p-3 shadow-lg bg-white rounded-lg w-44 text-black mt-3"
                >
                  <li>
                    <Link className="hover:bg-red-100 rounded" to="/dashboard">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={() => {
                        logOut();
                        navigate("/");
                      }}
                      className="text-red-600 hover:bg-red-100 rounded w-full text-left px-2 py-1"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="md:hidden flex items-center justify-center p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-white"
            aria-label="Toggle menu"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
        {menuOpen && (
          <div className="md:hidden bg-red-700 bg-opacity-95 text-white px-6 py-4 space-y-4">
            <Link
              to="/donation-requests"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-red-300 transition"
            >
              Donation Requests
            </Link>
            <Link
              to="/blogs"
              onClick={() => setMenuOpen(false)}
              className="block hover:text-red-300 transition"
            >
              Blog
            </Link>
            {user && (
              <Link
                to="/dashboard/fundings"
                onClick={() => setMenuOpen(false)}
                className="block hover:text-red-300 transition"
              >
                Funding Links
              </Link>
            )}
            <hr className="border-red-500" />
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-white text-red-700 font-semibold px-5 py-2 rounded-full shadow hover:bg-red-100 hover:text-red-800 transition text-center"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMenuOpen(false)}
                  className="block bg-white text-red-700 font-semibold px-5 py-2 rounded-full shadow hover:bg-red-100 hover:text-red-800 transition text-center mt-2"
                >
                  Register
                </Link>
              </>
            ) : (
              <div className="border border-red-500 rounded-lg p-3">
                <div className="flex items-center space-x-3 mb-3">
                  <img
                    src={
                      user.photoURL ||
                      "https://res.cloudinary.com/duic0gfkw/image/upload/v1754083513/avatar-default-svgrepo-com_thzca7.svg"
                    }
                    alt="avatar"
                    className="w-9 h-9 rounded-full border-2 border-white shadow-md"
                  />
                  <span className="font-semibold">{user.name}</span>
                </div>
                <Link
                  to="/dashboard"
                  onClick={() => setMenuOpen(false)}
                  className="block mb-2 hover:text-red-300"
                >
                  Dashboard
                </Link>
                <button
                  onClick={() => {
                    logOut();
                    setMenuOpen(false);
                    navigate("/");
                  }}
                  className="w-full text-left text-red-600 hover:bg-red-100 rounded px-2 py-1"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* Hero */}
      <header className="relative bg-gradient-to-r from-red-50 via-red-100 to-red-50 overflow-hidden py-24 text-center px-6">
        <h1
          className="text-5xl md:text-6xl font-extrabold text-red-700 mb-6 relative z-10"
          data-aos="fade-up"
        >
          Save Lives by Donating Blood
        </h1>
        <p
          className="text-lg text-gray-700 mb-8 relative z-10"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          Join our community to help those in need and find donors near you.
        </p>
        <div
          className="relative flex flex-col md:flex-row gap-4 justify-center z-10"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <Link
            to="/register"
            className="bg-red-600 text-white font-bold px-6 py-3 rounded-full hover:bg-red-700 transition shadow-lg"
          >
            Join as a Donor
          </Link>
          <Link
            to="/search-donors"
            className="bg-white text-red-700 font-bold px-6 py-3 rounded-full hover:bg-red-100 transition shadow-lg"
          >
            Search Donors
          </Link>
        </div>
        <span
          aria-hidden="true"
          className="pointer-events-none absolute w-48 h-48 md:w-64 md:h-64 rounded-full bg-red-400 opacity-30 animate-pulse -bottom-10 -right-10"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute w-72 h-72 md:w-96 md:h-96 rounded-full bg-red-300 opacity-20 animate-pulse delay-500 -top-20 -left-20"
        />
        <svg
          className="absolute bottom-0 w-full"
          viewBox="0 0 1440 320"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#f87171"
            fillOpacity="0.2"
            d="M0,160L48,149.3C96,139,192,117,288,128C384,139,480,181,576,192C672,203,768,181,864,154.7C960,128,1056,96,1152,106.7C1248,117,1344,171,1392,197.3L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          />
        </svg>
      </header>

      {/* 🔎 Live Donor Search with Hover Effects */}
      <section className="bg-white py-12 px-8 max-w-4xl mx-auto rounded-xl shadow-lg mt-12">
        <h2 className="text-3xl font-bold text-center mb-8 text-red-600">
          🔍 Search Donors Near You
        </h2>
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <select
            name="bloodGroup"
            value={search.bloodGroup}
            onChange={handleSearchChange}
            className="select select-bordered w-full rounded-lg border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-300 transition"
          >
            <option value="">Select Blood Group</option>
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
          <input
            type="text"
            name="district"
            placeholder="Enter District"
            value={search.district}
            onChange={handleSearchChange}
            className="input input-bordered w-full rounded-lg border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-300 transition"
          />
        </div>

        {searchLoading ? (
          <div className="text-center mt-6 text-red-600 font-semibold">
            Searching...
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {donors.length === 0 && search.bloodGroup && search.district ? (
              <p className="text-center text-gray-500 italic">
                No donors found.
              </p>
            ) : (
              donors.map((donor) => (
                <div
                  key={donor._id}
                  className="p-5 border border-red-200 rounded-xl shadow-sm bg-red-50 flex justify-between items-center transition hover:shadow-lg hover:bg-red-100 cursor-pointer"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-red-700">
                      {donor.name}
                    </h3>
                    <p className="text-sm text-red-500">{donor.district}</p>
                    <p className="text-sm text-red-500">
                      Group: {donor.bloodGroup}
                    </p>
                  </div>
                  <p className="text-red-700 font-extrabold text-2xl">
                    {donor.bloodGroup}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* Eye-catching Feature Cards */}
      <section className="bg-white py-20 px-10 max-w-7xl mx-auto mt-20 rounded-xl shadow-xl">
        <h2 className="text-4xl font-extrabold mb-12 text-center text-red-700">
          Why Donate Blood?
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {[
            {
              title: "Save Lives",
              desc: "Each donation can help up to three patients in need of urgent care.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.105 0-2 .895-2 2 0 1.105.895 2 2 2s2-.895 2-2c0-1.105-.895-2-2-2zm0 10v-2m0 0a6 6 0 010-12 6 6 0 010 12z"
                  />
                </svg>
              ),
            },
            {
              title: "Health Benefits",
              desc: "Regular donations reduce iron levels and stimulate new blood cells.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m0 6a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ),
            },
            {
              title: "Be a Hero",
              desc: "Support your local community by being a life-saving donor.",
              icon: (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-red-600 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              ),
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="p-8 bg-gradient-to-tr from-red-50 to-red-100 border border-red-300 rounded-2xl shadow-lg hover:shadow-2xl transition cursor-default"
            >
              {item.icon}
              <h3 className="text-2xl font-bold mb-3 text-red-800">
                {item.title}
              </h3>
              <p className="text-red-700">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Form Section (to fix unused handlers) */}
      <section className="bg-gradient-to-r from-red-50 via-red-100 to-red-50 max-w-5xl mx-auto my-20 p-12 rounded-3xl shadow-2xl border border-red-200">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-12 text-center text-red-700 drop-shadow-md">
          Contact Us
        </h2>
        <form
          onSubmit={handleContactSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          <div className="flex flex-col">
            <label
              htmlFor="name"
              className="mb-3 text-red-700 font-semibold text-lg tracking-wide"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={contactForm.name}
              onChange={handleInputChange}
              required
              placeholder="Your name"
              className="rounded-xl border border-red-400 px-5 py-3 text-lg text-red-900 placeholder-red-400 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-300 transition shadow-md"
            />
          </div>

          <div className="flex flex-col">
            <label
              htmlFor="email"
              className="mb-3 text-red-700 font-semibold text-lg tracking-wide"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={contactForm.email}
              onChange={handleInputChange}
              required
              placeholder="Your email"
              className="rounded-xl border border-red-400 px-5 py-3 text-lg text-red-900 placeholder-red-400 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-300 transition shadow-md"
            />
          </div>

          <div className="md:col-span-2 flex flex-col">
            <label
              htmlFor="message"
              className="mb-3 text-red-700 font-semibold text-lg tracking-wide"
            >
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={contactForm.message}
              onChange={handleInputChange}
              required
              placeholder="Your message"
              rows={6}
              className="resize-none rounded-xl border border-red-400 px-5 py-4 text-lg text-red-900 placeholder-red-400 focus:outline-none focus:border-red-600 focus:ring-4 focus:ring-red-300 transition shadow-md"
            ></textarea>
          </div>

          <div className="md:col-span-2 flex justify-center">
            <button
              type="submit"
              className="bg-red-700 hover:bg-red-800 active:bg-red-900 text-white font-extrabold text-xl px-12 py-4 rounded-full shadow-lg shadow-red-400/50 transition transform hover:-translate-y-1 hover:shadow-red-500/80 focus:outline-none focus:ring-4 focus:ring-red-300"
            >
              Send Message
            </button>
          </div>
        </form>

        {formStatus && (
          <p className="mt-10 text-center text-green-600 font-semibold text-xl drop-shadow-md animate-fadeIn">
            {formStatus}
          </p>
        )}
      </section>

      {/* Gradient Footer */}
      <footer className="bg-gradient-to-r from-red-800 via-red-700 to-red-800 text-white py-12 px-8 mt-auto rounded-t-3xl shadow-inner">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <h3 className="font-extrabold text-2xl mb-5">Pulse Point</h3>
            <p className="text-red-200 max-w-xs leading-relaxed">
              Dedicated to connecting donors and recipients to save lives.
            </p>
          </div>
          <div>
            <h3 className="font-extrabold text-2xl mb-5">Quick Links</h3>
            <ul className="space-y-3 text-red-300">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/donation-requests"
                  className="hover:text-white transition"
                >
                  Donation Requests
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="hover:text-white transition">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-white transition">
                  Register
                </Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-white transition">
                  Login
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-extrabold text-2xl mb-5">Contact Info</h3>
            <p>
              Email:{" "}
              <a
                href="mailto:support@bloodconnect.org"
                className="underline hover:text-white"
              >
                support@bPulsePoint.org
              </a>
            </p>
            <p>
              Phone:{" "}
              <a href="tel:+1234567890" className="underline hover:text-white">
                +1 (234) 567-890
              </a>
            </p>
            <p>Address: 123 Blood St, Health City, USA</p>
          </div>
        </div>
        <div className="mt-10 text-center text-red-300 text-sm select-none">
          &copy; {new Date().getFullYear()} PulsePoint. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
