const express = require('express');
const router = express.Router();

const { registerUser, loginUser, getUserProfile,verifyEmail,resendOTP,deleteUser,forgetpass, changepass,updateUserProfile,logoutUser} = require('../Controllers/userController');
const { protect } = require('../middlewares/auth');


//register user
router.route('/register').post(registerUser);

//verify email
router.route('/verifyemail/:id').post(verifyEmail);
//resend otp
router.route('/resendotp/:id').post(resendOTP);

//delete user
router.delete('/deleteuser',protect,deleteUser)


//forgot password
router.route('/forgetpassword').post(forgetpass)
//verfiy otp for forget password
router.route('/changepass/:id').post(changepass);

//login
router.route('/login').post(loginUser);

//get user profile
router.get('/profile', protect,getUserProfile);

//update user profile
router.put('/updateprofile', protect, updateUserProfile);

//Logout user 
// router.get('/logout', protect, logoutUser);

module.exports = router;