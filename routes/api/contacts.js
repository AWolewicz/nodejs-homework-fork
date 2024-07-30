const express = require('express');
const { getContacts, getContactById, addContact, removeContact, updateContact, favoriteContact } = require('../../controlers/contacts/contacts');
const authMiddleware = require('../../middleware/jwt');

const router = express.Router()

router.get('/', authMiddleware, getContacts);
router.get('/:contactId', authMiddleware, getContactById);
router.post('/', authMiddleware, addContact);
router.delete('/:contactId', authMiddleware, removeContact);
router.put('/:contactId', authMiddleware, updateContact);
router.patch('/contacts/:contactId/favorite', authMiddleware, favoriteContact);



module.exports = router
