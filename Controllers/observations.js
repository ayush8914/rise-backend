const Observation = require('../Models/observations');
const asyncHandler = require('express-async-handler');
const category = require('../Models/cateconfig');  
const Inspection = require('../Models/inspection');

//add observation
const addObservation = asyncHandler(async (req, res) => {
    const inspectionid = req.params.id;
    const headingid = req.params.headingid;
    const heading = await category.findOne({'category._id': headingid});
    if(!heading){
        return res.status(200).json({success: 0, message: 'Heading not found'});
    }

    const inspection = await Inspection.findById(inspectionid);
    if(!inspection){
        return res.status(200).json({success: 0, message: 'Inspection not found'});
    }
    const observationExists = await Observation.findOne({inspectionid: inspectionid, headingid: headingid}).countDocuments();
    if(observationExists > 0){
        return res.status(200).json({
            Status: 0,
            Message: 'Observation already exists'
        });
    }
     if(req.body.issue_identified == true){
       

    const observation = new Observation({
        inspectionid: inspectionid,
        headingid: headingid,
        issue_identified: req.body.issue_identified,
        observations: req.body.observations
    });

    const createdObservation = await observation.save();
    if(createdObservation){
        return res.status(200).json({
            Status: 1,
            Message: 'Observation created successfully',
            info: createdObservation
        });
    }else{
        return res.status(200).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
    }
   }
   else{
    const observation = new Observation({
        inspectionid: inspectionid,
        headingid: headingid,
        issue_identified: req.body.issue_identified,
        observations: []
    });

    const createdObservation = await observation.save();
    if(createdObservation){
        return res.status(200).json({
            Status: 1,
            Message: 'Observation created successfully',
            info: createdObservation
        });
    }else{
        return res.status(200).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
    }
   }
});



const updateObservation = asyncHandler(async (req, res) => {
    const observationid = req.params.id;
    const observation = await Observation.findById(observationid);
    if(!observation){
        return res.status(200).json({success: 0, message: 'Observation not found'});
    }
    // observation.issue_identified = req.body.issue_identified;
    observation.observations = req.body.observations;
    const updatedObservation = await observation.save();
    if(updatedObservation){
        return res.status(200).json({
            Status: 1,
            Message: 'Observation updated successfully',
            info: updatedObservation
        });
    }else{
        return res.status(200).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
    }
});


//get observation
const getObservation = asyncHandler(async (req, res) => {
    const inspectionid = req.params.id;
    const headingid = req.params.headingid;
    const observation = await Observation.findOne({inspectionid: inspectionid, headingid: headingid});
    if(!observation){
        return res.status(200).json({Status: 0, message: 'Observation not found'});
    }
    return res.status(200).json({
        Status: 1,
        Message: 'Observation found',
        info: observation
    });
});


module.exports={addObservation,updateObservation,getObservation}