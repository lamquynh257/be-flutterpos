const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

// All admin routes require authentication and admin role
router.use(authMiddleware, adminOnly);

// Clear all data (except users, floors, tables, categories, dishes)
router.delete('/clear-data', adminController.clearData);

module.exports = router;

