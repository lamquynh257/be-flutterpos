const express = require('express');
const router = express.Router();
const storeSettingsController = require('../controllers/storeSettingsController');
const { authMiddleware, adminOnly } = require('../middleware/auth');

console.log('📦 Loading store settings routes...');

// All store settings routes require authentication and admin role
router.use(authMiddleware);
router.use(adminOnly);

// GET /api/store-settings - Get store settings
router.get('/', (req, res, next) => {
    console.log('📥 GET /api/store-settings called');
    next();
}, storeSettingsController.get);

// PUT /api/store-settings - Update store settings
router.put('/', (req, res, next) => {
    console.log('📝 PUT /api/store-settings called');
    next();
}, storeSettingsController.update);

console.log('✅ Store settings routes loaded');

module.exports = router;

