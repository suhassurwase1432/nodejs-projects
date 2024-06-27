const express = require('express');
const authController = require('./../controllers/authController');
const reviewController = require('./../controllers/reviewController');

const router = express.Router({ mergeParams : true });

router
.route('/')
.get(reviewController.getAllReviews)
.post(authController.validate, authController.permitTo('user'), reviewController.tourAndUserFields, reviewController.createReview);

router
.route('/:id')
.get(authController.validate , reviewController.getReview)
.patch(authController.validate, authController.permitTo('admin'), reviewController.updateReview)
.delete(authController.validate, authController.permitTo('admin'), reviewController.deleteReview)


module.exports = router;