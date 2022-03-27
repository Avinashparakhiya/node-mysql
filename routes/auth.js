const express = require('express')
const router = express.Router();
const authController = require('../controller/auth')

router.post('/registration', authController.registration)
router.post('/login', authController.login)
router.get('/profile', authController.profile)
router.post('/update', authController.update)
router.get('/deleteProfile', authController.deleteProfile)
router.get('/logout', authController.logout)

module.exports = router;