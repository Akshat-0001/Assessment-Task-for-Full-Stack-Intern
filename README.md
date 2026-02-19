# User Management System

Simple MERN stack app to manage users with CRUD operations, search, pagination, and CSV export.

## Tech Stack

* Backend: Node.js, Express, MongoDB (Mongoose)
* Frontend: React (Vite), React Router

## Setup

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## API Routes

* POST /api/users
* GET /api/users
* GET /api/users/:id
* PUT /api/users/:id
* DELETE /api/users/:id
* GET /api/users/search?q=
* GET /api/users/export
