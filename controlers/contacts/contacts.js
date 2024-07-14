const { fetchContacts, fetchContactById, insertContact, updateStatusContact, deleteContact } = require('./services');
const Joi = require('joi');

const contactSchema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    phone: Joi.string().min(9).max(30).required()
});

const getContacts = async (req, res) => {
    try {
        const contacts = await fetchContacts();
        res.json({
            status: 200,
            data: { contacts }
        });
    } catch (error) {
        console.log(error.message);
        next(error);
    }
};

const getContactById = async (req, res, next) => {
    try {
        const contact = await fetchContactById(req.params.contactId);
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
};

const addContact = async (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    } else {
        try {
            const { name, email, phone, favorite } = req.body;
            const newContact = await insertContact(name, email, phone, favorite);
            res.status(201).json({
                status: 201,
                data: { newContact }
            });
        } catch (error) {
            console.log(error.message);
            next(error);
        };
    };
};
//------------------------NOT DONE-------------------------------------------------------
const removeContact = async (req, res, next) => {
  try {
    const contactId = req.params.contactId;
    await deleteContact(contactId)
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
};
//---------------------------------DONE----------------------------------------------
const updateContact = async (req, res, next) => {
    const { error } = contactSchema.validate(req.body);
    if (error) {
        res.status(400).json({
            status: 400,
            message: error.message
        });
    } else {
        try {
            const contactId = req.params.contactId;
            const upContact = await updateStatusContact({
                contactId,
                toUpdate: req.body,
                upsert: true,
            });
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
};

const favoriteContact = async (req, res, next) => {
    const contactId = req.params.contactId;
    if (!req.body) {
        res.status(400).json({
            status: 400,
            message: "Missing field favorite"
        });
    } else {
        try {
            const result = await updateStatusContact({
                contactId,
                toUpdate: req.body,
            });
            if (result) {
                res.status(200).json({
                    status: 200,
                    data: { result },
                })
            } else {
                res.status(404).json({
                    status: 404,
                    message: "Not found",
                })
            }
        } catch (error) {
            console.log(error.message);
            next(error);
        }
    }
};

module.exports = {
    getContacts,
    getContactById,
    addContact,
    removeContact,
    updateContact,
    favoriteContact,
}
