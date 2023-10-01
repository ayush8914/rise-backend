const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');
const Lift = require('../Models/lifts');
const category = require('../Models/cateconfig');  

//add lift
const addLift = asyncHandler(async (req, res) => {
    const headingid = req.params.headingid;
    const inspectionid = req.params.id;
    const inspection = await Inspection.findById(inspectionid);
    const heading = await category.findOne({'category._id': headingid});
    if(!heading){
        return res.status(200).json({success: 0, message: 'Heading not found'});
    }

    if(!inspection){
        return res.status(200).json({success: 0, message: 'Inspection not found'});
    }

    const liftExists = await Lift.findOne({inspectionid: inspectionid, headingid: headingid}).countDocuments();
    if(liftExists > 0){
        return res.status(200).json({
            Status: 0,
            Message: 'Lift already exists'
        });
    }
    if(req.body.isissue == true){
    const lift = new Lift({
        inspectionid: inspectionid,
        headingid: headingid,
        isissue: req.body.isissue,
        observations: req.body.observations
    });

    console.log(lift);

    const createdLift = await lift.save();
    if(createdLift){
        return res.status(200).json({
            Status: 1,
            Message: 'Lift created successfully',
            info: createdLift
        });
    }else{
        return res.status(200).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
    }
   }else{
    const lift = new Lift({
        inspectionid: inspectionid,
        headingid: headingid,
        isissue: req.body.isissue,
        observations: []
    });

    console.log(lift);

    const createdLift = await lift.save();
    if(createdLift){
        return res.status(200).json({
            Status: 1,
            Message: 'Lift created successfully',
            info: createdLift
        });
    }else{
        return res.status(200).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
    }
   }
});

//update lift
const updateLift = asyncHandler(async (req, res) => {
    const liftid = req.params.id;
    const lift = await Lift.findById(liftid);
    if(!lift){
        return res.status(200).json({success: 0, message: 'Lifts not found'});
    }
    lift.observations = req.body.observations;
    const updatedLift = await lift.save();
    if(updatedLift){
        return res.status(200).json({
            Status: 1,
            Message: 'Lift updated successfully',
            info: updatedLift
        });
    }else{
        return res.status(200).json({
            Status: 0,
            Message: 'something went wrong.please try again'
        });
    }
});

module.exports={addLift,updateLift}
