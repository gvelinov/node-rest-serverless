module.exports = (app) => {
  const home = require('./controllers/home.controller.js');
  const notes = require('./controllers/note.controller.js');

  // Default route
  app.route('/').get(home.index);

  // Create and Retrieve
  app.route('/notes')
    .post(notes.create)
    .get(notes.findAll);

  // Note specific actions
  app.route('/notes/:noteId')
    .get(notes.findOne)
    .put(notes.update)
    .delete(notes.delete)

}