const asyncHandler = require('express-async-handler');
const cateconfig = require('../Models/cateconfig');
const objoptions = require('../Models/obj_options');
const resultsofinspecitons = require('../Models/resultsofinspecitons');
const Inspection = require('../Models/inspection'); 
const Project = require('../Models/project');
const jwt  = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
// const asyncHandler = require('express-async-handler');
const User = require('../Models/user');

//get count of all
const getCounts = asyncHandler(

    async(req,res)=>{
     const usercnt = await User.find().countDocuments();
     const procnt = await  Project.find().countDocuments();
     const inspectioncnt = await Inspection.find().countDocuments();

     if(!usercnt || !procnt || !inspectioncnt)
     {
        res.status(200).json({
            Status : 0,
            Message : "All data not fatched"
        });
     }
     else{
        res.status(200).json({
            Status : 1,
            Message : "Fatched successfully",
            info : {
                usercnt,
                procnt,
                inspectioncnt
            }
        });
     }
    }
);


//add result 
const addResult = asyncHandler(async (req, res) => {
    const {result} = req.body;
    const resultExists = await resultsofinspecitons.findOne({result});
    if(resultExists){
        return res.status(200).json({
            Status:0,
            Message: 'Result already exists',
        });
    }
    else{
        const newresult = new resultsofinspecitons({result});
        const createdResult = await newresult.save();
        if(createdResult){
            return res.status(200).json({
                Status:1,
                Message: 'Result added successfully',
                info: createdResult
            });
        }
        else{
            return res.status(200).json({
                Status:0,
                Message: 'Something went wrong',
            });
        }
    }
});


//remove result

const removeResult = asyncHandler(async (req, res) => {
    const {result} = req.body;
    const resultExists = await resultsofinspecitons.findOneAndDelete({result});
    if(resultExists){
        return res.status(200).json({
            Status:1,
            Message: 'Result deleted successfully',
            info: resultExists
        });
    }
    else{
        return res.status(200).json({
            Status:0,
            Message: 'Result not found',
        });
    }
});


//get results
const getResults = asyncHandler(async(req,res)=>{
    const data = await resultsofinspecitons.find({});
    return res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: data
    });
}
)


const Adminlogin = asyncHandler(async(req,res)=>{

    const{email, password} = req.body;

    if(!email || !password){
        return res.status(200).json(
            {   
                Status:0,
                Message: 'Please fill all the fields' 
            }
            );  
    }

    const user = await User.findOne({email});
    if(!user || user.role != 'admin'){
          if(!user){
            return res.status(200).json(
                {
                Status:0,
                Message:"Email and password does not match"
            }
            );
            
           
          }
          if(!user.emailverified){
            return res.status(200).json(
                {
                Status:2,
                Message:"Email is not verified.Please verify your email"
            }
            );
          }
    }
    if(user && (await bcrypt.compare(password, user.password)) ){
        res.status(200).json(
            {
             Status:1,
             Message:"Login successful",
           info: {
            user_id: user._id,
            email_id: user.email,
            user_role: user.role,
            UserToken: generateToken(user._id)
        }
    }
        );
    }
    else{
       return res.status(200).json(
        {   
            Status:0,
            Message:"Invalid email or password or email not verified"
        }
        );
    }
});


//set category and subcategory
const setfields = asyncHandler(async (req, res) => {
    const {heading, subheading} = req.body;
    const cateconfig1 = await cateconfig.findOne({});

    if(cateconfig1 != null){
        cateconfig1.category.push({heading, 
            subheading: subheading?.map(name =>  (name) ),
        });
        
        await cateconfig1.save();
        return res.status(200).json({message: 'heading and subheading added'});
    }
    else{
        const cateconfig2 = new cateconfig({category: [ {heading, 
            subheading: subheading?.map(name => (name) ),
        }]});
        console.log(cateconfig2);
        await cateconfig2.save();
        return res.status(200).json({message: 'heading and subheading added'});
    }
});

//get fields
const getData = asyncHandler(async(req,res)=>{
    const data = await cateconfig.findOne({});
    const actualdata = data.category;
    return res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: actualdata
    });
}
)

//set options
const setoptions = asyncHandler(async (req, res) => {
    const option = req.body.option;
    const options = await objoptions.findOne({option});
    if(options){
        return res.status(200).json({
            Status:0,
            Message: 'Option already exists',
        });
    }
    else{
        const newoption = new objoptions({
           option
        });
        const createdOption = await newoption.save();
        if(createdOption){
            return res.status(200).json({
                Status:1,
                Message: 'Option added successfully',
                info: createdOption
            });
        }
        else{
            return res.status(200).json({
                Status:0,
                Message: 'Something went wrong',
            });
        }
    }
});


const getObjOptions = asyncHandler(async(req,res)=>{
    const data = await objoptions.find({});
    return res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: data
    });
}
)

//delete obj options
const deleteObjOptions = asyncHandler(async(req,res)=>{
    const option = req.body.option;
    const data = await objoptions.findOneAndDelete({option});
    return res.status(200).json({
        Status:1,
        Message:'Deleted successfully',
        info: data
    });
}
)



//get all users


const getAllUsers = asyncHandler(async(req,res)=>{
    const data = await User.find({});
    return res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: data
    });
}
)


//get project by user id 

const getProjectByUserId = asyncHandler(async(req,res)=>{

    const userid = req.params.id;
    const data = await Project.find({userid});
    return res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: data
    });

});


//get inspections by project id 
const getInspectionsByProjectId = asyncHandler(async(req,res)=>{
    const projectid = req.params.id;
    const inspection = await Inspection.find({projectid});

    if(!inspection){
        res.status(200).json({
            Status:0,
            Message:'Inspection not found',
        });
    }
    else{

        res.status(200).json({
            Status:1,
            Message:'Fetched successfully',
            info: inspection
        });
    }
});



//get all inspections

const getInspections = asyncHandler(async(req,res)=>{

    const inspection = await Inspection.find({});

    if(!inspection){
        res.status(200).json({
            Status:0,
            Message:'Inspection not found',
        });
    }
    else{

        res.status(200).json({
            Status:1,
            Message:'Fetched successfully',
            info: inspection
        });
    }
});


function generateToken(id){
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '30d'});
}


module.exports = {setfields,getInspectionsByProjectId,getInspections,getData,setoptions,Adminlogin,getObjOptions,getProjectByUserId,deleteObjOptions,addResult,removeResult,getResults,getAllUsers,getCounts};