const User = require('../models/User');

// Placeholder controller functions
// These will be implemented in subsequent tasks

const createUser = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile, gender, status, profile, location } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !mobile || !location) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, email, mobile, and location are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate mobile format (exactly 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        error: 'Mobile must be exactly 10 digits'
      });
    }

    // Validate gender if provided
    if (gender && !['Male', 'Female'].includes(gender)) {
      return res.status(400).json({
        success: false,
        error: 'Gender must be Male or Female'
      });
    }

    // Validate status if provided
    if (status && !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be Active or Inactive'
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Create new user
    const user = new User({
      firstName,
      lastName,
      email,
      mobile,
      gender,
      status,
      profile,
      location
    });

    // Save user to database
    const savedUser = await user.save();

    // Return created user
    res.status(201).json({
      success: true,
      data: savedUser
    });

  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // Handle duplicate key error (in case unique index catches it)
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Handle other server errors
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again.'
    });
  }
};

const getUsers = async (req, res) => {
  try {
    // Parse page and limit query parameters with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    // Fetch users from database with pagination
    const users = await User.find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first

    // Get total count of users for pagination metadata
    const totalCount = await User.countDocuments();

    // Calculate total pages
    const totalPages = Math.ceil(totalCount / limit);

    // Return users array with pagination metadata
    res.status(200).json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit
      }
    });

  } catch (error) {
    // Handle server errors
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again.'
    });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Find user by ID
    const user = await User.findById(id);

    // Return 404 if not found
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Return user object with all fields
    res.status(200).json({
      success: true,
      data: user
    });

  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Handle server errors
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again.'
    });
  }
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, mobile, gender, status, profile, location } = req.body;

    // Find user by ID first
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Validate required fields
    if (!firstName || !lastName || !email || !mobile || !location) {
      return res.status(400).json({
        success: false,
        error: 'First name, last name, email, mobile, and location are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate mobile format (exactly 10 digits)
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(mobile)) {
      return res.status(400).json({
        success: false,
        error: 'Mobile must be exactly 10 digits'
      });
    }

    // Validate gender if provided
    if (gender && !['Male', 'Female'].includes(gender)) {
      return res.status(400).json({
        success: false,
        error: 'Gender must be Male or Female'
      });
    }

    // Validate status if provided
    if (status && !['Active', 'Inactive'].includes(status)) {
      return res.status(400).json({
        success: false,
        error: 'Status must be Active or Inactive'
      });
    }

    // Check for duplicate email (if email is being changed)
    if (email.toLowerCase() !== user.email.toLowerCase()) {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(409).json({
          success: false,
          error: 'Email already exists'
        });
      }
    }

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        firstName,
        lastName,
        email,
        mobile,
        gender,
        status,
        profile,
        location
      },
      { new: true, runValidators: true }
    );

    // Return updated user
    res.status(200).json({
      success: true,
      data: updatedUser
    });

  } catch (error) {
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        error: error.message
      });
    }

    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        error: 'Email already exists'
      });
    }

    // Handle other server errors
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again.'
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete user by ID
    const user = await User.findByIdAndDelete(id);

    // Return 404 if not found
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Return success message
    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });

  } catch (error) {
    // Handle invalid ObjectId format
    if (error.name === 'CastError') {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    // Handle server errors
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again.'
    });
  }
};

const searchUsers = async (req, res) => {
  try {
    // Parse search query parameter and trim whitespace
    const searchTerm = (req.query.q || '').trim();

    // If no search term provided, return empty array
    if (!searchTerm) {
      return res.status(200).json({
        success: true,
        data: []
      });
    }

    // Fetch all users and filter in memory for full name matching
    const allUsers = await User.find().sort({ createdAt: -1 });

    // Filter users that match firstName, lastName, email, or full name
    const users = allUsers.filter(user => {
      const firstName = (user.firstName || '').toLowerCase();
      const lastName = (user.lastName || '').toLowerCase();
      const email = (user.email || '').toLowerCase();
      const fullName = `${firstName} ${lastName}`;
      const searchLower = searchTerm.toLowerCase();

      return firstName.includes(searchLower) ||
             lastName.includes(searchLower) ||
             email.includes(searchLower) ||
             fullName.includes(searchLower);
    });

    // Return matching users array
    res.status(200).json({
      success: true,
      data: users
    });

  } catch (error) {
    // Handle server errors
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again.'
    });
  }
};


const exportUsers = async (req, res) => {
  try {
    // Fetch all users from database
    const users = await User.find().sort({ createdAt: -1 });

    // Define CSV headers
    const headers = ['First Name', 'Last Name', 'Email', 'Mobile', 'Gender', 'Status', 'Location', 'Profile', 'Created At', 'Updated At'];
    
    // Convert to CSV format
    const csvRows = [];
    
    // Add header row
    csvRows.push(headers.join(','));
    
    // Add data rows
    for (const user of users) {
      const row = [
        user.firstName,
        user.lastName,
        user.email,
        user.mobile,
        user.gender,
        user.status,
        user.location,
        user.profile || '',
        user.createdAt ? user.createdAt.toISOString() : '',
        user.updatedAt ? user.updatedAt.toISOString() : ''
      ];
      
      // Escape fields that contain commas or quotes
      const escapedRow = row.map(field => {
        const fieldStr = String(field);
        if (fieldStr.includes(',') || fieldStr.includes('"') || fieldStr.includes('\n')) {
          return `"${fieldStr.replace(/"/g, '""')}"`;
        }
        return fieldStr;
      });
      
      csvRows.push(escapedRow.join(','));
    }
    
    const csvContent = csvRows.join('\n');
    
    // Set appropriate response headers for file download
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=users.csv');
    
    // Return CSV file
    res.status(200).send(csvContent);

  } catch (error) {
    // Handle server errors
    res.status(500).json({
      success: false,
      error: 'Server error. Please try again.'
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers,
  exportUsers
};
