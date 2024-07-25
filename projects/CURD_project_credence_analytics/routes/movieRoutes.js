const express = require('express');
const movieController = require('../controllers/movieController');
const upload = require('./../fileUpload');

const router = express.Router();

router.route('/')
.get(movieController.getMovies)
.post(movieController.createMovie);

router.route('/:id')
.get(movieController.getMovie)
.patch(movieController.updateMovie)
.delete(movieController.deleteMovie);

router.post('/upload' , upload.single("image"), (req ,res) => {
    res.status(200).json({
      status : "success",
        message: 'File uploaded successfully'
      });
});

router.route('/images').get(movieController.getImages);
router.route('/images/:filename').get(movieController.getImage);

module.exports = router;