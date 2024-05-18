const express  = require('express');
const { sendMailer } = require('../../controllers/mailer/mail');

const router = express.Router();

router.post('/', sendMailer);

// router.post('/login', loginUser);

// router.get('/current', validateToken, currentUser);

module.exports = router;