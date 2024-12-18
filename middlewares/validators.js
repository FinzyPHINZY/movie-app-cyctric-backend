const { body } = require('express-validator');

const validateMovie = [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isString()
    .withMessage('Title must be a string'),

  body('publishYear')
    .optional()
    .isInt({ min: 1888 }) // 1888 is the year the first movie was made
    .withMessage('Publish year must be a valid number'),

  body('poster').optional().isURL().withMessage('Poster must be a valid URL'),
];

module.exports = { validateMovie };
