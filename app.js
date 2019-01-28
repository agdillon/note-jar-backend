const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bcrypt = require('bcrypt')

const indexRouter = require('./routes/index')
const usersRouter = require('./routes/users')
const notesRouter = require('./routes/notes')
const authRouter = require('./routes/auth')

const app = express()
app.disable('x-powered-by')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/', indexRouter)
app.use('/users', usersRouter)
app.use('/notes', notesRouter)
app.use('/auth', authRouter)

app.use((error, req, res, next) => {
  const status = error.status || 500
  const message = error.message || 'Internal server error'
  res.status(status).json({ message })
})

module.exports = app
