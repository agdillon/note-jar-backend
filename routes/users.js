const express = require('express')
const router = express.Router()
const knex = require('../knex')

// GET one user
router.get('/:id', (req, res, next) => {
  knex('users')
    .select('id', 'email', 'phone', 'code', 'daily_method', 'daily_time')
    .where('id', req.params.id)
    .first()
    .then(user => {
      if (!user) {
        next({ status: 404, message: 'User not found' })
      }
      res.json(user)
    })
    .catch(err => {
      next(err)
    })
})

// POST a new user
router.post('/', (req, res, next) => {
  let {
    email,
    password,
    phone,
    daily_method,
    daily_time
  } = req.body

  // hash pw - TODO
  const hashed_password = 'password'

  // remove anything that's not a digit from phone number and validate length
  phone = phone.replace(/\D/, '')
  if (phone.length !== 10) {
    next({ status: 400, message: 'Invalid phone number' })
  }

  // validate email
  if (!email.match(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    next({ status: 400, message: 'Invalid email' })
  }

  // validate daily_method
  const methods = ['email', 'SMS', 'push']
  if (!methods.includes(req.body.daily_method)) {
    next({ status: 400, message: 'Invalid daily method (must be email, SMS, or push)' })
  }

  // validate daily_time - TODO

  // generate friend code - TODO
  const code = phone.slice(0, 7)

  const newUser = {
    email,
    hashed_password,
    phone,
    code,
    daily_method,
    daily_time
  }

  knex('users')
    .where('email', newUser.email)
    .first()
    .then(user => {
      if (user) {
        next({ status: 400, message: 'Duplicate email' })
      }
    })
    .catch(err => {
      next(err)
    })

  knex('users')
    .insert(newUser)
    .returning(['id', 'email', 'phone', 'code', 'daily_method', 'daily_time'])
    .then(user => {
      res.json(user)
    })
    .catch(err => {
      next(err)
    })
})

// PATCH a user
router.patch('/:id', (req, res, next) => {
  res.send('PATCH a user')
})

// GET all notes for user
router.get('/:id/notes', (req, res, next) => {
  knex('notes')
    .leftJoin('note_tags', 'notes.id', 'note_id')
    .innerJoin('tags', 'tags.id', 'tag_id')
    .select(['author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id', knex.raw('ARRAY_AGG(tag_name) as tag_name')])
    .where('user_id', req.params.id)
    .groupBy('author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id')
    .then(notes => {
      res.json(notes)
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
