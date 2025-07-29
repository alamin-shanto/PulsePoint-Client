import { RouterProvider } from "react-router-dom";
import router from "./Routers/Router";

const App = () => {
  return (
    <div className="p-4 max-w-xl mx-auto">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
