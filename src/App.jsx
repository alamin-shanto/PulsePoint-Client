import BloodRequestList from "./Components/BloodRequestList";
import BloodRequestForm from "./Components/BloodRequestForm";

const App = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blood Requests</h1>
      <BloodRequestList />
      <BloodRequestForm />
    </div>
  );
};

export default App;
