# Public Service Request System

A web-based public service request management system inspired by eCitizen. The platform enables citizens to report community issues, track their requests, and receive updates while service officers and administrators manage and resolve reported issues.

## Features

### Citizen
- Register and log in securely.
- Submit service requests with a category, location, description, and optional image.
- View submitted requests and their current statuses.
- Track request progress and status history.

### Service Officer
- View assigned service requests.
- Update request statuses.
- Add progress notes and resolution details.

### Administrator
- Access an administrative dashboard.
- View and manage service requests.
- Assign requests to service officers.
- Monitor request statuses.
- View basic analytics for pending, in-progress, and resolved requests.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | React (JavaScript) |
| Frontend tooling | Vite |
| Backend | Node.js |
| API framework | Express.js |
| Database | MongoDB Atlas |
| Database ODM | Mongoose |
| Authentication | JSON Web Tokens (JWT) |
| Password security | bcrypt |
| Version control | Git and GitHub |

Optional image uploads can be implemented using a cloud storage provider.

## System Architecture

The application uses a client-server architecture.

1. React provides the user interface.
2. Express.js exposes REST API endpoints.
3. Node.js runs the backend application.
4. Mongoose manages database models and queries.
5. MongoDB Atlas stores users, service requests, and request history.
6. JWT-based authentication protects private endpoints.

## Database Design

The database consists of the following collections.

### 1. Users

Stores citizen, service officer, and administrator accounts.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `name` | String | Full name |
| `email` | String | Unique email address |
| `passwordHash` | String | Hashed password |
| `phone` | String | Optional phone number |
| `role` | String | citizen, officer, or admin |
| `createdAt` | Date | Account creation date |
| `updatedAt` | Date | Last update date |

### 2. ServiceRequests

Stores service issues reported by citizens.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `userId` | ObjectId | Reference to the submitting user |
| `title` | String | Short request title |
| `category` | String | Type of service issue |
| `location` | Object | County, area, landmark, optional coordinates |
| `description` | String | Details of the reported issue |
| `imageUrl` | String or null | Optional image URL |
| `status` | String | Pending, In Progress, Resolved |
| `assignedTo` | ObjectId or null | Reference to the assigned officer |
| `createdAt` | Date | Submission date |
| `updatedAt` | Date | Last update date |
| `resolvedAt` | Date or null | Resolution date |

### 3. RequestHistory

Records request status changes and progress updates.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `requestId` | ObjectId | Reference to the service request |
| `changedBy` | ObjectId | Reference to the user making the change |
| `previousStatus` | String or null | Previous status |
| `newStatus` | String | New status |
| `note` | String | Optional progress or resolution note |
| `createdAt` | Date | Date of the update |

### 4. Categories (Optional)

Can be introduced when categories need to be managed dynamically.

| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Primary identifier |
| `name` | String | Category name |
| `description` | String | Category description |
| `isActive` | Boolean | Whether the category is available |
| `createdAt` | Date | Creation date |

For the initial version, categories can be defined as a predefined list in the backend.

## Database Relationships

- **Users → ServiceRequests:** One-to-many. A citizen can submit multiple requests.
- **Users → ServiceRequests (assignedTo):** One-to-many. An officer can be assigned multiple requests.
- **ServiceRequests → RequestHistory:** One-to-many. Each request can have multiple history entries.
- **Users → RequestHistory:** One-to-many. An officer or administrator can make multiple updates.
- **Categories → ServiceRequests:** One-to-many, if the optional Categories collection is implemented.

MongoDB relationships use ObjectId references. The backend is responsible for validating referenced documents and enforcing permissions.

## Request Status Workflow

`Pending → In Progress → Resolved`

- **Pending:** A request has been submitted and awaits action.
- **In Progress:** The request is being handled.
- **Resolved:** The reported issue has been addressed.

Every status change should be recorded in RequestHistory for accountability.

## Basic Analytics

The administrator dashboard will display:

- Total service requests.
- Pending requests.
- In-progress requests.
- Resolved requests.
- Open requests, calculated as Pending + In Progress.

Open and resolved counts should be calculated from the database to keep the dashboard up to date.

## Planned REST API

### Authentication
- `POST /api/auth/register` — Register a citizen.
- `POST /api/auth/login` — Authenticate a user.
- `GET /api/auth/me` — Retrieve the authenticated user's profile.

### Service Requests
- `POST /api/requests` — Submit a request.
- `GET /api/requests/my-requests` — List the current citizen's requests.
- `GET /api/requests/:id` — Retrieve request details, subject to authorization.
- `GET /api/requests` — List requests accessible to authorized staff.
- `PATCH /api/requests/:id/status` — Update request status, subject to authorization.
- `PATCH /api/requests/:id/assign` — Assign a request to an officer.

### Request History
- `GET /api/requests/:id/history` — Retrieve a request's status history.

### Administration and Analytics
- `GET /api/admin/analytics` — Retrieve request statistics.
- `GET /api/admin/users` — List users, subject to administrator authorization.

These endpoints are planned routes and will be implemented as development progresses.

## Security Considerations

- Hash passwords before storing them.
- Use environment variables for database credentials and JWT secrets.
- Validate request bodies and query parameters.
- Protect private routes using authentication middleware.
- Enforce role-based authorization on the backend.
- Allow public registration only for citizen accounts.
- Validate uploaded file types and sizes.
- Restrict access to requests and personal information based on user roles.
- Never expose database credentials or secrets in frontend code.

## Local Development Setup

### Prerequisites

- Node.js and npm.
- Git.
- A MongoDB Atlas account.
- Visual Studio Code or another code editor.

### Installation

1. Clone the repository.

   ```bash
   git clone <your-repository-url>
   cd public-service-request-system
   ```

2. Install frontend and backend dependencies in their respective directories.

   ```bash
   cd client
   npm install
   ```

   ```bash
   cd ../server
   npm install
   ```

3. Create a `.env` file inside the `server` directory.

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_secure_random_secret
   CLIENT_URL=http://localhost:5173
   ```

4. Start the backend and frontend using their configured development scripts.

   ```bash
   # Terminal 1
   cd server
   npm run dev
   ```

   ```bash
   # Terminal 2
   cd client
   npm run dev
   ```

5. Open the local URL displayed by Vite in your browser.

Do not commit `.env` files to GitHub. Add them to `.gitignore`.

## Project Structure

```text
public-service-request-system/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env.example
│   └── package.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   ├── .env.example
│   └── package.json
├── .gitignore
└── README.md
```

## Future Improvements

- Email notifications when request statuses change.
- Search, filtering, and pagination.
- Image uploads using cloud storage.
- Map-based request locations.
- Advanced analytics and reports.
- Audit logging and request assignment history.

## License

This project is intended for educational and portfolio purposes. Add a suitable open-source license if you intend to distribute it publicly.