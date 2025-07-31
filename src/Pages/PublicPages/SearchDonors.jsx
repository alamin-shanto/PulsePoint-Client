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
    fetch("/json/divisions.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data[2] && data[2].data) {
          setDivisions(data[2].data);
        }
      })
      .catch(() => setDivisions([]));

    // Load districts
    fetch("/json/districts.json")
      .then((res) => res.json())
      .then((data) => {
        if (data && data[2] && data[2].data) {
          setDistricts(data[2].data);
        }
      })
      .catch(() => setDistricts([]));
  }, []);

  // Filter districts when division changes
  useEffect(() => {
    if (formData.division) {
      const filtered = districts.filter(
        (d) =>
          d.division_id === formData.division ||
          d.division_name === formData.division
      );
      setFilteredDistricts(filtered);
      setFormData((prev) => ({ ...prev, district: "" }));
    } else {
      setFilteredDistricts([]);
      setFormData((prev) => ({ ...prev, district: "" }));
    }
  }, [formData.division, districts]);

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
    <div className="max-w-5xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold mb-8 text-center text-red-700">
        Search Blood Donors
      </h1>

      <form onSubmit={handleSearch} className="grid gap-4 md:grid-cols-4 mb-8">
        {/* Blood Group */}
        <select
          name="bloodGroup"
          value={formData.bloodGroup}
          onChange={handleChange}
          required
          className="select select-bordered"
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

        {/* Division */}
        <select
          name="division"
          value={formData.division}
          onChange={handleChange}
          required
          className="select select-bordered"
        >
          <option value="" disabled>
            Select Division
          </option>
          {divisions.map((div) => (
            <option key={div.id} value={div.id}>
              {div.name}
            </option>
          ))}
        </select>

        {/* District */}
        <select
          name="district"
          value={formData.district}
          onChange={handleChange}
          required
          className="select select-bordered"
          disabled={!formData.division}
        >
          <option value="" disabled>
            Select District
          </option>
          {filteredDistricts.length === 0 && (
            <option disabled>No districts</option>
          )}
          {filteredDistricts.map((dist) => (
            <option key={dist.id} value={dist.name}>
              {dist.name}
            </option>
          ))}
        </select>

        <button type="submit" className="btn btn-primary">
          Search
        </button>
      </form>

      {/* Results Section */}
      {loading && <p className="text-center text-red-600">Loading donors...</p>}

      {error && <p className="text-center text-red-600">{error}</p>}

      {!loading && searched && donors.length === 0 && (
        <p className="text-center text-gray-500">
          No donors found for selected criteria.
        </p>
      )}

      {!loading && donors.length > 0 && (
        <div className="grid gap-6 md:grid-cols-3">
          {donors.map((donor) => (
            <div
              key={donor._id}
              className="border rounded-lg shadow p-4 hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={donor.avatar || "/default-avatar.png"}
                  alt={donor.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-lg">{donor.name}</h3>
                  <p className="text-sm text-gray-600">{donor.email}</p>
                </div>
              </div>
              <p>
                <strong>Blood Group:</strong> {donor.bloodGroup}
              </p>
              <p>
                <strong>Location:</strong> {donor.district}, {donor.division}
              </p>
              <p>
                <strong>Last Donation:</strong>{" "}
                {donor.lastDonationDate || "Not available"}
              </p>
              <p>
                <strong>Contact:</strong> {donor.phone || "Not available"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchDonors;
