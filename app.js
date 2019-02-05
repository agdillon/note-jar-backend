const express = require('express')
const path = require('path')
const logger = require('morgan')
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
app.use(express.static(path.join(__dirname, 'public')))

const authMiddleware = (req, res, next) => {
  // if route is POST /notes and friend code is present,
  // don't do the normal jwt checking
  // req.baseUrl or req.url or req.originalUrl?
  if (req.baseUrl === '/notes' && req.method === 'POST' && req.body.hasOwnProperty('code')) {
    next()
  }

  const header = req.header('Authorization')
  if (header) {
    const bearer = header.split(' ')
    const token = bearer[1]

    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
        // invalid JWT
        if (err) {
          return next(err)
        }
        // valid JWT
        req.decodedJwt = payload
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
