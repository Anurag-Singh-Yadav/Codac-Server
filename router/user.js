const express = require('express');
const router = express.Router();
// constroller 
const { login } = require('../controllers/autoAuth');

router.post('/authlogin', login);   

module.exports = router;

