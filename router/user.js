const express = require('express');
const router = express.Router();
// constroller 
const { login } = require('../controllers/autoAuth');
const { uploadMiddleWare } = require('../middleware/upload');
const {uploadFile} = require('../controllers/upload');
router.post('/authlogin', login); 

router.post('/get-file-url',uploadMiddleWare  , uploadFile , (req,res) => {
    return res.status(200).json({
        location: req.files[0].location,
        success: true,
        message: 'Image was successfully uploaded',
    })
})

module.exports = router;

