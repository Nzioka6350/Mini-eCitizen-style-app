# 🖥️ Murang'a e-Huduma — Frontend (Client)

A React single-page application built with Create React App (CRA) that serves as the public-facing portal for citizens to apply for county services and for admins to manage those requests.

Part of the **Murang'a e-Huduma** public service request system. This repository is the `client/` folder of the full MERN project.

---

## Table of Contents

1. [Overview](#overview)
2. [Tech Stack](#tech-stack)
3. [Features](#features)
4. [Design System](#design-system)
5. [Folder Structure](#folder-structure)
6. [Environment Variables](#environment-variables)
7. [Local Development](#local-development)
8. [Pages & Routing](#pages--routing)
9. [Components](#components)
10. [Authentication Flow](#authentication-flow)
11. [API Integration](#api-integration)
12. [Build & Deploy](#build--deploy)
13. [Troubleshooting](#troubleshooting)
14. [License](#license)

---

## Overview

This frontend consumes the Express API (see the sibling `server/` folder) and provides:

- A **public landing page** where anyone can browse county services.
- A **citizen portal** where registered users submit requests and track progress.
- An **admin panel** where county admins manage requests, services, and sub-counties.

The UI is built with plain CSS-in-JS (inline `style` objects) and follows the Murang'a County brand: dark green (`#15603b`), warm beige backgrounds, and clean white cards.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Tooling | Create React App (Webpack) |
| Routing | React Router v6 |
| HTTP client | Axios (with JWT interceptor) |
| State management | React Context (`AuthContext`) + local `useState` |
| Styling | Inline styles + global CSS variables in `index.css` |
| Icons | Emojis (no external icon library) |
| Fonts | System font stack |

---

## Features

### Public
- Landing page with a **hero slideshow** (tea plantation + hills images from Unsplash).
- **Live search** across service title, category, and description.
- Services grid showing fee and processing time.
- "About Us" section with live statistics.
- Sub-counties served as pills.
- Footer with quick links, popular services, and contact info.

### Citizen
- Register and log in (JWT-based).
- **Forgot password** flow with a reset link.
- **Personalized greeting** ("Good morning, Frank 👋") based on time of day.
- Submit a new request with category, sub-county, landmark, and description.
- View **My Requests** with open/resolved counters.
- Click any request to see the full **status timeline**.

### Admin
- Dedicated `/admin` dashboard with role-based access.
- **Analytics cards**: Total Requests, Open, Resolved.
- **Citizen Requests table** with:
  - Row numbers
  - Pagination (5 per page)
  - Status dropdown for quick updates
  - "View" button → navigates to the full request detail page
- **Manage Services** tab: Add/remove services shown on the landing page.
- **Manage Sub-counties** tab: Add/remove sub-counties.
- Same request detail page as citizens, but with an extra **"Update Status"** panel.

---

## Design System

### Color Palette (defined in `src/index.css`)

| Token | Hex | Usage |
|---|---|---|
| `--primary-green` | `#15603b` | Buttons, links, active states |
| `--bg-color` | `#f7f5f0` | Page background |
| `--card-bg` | `#ffffff` | Cards, panels |
| `--text-dark` | `#1f2937` | Headings and body |
| `--text-muted` | `#6b7280` | Secondary text |
| `--border-color` | `#e5e7eb` | Borders and dividers |
| `--danger` | `#ef4444` | Errors |
| Pending | `#fef3c7` / `#d97706` | Status badge |
| In Progress | `#dbeafe` / `#2563eb` | Status badge |
| Resolved | `#d1fae5` / `#059669` | Status badge |

### Typography
- System fonts (`-apple-system, Segoe UI, Roboto, …`).
- Headings: bold weights (700–800).
- Body: 0.85–0.95rem.

### UI Patterns
- **Cards** with `border-radius: 12px` and subtle borders.
- **Pill badges** for statuses and sub-counties.
- **Solid green CTA buttons** everywhere.
- **Sticky navbar** on authenticated pages.
- **Flex-based footer** that sticks to the bottom.

---

## Folder Structure

```text
client/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── AdminRoute.jsx         # Guard for /admin
│   │   ├── AppNavbar.jsx          # Logged-in navbar (role-aware)
│   │   ├── Footer.jsx             # Landing page footer
│   │   └── ProtectedRoute.jsx     # Guard for citizen routes
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state + login/register/logout
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
│   │   └── api.js                 # Axios instance with JWT interceptor
│   ├── App.jsx                    # Routing definition
│   ├── index.css                  # Global styles + CSS variables
│   └── main.jsx                   # React entry point
├── .env                           # REACT_APP_API_URL
└── package.json