const express = require('express');
const router = express.Router();
// constroller 
const { login } = require('../controllers/autoAuth');
const uploadMiddleWare = require('../middleware/upload');
const { uploadFile } = require('../controllers/upload');
const  axios  = require('axios');
const { exec } = require('child_process'); 
const fs = require('fs');

// Add this line
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
    const inputFilePath = `.\\input-videos\\input.${req.files[0].originalname.split('.').pop()}`;
    await downloadFile(s3Url, inputFilePath);
  try {
    const clamAVScan = await new Promise((resolve, reject) => {
      console.log("Initiating ClamAV scan...");
      exec(`clamscan ${inputFilePath}`, (error, stdout, stderr) => {
        if (error) {
          console.error("Error executing ClamAV command:", error);
          reject(error);
        }
        resolve(stdout);
      });
    });

    console.log("ClamAV scan result:", clamAVScan);

    if (clamAVScan.includes("Infected files: 0")) {
      console.log("File is clean. Proceeding with transcoding...");
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

 
