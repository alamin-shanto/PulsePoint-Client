import { useState, useEffect } from "react";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const SearchDonors = () => {
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);

  const [formData, setFormData] = useState({
    bloodGroup: "",
    division: "",
    district: "",
  });

  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState(null);

  // Load divisions and districts on mount
  useEffect(() => {
    // Load divisions
    fetch("/divisions.json")
      .then((res) => res.json())
      .then((data) => {
        const divisionsTable = data.find((item) => item.name === "divisions");
        if (divisionsTable && divisionsTable.data) {
          setDivisions(divisionsTable.data);
        }
      })
      .catch(() => setDivisions([]));

    // Load districts
    fetch("/districts.json")
      .then((res) => res.json())
      .then((data) => {
        const districtsTable = data.find((item) => item.name === "districts");
        if (districtsTable && districtsTable.data) {
          setDistricts(districtsTable.data);
        }
      })
      .catch(() => setDistricts([]));
  }, []);

  // Filter districts when division changes
  useEffect(() => {
    if (formData.division) {
      // Create a map from division name to division id
      const divisionNameToId = Object.fromEntries(
        divisions.map((div) => [div.name, div.id])
      );

      // Get the division id corresponding to selected division name
      const selectedDivisionId = divisionNameToId[formData.division];

      // Filter districts that have this division_id
      const filtered = districts.filter(
        (d) => d.division_id === selectedDivisionId
      );

      setFilteredDistricts(filtered);
      setFormData((prev) => ({ ...prev, district: "" }));
    } else {
      setFilteredDistricts([]);
      setFormData((prev) => ({ ...prev, district: "" }));
    }
  }, [formData.division, districts, divisions]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setDonors([]);
    setSearched(true);

    try {
      const queryParams = new URLSearchParams({
        bloodGroup: formData.bloodGroup,
        division: formData.division,
        district: formData.district,
      }).toString();

      const response = await fetch(
        `https://pulse-point-server-blue.vercel.app/donors/search?${queryParams}`
      );
      if (!response.ok) throw new Error("Failed to fetch donors");

      const data = await response.json();
      setDonors(data);
    } catch (err) {
      setError(err.message || "Error occurred while searching donors");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1
        className="text-4xl font-extrabold mb-12 text-center text-red-700 drop-shadow-md"
        data-aos="fade-up"
      >
        🔍 Search Blood Donors
      </h1>

      <form
        onSubmit={handleSearch}
        className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10 bg-white shadow-md rounded-2xl p-6 border border-red-200"
        data-aos="fade-up"
      >
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
          className="select select-bordered border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-300 transition text-lg"
        >
          <option value="" disabled>
            Select Blood Group
          </option>
          {bloodGroups.map((bg) => (
            <option key={bg} value={bg}>
              {bg}
            </option>
          ))}
        </select>

        <select
          name="division"
          value={formData.division}
          onChange={handleChange}
          required
          className="select select-bordered border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-300 transition text-lg"
        >
          <option value="" disabled>
            Select Division
          </option>
          {divisions.map((div) => (
            <option key={div.id} value={div.name}>
              {div.name}
            </option>
          ))}
        </select>

        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          disabled={!formData.division}
          className="select select-bordered border-red-400 focus:border-red-600 focus:ring-2 focus:ring-red-300 transition text-lg"
        >
          <option value="" disabled>
            Select District
          </option>
          {filteredDistricts.length === 0 ? (
            <option disabled>No districts</option>
          ) : (
            filteredDistricts.map((dist) => (
              <option key={dist.id} value={dist.name}>
                {dist.name}
              </option>
            ))
          )}
        </select>

        <button
          type="submit"
          className="btn btn-primary bg-red-600 hover:bg-red-700 transition text-white font-bold text-lg rounded-full"
        >
          Search
        </button>
      </form>

      {/* Feedback Section */}
      {loading && (
        <p className="text-center text-red-500 font-semibold animate-pulse">
          Searching donors...
        </p>
      )}

      {error && (
        <p className="text-center text-red-600 font-semibold">{error}</p>
      )}

      {!loading && searched && donors.length === 0 && (
        <p className="text-center text-gray-500 italic">
          No donors found for selected criteria.
        </p>
      )}

      {/* Donors Result */}
      {!loading && donors.length > 0 && (
        <div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          data-aos="fade-up"
        >
          {donors.map((donor) => (
            <div
              key={donor._id}
              className="bg-white border border-red-200 rounded-2xl shadow-lg p-6 hover:shadow-red-300 transition-transform transform hover:-translate-y-1 cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={donor.avatar || "/default-avatar.png"}
                  alt={donor.name}
                  className="w-14 h-14 rounded-full border-2 border-red-500 shadow"
                />
                <div>
                  <h3 className="font-bold text-lg text-red-800">
                    {donor.name}
                  </h3>
                  <p className="text-sm text-gray-500">{donor.email}</p>
                </div>
              </div>
              <ul className="text-sm text-red-700 space-y-1">
                <li>
                  <strong>🩸 Blood Group:</strong> {donor.bloodGroup}
                </li>
                <li>
                  <strong>📍 Location:</strong> {donor.district},{" "}
                  {donor.division}
                </li>
                <li>
                  <strong>🕒 Last Donation:</strong>{" "}
                  {donor.lastDonationDate || "Not available"}
                </li>
                <li>
                  <strong>📞 Contact:</strong> {donor.phone || "Not available"}
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDonors;
