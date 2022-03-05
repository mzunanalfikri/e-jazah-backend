const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const jwt = require('../middlewares/jwt.middleware')

router.get('/login', userController.login)

router.get('/admin', jwt.authenticateStudent, userController.testing)

module.exports = router