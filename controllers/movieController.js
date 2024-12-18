const { validationResult } = require('express-validator');
const Movie = require('../models/movie');

const getMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const movie = await Movie.findById({ _id: id, user: req.user.id });

    if (!movie) {
      return res
        .status(404)
        .json({ success: false, message: 'Movie not found or access denied' });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie fetched successfully',
      data: movie,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch movie' });
  }
};

const fetchMovies = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 10;

    const filter = { user: req.user.id };

    const movies = await Movie.find(filter)
      .populate('user', 'name email')
      .skip((page - 1) * limit)
      .limit(limit);

    const moviesCount = await Movie.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: 'Movie fetched successfully',
      data: movies,
      pagination: {
        page,
        totalPages: Math.ceil(moviesCount / limit),
        moviesCount,
      },
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to fetch movies' });
  }
};

const addMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, publishYear } = req.body;

    if (!title || !publishYear) {
      return res.status(400).json({
        success: false,
        message: 'Title and Published Year are required',
      });
    }

    const posterUrl = req.file ? req.file.path : undefined;
    if (!posterUrl) {
      return res.status(400).json({
        success: false,
        message: 'Poster image upload failed',
      });
    }

    const newMovie = new Movie({
      title,
      publishYear,
      poster: posterUrl,
      user: req.user.id,
    });

    const savedMovie = await newMovie.save();

    return res.status(201).json({
      success: true,
      message: 'Movie created successfully',
      data: savedMovie,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to add movie', error });
  }
};

const editMovie = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { id } = req.params;
    const { title, publishYear, poster } = req.body;

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      { title, publishYear, poster },
      { new: true, runValidators: true }
    );

    if (!updatedMovie) {
      return res
        .status(404)
        .json({ success: false, message: 'Movie not found' });
    }

    return res.status(200).json({
      success: true,
      message: 'Movie updated successfully',
      data: updatedMovie,
    });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, message: 'Failed to update movie' });
  }
};

const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMovie = await Movie.findByIdAndDelete(id);

    if (!deletedMovie) {
      return res.status(404).json({
        success: false,
        message: 'Movie not found',
      });
    }

    return res
      .status(200)
      .json({ success: true, message: 'Movie deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete movie',
    });
  }
};

module.exports = { getMovie, fetchMovies, addMovie, editMovie, deleteMovie };
