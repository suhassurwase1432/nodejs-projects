const express = require('express');
const tourController = require('./../controllers/tourController');
const authController = require('./../controllers/authController');
const reviewRouter = require('./reviewRoutes');
const router = express.Router();

// router.param('id' , tourController.checkId);  // this middleware is used to manupilate url params.

router.param('id' , (req,res,next,val)=>{
    console.log(`Tour id is ${val}`);
    next();  
});

//this is the duplicate code also available in reviewRoutes.js
// router.route('/:tourId/reviews').post(authController.validate , authController.permitTo('user'), reviewController.createReview);

router.use('/:tourId/reviews' , reviewRouter);

router
.route('/top-5-tours')
.get(authController.validate ,tourController.bestTour, tourController.getAllTours);

router.route('/tour-stats').get(authController.validate ,tourController.getTourStats);

router.route('/monthly-plan/:year?').get(authController.validate ,tourController.getMonthlyPlan);

router
.route('/')
.get(tourController.getAllTours)
.post(authController.validate, authController.permitTo('admin' , 'lead-guide'), tourController.createTour);

router
.route('/:id')
.get(tourController.getTour)
.patch(authController.validate, authController.permitTo('admin' , 'lead-guide'),tourController.updateTour)
.delete(authController.validate, authController.permitTo('admin' , 'lead-guide'), tourController.deleteTour);

module.exports = router;