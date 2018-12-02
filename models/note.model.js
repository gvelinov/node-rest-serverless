const mongoose = require('mongoose');

const NoteSchema = mongoose.Schema({
    title: {type: String, min: 5},
    content: {type: String, min: 10}
}, {
    timestamps: true
});

module.exports = mongoose.model('Note', NoteSchema);