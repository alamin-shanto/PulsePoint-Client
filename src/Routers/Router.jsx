import { createBrowserRouter, Navigate } from "react-router-dom";

// Public Pages
import Login from "../Pages/PublicPages/Login";
import Register from "../Pages/PublicPages/Register";
import Home from "../Pages/PublicPages/Home";
import SearchDonors from "../Pages/PublicPages/SearchDonors";
import DonationRequestsPublic from "../Pages/PublicPages/DonationRequests";
import DonationRequestDetails from "../Pages/PublicPages/DonationRequestDetails";
import BlogPage from "../Pages/PublicPages/BlogPage";
import BlogDetails from "../Pages/PublicPages/BlogDetails";

// Dashboard Layout and Middleware
import ProtectedLayout from "../Layout/ProtectedLayout";
import AuthRedirect from "../Layout/AuthRedirect";

// Role-based Wrappers
import AdminRoute from "./AdminRoute";
import VolunteerRoute from "./VolunteerRoute";
import DonorRoute from "./DonorRoute";

// Common Dashboard Pages
import DashboardHome from "../Pages/DashboardPages/DashboardHome";
import Profile from "../Pages/DashboardPages/Profile";
import NotFound from "../Pages/Shared/NotFound";

// Donor Pages
import MyDonationRequests from "../Pages/DashboardPages/Donor/MyDonationRequests";
import CreateDonationRequest from "../Pages/DashboardPages/Donor/CreateDonationRequest";

// Admin Pages
import AllUsers from "../Pages/DashboardPages/Admin/AllUsers";
import AllDonationRequests from "../Pages/DashboardPages/Admin/AllDonationRequests";
import ContentManagement from "../Pages/DashboardPages/Admin/ContentManagement";
import AddBlog from "../Pages/DashboardPages/Admin/AddBlog";
import FundingPage from "../Pages/DashboardPages/Admin/FundingPage";

// Volunteer Pages (Some Admin Pages reused with restricted privileges)
import VolunteerDonationRequests from "../Pages/DashboardPages/Volunteer/AllDonationRequests";
import VolunteerContentManagement from "../Pages/DashboardPages/Volunteer/ContentManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthRedirect />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "search-donors", element: <SearchDonors /> },
      { path: "donation-requests", element: <DonationRequestsPublic /> },
      {
        path: "donation-requests/:id",
        element: <DonationRequestDetails />,
      },
      { path: "blogs", element: <BlogPage /> },
      { path: "blogs/:id", element: <BlogDetails /> },
    ],
  },

  {
    path: "/dashboard",
    element: <ProtectedLayout />,
    children: [
      {
        index: true,
        element: <DashboardHome />,
      },
      { path: "profile", element: <Profile /> },

      // Donor Routes
      {
        path: "my-donation-requests",
        element: (
          <DonorRoute>
            <MyDonationRequests />
          </DonorRoute>
        ),
      },
      {
        path: "create-donation-request",
        element: (
          <DonorRoute>
            <CreateDonationRequest />
          </DonorRoute>
        ),
      },

      // Admin Routes
      {
        path: "all-users",
        element: (
          <AdminRoute>
            <AllUsers />
          </AdminRoute>
        ),
      },
      {
        path: "all-blood-donation-request",
        element: (
          <AdminRoute>
            <AllDonationRequests />
          </AdminRoute>
        ),
      },
      {
        path: "content-management",
        element: (
          <AdminRoute>
            <ContentManagement />
          </AdminRoute>
        ),
      },
      {
        path: "content-management/add-blog",
        element: (
          <AdminRoute>
            <AddBlog />
          </AdminRoute>
        ),
      },
      {
        path: "fundings",
        element: (
          <AdminRoute>
            <FundingPage />
          </AdminRoute>
        ),
      },

      // Volunteer Routes
      {
        path: "volunteer-blood-requests",
        element: (
          <VolunteerRoute>
            <VolunteerDonationRequests />
          </VolunteerRoute>
        ),
      },
      {
        path: "volunteer-content-management",
        element: (
          <VolunteerRoute>
            <VolunteerContentManagement />
          </VolunteerRoute>
        ),
      },
    ],
  },

  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router;
