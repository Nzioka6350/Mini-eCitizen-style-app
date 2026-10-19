# Murang'a e-Huduma — Public Service Request System

A modern, citizen-first platform that allows residents of Murang'a County to apply for services, report issues, and track their requests while county administrators manage services, sub-counties, and citizen reports through a dedicated dashboard.

Inspired by eCitizen and built as a full-stack MERN application.

---

## 🔐 Access & Credentials

### 👤 Citizen Login

Citizens do not have pre-created accounts. To access the citizen portal:

1. Click **Sign in** on the top right of the landing page.
2. Click **Create an account** at the bottom of the login form.
3. Register with your name, email, and password.
4. Once registered, log in to access your dashboard.

### 🛡️ Administrator Login

An administrator account is pre-seeded into the database for testing and management purposes.

- **URL:** `/login`
- **Email:** `admin@muranga.go.ke`
- **Password:** `admin123`

*Note: The app automatically detects your role upon login and routes you to the correct dashboard: `/admin` for admins and `/dashboard` for citizens.*

---

## Architecture

The application uses a React frontend, an Express REST API, and MongoDB Atlas for persistent data storage.

```text
┌────────────────────────┐         HTTPS / JSON        ┌────────────────────────┐
│                        │  ───────────────────────►   │                        │
│  React Frontend (CRA)  │                             │  Express API (Node.js) │
│  localhost:3000        │   ◄───────────────────────  │  localhost:5000        │
│                        │        JWT + Responses      │                        │
└────────────────────────┘                             └───────────┬────────────┘
                                                                  │
                                                                  │ Mongoose
                                                                  ▼
                                                      ┌────────────────────────┐
                                                      │     MongoDB Atlas      │
                                                      │ Users, Services,       │
                                                      │ SubCounties, Requests  │
                                                      └────────────────────────┘
```

### Application Design

- **Authentication:** JWT tokens are stored in `localStorage` and attached to API requests through an Axios interceptor. Sessions automatically expire after 1 hour of inactivity.
- **Role-based routing:** `ProtectedRoute` restricts access to authenticated citizen pages, while `AdminRoute` protects administrator pages.
- **Data fetching:** `Promise.all` is used to fetch independent data concurrently on the landing page and admin dashboard.
- **Database access:** Mongoose models define the application's data structures and relationships.

---

## Features

### Citizen

- Register and log in securely using JWT and bcrypt.
- Browse active county services on the public landing page.
- Apply for a service using the category, sub-county, landmark, and description.
- View personal service requests and open/resolved request counters.
- Track request status: `Pending → In Progress → Resolved`.
- Recover forgotten passwords through the password reset flow.

### Admin

- Secure admin panel with role-based access using `AdminRoute`.
- Dashboard analytics showing total requests, open requests, resolved cases, and total users.
- Personalized greeting based on the time of day.
- View citizen requests in a paginated table and update their statuses inline.
- View full request details and update status with a custom progress note.
- Manage services by adding or removing services displayed on the landing page.
- Manage sub-counties displayed on the landing page and request form.

### Public Access

- Public landing page with a hero slideshow, live search, service catalogue, About Us section, and sub-counties served.
- Navigation links for signing in and registering.
- Browse available services without logging in.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, JavaScript, Hooks |
| Frontend Tooling | Create React App (Webpack) |
| Backend | Node.js (ES Modules) |
| API Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password Hashing | bcryptjs |
| HTTP Client | Axios |
| Routing | React Router v6 |

---

## Design & Theme

The interface is designed to feel calm, accessible, civic-focused, and representative of county public services.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--primary-green` | `#15603b` | Primary buttons, links, and active states |
| `--bg-color` | `#f7f5f0` | Warm off-white page background |
| `--card-bg` | `#ffffff` | Cards, panels, and navbar |
| `--text-dark` | `#1f2937` | Headings and body text |
| `--text-muted` | `#6b7280` | Secondary text and metadata |
| `--border-color` | `#e5e7eb` | Card borders and dividers |
| `--danger` | `#ef4444` | Error messages and destructive actions |
| Pending | `#d97706` / `#fef3c7` | Pending status badge |
| In Progress | `#2563eb` / `#dbeafe` | In-progress status badge |
| Resolved | `#059669` / `#d1fae5` | Resolved status badge |

---

## Database Design

### 1. User

| Field | Type |
|---|---|
| `_id` | ObjectId |
| `name` | String |
| `email` | String |
| `passwordHash` | String |
| `phone` | String |
| `role` | String |
| `resetPasswordToken` | String |
| `resetPasswordExpires` | Date |
| `createdAt` / `updatedAt` | Date |

### 2. Service

| Field | Type |
|---|---|
| `_id` | ObjectId |
| `category` | String |
| `title` | String |
| `description` | String |
| `fee` | String |
| `processingTime` | String |
| `isActive` | Boolean |
| `createdAt` / `updatedAt` | Date |

### 3. SubCounty

| Field | Type |
|---|---|
| `_id` | ObjectId |
| `name` | String |
| `isActive` | Boolean |
| `createdAt` / `updatedAt` | Date |

### 4. ServiceRequest

| Field | Type |
|---|---|
| `_id` | ObjectId |
| `userId` | ObjectId (ref: User) |
| `serviceId` | ObjectId (ref: Service) |
| `title` | String |
| `category` | String |
| `location.subCounty` | String |
| `location.landmark` | String |
| `description` | String |
| `imageUrl` | String |
| `status` | String |
| `assignedTo` | ObjectId (ref: User) |
| `resolvedAt` | Date |
| `createdAt` / `updatedAt` | Date |

### 5. RequestHistory

| Field | Type |
|---|---|
| `_id` | ObjectId |
| `requestId` | ObjectId (ref: ServiceRequest) |
| `changedBy` | ObjectId (ref: User) |
| `previousStatus` | String |
| `newStatus` | String |
| `note` | String |
| `createdAt` / `updatedAt` | Date |

---

## Folder Structure

### Root Directory

```text
Mini-eCitizen-style-app/
├── client/
├── server/
├── README.md
└── .gitignore
```

### `client/` — Frontend

React application built with Create React App.

```text
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminRoute.jsx
│   │   ├── AppNavbar.jsx
│   │   ├── Footer.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── AdminDashboard.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── MyRequests.jsx
│   │   ├── NewRequest.jsx
│   │   ├── Register.jsx
│   │   ├── RequestDetail.jsx
│   │   └── ResetPassword.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
└── package.json
```

### `server/` — Backend

Express REST API using Node.js ES modules and Mongoose.

```text
server/
├── config/
│   └── db.js
├── controllers/
│   ├── adminController.js
│   ├── authController.js
│   ├── requestController.js
│   ├── serviceController.js
│   └── subCountyController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── RequestHistory.js
│   ├── Service.js
│   ├── ServiceRequest.js
│   ├── SubCounty.js
│   └── User.js
├── routes/
│   ├── adminRoutes.js
│   ├── authRoutes.js
│   ├── requestRoutes.js
│   ├── serviceRoutes.js
│   └── subCountyRoutes.js
├── scripts/
│   ├── createAdmin.js
│   └── seedSubCounties.js
├── .env
├── server.js
└── package.json
```

---

## Local Development Setup

### Prerequisites

- Node.js v18 or later
- npm
- MongoDB Atlas account, or a running local MongoDB server
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Mini-eCitizen-style-app
```

### 2. Configure the Backend

```bash
cd server
npm install
```

Create a `.env` file inside the `server/` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_uri
JWT_SECRET=your_secure_random_secret
CLIENT_URL=http://localhost:3000
```

### 3. Seed Initial Data

From the `server/` directory, run:

```bash
node scripts/createAdmin.js
node scripts/seedSubCounties.js
```

### 4. Start the Backend

```bash
npm run dev
```

### 5. Configure the Frontend

Open a second terminal:

```bash
cd client
npm install
```

Create a `.env` file inside the `client/` directory:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Start the Frontend

```bash
npm start
```

Open the application in your browser at `http://localhost:3000`.

---

## API Endpoints

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/me` | Authenticated user |
| `POST` | `/api/auth/forgot-password` | Public |
| `POST` | `/api/auth/reset-password/:token` | Public |

### Services & Sub-counties

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/services` | Public |
| `POST` | `/api/services` | Admin |
| `DELETE` | `/api/services/:id` | Admin |
| `GET` | `/api/subcounties` | Public |
| `POST` | `/api/subcounties` | Admin |
| `DELETE` | `/api/subcounties/:id` | Admin |

### Service Requests

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/requests` | Authenticated citizen |
| `GET` | `/api/requests/my-requests` | Authenticated citizen |
| `GET` | `/api/requests/:id` | Owner, admin, or officer |
| `GET` | `/api/admin/requests` | Admin or officer |
| `PATCH` | `/api/admin/requests/:id/status` | Admin or officer |
| `GET` | `/api/admin/analytics` | Admin |

---

## License

This project is intended for educational and portfolio purposes. If you plan to distribute it publicly, add an appropriate open-source license, such as the MIT License, and include the corresponding `LICENSE` file.

---

**County Government of Murang'a** · *Huduma bora, mahali popote.*