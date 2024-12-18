const express = require('express');
const { tokenExtractor, userExtractor } = require('../middlewares/auth');
const router = express.Router();
const upload = require('../middlewares/multer');
const {
  getMovie,
  fetchMovies,
  addMovie,
  editMovie,
  deleteMovie,
} = require('../controllers/movieController');
const { validateMovie } = require('../middlewares/validators');

router.use(tokenExtractor);
router.use(userExtractor);

// Route:   GET /api/movies
// Desc:    List all movies with pagination
router.get('/', fetchMovies);

// Route:   GET /api/movies/:id
// Desc:    Find a movie
router.get('/:id', getMovie);

// Route:   POST /api/movies
// Desc:    Add a new movie
router.post('/addMovie', upload.single('poster'), validateMovie, addMovie);

// Route;   PUT /api/movies/:id
// Desc:    Edit a movie
router.put('/:id', validateMovie, editMovie);

// Route:   DELETE /api/movies/:id
// Desc:    Delete a movie
router.delete('/:id', deleteMovie);

module.exports = router;
