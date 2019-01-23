const express = require('express')
const router = express.Router()

// GET one user
router.get('/:id', (req, res, next) => {
  res.send('GET a user')
})

// POST a new user
router.post('/', (req, res, next) => {
  res.send('POST a user')
})

// PATCH a user
router.patch('/:id', (req, res, next) => {
  res.send('PATCH a user')
})

module.exports = router
