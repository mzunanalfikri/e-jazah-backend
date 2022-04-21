const express = require('express')
const router = express.Router()
const pdfController = require('../controllers/pdf.controller')
const multer  = require('multer')
const os = require('os')
const upload = multer({dest: os.tmpdir()})

router.get('/create-ijazah', pdfController.createIjazahPDF )
router.post('/verify', upload.single('file'), pdfController.verifyIjazah)

module.exports = router