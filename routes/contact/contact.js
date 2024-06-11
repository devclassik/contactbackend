const express = require('express');
const router = express.Router();
const { getContacts, getOneContact, createContact, updateContact, deleteContact } = require('../../controllers/contact/contact');
const validateToken = require('../../middleware/validateTokenHandler');

router.use(validateToken);

router.route('/').get(getContacts).post(createContact);

router.route('/:id').get(getOneContact).put(updateContact).delete(deleteContact);

// router.route('/').post(createContact);

// router.route('/:id').put(updateContact);

// router.route('/:id').delete(deleteContact);

module.exports = router;