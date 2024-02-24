const { S3Client } = require("@aws-sdk/client-s3");
const multer = require("multer");
const multerS3 = require("multer-s3");
const util = require("util");
const path = require("path");

const region = process.env.NEXT_PUBLIC_AWS_REGION;
const bucketName = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
  accessKeyId,
  secretAccessKey,
  },
  region: region,
});

const storage = multerS3({
  s3:s3,
  bucket: bucketName,
  contentType: multerS3.AUTO_CONTENT_TYPE,
  metadate: function (req , file , cb){
    cb(null , {fieldName: file.fieldName})
  },
  key:function (req , file , cb){
    cb(null , Date.now().toString());
  }
})

function checkFileType(file , cb){
  const fileTypes = /jpeg|jpg|png|pdf|text|txt|text\/plain/;
  
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());

  console.log(file,'-------->file');

  const mimitype = fileTypes.test(file.mimetype);
  
  if (extname && mimitype) {
    return cb(null, true);
  } else {
    cb(new Error('Error: Invalid file type. Only JPEG, JPG, PNG, TXT, and PDF files are allowed.')); // Update the error message
  }
}

const upload = multer({
    storage: storage,
    fileFilter: function(req , file , cb){
        console.log('Testing');
        checkFileType(file , cb);
    },

}).array('file' , 5);

const uploadMiddleWare = util.promisify(upload);

module.exports = uploadMiddleWare;
