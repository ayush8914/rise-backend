const asyncHandler = require('express-async-handler');
const Project = require('../Models/project');
const Inspection = require('../Models/inspection');
const multer = require('multer');
const User = require('../Models/user');

//get all projects
const getProjects = asyncHandler(async (req, res) => {
    const projects = await  Project.find({}).sort({ createdAt: -1 });
    res.status(200).json({
        Status:1,
        Message: "Successful",
        info:projects
       }
    );
});

//get contractor name and project ids of all projects
const getShortProjects = asyncHandler(async (req, res) => {
    var projects = await  Project.find({}).sort({ createdAt: -1 });
    if(projects){
        projects = projects.map( project =>  ({
            projectid: project._id,
            contractor_name:project.contractor_name
            }));
    }
    res.status(200).json({
        Status:1,
        Message: "Fetched successfully",
        info:projects
       }
    );
});


//get project by id
const getProjectById = asyncHandler(async (req, res) => {
    
       function formateddate(inputDate){
       const day = inputDate.getDate();
const year = inputDate.getFullYear().toString();
const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const month = monthNames[inputDate.getMonth()];
return `${day} ${month}, ${year}`;

    }
    const project = await Project.findById(req.params.id);
    var inspections = await Inspection.find({projectid: req.params.id});
    if(inspections){
        inspections = inspections.map( inspection =>  ({
            inspectionid: inspection._id,
            name:inspection.inspector_name,
            date : formateddate(inspection.Date)
            
            }));
    }
    if(project){
        res.status(200).json({
           Status:1,
           Message : "Fetched successfully",
           info: project,
           inspections: inspections
        }
            );
    }
    else{
        res.status(200).json(
            {   Status:0,
                Message: 'Project not found'
            });
    }
});


// Set up storage for multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/projects'); // Destination folder
    },
    filename: (req, file, cb) => {
        
        cb(null, Date.now() + file.originalname);
    },
});


const upload = multer({ storage: storage});

//create project
const createProject = asyncHandler(async (req, res) => {
    try {
        console.log(req.user._id);
        const userid = req.user._id;
        const user = await User.findById(req.user._id);
        console.log(user);
        if (!user) { 
            return res.status(200).json(
                {   
                    Status:0,
                    Message: 'User not found' 
                }
                );
        }

        // const previousProfilePic = user.profilepic;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        var imageurl;
        upload.single('image')(req, res, async (err) => {
            if (err instanceof multer.MulterError) {
                return res.status(200).json(
                    {   Status:0,
                        Message: 'File upload error'
                    }
                    );
            } else if (err) {
                return res.status(200).json(
                    {   
                        Status:0,
                        // error : err,
                        Message: 'Internal server error'
                     }
                    );
            }

            if (req.file) {

            const { contractor_name, site_name, site_location} = req.body;
            const project = new Project({
                        userid,
                        contractor_name,
                        site_name,
                        site_location,
                        image: baseUrl+ "/projects/"+ req.file.filename
                    });


            const createdProject = await project.save();
                res.status(200).json({
                    Status:1,
                    Message:"New Project Added",
                    info:createdProject
                }
             );

            
            }
            else{
                res.status(200).json(
                    {   
                        Status:0,
                        Message: 'Image not found'
                     }
                    );
            }

        });
    } catch (error) {
        res.status(200).json(
            {
                Status:0,
                Message: 'Something went wrong try to create again'
            }
        );
     }
});


module.exports={getProjects, getProjectById, createProject,getShortProjects}