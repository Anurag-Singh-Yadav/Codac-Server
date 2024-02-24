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

router.post('/manualLogin',manualLogin);

router.post('/authlogin', login);

router.get('/check-Login',auth, userDetails);
const  axios  = require('axios');
const { spawn } = require('child_process'); 
const fs = require('fs');

router.post('/authlogin', login); 



async function downloadFile(url, filePath) {
    try {

      const response = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(filePath, response.data);
      console.log(`Downloaded and saved file to ${filePath}`);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  }
  

router.post('/get-file-url', uploadMiddleWare , uploadFile , async(req,res) => {
  const s3Url = req.files[0].location;
  const inputFilePath = ".\\input-videos\\input."+ req.files[0].originalname.split('.').pop();
  // const inputFilePath = "./input-videos/input."+ req.files[0].originalname.split('.').pop();

  await downloadFile(s3Url, inputFilePath);
  try {
    const clamAVScan = await new Promise((resolve, reject) => {
      console.log("Initiating ClamAV scan...");
      const clamscan = spawn('clamscan', [inputFilePath]);

      let stdout = '';
      clamscan.stdout.on('data', (data) => {
        stdout += data;
      });

      clamscan.on('error', (error) => {
        console.error("Error executing ClamAV command:", error);
        reject(error);
      });

      clamscan.on('close', (code) => {
        resolve(stdout);
      });
    });

    console.log("ClamAV scan result:", clamAVScan);

    if (clamAVScan.includes("Infected files: 0")) {
      console.log("File is clean");
      return res.status(200).json({
        clamAVScan,
        success: true, 
        message: 'File is clean.', 
      })
    }
    return res.status(200).json({
      clamAVScan,
      success: false, 
      message: 'Image was successfully uploaded', 
    })

  } catch (error) {
    console.error("Error during ClamAV scan:", error);
    return res.status(500).json({
      error: "Error during ClamAV scan",
    });
  }
});




module.exports = router;

 
