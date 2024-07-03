const express = require('express');
const Joi = require('joi');
const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../models/contacts');

const router = express.Router()

const contactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).max(9).required()
});

router.get('/', async (req, res, next) => {
  try {
    const contacts = await listContacts();
    res.json({
      status: 200,
      data: { contacts }
    });
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

router.get('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    const contact = await getContactById(contactId);
    if (contact) {
      res.json({
        status: 200,
        data: { contact }
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Not found"
      });
    };
  } catch (error) {
    console.log(error.message);
    next(error);
  }
});

router.post('/', async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    });
  } else {
    try {
      const newContact = await addContact(req.body);
      res.status(201).json({
        status: 201,
        data: { newContact }
      });
    } catch (error) {
      console.log(error.message);
      next(error);
    };
  };
});

router.delete('/:contactId', async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    await removeContact(contactId)
    if (contactId) {
      res.json({
        status: 200,
        message: "Contact deleted"
      });
    } else {
      res.status(404).json({
        status: 404,
        message: "Not found"
      });
    };
  } catch (error) {
    console.log(error.message);
    next(error);
  };
});

router.put('/:contactId', async (req, res, next) => {
  const { error } = contactSchema.validate(req.body);
  if (error) {
    res.status(400).json({
      status: 400,
      message: error.message
    });
  } else {
    try {
      const contactId = req.params.contactId;
      const upContact = await updateContact(contactId, req.body);
      if (upContact) {
        res.status(200).json({
          status: 200,
          data: { upContact }
        });
      } else {
        res.status(404).json({
          status: 404,
          message: "Not found"
        })
      };
    } catch (error) {
      console.log(error.message);
      next(error);
    };
  };
});

module.exports = router
