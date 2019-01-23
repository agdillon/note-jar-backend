const express = require('express')
const router = express.Router()

// GET all notes
router.get('/', (req, res, next) => {
  res.send('GET notes')
});

// GET one note
router.get('/:id', (req, res, next) => {
  res.send('GET a note')
})

// POST a new note
router.post('/', (req, res, next) => {
  res.send('POST a note')
})

// PATCH a note
router.patch('/:id', (req, res, next) => {
  res.send('PATCH a note')
})

// DELETE a note
router.delete('/:id', (req, res, next) => {
  res.send('DELETE a note')
})

module.exports = router
