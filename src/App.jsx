import { RouterProvider } from "react-router-dom";
import router from "./Routers/Router";
const App = () => {
  return (
    <div className="min-h-screen w-full">
      <RouterProvider router={router} />
    </div>
  );
};

export default App;
