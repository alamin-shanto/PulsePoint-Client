# Pulse Point

**Pulse Point** is a full-featured blood donation web application designed to bridge the gap between donors, recipients, volunteers, and administrators — creating a seamless and efficient system to save lives.

(![Pulse Point Banner](https://github.com/user-attachments/assets/1d5a6010-fcb0-460f-9251-0f9702961003)


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

pulse-point/
│
├── client/ (React App)
│ ├── pages/
│ ├── components/
│ ├── context/
│ └── App.jsx
│
├── server/ (Express API)
│ ├── routes/
│ ├── controllers/
│ └── index.js
│
├── .env
└── README.md

💡 Notable UX Highlights
🎨 Custom-styled dashboard with role-based sidebar

🖼 User avatar with default placeholder

📲 Mobile-first UI with smooth toggle sidebar

✅ Toast messages for updates, warnings, and errors

💬 Fully styled forms and intuitive interactions

📄 License
This project is licensed under the MIT License.

“Donate Blood, Save Lives — Be a Pulse in Someone’s Life”
