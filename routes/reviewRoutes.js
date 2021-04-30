const express = require('express')
const reviewController = require('../controller/reviewController')
const authController = require('./../controller/authController')
const reviewRoutes = express.Router({ mergeParams: true })

reviewRoutes.use(authController.protect)

reviewRoutes.route('/')
.get(reviewController.getAllReviews)
.post(authController.restrictTo('user'), reviewController.setUserId,
reviewController.createReview)

reviewRoutes.route('/:id')
.get(reviewController.getReview)
.patch(authController.restrictTo('admin', 'user'), reviewController.updateReview)
.delete(authController.restrictTo('admin', 'user'), reviewController.deleteReview)

module.exports = reviewRoutes