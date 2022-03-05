const express = require('express');
const router = express.Router();
const controller = require('../controllers/testing.controller')


router.get('/', controller.testingGet)

router.get('/user/:id', controller.getUserById)

module.exports = router