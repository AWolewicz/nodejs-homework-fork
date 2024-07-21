const express = require('express')
const logger = require('morgan')
const cors = require('cors')
const jwtStrategy = require('./config/config-jwt')
const { register, login, logout, currentUser } = require('./controlers/auth');
const authMiddleware = require('./middleware/jwt');

require('dotenv').config();

const contactsRouter = require('./routes/api/contacts')

const app = express()

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short'

app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json())

jwtStrategy()

app.post('/users/signup', register);
app.post('/users/login', login);
app.get('/users/logout', authMiddleware, logout);
app.get('/users/current', authMiddleware, currentUser);

app.use('/api/contacts', contactsRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app