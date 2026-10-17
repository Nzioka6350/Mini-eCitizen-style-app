# Murang'a e-Huduma — Public Service Request System

A modern, citizen-first platform that lets residents of Murang'a County apply for services, report issues, and track their requests in real time — while county administrators manage services, sub-counties, and citizen reports from a dedicated panel.

Inspired by eCitizen, built as a full-stack MERN application.

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
- Register and log in securely (JWT + bcrypt).
- Browse all active county services on the public landing page.
- Apply for a service with **category**, **sub-county**, **landmark**, and **description**.
- View the list of their own requests with **open / resolved** counters.
- Track request status via badges: `Pending → In Progress → Resolved`.

### Admin
- Secure admin panel with **role-based access** (`AdminRoute`).
- Dashboard analytics: total requests, open (Pending + In Progress), and resolved cases.
- **Citizen Requests Table** with inline status update dropdown.
- **Manage Services**: add / remove services shown on the landing page.
- **Manage Sub-counties**: add / remove sub-counties shown on the landing page and the request form.

### Public (no login required)
- Landing page with hero section, service catalogue, About Us section, and sub-counties served.
- Public Navbar with links to sign in / register.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (JavaScript, function components + hooks) |
| Frontend tooling | Create React App (Webpack) |
| Backend | Node.js (ES Modules) |
| API framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Auth | JSON Web Tokens (JWT) |
| Password hashing | bcryptjs |
| HTTP client | Axios |
| Routing | React Router v6 |

---

## Design & Theme

The UI is intentionally calm, civic, and county-flavoured.

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--primary-green` | `#15603b` | Primary buttons, links, active states |
| `--bg-color` | `#f7f5f0` | Page background (warm off-white / beige) |
| `--card-bg` | `#ffffff` | Cards, panels, navbar |
| `--text-dark` | `#1f2937` | Headings, body text |
| `--text-muted` | `#6b7280` | Secondary text, metadata |
| `--border-color` | `#e5e7eb` | Card borders, dividers |
| `--danger` | `#ef4444` | Error messages, destructive buttons |
| Status amber | `#d97706` / `#fef3c7` | Pending badge |
| Status blue | `#2563eb` / `#dbeafe` | In Progress badge |
| Status green | `#059669` / `#d1fae5` | Resolved badge |

### Typography
- System font stack (`-apple-system, Segoe UI, Roboto, …`) for performance and consistency.
- Headings use bold weights (700–800).
- Body copy uses 0.85–0.95rem for a comfortable civic-document feel.

### UI Patterns
- **Cards** with subtle borders and `border-radius: 12px`.
- **Pill badges** for statuses and sub-counties.
- **Solid green CTA buttons** consistently used across Navbar, Forms, and Admin tables.
- **Sticky Navbar** at the top of authenticated pages.
- **Footer** with four columns (Branding, Quick Links, Popular Services, Contact) pinned to the bottom using a flex layout.

---

## Architecture
