const express = require('express');
const router = express.Router();
const { getProjects, getProjectById, createProject } = require('../Controllers/projectController');
const { protect } = require('../middlewares/auth');


//get all projects
router.get('/',getProjects);

//get project by id
router.get('/:id',getProjectById);

//create project
router.post('/',protect,createProject);


module.exports = router;