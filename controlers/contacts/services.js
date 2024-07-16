const Contact = require('../../models/Contact');

const fetchContacts = () => {
    return Contact.find();
};

const fetchContactById = (contactId) => {
    return Contact.findOne({
        contactId: contactId,
    })
};

const insertContact = (name, email, phone, favorite) => {
    return Contact.create({
        name,
        email,
        phone,
        favorite,
    })
}

const updateStatusContact = async ({ contactId, toUpdate, upsert = false }) => {
    return Contact.findByIdAndUpdate(
        contactId,
        { $set: toUpdate },
        { new: true, upsert });
};

const deleteContact = (contactId) => {
    return Contact.deleteOne({
        contactId: contactId,
    })
}

module.exports = {
    fetchContacts,
    fetchContactById,
    insertContact,
    updateStatusContact,
    deleteContact
}