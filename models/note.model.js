const mongoose = require('mongoose');

// Our data model
const NoteSchema = mongoose.Schema({
    title: {type: String},
    content: {type: String}
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);