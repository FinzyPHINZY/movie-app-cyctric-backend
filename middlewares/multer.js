const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'movies',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    const allowedFormats = ['jpg', 'jpeg', 'png', 'webp'];
    const fileExtension = file.mimetype.split('/')[1];

    if (allowedFormats.includes(fileExtension)) {
      cb(null, true);
    } else {
      cb(
        new Error(
          `Unsupported file format: ${fileExtension}. Allowed formats are ${allowedFormats.join(', ')}`
        )
      );
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
