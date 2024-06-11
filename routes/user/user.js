const express  = require('express');
const { registerUser, loginUser, currentUser, resetPassword, forgotPassword, logoutUser, updateUser } = require('../../controllers/user/user');
const validateToken = require('../../middleware/validateTokenHandler');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', validateToken, currentUser);
router.get('/update', validateToken, updateUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/logout', logoutUser);

module.exports = router;