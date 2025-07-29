import { createBrowserRouter } from "react-router-dom";
import AuthRedirect from "./../Layout/AuthDIrect";
import Login from "./../Pages/PublicPages/Login";
import Register from "./../Pages/PublicPages/Register";
import ProtectedLayout from "./../Layout/ProtectedLayout";
import DashboardHome from "./../Pages/DashboardPages/DashBoardHome";
import MyDonationRequests from "./../Pages/DashboardPages/MyDonationRequests";
import CreateDonationRequest from "./../Pages/DashboardPages/CreateDonationRequest";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
    children: [
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedLayout />,
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "profile", element: <Profile /> },
      { path: "my-donation-requests", element: <MyDonationRequests /> },
      { path: "create-donation-request", element: <CreateDonationRequest /> },
    ],
  },
  { path: "*", element: <NotFound /> },
]);

export default router;
