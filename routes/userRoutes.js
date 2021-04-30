const express = require('express')
const userController = require('./../controller/userController')
const authController = require('./../controller/authController')
const userRoutes = express.Router()

userRoutes.post('/signup', authController.signup)
userRoutes.post('/login', authController.login)
userRoutes.post('/forgotPassword', authController.forgotPassword)
userRoutes.patch('/resetPassword/?token', authController.resetPassword)

userRoutes.use(authController.protect)

userRoutes.get('/me', userController.getMe, userController.getUser)
userRoutes.patch('/updateMyPassword', authController.updatePassword)
userRoutes.patch('/updateMe', userController.updateMe)
userRoutes.delete('/deleteMe', userController.deleteMe)

userRoutes.use(authController.restrictTo('admin'))

userRoutes.route('/')
.get(userController.getAllUsers)
.post(userController.createUser)

userRoutes.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser)

module.exports = userRoutes