const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');
const Lift = require('../Models/lifts');

//add lift
const addLift = asyncHandler(async (req, res) => {
    const inspectionid = req.params.id;
    const inspection = await Inspection.findById(inspectionid);
    if(!inspection){
        return res.status(200).json({success: 0, message: 'Inspection not found'});
    }
    const category = req.body.category;
    const liftExists = await Lift.findOne({inspectionid: inspectionid, category: category}).countDocuments();
    if(liftExists > 0){
        return res.status(200).json({
            Status: 0,
            Message: 'Lift already exists'
        });
    }

    const lift = new Lift({
        inspectionid: inspectionid,
        category: req.body.category,
        isissue: req.body.isissue,
        observations: req.body.observations
    });
    console.log(lift);
    const createdLift = await lift.save();
    if(createdLift){
        return res.status(201).json({
            Status: 1,
            Message: 'Lift created successfully',
            info: createdLift
        });
    }else{
        return res.status(500).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
    }
});



module.exports={addLift}
