const asyncHandler = require('express-async-handler');
const Project = require('../Models/project');
const Inspection = require('../Models/inspection');

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


//create project
const createProject = asyncHandler(async (req, res) => {
    const {contractor_name, site_name, site_location} = req.body;
    
    const userid = req.user._id;     //from auth middleware
    
    try{
    const project = new Project({
        userid,
        contractor_name,
        site_name,
        site_location
    });
    const createdProject = await project.save();
    res.status(200).json({
        Status:1,
        Message:"New Project Added",
        info:createdProject
    }
        );
  }catch(e){
    res.status(200).json({
        Status:0,
        Message:"Something went wrong try to create again"
    })
  }

});


module.exports={getProjects, getProjectById, createProject}