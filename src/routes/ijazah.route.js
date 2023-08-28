const express = require('express')
const router = express.Router()
const ijazahController = require('../controllers/ijazah.controller')
const jwt = require('../middlewares/jwt.middleware')
const multer  = require('multer')
const os = require('os')
const upload = multer({dest: os.tmpdir()})

// change ijazah link -> on set to off, off set to on
router.post('/set-link', jwt.authenticateStudent, ijazahController.setIjazahLink)

// create ijazah using csv file
router.post('/create', jwt.authenticateInstitution, upload.single('file'), ijazahController.createIjazah)

// get ijazah by nik, check ijazah link
router.get('/:nik', ijazahController.getIjazahByUserCheckLink)

// verify by id
router.post('/verify-by-id', ijazahController.verifyIjazahById)

// verify by content
// not used
router.post('/verify-content', ijazahController.verifyIjazahContent)

// get all ijazah
router.get('/admin/all', jwt.authenticateAdmin, ijazahController.getAllIjazah)

// get ijazah by institution
router.get('/institution/all', jwt.authenticateInstitution, ijazahController.getIjazahByInstitution)

router.get('/student/all', jwt.authenticateStudent, ijazahController.getIjazahByUser)

module.exports = router