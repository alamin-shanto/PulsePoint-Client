import { RouterProvider } from "react-router-dom";
import router from "./Routers/Router";
import { ToastContainer } from "react-toastify";
const App = () => {
  return (
    <div className="min-h-screen w-full">
      <RouterProvider router={router} />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
};

export default App;
