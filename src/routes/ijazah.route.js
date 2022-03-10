const express = require('express')
const router = express.Router()
const ijazahController = require('../controllers/ijazah.controller')
const jwt = require('../middlewares/jwt.middleware')

// change ijazah link -> on set to off, off set to on
router.post('/set-ijazah-link', jwt.authenticateUser, ijazahController.dummy)

// get ijazah by nik, check ijazah link
router.get('/ijazah/:nik', ijazahController.dummy)

// verify by id
router.get('/verify-by-id/:id', ijazahController.dummy)

// verify by content
router.post('/verify-by-content', ijazahController.dummy)

// create ijazah using csv file
router.post('/create-ijazah', jwt.authenticateInstitution, ijazahController.dummy)

// get all ijazah
router.get('/ijazah', jwt.authenticateAdmin, ijazahController.dummy)

// get ijazah by institution
router.get('/ijazah-institution', jwt.authenticateInstitution, ijazahController.dummy)