const asyncHandler = require('express-async-handler');
const Inspection = require('../Models/inspection');
const Lift = require('../Models/lifts');
const category = require('../Models/cateconfig');  

//add lift
const addLift = asyncHandler(async (req, res) => {
    try{
    console.log(req.body.isissue,'*******************************');
    console.log(req.body.observations,'*******************************');

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

    console.log(inspection);

    const liftExists = await Lift.findOne({inspectionid: inspectionid, headingid: headingid}).countDocuments();
    console.log(liftExists);

    if(liftExists > 0){
        return res.status(200).json({
            Status: 0,
            Message: 'Lift already exists'
        });
    }
    if(req.body.isissue == true){
     console.log(req.body.isissue);

    const lift = new Lift({
        inspectionid: inspectionid,
        headingid: headingid,
        isissue: req.body.isissue,
        observations: req.body.observations
    });

    console.log(lift);

    const createdLift = await lift.save();

    console.log(createdLift, '*******************************');
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


    console.log(lift,2);
    const createdLift = await lift.save();
    console.log(createdLift,2);
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

}catch(error){
    console.log(error);
    res.status(200).json({
        Status: 0,
        Message: 'something went wrong.please try again'
    });

}
});


//update lift


// const updateLift = asyncHandler(async (req, res) => {
//     const inspectionid = req.params.id;
//     const lift = await Lift.find({inspectionid : inspectionid});

//     if(!lift || lift.length == 0 ){
//         return res.status(200).json({success: 0, message: 'Lifts not found'});
//     }
    

//     lift.observations = req.body.observations || lift.observations;
//     console.log(lift.observations); 


//     const updatedLift = await lift?.save();
//     console.log(updatedLift);
//     if(updatedLift){
//         return res.status(200).json({
//             Status: 1,
//             Message: 'Lift updated successfully',
//             info: updatedLift
//         });
//     }else{
//         return res.status(200).json({
//             Status: 0,
//             Message: 'something went wrong.please try again'
//         });
//     }
// });

const updateLift = asyncHandler(async (req, res) => {
    const inspectionid = req.params.id;
    try {
        const lift = await Lift.findOne({ inspectionid });

        if (!lift) {
            return res.status(200).json({ success: 0, message: 'Lift not found' });
        }

        // Update the observations property
        lift.observations = req.body.observations || lift.observations;

        // Save the updated lift
        const updatedLift = await lift.save();

        if (updatedLift) {
            return res.status(200).json({
                Status: 1,
                Message: 'Lift updated successfully',
                info: updatedLift
            });
        } else {
            return res.status(200).json({
                Status: 0,
                Message: 'Something went wrong. Please try again'
            });
        }
    } catch (error) {
        return res.status(500).json({ Status: 0, Message: 'Internal Server Error', error: error });
    }
});



//get lift by inspectionid

const getLiftByInspectionId = asyncHandler(async(req,res)=>{    
    const inspectionid = req.params.id;
    const lift = await Lift.findOne({inspectionid});

    if(lift){
        return res.status(200).json({
            Status:1,
            Message:'Fetched successfully',
            info: lift
        });
    }
    else{
        return res.status(200).json({
            Status:0,
            Message:'Lift not found',
        });
    }

}
);

module.exports={addLift,updateLift,getLiftByInspectionId}
