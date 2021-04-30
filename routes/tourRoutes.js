const express = require('express')
const tourController = require('./../controller/tourController')
const authController = require('./../controller/authController')
const reviewController = require('./../controller/reviewController')
const reviewRoutes = require('./../routes/reviewRoutes')
const tourRoutes = express.Router()
// tourRoutes.param('id', tourController.checkId)

tourRoutes.use('/:tourId/review', reviewRoutes)

tourRoutes.route('/top-5-cheap')
.get(tourController.aliasTopTours ,tourController.getAllTours)

tourRoutes.route('/tour-stats')
.get(tourController.getTourStats);

tourRoutes.route('/monthly-plan/:year')
.get(authController.protect, authController
.restrictTo('admin','guid', 'lead-guid'),
tourController.getMonthlyPlan)

tourRoutes.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin)
tourRoutes.route('/distance/:latlng/unit/:unit').get(tourController.getDistances)

tourRoutes.route('/')
.get(tourController.getAllTours)
.post(authController.protect, authController.restrictTo('admin', 'lead-guid'),
tourController.createTour)

tourRoutes.route('/:id')
.get(tourController.getTour)
.patch(tourController.updateTour)
.delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour
);

module.exports = tourRoutes