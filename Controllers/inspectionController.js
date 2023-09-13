const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');


//get all inspections
const getInspections = asyncHandler(async (req, res) => {
    const inspections = await Inspection.find({});
    
    res.status(200).json(inspections);
});

//get inspection by id
const getInspectionById = asyncHandler(async (req, res) => {
    const inspection = await Inspection.findById(req.params.id);
    if(inspection){
        res.status(200).json(inspection);
    }
    else{
        res.status(404).json({error: 'Inspection not found'});
    }
});

//create inspection
const createInspection = asyncHandler(async (req, res) => {
    const projectid = req.params.id;
    const {Date ,
        starttime,
        inspector_name,
        inspector_role,
        scaffold_description,
        referenceImages,
        bespokedesigns,
        statutory_inspection = false,
        reason_for_inspection = null,
        inspection_date= null} = req.body;

    const inspection = new Inspection({
        projectid,
        Date ,
        starttime,
        inspector_name,
        inspector_role,
        scaffold_description,
        referenceImages,
        bespokedesigns,
        statutory_inspection,
        reason_for_inspection,
        inspection_date
    });
    const createdInspection = await inspection.save();
    if(createdInspection){
    res.status(200).json(createdInspection);
    }
    else{
        res.status(400).json({error: 'Invalid inspection data'});
    }

});





module.exports={getInspections, getInspectionById, createInspection}