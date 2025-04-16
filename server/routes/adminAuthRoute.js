const express = require('express');
const {
    loginAdmin,
    forgotPassword,
    verify2FA,
} = require('../controllers/adminAuthController.js');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/forgot-password', forgotPassword);
router.post('/2fa', verify2FA);

module.exports = router;
