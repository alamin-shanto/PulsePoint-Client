import { useBloodRequests } from "./../Hooks/useBloodRequests";

const BloodRequestList = () => {
  const { data, isLoading, isError } = useBloodRequests();

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>Error loading requests.</p>;

  return (
    <ul className="space-y-2">
      {data.map((req) => (
        <li key={req._id} className="border p-2 rounded">
          <strong>{req.name}</strong> – {req.bloodGroup} at {req.location}
        </li>
      ))}
    </ul>
  );
};

export default BloodRequestList;
