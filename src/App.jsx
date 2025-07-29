import { RouterProvider } from "react-router-dom";
import router from "./Routers/Router";

const App = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Blood Requests</h1>
      return <RouterProvider router={router} />;
    </div>
  );
};

export default App;
