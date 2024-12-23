const mongoose = require('mongoose');
require('dotenv').config();

const movieSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title'],
    },
    publishYear: {
      type: Number,
    },
    poster: {
      type: String,
      default: process.env.DEFAULT_POSTER_URL,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

movieSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;
