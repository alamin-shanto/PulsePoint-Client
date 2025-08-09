# Pulse Point

**Pulse Point** is a full-featured blood donation web application designed to bridge the gap between donors, recipients, volunteers, and administrators — creating a seamless and efficient system to save lives.

![Pulse Point](https://github.com/user-attachments/assets/87de7a25-1095-41ee-a77d-3dd81dd1a514)



---

## 🌟 Features

- 🔐 **JWT Authentication & Role-based Access**
- 👤 **Profile Management with Editable Fields**
- 🩸 **Create & Manage Blood Donation Requests**
- 🧑‍🤝‍🧑 **Volunteer Request Handling**
- 🛠 **Admin Dashboard for User & Request Management**
- 📱 **Fully Responsive Design**
- 🧾 **Funding Page with Payment Integration (Stripe)**
- 🔔 **Real-Time Notifications with React Toastify**

---

## 🧩 Tech Stack

| Tech           | Purpose                           |
| -------------- | --------------------------------- |
| React.js       | Frontend UI Framework             |
| Tailwind CSS   | Styling (fully responsive)        |
| React Router   | Page Routing                      |
| React Toastify | Alert Messages & Notifications    |
| Node.js        | Backend Server (Express.js)       |
| MongoDB        | NoSQL Database                    |
| Firebase Auth  | Optional user identity management |
| Stripe         | Payment Integration               |
| Vercel         | Deployment (Frontend + API)       |

---

## 👥 User Roles & Access

| Role          | Abilities                                                |
| ------------- | -------------------------------------------------------- |
| **Donor**     | View & manage personal donation requests, update profile |
| **Volunteer** | See assigned requests, update progress                   |
| **Admin**     | Manage all users, requests, and funding history          |

---

## 🧭 Project Structure

```
pulse-point/
│
├── client/ (React Frontend)
│   ├── assets/
│   ├── Components/
│   │   ├── Shared/
│   │   │   ├── BloodRequestRouter.jsx
│   │   │   └── LoadingSpinner.jsx
│   │   ├── BloodRequestForm.jsx
│   │   └── BloodRequestList.jsx
│   ├── Context/
│   │   ├── AuthContext.jsx
│   │   └── AuthProvider.jsx
│   ├── Firebase/
│   │   └── firebase.config.js
│   ├── Hooks/
│   │   ├── axiosPublic.js
│   │   ├── useAxiosSecure.js
│   │   ├── useBloodRequests.jsx
│   │   └── useUserRole.jsx
│   ├── Layout/
│   │   ├── AuthRedirect.jsx
│   │   ├── DashBoardLayout.jsx
│   │   └── ProtectedLayout.jsx
│   ├── Pages/
│   │   ├── DashboardPages/
│   │   │   ├── Admin/
│   │   │   │   ├── AddBlog.jsx
│   │   │   │   ├── AllDonationRequests.jsx
│   │   │   │   ├── AllUsers.jsx
│   │   │   │   ├── ContentManagement.jsx
│   │   │   │   └── FundingPage.jsx
│   │   │   ├── Donor/
│   │   │   │   ├── CreateDonationRequest.jsx
│   │   │   │   └── MyDonationRequests.jsx
│   │   │   ├── Volunteer/
│   │   │   │   ├── ContentManagement.jsx
│   │   │   │   └── VolunteerDonationRequests.jsx
│   │   │   ├── DashBoardHome.jsx
│   │   │   └── Profile.jsx
│   │   ├── PublicPages/
│   │   │   ├── BlogDetails.jsx
│   │   │   ├── BlogPage.jsx
│   │   │   ├── DonationRequestDetails.jsx
│   │   │   ├── DonationRequests.jsx
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── SearchDonors.jsx
│   │   └── Shared/
│   │       └── NotFound.jsx
│   ├── Routers/
│   │   ├── AdminRoute.jsx
│   │   ├── DonorRoute.jsx
│   │   ├── Router.jsx
│   │   └── VolunteerRoute.jsx
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── server/ (Backend API)
│   ├── .env
│   ├── .firebaserc
│   ├── .gitignore
│   ├── admin-key.json
│   ├── firebase.json
│   ├── index.js
│   ├── keyConvert.js
│   ├── package.json
│   └── vercel.json


```
---

# 📦 package.json Dependencies Summary
## Main Dependencies:

- @stripe/react-stripe-js, @stripe/stripe-js — Stripe payment integration

- @tailwindcss/vite — Tailwind integration with Vite

- @tanstack/react-query — Data fetching & caching

- axios — HTTP client

- firebase — Authentication & backend services

- framer-motion — Animations

- lucide-react — Icons

- react, react-dom, react-router-dom — React core and routing

- react-hook-form — Form handling

- react-toastify — Toast notifications

- sweetalert2 — Beautiful alerts

- tailwindcss — Utility-first CSS framework

## Dev Dependencies:

- eslint + plugins — Linting

- vite + @vitejs/plugin-react — Development server & React support

---

# 💡 Notable UX Highlights
## 🎨 Custom-styled dashboard with role-based sidebar

🖼 User avatar with default placeholder

📲 Mobile-first UI with smooth toggle sidebar

✅ Toast messages for updates, warnings, and errors

💬 Fully styled forms and intuitive interactions
---
# ⚙️ Local Setup & Installation Guide
Follow these steps to get Pulse Point running on your local machine:

1️⃣ Clone the Repository
```
git clone https://github.com/<your-username>/pulse-point.git
cd pulse-point
```
2️⃣ Frontend Setup
```
cd client
npm install
npm run dev
```
This will start the React development server at: [localhost](http://localhost:5173)
Open your browser and visit the URL above to see the app in action.

3️⃣ Backend Setup
Open a new terminal window/tab and run:
```
cd ../server
npm install
```
4️⃣ Configure Environment Variables
Create a .env file inside the server folder with the following variables:

# MongoDB Atlas connection string
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>?retryWrites=true&w=majority
```
# JWT secret key for authentication
```
JWT_SECRET=your_jwt_secret_here
```

# Firebase Admin SDK credentials
```
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_client_email@project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----\n"
```
# Stripe secret key (if payment integration is used)
```
STRIPE_SECRET_KEY=sk_test_XXXXXXXXXXXXXXXXXXXXXXXX
```
Important:
Keep .env and admin-key.json in .gitignore to avoid leaking sensitive credentials.
Replace placeholders with your actual credentials.

5️⃣ Start Backend Server
Run the backend with:
```
npm run dev
```
This starts the Express API on default port 5000 (or as configured).

Make sure backend is running before testing frontend API calls.

6️⃣ Access the App

Frontend: [localhost:5173](http://localhost:5173)

Backend API: [localhost:5000](http://localhost:5000)

⚠️ Troubleshooting Tips
- Ensure MongoDB Atlas cluster is accessible and IP whitelisted.

- Verify Firebase Admin credentials are correct and active.

- If ports conflict, adjust in package.json scripts or backend config.

For any issues with JWT, confirm your JWT_SECRET matches in both frontend and backend (if applicable).

🏁 Deployment Notes

- Frontend can be deployed to Netlify, Vercel, or any static hosting with React support.

- Backend API deploys smoothly on Vercel, Render, or Heroku.

Don't forget to set environment variables in your hosting platform dashboard!

Whitelist your deployed domain in Firebase Authentication settings.

---

# 📄 License
This project is licensed under the MIT License.
```
“Donate Blood, Save Lives — Be a Pulse in Someone’s Life”
```
