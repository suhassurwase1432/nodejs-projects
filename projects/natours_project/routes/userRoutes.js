const express = require('express');
const userController = require('./../controllers/userController');
const authController = require('./../controllers/authController');

const router = express.Router();

router.post('/signup' , authController.signup);
router.post('/login' , authController.login);
router.post('/forgotPassword' , authController.forgotPassword);
router.patch('/resetPassword/:token' , authController.resetPassword);
router.patch('/updatePassword' , authController.validate , authController.updatePassword);

router.patch('/updateMe' , authController.validate , userController.updateMe);
router.delete('/deleteMe' , authController.validate , userController.deleteMe);
router.get('/me' , authController.validate , userController.getMyId , userController.getUser);

router.use(authController.validate , authController.permitTo('admin'));

router
.route('/')
.get(userController.getAllUsers)
.post(userController.createUser);

router
.route('/:id')
.get(userController.getUser)
.patch(userController.updateUser)
.delete(userController.deleteUser);

module.exports = router;