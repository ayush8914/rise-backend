const asyncHandler = require('express-async-handler');
const Project = require('../Models/project');


//get all projects
const getProjects = asyncHandler(async (req, res) => {
    const projects = await Project.find({});
    res.status(200).json(projects);
});


//get project by id
const getProjectById = asyncHandler(async (req, res) => {
    const project = await Project.findById(req.params.id);
    if(project){
        res.status(200).json(project);
    }
    else{
        res.status(404).json({error: 'Project not found'});
    }
});


//create project
const createProject = asyncHandler(async (req, res) => {
    const {contractor_name, site_name, site_location} = req.body;

    const userid = req.user._id;     //from auth middleware

    const project = new Project({
        userid,
        contractor_name,
        site_name,
        site_location
    });
    const createdProject = await project.save();
    res.status(200).json({
        status:1,
        Message:"New Project Added",
        info:createdProject
    }
        );

});


module.exports={getProjects, getProjectById, createProject}