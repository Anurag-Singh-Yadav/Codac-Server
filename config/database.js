const mongoose = require('mongoose');
require('dotenv').config();
exports.dbConnect =() =>{
    mongoose.connect(process.env.MONGOOSE_URL,{
    })
    .then(()=>{
        console.log("db connection established")
    })
    .catch((err)=>{
        console.log("error connecting");
        console.log(err);
        process.exit(1);
    })
}