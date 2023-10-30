const experss = require('express');
const router = experss.Router();
const {setfields,getData,setoptions,getObjOptions,Adminlogin,getInspections,getInspectionsByProjectId,deleteObjOptions,getAllUsers,getProjectByUserId,getCounts} = require('../Controllers/adminController');

router.get('/projectbyuserid/:id',getProjectByUserId);


router.post('/setfields',setfields);

router.get('/getfields',getData);

router.get('/getcnt',getCounts);

router.post('/objoptions',setoptions);

router.get('/objoptions',getObjOptions);

router.delete('/objoptions',deleteObjOptions);


//get all inspections

router.get('/getAllinspections',getInspections);

//results of inspections
const {addResult,getResults,removeResult} = require('../Controllers/adminController');


router.post('/addresult',addResult);

router.get('/getresults',getResults);

router.delete('/removeresult',removeResult);



//users

router.get('/getusers',getAllUsers);

//get inspections by project id
router.get('/getinspections/:id',getInspectionsByProjectId);

//admin login

router.post('/login',Adminlogin);




module.exports = router;