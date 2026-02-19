const express = require('express');
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  exportUsers
} = require('../controllers/userController');

// Routes will be implemented in subsequent tasks
// POST /api/users - create user
router.post('/', createUser);

// GET /api/users - get all users with pagination
router.get('/', getUsers);

// GET /api/users/search - search users
router.get('/search', searchUsers);

// GET /api/users/export - export to CSV
router.get('/export', exportUsers);

// GET /api/users/:id - get single user
router.get('/:id', getUserById);

// PUT /api/users/:id - update user
router.put('/:id', updateUser);

// DELETE /api/users/:id - delete user
router.delete('/:id', deleteUser);

module.exports = router;
