const experss = require('express');
const router = experss.Router();
const { createInspection, getInspectionById, getInspections } = require('../Controllers/inspectionController');

//get short details of all inspections
router.get('/', getInspections);


//get inspection by id
router.get('/:id', getInspectionById);


//create inspection   -- project id is passed in url
router.post('/:id', createInspection);


module.exports = router;