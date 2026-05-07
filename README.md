# EduCast — Content Broadcasting System

A production-grade, role-based frontend web application designed for educational institutions to manage and broadcast visual content (images) to public displays. Built as a technical assignment showcasing modern React architecture, state management, and UI design.

![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![React Query](https://img.shields.io/badge/-React%20Query-FF4154?style=for-the-badge&logo=react%20query&logoColor=white)

---

## 📖 Overview

EduCast enables a complete approval workflow for educational broadcasting. Teachers upload content with scheduled air-times, Principals review and approve the submissions, and a publicly accessible Live Page automatically polls and displays the approved content during its scheduled window.

### 🎭 User Roles

1. **Teacher:** Uploads content, sets start/end times, and tracks approval status via their dashboard.
2. **Principal:** Views all institution-wide content, manages pending approvals, and can reject content with mandatory feedback.
3. **Public (Student View):** Views the `/live` broadcast page without authentication. Automatically refreshes every 10 seconds to reflect newly approved content.

---

## 🚀 Features

* **Role-Based Access Control (RBAC):** Secure routing isolating Teacher and Principal views.
* **Cross-Tab Synchronization:** Approvals made in one tab instantly reflect on the public live page in another tab via `localStorage` events.
* **Simulated Network Latency:** Mock services use artificial delays to demonstrate loading states and skeletons realistically.
* **Advanced State Management:** 
  * `sessionStorage` for tab-isolated authentication (allowing simultaneous multi-role testing).
  * `TanStack Query` for caching, background refetching, and pagination.
* **Premium UI/UX:** Built with Tailwind CSS v4 featuring "Nebula Dark" glassmorphism, micro-animations, and responsive layouts.
* **Robust Error Handling:** Global Error Boundary, form validation (Zod), and graceful fallback states for empty/error data.

---

## 🛠️ Tech Stack

* **Core:** React 19, Vite 8, JavaScript (ES2022+)
* **Routing:** React Router DOM v7
* **State Management:** TanStack Query v5 (Server state), Context API (Auth state)
* **Styling:** Tailwind CSS v4, Lucide React (Icons)
* **Forms & Validation:** React Hook Form v7, Zod v4
* **HTTP Client:** Axios v1 (Configured with interceptors, currently connected to mock services)

---

## ⚙️ Local Development Setup

### Prerequisites
* Node.js (v18 or higher recommended)
* npm or yarn

### Installation Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Manir06/Content-Broadcasting-System_GrubPac.git
   cd Content-Broadcasting-System_GrubPac
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open the application**
   Navigate to `http://localhost:5173` in your browser.

---

## 🧪 Demo Credentials

The application uses an in-memory mock database seeded with sample data. You can log in using the following test accounts:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Teacher** | `teacher@example.com` | `password123` |
| **Principal** | `principal@example.com` | `password123` |

*Note: The login page includes quick-fill chips for these credentials.*

---

## 🏗️ Architecture Highlights

This project was built with strict adherence to separation of concerns and scalability:

* **Service Layer Pattern:** Components **never** call APIs directly. All data access is routed through `src/services/`, meaning the mock data layer can be replaced with a real backend by editing just 3 files, without touching a single React component.
* **Barrel Exports:** Clean imports across the app (e.g., `import { ErrorBoundary, PageLoader } from '@/components/common'`).
* **Debounced Inputs:** Search bars utilize custom `useDebounce` hooks to prevent excessive re-renders and query executions.
* **Tab-Isolated Auth:** Authentication uses `sessionStorage` instead of `localStorage`. This intentionally allows you to log in as a Teacher in Tab A, and a Principal in Tab B simultaneously without the sessions overriding each other.

---

## 📂 Project Structure

```text
src/
├── api/             # Axios instance and interceptors
├── components/      # Reusable UI (common, content, dashboard, forms)
├── context/         # React Context (AuthContext)
├── hooks/           # Custom React hooks (useAuth, useDebounce)
├── layouts/         # Shell layouts (AuthLayout, DashboardLayout)
├── mock/            # Initial seed data for the simulated database
├── pages/           # Role-segregated views (teacher, principal, public)
├── routes/          # Route guards (ProtectedRoute, RoleRoute)
├── services/        # Business logic and mock API calls
└── utils/           # Helper functions, formatters, and constants
```

For a deep dive into the architectural decisions, state management strategy, and assumptions made during development, please refer to the `Frontend-notes.txt` file included in the repository.

---

## 📝 Future Backend Integration

The frontend is fully pre-configured to accept a real backend:
1. Set the `VITE_API_URL` environment variable.
2. Open `src/services/*.service.js`.
3. Replace the `mockStore` returns with `apiClient.get/post/put/delete` calls.
4. Axios interceptors will automatically handle attaching the Bearer token and intercepting 401 Unauthorized responses.
