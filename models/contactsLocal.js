const path = require('path');
const fs = require('fs').promises;
const { v4: uuidv4 } = require('uuid');

const contactsPath = path.join(__dirname, 'contacts.json');


const listContacts = async () => {
    try {
        const data = await fs.readFile(contactsPath);
        return JSON.parse(data);
    } catch (error) {
        console.log(error.message);
    }
};

const getContactById = async (contactId) => {
    try {
        const contacts = await listContacts();
        const contact = contacts.find(c => c.id === contactId);
        return contact || null;
    } catch (error) {
        console.log(error.message);
    }
};

const removeContact = async (contactId) => {
    try {
        const contacts = await listContacts();
        const updatedContacts = contacts.filter(c => c.id !== contactId);
        await fs.writeFile(contactsPath, JSON.stringify(updatedContacts, null, 2));
    } catch (error) {
        console.log(error.message);
    }
};

const addContact = async (name, email, phone) => {
    try {
        const contacts = await listContacts();
        const newContact = {
            id: uuidv4(),
            name,
            email,
            phone,
        };
        contacts.push(newContact);
        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return newContact
    } catch (error) {
        console.log(error.message);
    }
};

const updateContact = async (contactId, body) => {
    try {
        const contacts = await listContacts();
        const contactIndex = contacts.findIndex(c => c.id === contactId);

        if (contactIndex === -1) {
            console.log("Contact not exist")
        }

        const updatedContact = { ...contacts[contactIndex], ...body };
        contacts[contactIndex] = updatedContact;

        await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
        return updatedContact;
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = {
    listContacts,
    getContactById,
    removeContact,
    addContact,
    updateContact,
}
