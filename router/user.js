const express = require('express');
const router = express.Router();
// constroller 
const { login } = require('../controllers/autoAuth');
const uploadMiddleWare = require('../middleware/upload');
const { uploadFile } = require('../controllers/upload');
const { auth } = require('../middleware/auth');
const {userDetails} = require('../controllers/userDetails');
const {createUser, manualLogin} = require('../controllers/manualLogin');

router.post('/create-user',createUser);

router.post('manualLogin',manualLogin);

router.post('/authlogin', login);

router.get('/check-Login',auth, userDetails);

router.post('/get-file-url', uploadMiddleWare , uploadFile , (req,res) => {
    return res.status(200).json({
        location: req.files[0].location,
        success: true, 
        message: 'Image was successfully uploaded',
    })
});

module.exports = router;

 
