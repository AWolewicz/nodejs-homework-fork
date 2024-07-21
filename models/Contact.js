const mongoose = require('mongoose');
const Shema = mongoose.Schema;

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Set name for contact'],
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    favorite: {
        type: Boolean,
        default: false,
    },
    owner: {
        type: Shema.Types.ObjectId,
        ref: 'user',
    },
});

const Contact = mongoose.model('contact', contactSchema, 'contacts');

module.exports = Contact;