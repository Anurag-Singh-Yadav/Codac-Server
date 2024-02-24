const userSchema = require("../models/userSchema");

exports.userDetails = async (req,res)=>{
    try{

        const email = req.user.email;
        let checkUser = await userSchema.findOne({ email: email });
        if (!checkUser) {
            return res.status(400).json({
                success: false,
                message: "User not found",
            });
        }

        return res.status(200).json({
            success: true,
            email,
            avatar: checkUser.avatar,
            name: checkUser.name,
        });

    }catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Error while fetching user details",
            error: e,
        });
    }
}