const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const asyncHandler = require('express-async-handler');
const User = require('../Models/user');
const sendResetPasswordEmail = require('../Controllers/sendmail');
const multer = require('multer');



//@desc     Register a new user
//@route    POST /api/register
//@access   Public

const registerUser = asyncHandler(async (req, res) => {
    const {fname , lname , email , password } = req.body;

    if(!fname || !lname || !email || !password){
        return res.status(400).json(
            { 
            Status : 0,
            Message: "Please field all the fields" 
        });  
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json(
            { 
                Status : 0,
                Message: "Email already used"
             }
            );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate a random 4-digit OTP
    const everification= "confirm your email";
    const otp = Math.floor(1000 + Math.random() * 9000);
    await sendResetPasswordEmail(email, otp,everification,req);

    const user = await User.create({
        fname,
        lname,
        email,
        password: hashedPassword,
        otp: otp
    });
    
    if(user){
        res.status(200).json(
          {
            Status : 1,
            Message: "Registration successful",
           info: {
            user_id: user._id,
            first_name: user.fname,
            last_name: user.lname,
            email_id: user.email,
            user_role: user.role,
            otp: user.otp
        }
    }
        );
    }
    else{
        return res.status(400).json({ error: 'Invaild user data' });
    }
});

const verifyEmail = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const {otp} = req.body;
    const exists = await User.findOne({email: user.email, otp: otp});
    if(exists){
        user.emailverified = true;
        // user.otp = null;
        await user.save();
        res.status(200).json(
            {
            Status:1,
            Message:"Email verified successfully",
            info:{
            user_id: user._id,
            firsr_name: user.fname,
            last_name: user.lname,
            email_id: user.email,
            user_role: user.role,
            is_email_verified: user.emailverified,
        }
    }
        );
    }
    else{

        // await User.findByIdAndDelete(user._id);
        return res.status(400).json(
            {
            Status:0,
            Message: 'Invaild OTP' 
        }
        );
    }
});

//resend otp
const resendOTP = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const otp = Math.floor(1000 + Math.random() * 9000);
    await sendResetPasswordEmail(user.email, otp,req);
    user.otp = otp;
    user.emailverified = false;
    await user.save();
    res.status(200).json(

        {
         Status:1,
         Message:"OTP sent successfully",       
        info:{
        user_id: user._id,
        first_name: user.fname,
        last_name: user.lname,
        email_id: user.email,
        user_role: user.role,
        otp:user.otp
    }
   }
    );
});

//@desc     Login a user
//@route    POST /api/login
//@access   Public

const loginUser = asyncHandler(async (req, res) => {
   const{email, password} = req.body;

    if(!email || !password){
        return res.status(400).json(
            {   
                Status:0,
                Message: 'Please fill all the fields' 
            }
            );  
    }

    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password)) && user.emailverified){
        res.status(200).json(
            {
             Status:1,
             Message:"Logged in successful",
           info: {
            user_id: user._id,
            first_name: user.fname,
            last_name: user.lname,
            email_id: user.email,
            user_role: user.role,
            UserToken: generateToken(user._id)
        }
    }
        );
    }
    else{
       return res.status(400).json(
        {   
            Status:0,
            Message:"Invalid email or password or email not verified"
        }
        );
    }
});


//@desc     Get user profile
//@route    GET /api/profile
//@access   Private

const getUserProfile = asyncHandler(async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json(
            {   
                Status:0,
                Message: 'User not found' 
            }
            );
      }
  
      
      if (!user.profilepic) {
        return res.status(404).json(
            {   
                Status:0,
                Message: 'Profile picture not found' 
            }
            );
      }
  
      const profilePicFilename = user.profilepic;
      const baseUrl = `${req.protocol}://${req.get('host')}`;
      const imageurl = baseUrl+'/userprofiles/' + profilePicFilename;
  
      const { _id, fname, lname, email } = user;
      res.status(200).json({
        user_id:_id,
        first_name:fname,
        last_name:lname,
        email_id:email,
        profile_pic:imageurl
      });
    } catch (error) {
    //   console.error(error);
      res.status(500).json(
        {   Status:0,
            Message: 'Internal server error' 
        }
        );
    }

  });
  

//delete user
const deleteUser = asyncHandler(async (req,res) =>{
   const user = await User.findById(req.params.id);
   if(user){
   await User.findByIdAndDelete(req.params.id);
   res.status(200).json(
    {   Status:1,
        Message:'Account removed successfully'
    }
    ); 
}
   else{
     return res.status(404).json(
        {
            Status:0,
            Message:'No User found'
        }
        )
   }
}

);

//forget password
const forgetpass = asyncHandler(async(req,res)=>{
   
        const { email } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        
        if (!user) {
          return res.status(404).json(
            {   
                Status:0,
                Message: 'User not found'
            }
            );
        }
        
        // Generate a reset token and set an expiration time
        const resetToken =  Math.floor(1000 + Math.random() * 9000);
        const resetExpires = Date.now() + 300000; // 5 min
        
        user.resettoken = resetToken;
        user.resettokentime = resetExpires;
        
        await user.save();
        await sendResetPasswordEmail(email, resetToken,"reset your password");
        res.status(200).json(

            {   
                Status:1,
                Message:'opt sent successfully. Valid for 5 mins',
                pass_resetToken: user.resettoken,
                token_valid : user.resettokentime
            }

            );
       
}
);


const verifyOtp = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const {otp} = req.body;
    console.log(otp);
    const newpassword = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if(newpassword !== confirmpassword){
        return res.status(400).json(
            {   
                Status:0,
                Message: 'New password and confirm password does not match' 
            }
            );
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
   
    const exists = await User.findOne({email: user.email, resettoken: otp});
  
    if(exists && user.resettokentime > Date.now() ){
        user.password = hashedPassword;
        user.resettoken = null;
        user.resettokentime = null;
        await user.save();
        res.status(200).json(
            {   Status:1,
                Message:'Password changed successfully',
                newpassword: user.password
            }
            );
    }
    else{
        return res.status(400).json(
            {   
                Status : 0,
                Message: 'Invaild OTP. Try again!'
             }
            );
    }
    
});


// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/userprofiles'); // Destination folder
    },
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {

        try{ 
        cb(new Error('Invalid file type'), false);
        }
        catch(e){
            req.status(404).json({
                Status:0,
                Message:"Only images are allowed"
            });
        }
    }
};



const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 5 }, // 5 MB
});

//update user profile
// const updateUserProfile = asyncHandler(async (req, res) => {
//     const {_id , fname, lname , profilepic} = await User.findById(req.user._id);
//     const {fname: newfname, lname: newlname, profilepic: newprofilepic} = req.body;
//     if(id){
//         user.fname = newfname;
//         user.lname = newlname;
//         user.profilepic = newprofilepic;
//         await user.save();
//         res.status(200).json({
//             _id,
//             fname,
//             lname,
//             profilepic
//         });
//     }
// });

const path = require('path');
const fs = require('fs');


const updateUserProfile = asyncHandler(async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json(
                {   
                    Status:0,
                    Message: 'User not found' 
                }
                );
        }

        const previousProfilePic = user.profilepic;


        upload.single('profilepic')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(400).json(
                    {   Status:0,
                        Message: 'File upload error'
                    }
                    );
            } else if (err) {
                return res.status(500).json(
                    {   
                        Status:0,
                        Message: 'Internal server error'
                     }
                    );
            }

            if (req.file) {
                user.profilepic = req.file.filename;
           
                if (previousProfilePic != null) {
                    const parentDirectory = path.dirname(__dirname);
                    const previousImagePath = path.join(parentDirectory, 'public/userprofiles', previousProfilePic);
                    console.log(previousImagePath);
                    // Check if the file exists before attempting to delete it
                    fs.access(previousImagePath, fs.constants.F_OK, (err) => {
                        if (err) {
                            // File doesn't exist
                            console.error(`Error deleting previous image: File does not exist`);
                        } else {
                            // File exists, attempt to delete it
                            fs.unlink(previousImagePath, (err) => {
                                if (err) {
                                    console.error(`Error deleting previous image: ${err}`);
                                } else {
                                    console.log(`Previous image deleted successfully`);
                                }
                            });
                        }
                    });
                }
            }

            const { fname, lname } = req.body;
            user.fname = fname || user.fname;
            user.lname = lname || user.lname;

            await user.save();

            res.status(200).json(
                {
                    Status:1,
                Message:"Updated successfully",
                info:{
                user_id: user._id,
                fname: user.fname,
                lname: user.lname,
                profilepic: user.profilepic || 'generaluserpic.png',
            }
        }
            );
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
    }
});



function generateToken(id){
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

module.exports = { registerUser, loginUser, getUserProfile , verifyEmail, resendOTP,deleteUser, forgetpass,verifyOtp,updateUserProfile};