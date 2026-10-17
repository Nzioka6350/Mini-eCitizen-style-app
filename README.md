# Murang'a e-Huduma — Public Service Request System

A modern, citizen-first platform that allows residents of Murang'a County to apply for services, report issues, and track their requests while county administrators manage services, sub-counties, and citizen reports through a dedicated dashboard.

Inspired by eCitizen and built as a full-stack MERN application.

---

## Table of Contents

1. [Features](#features)
2. [Tech Stack](#tech-stack)
3. [Design & Theme](#design--theme)
4. [Architecture](#architecture)
5. [Database Design](#database-design)
6. [Folder Structure](#folder-structure)
7. [Local Development Setup](#local-development-setup)
8. [API Endpoints](#api-endpoints)
9. [Roadmap](#roadmap)
10. [License](#license)

---

## Features

### Citizen

- Register and log in securely using JWT and bcrypt.
- Browse active county services on the public landing page.
- Apply for a service using the category, sub-county, landmark, and description.
- View personal service requests and open/resolved request counters.
- Track request status: `Pending → In Progress → Resolved`.

### Admin

- Secure admin panel with role-based access using `AdminRoute`.
- Dashboard analytics showing total requests, open requests, and resolved cases.
- View citizen requests and update their statuses.
- Manage services by adding or removing services displayed on the landing page.
- Manage sub-counties displayed on the landing page and request form.

### Public Access

- Public landing page with a hero section, service catalogue, About Us section, and sub-counties served.
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

### Typography

- System font stack using fonts such as `-apple-system`, `Segoe UI`, and `Roboto`.
- Bold headings with font weights of 700–800.
- Body text sized between `0.85rem` and `0.95rem`.

### UI Patterns

- Cards with subtle borders and `12px` border radii.
- Pill-shaped status badges and sub-county labels.
- Consistent green call-to-action buttons.
- Sticky navigation on authenticated pages.
- Footer with branding, quick links, popular services, and contact information.
- Flexbox layout to help keep the footer at the bottom of the page.

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

- **Authentication:** JWT tokens are stored in `localStorage` and attached to API requests through an Axios interceptor.
- **Role-based routing:** `ProtectedRoute` restricts access to authenticated citizen pages, while `AdminRoute` protects administrator pages.
- **Data fetching:** `Promise.all` can be used to fetch independent data concurrently on the landing page and admin dashboard.
- **Database access:** Mongoose models define the application's data structures and relationships.

---

## Database Design

### Entity Relationship Overview

```text
User (1) ──────────< ServiceRequest (many)
User (1) ──────────< RequestHistory (many)
Service (1) ───────< ServiceRequest (many)
SubCounty (1) ─────< ServiceRequest (many)
ServiceRequest (1) ─< RequestHistory (many)
```

### 1. User

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `name` | String | Required |
| `email` | String | Required, unique |
| `passwordHash` | String | Required; stores the bcrypt password hash |
| `phone` | String | Optional |
| `role` | String | `citizen`, `officer`, or `admin`; defaults to `citizen` |
| `createdAt` / `updatedAt` | Date | Automatically managed timestamps |

### 2. Service

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `category` | String | Required |
| `title` | String | Required |
| `description` | String | Required |
| `fee` | String | Example: `KES 1,000` or `Free` |
| `processingTime` | String | Example: `~30 days` |
| `isActive` | Boolean | Defaults to `true`; supports soft deletion |
| `createdAt` / `updatedAt` | Date | Automatically managed timestamps |

### 3. SubCounty

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `name` | String | Required, unique |
| `isActive` | Boolean | Defaults to `true`; supports soft deletion |
| `createdAt` / `updatedAt` | Date | Automatically managed timestamps |

### 4. ServiceRequest

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `userId` | ObjectId → `User` | Citizen submitting the request |
| `serviceId` | ObjectId → `Service` | Requested service |
| `title` | String | Required |
| `category` | String | Required |
| `location.subCounty` | String | Required |
| `location.landmark` | String | Required |
| `description` | String | Required |
| `imageUrl` | String or null | Reserved for future image uploads |
| `status` | String | `Pending`, `In Progress`, or `Resolved`; defaults to `Pending` |
| `assignedTo` | ObjectId → `User` or null | Assigned officer |
| `resolvedAt` | Date or null | Set when the request is resolved |
| `createdAt` / `updatedAt` | Date | Automatically managed timestamps |

### 5. RequestHistory

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | Primary key |
| `requestId` | ObjectId → `ServiceRequest` | Related request |
| `changedBy` | ObjectId → `User` | User who changed the status |
| `previousStatus` | String or null | Previous status |
| `newStatus` | String | Required |
| `note` | String | Optional history note |
| `createdAt` / `updatedAt` | Date | Automatically managed timestamps |

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
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── MyRequests.jsx
│   │   ├── NewRequest.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .env
└── package.json
```

**Important files:**

- `AuthContext.jsx` — Global authentication state and login, registration, and logout functionality.
- `api.js` — Axios configuration and JWT request interceptor.
- `ProtectedRoute.jsx` — Restricts access to authenticated citizen pages.
- `AdminRoute.jsx` — Restricts access to administrator pages.
- `AdminDashboard.jsx` — Displays analytics, requests, services, and sub-county management.
- `NewRequest.jsx` — Provides the service request submission form.

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
│   ├── seedSubCounties.js
│   └── checkAdmin.js
├── .env
├── server.js
└── package.json
```

**Important files:**

- `config/db.js` — MongoDB connection configuration.
- `middleware/authMiddleware.js` — Authentication and role authorization.
- `models/` — Mongoose schemas for application data.
- `controllers/` — Business logic for API operations.
- `routes/` — API route definitions.
- `scripts/createAdmin.js` — Creates the initial administrator account.
- `scripts/seedSubCounties.js` — Seeds initial sub-county records.
- `scripts/checkAdmin.js` — Checks an account's administrator role.
- `server.js` — Express application entry point.

---

## Local Development Setup

### Prerequisites

Install or prepare the following:

- Node.js v18 or later
- npm
- MongoDB Atlas account, or a running local MongoDB server
- Git

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd Mini-eCitizen-style-app
```

Replace `<your-repo-url>` with your actual Git repository URL.

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

Replace `your_mongodb_atlas_uri` with your MongoDB Atlas connection string and set `JWT_SECRET` to a strong, private value.

Make sure your MongoDB Atlas database user and network access settings permit the connection.

### 3. Seed Initial Data

From the `server/` directory, run the following scripts as appropriate:

```bash
node scripts/createAdmin.js
node scripts/seedSubCounties.js
```

Run these scripts only after configuring the environment variables and ensuring the database connection works. The scripts should be safe to rerun before doing so; check whether they create duplicates.

### 4. Start the Backend

```bash
npm run dev
```

The API should run on:

```text
http://localhost:5000
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

Restart the frontend whenever you change its environment variables.

### 6. Start the Frontend

```bash
npm start
```

Open the application in your browser:

```text
http://localhost:3000
```

### 7. Administrator Account

The initial administrator account depends on the implementation of `scripts/createAdmin.js`.

If you configure the script to create the following development credentials, use them for local testing:

```text
Email:    admin@muranga.go.ke
Password: admin123
```

These are example credentials, not guaranteed defaults. Confirm the values in your script before logging in.

**Security warning:** Never deploy a publicly accessible administrator account with a known default password. Use a strong password and keep database credentials, JWT secrets, and other sensitive configuration out of Git.

---

## API Endpoints

All routes below are relative to the backend API base URL, such as `http://localhost:5000`.

### Authentication

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/auth/register` | Public |
| `POST` | `/api/auth/login` | Public |
| `GET` | `/api/auth/me` | Authenticated user |

### Services

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/services` | Public |
| `POST` | `/api/services` | Admin |
| `DELETE` | `/api/services/:id` | Admin |

### Sub-counties

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/subcounties` | Public |
| `POST` | `/api/subcounties` | Admin |
| `DELETE` | `/api/subcounties/:id` | Admin |

### Service Requests

| Method | Endpoint | Access |
|---|---|---|
| `POST` | `/api/requests` | Authenticated citizen |
| `GET` | `/api/requests/my-requests` | Authenticated citizen |
| `GET` | `/api/requests/:id` | Request owner, admin, or authorized officer |

### Administration

| Method | Endpoint | Access |
|---|---|---|
| `GET` | `/api/admin/requests` | Admin or officer |
| `PATCH` | `/api/admin/requests/:id/status` | Admin or officer |
| `GET` | `/api/admin/analytics` | Admin |

**Note:** These endpoints describe the intended API design. Confirm that your route files and middleware implement the same paths and permissions.

---

## Roadmap

Potential improvements for future releases:

- [ ] Request details page with a status timeline and history notes.
- [ ] Image uploads using Cloudinary or Amazon S3.
- [ ] Officer assignment interface in the admin dashboard.
- [ ] Email notifications when request statuses change.
- [ ] Search, filtering, and pagination for the admin requests table.
- [ ] Map picker for request locations and coordinates.
- [ ] Password reset and recovery functionality.
- [ ] Audit logs for administrative actions.
- [ ] Export service requests to CSV or PDF.
- [ ] Improved validation, automated tests, and API documentation.
- [ ] Production deployment with secure environment variables and CORS configuration.

---

## License

This project is intended for educational and portfolio purposes.

If you plan to distribute it publicly, add an appropriate open-source license, such as the MIT License, and include the corresponding `LICENSE` file.

---

**County Government of Murang'a** · *Huduma bora, mahali popote.*
