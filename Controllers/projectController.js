    const asyncHandler = require('express-async-handler');
const Project = require('../Models/project');
const Inspection = require('../Models/inspection');
const conclusions = require('../Models/conclusion');
const multer = require('multer');
const User = require('../Models/user');

//get all projects
const getProjects = asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 0;
    const limit = parseInt(req.query.limit) || 9;
    const skip = (page - 1) * limit;
    const count = await Project.countDocuments({isdelete:0});
    const totalPages = Math.ceil(count / limit);
    if(page != 0){
    const projects = await  Project.find({isdelete:0}).sort({ createdAt: -1 }).skip(skip).limit(limit); 
    res.status(200).json({
        Status:1,
        Message: "Successful",
        info:projects,
        totalPages: totalPages,
       }
    );
    }
    else{
        const projects = await  Project.find({isdelete:0}).sort({ createdAt: -1 });
        res.status(200).json({
            Status:1,
            Message: "Successful",
            info:projects
           }
        );
    
    }
});

//get contractor name and project ids of all projects
const getShortProjects = asyncHandler(async (req, res) => {
    var projects = await  Project.find({}).sort({ createdAt: -1 });
    if(projects){
        projects = projects.map( project =>  ({
            projectid: project._id
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
    
    function formatDateString(inputDateString) {
        const dateParts = inputDateString.split('/');
      
        const day = dateParts[0];
        const month = dateParts[1];
        const year = dateParts[2];
    
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthAbbreviation = monthNames[parseInt(month, 10) - 1];
        return `${day} ${monthAbbreviation}, ${year}`;
      }
    const project = await Project.findById(req.params.id);
    var inspections = await Inspection.find({projectid: req.params.id}).sort({  createdAt: -1 });
    console.log(inspections);
    
    const getResult = async (inspectionid) => {
        console.log(inspectionid);
        var result = await conclusions.findOne({inspectionid: inspectionid});
      
        
        if(result != null){
            console.log(result.result_of_inspection_data);
            return result.result_of_inspection_data;
        }
        else{
            return "Conclusion not found";
        }
    }
    

    if (inspections) {
        inspections = await Promise.all(inspections.map(async inspection => {
            const result = await getResult(inspection._id);
            
            // Create a new object with only the desired fields
            return {
                inspectionid: inspection._id,
                name: inspection.inspector_name,
                date: formatDateString(inspection.Date),
                result_of_inspection: result,
            };
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

            const { contractor_name, site_name, site_location,project_name} = req.body;
            const project = new Project({
                        userid,
                        contractor_name,
                        site_name,
                        site_location,
                        project_name,
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



const deleteProject = asyncHandler(async (req, res) => {

    const project = await Project.findById(req.params.id);
    
    if(project){
        project.isdelete = 1;
       await project.save();
        res.status(200).json({
           Status:1,
           Message : "project deleted successfully",
           project:project
       
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

const setProject = asyncHandler(async (req, res) => {
    console.log("Fsdjfj");
    // const projects = await Project.find({}).sort({ createdAt: -1 });
  const projects = await Project.find();
  console.log(projects);
  for(var i in projects){
    if(i){
    
        const project1 = await Project.findById(i._id); 
        console.log(project1);
        project1.isdelete = 0;
        project1.save();
        res.status(200).json(
            {   Status:0,
                Message: 'Project not found',
                project:project1

            });
        
    }
  }

});
module.exports={getProjects, getProjectById, createProject,getShortProjects,deleteProject,setProject}