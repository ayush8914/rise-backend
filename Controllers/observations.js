const asyncHandler = require('express-async-handler');

const {Observation}  = require("../Models/observations")


//create observation
const createObservation = asyncHandler(async (req, res) => {
    const inspectionid = req.params.id;
    const category = req.body.category;

    const observationExists = await Observation.findOne({inspectionid: inspectionid, category: category}).countDocuments();
    if(observationExists > 0){
        return res.status(200).json({
            Status: 0,
            Message: 'Observation already exists'
        });
    }

    const observation = new Observation({
        inspectionid: inspectionid,
        category: req.body.category,
        isissue: req.body.isissue,
        observations: req.body.observations
    });

    const createdObservation = await observation.save();
    if(createdObservation){
        return res.status(201).json({
            Status: 1,
            Message: 'Observation created successfully',
            info: createdObservation
        });
    }else{
        return res.status(500).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
}
});




module.exports={createObservation}