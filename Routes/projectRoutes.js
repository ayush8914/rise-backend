const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject } = require('../Controllers/projectController');


//get all projects
router.get('/',getProjects);

//get project by id
router.get('/:id',getProjectById);

//create project
router.post('/',createProject);


module.exports = router;