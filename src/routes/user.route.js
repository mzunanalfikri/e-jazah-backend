const express = require('express')
const router = express.Router()
const userController = require('../controllers/user.controller')
const jwt = require('../middlewares/jwt.middleware')
const multer  = require('multer')
const os = require('os')
const upload = multer({dest: os.tmpdir()})

router.post('/login', userController.login)

// accept csv file
router.post('/register-institution', jwt.authenticateAdmin, upload.single('file'), userController.registerInstitution)

// accept csv file
router.post('/register-student', jwt.authenticateInstitution,upload.single('file') ,userController.registerStudent)

// return user profile
router.get('/profile',jwt.authenticateUser, userController.getUserProfile)

// change user password
router.post('/change-password', jwt.authenticateUser, userController.changePassword)


module.exports = router