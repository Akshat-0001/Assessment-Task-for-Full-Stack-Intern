# User Management System

A simple MERN stack application for managing users with CRUD operations, search, pagination, and CSV export.

## Project Structure

```
.
├── backend/
│   ├── models/          # Mongoose schemas
│   │   └── User.js
│   ├── routes/          # API endpoints
│   │   └── userRoutes.js
│   ├── controllers/     # Business logic
│   │   └── userController.js
│   ├── server.js        # Express server setup
│   ├── package.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── pages/       # Main screens
    │   │   ├── ListPage.jsx
    │   │   ├── FormPage.jsx
    │   │   └── DetailsPage.jsx
    │   ├── components/  # Reusable components
    │   │   ├── UserTable.jsx
    │   │   ├── SearchBar.jsx
    │   │   └── Pagination.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── index.html
    ├── vite.config.js
    └── package.json
```

## Tech Stack

- **Backend**: Express.js, MongoDB (Mongoose), CORS
- **Frontend**: React (Vite), React Router
- **Database**: MongoDB

## Setup Instructions

### Backend Setup

1. Navigate to backend folder:
   ```bash
   cd backend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Create `.env` file from `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Update MongoDB connection string in `.env` if needed

5. Start the server:
   ```bash
   npm run dev
   ```

Backend will run on http://localhost:5000

### Frontend Setup

1. Navigate to frontend folder:
   ```bash
   cd frontend
   ```

2. Install dependencies (already done):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

Frontend will run on http://localhost:3000

## API Endpoints

- `POST /api/users` - Create new user
- `GET /api/users?page=1&limit=10` - Get users with pagination
- `GET /api/users/:id` - Get single user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user
- `GET /api/users/search?q=term` - Search users
- `GET /api/users/export` - Export users to CSV

## Next Steps

The project structure is set up. The following tasks will implement:
- Backend API endpoints and controllers
- Frontend pages and components
- User interface and styling
- Form validation
- Search and pagination functionality
- CSV export feature
