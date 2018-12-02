const Note = require('../models/note.model.js');

// Create and Save a new Note
exports.create = (req, res) => {
  // Validate the request
  if (!req.body.content || !req.body.title) {
    return res.status(400).send({
      message: "Note content and/or title can not be empty!"
    });
  }

  // Create a Note
  const note = new Note({
    title: req.body.title,
    content: req.body.content
  });

  // Save in the database
  note.save()
    .then(data => {
      res.send(data);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred."
      });
    });
};

// Retrieve and return all notes from the database.
exports.findAll = (req, res) => {
  Note.find()
    .then(notes => {
      res.send(notes);
    }).catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred."
      });
    });
};

// Find a single note with a noteId
exports.findOne = (req, res) => {

};

// Update a note identified by the noteId in the request
exports.update = (req, res) => {

};

// Delete a note with the specified noteId in the request
exports.delete = (req, res) => {

};