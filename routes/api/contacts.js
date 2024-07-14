const express = require('express');
const { getContacts, getContactById, addContact, removeContact, updateContact, favoriteContact } = require('../../controlers/contacts/contacts');

const router = express.Router()

router.get('/', getContacts);
router.get('/:contactId', getContactById);
router.post('/', addContact);
router.delete('/:contactId', removeContact);
router.put('/:contactId', updateContact);
router.patch('/contacts/:contactId/favorite', favoriteContact);

module.exports = router
