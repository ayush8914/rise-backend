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
        return res.status(400).json({ error: 'Please field all the fields' });  
    }

    const userExists = await User.findOne({email});

    if(userExists){
        return res.status(400).json({ error: 'Email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Generate a random 4-digit OTP
    const everification= "confirm your email";
    const otp = Math.floor(1000 + Math.random() * 9000);
    await sendResetPasswordEmail(email, otp,everification);

    const user = await User.create({
        fname,
        lname,
        email,
        password: hashedPassword,
        otp: otp
    });
    
    if(user){
        res.status(200).json({
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            role: user.role,
        });
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
        user.otp = null;
        await user.save();
        res.status(200).json({
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            role: user.role,
            emailverified: user.emailverified,
        });
    }
    else{

        // await User.findByIdAndDelete(user._id);
        return res.status(400).json({ error: 'Invaild OTP' });
        // throw new Error('Invalid OTP');
    }
});

//resend otp
const resendOTP = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const otp = Math.floor(1000 + Math.random() * 9000);
    await sendResetPasswordEmail(user.email, otp);
    user.otp = otp;
    user.emailverified = false;
    await user.save();
    res.status(200).json({
        _id: user._id,
        fname: user.fname,
        lname: user.lname,
        email: user.email,
        role: user.role,
    });
});

//@desc     Login a user
//@route    POST /api/login
//@access   Public

const loginUser = asyncHandler(async (req, res) => {
   const{email, password} = req.body;

    if(!email || !password){
        return res.status(400).json({ error: 'Please field all the fields' });  
    }

    const user = await User.findOne({email});
    if(user && (await bcrypt.compare(password, user.password)) && user.emailverified){
        res.status(200).json({
            _id: user._id,
            fname: user.fname,
            lname: user.lname,
            email: user.email,
            role: user.role,
            token: generateToken(user._id)
        });
    }
    else{
       return res.status(400).json({error:'Invalid email or password or email not verified'});
    }
});


//@desc     Get user profile
//@route    GET /api/profile
//@access   Private

const getUserProfile = asyncHandler(async (req, res) => {
    const {_id , fname, lname , profilepic} = await User.findById(req.user._id);
    
   
    res.status(200).json({
            _id,
            fname,
            lname,
            profilepic
        });
});

//delete user
const deleteUser = asyncHandler(async (req,res) =>{
   const user = await User.findById(req.params.id);
   if(user){
   await User.findByIdAndDelete(req.params.id);
   res.status(200).json({msg:'deleted successfully.'}); 
}
   else{
     return res.status(404).json({error:'user does not exist'})
   }
}

);

//forget password
const forgetpass = asyncHandler(async(req,res)=>{
   
        const { email } = req.body;
        // Find the user by email
        const user = await User.findOne({ email });
        
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }
        
        // Generate a reset token and set an expiration time
        const resetToken =  Math.floor(1000 + Math.random() * 9000);
        const resetExpires = Date.now() + 300000; // 5 min
        
        user.resettoken = resetToken;
        user.resettokentime = resetExpires;
        
        await user.save();
        await sendResetPasswordEmail(email, resetToken,"reset your password");
        res.status(200).json({meg:'opt sent successfully '});
        
}
);


const verifyOtp = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    const {otp} = req.body;
    console.log(otp);
    const newpassword = req.body.password;
    const confirmpassword = req.body.confirmpassword;
    if(newpassword !== confirmpassword){
        return res.status(400).json({ error: 'password and confirm password does not match' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newpassword, salt);
   
    const exists = await User.findOne({email: user.email, resettoken: otp});
  
    if(exists && user.resettokentime > Date.now() ){
        user.password = hashedPassword;
        user.resettoken = null;
        user.resettokentime = null;
        await user.save();
        res.status(200).json({mes:'Password changed successfully'});
    }
    else{
        return res.status(400).json({ error: 'Invaild OTP' });
    }
    
});

//update user profile
const updateUserProfile = asyncHandler(async (req, res) => {
    const {_id , fname, lname , profilepic} = await User.findById(req.user._id);
    const {fname: newfname, lname: newlname, profilepic: newprofilepic} = req.body;
    if(id){
        user.fname = newfname;
        user.lname = newlname;
        user.profilepic = newprofilepic;
        await user.save();
        res.status(200).json({
            _id,
            fname,
            lname,
            profilepic
        });
    }
});




function generateToken(id){
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}

module.exports = { registerUser, loginUser, getUserProfile , verifyEmail, resendOTP,deleteUser, forgetpass,verifyOtp,updateUserProfile};