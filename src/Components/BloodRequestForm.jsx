import { useState } from "react";
import { useCreateRequest } from "../hooks/useBloodRequests";

const BloodRequestForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    bloodGroup: "",
    location: "",
  });
  const mutation = useCreateRequest();

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate(formData);
    setFormData({ name: "", bloodGroup: "", location: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6 space-y-2">
      <input
        type="text"
        placeholder="Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Blood Group"
        value={formData.bloodGroup}
        onChange={(e) =>
          setFormData({ ...formData, bloodGroup: e.target.value })
        }
        className="w-full border p-2 rounded"
        required
      />
      <input
        type="text"
        placeholder="Location"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        className="w-full border p-2 rounded"
        required
      />
      <button
        type="submit"
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Add Request
      </button>
      {mutation.isError && (
        <p className="text-red-500">Failed to add request. Try again.</p>
      )}
    </form>
  );
};

export default BloodRequestForm;