const express = require('express')
const router = express.Router()
const knex = require('../knex')

// GET one note
router.get('/:id', (req, res, next) => {
  if (!parseInt(req.params.id)) {
    return next({ status: 400, message: 'Incorrect note ID' })
  }

  knex('notes')
    .leftJoin('note_tags', 'notes.id', 'note_id')
    .innerJoin('tags', 'tags.id', 'tag_id')
    .select(['author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id', knex.raw('ARRAY_AGG(tag_name) as tag_name')])
    .where('note_id', req.params.id)
    .groupBy('author', 'content', 'notes.created_at', 'note_id', 'type', 'user_id')
    .first()
    .then(note => {
      if (!note) {
        next({ status: 404, message: 'Note not found' })
      }
      res.json(note)
    })
    .catch(err => {
      next(err)
    })
})

// POST a new note
router.post('/', (req, res, next) => {
  function insertNoteinDB(noteData, tagsData) {
    knex('notes')
      .insert(noteData)
      .returning(['id', 'user_id', 'author', 'content', 'type', 'created_at'])
      .then(note => {
        // get all tag names with their ids from db
        knex('tags')
          .then(allTags => {
            // loop over tags you want to insert
            tagsData.forEach((tag, i) => {
              // get id for the tag
              const tag_id = allTags.find(el => el.tag_name === tag).id
              // insert association in join table
              knex('note_tags')
                .insert({ note_id: note[0].id, tag_id })
                .then(() => {
                  // finally return your response, only if you're at the end of the array
                  if (i === tagsData.length - 1) {
                    res.json(note[0])
                  }
                })
                .catch(err => {
                  next(err)
                })
            })
          })
          .catch(err => {
            next(err)
          })
      })
      .catch(err => {
        next(err)
      })
  }

  let {
    user_id,
    code,
    author,
    content,
    type,
    tags
  } = req.body

  if (author) {
    if (author.length > 255) {
      return next({ status: 400, message: 'Author name too long' })
    }
  }

  if (tags) {
    // only allowing already existing tags for now
    const tagTypes = ['compliment', 'encouragement', 'gratitude', 'action', 'memory', 'humor']
    tags.forEach(tag => {
      if (!tagTypes.includes(tag)) {
        return next({ status: 400, message: 'Invalid tag' })
      }
    })
  }

  // validate type
  const types = ['text', 'image']
  if (!types.includes(type)) {
    return next({ status: 400, message: 'Invalid type (must be text or image)' })
  }

  // validate content

  if (user_id) {
    // validate user exists
    knex('users')
      .where('id', user_id)
      .first()
      .then(user => {
        if (!user) {
          return next({ status: 404, message: 'User not found' })
        }

        let note = {
          user_id,
          content,
          type
        }

        if (author) note.author = author

        insertNoteinDB(note, tags)
      })
      .catch(err => {
        next(err)
      })
  }
  // if you're not given a user_id, you need a friend code
  else if (!code) next({ status: 400, message: 'User ID or friend code are required' })
  else {
    // look up user id by friend code
    knex('users')
      .where('code', code)
      .first()
      .then(user => {
        if (!user) {
          return next({ status: 404, message: 'User not found' })
        }

        let user_id = user.id

        let note = {
          user_id,
          content,
          type
        }

        if (author) note.author = author

        insertNoteinDB(note, tags)
      })
      .catch(err => {
        next(err)
      })
  }
})

// PATCH a note
router.patch('/:id', (req, res, next) => {
  if (!parseInt(req.params.id)) {
    return next({ status: 400, message: 'Incorrect note ID' })
  }
  // TODO
  res.send('PATCH a note')
})

// DELETE a note
router.delete('/:id', (req, res, next) => {
  if (!parseInt(req.params.id)) {
    return next({ status: 400, message: 'Incorrect note ID' })
  }

  knex('notes')
    .delete()
    .where('id', req.params.id)
    .then(() => {
      res.status(204).send()
    })
    .catch(err => {
      next(err)
    })
})

module.exports = router
