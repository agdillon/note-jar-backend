const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

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

const authMiddleware = (req, res, next) => {
  const header = req.header('Authorization')
  if (header) {
    const bearer = header.split(' ')
    const token = bearer[1]

    req.token = token
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        // invalid JWT
        if (err) {
          return next({ status: 401, message: 'Unauthorized' })
        }
        // valid JWT
        next()
      })
    }
  }
  else {
    next({ status: 401, message: 'Unauthorized' })
  }
}

app.use('/users', authMiddleware)
app.use('/notes', authMiddleware)

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
