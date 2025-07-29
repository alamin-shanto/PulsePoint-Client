import { createBrowserRouter } from "react-router-dom";
import ProtectedLayout from "./../Layout/ProtectedLayout";
import DashboardHome from "./../Pages/DashboardPages/DashBoardHome";
import Profile from "./../Pages/DashboardPages/Profile";
import MyDonationRequests from "./../Pages/DashboardPages/MyDonationRequests";
import CreateDonationRequest from "./../Pages/DashboardPages/CreateDonationRequest";
import Login from "./../Pages/PublicPages/Login";
import Register from "./../Pages/PublicPages/Register";
import NotFound from "./../Pages/DashboardPages/NotFound";

const router = createBrowserRouter([
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
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },
  { path: "*", element: <NotFound /> },
]);

export default router;
