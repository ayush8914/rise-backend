const asyncHandler = require('express-async-handler');

const {Observation}  = require("../Models/observations")
const {Obj} = require("../Models/obj")


//create observation
// const createObservation = asyncHandler(async (req, res) => {
//     const inspectionid = req.params.id;
//     const category = req.body.category;

//     const observationExists = await Observation.findOne({inspectionid: inspectionid, category: category}).countDocuments();
//     if(observationExists > 0){
//         return res.status(200).json({
//             Status: 0,
//             Message: 'Observation already exists'
//         });
//     }

//     const observation = new Observation({
//         inspectionid: inspectionid,
//         category: req.body.category,
//         isissue: req.body.isissue,
//         observations: req.body.observations
//     });

//     const createdObservation = await observation.save();
//     if(createdObservation){
//         return res.status(201).json({
//             Status: 1,
//             Message: 'Observation created successfully',
//             info: createdObservation
//         });
//     }else{
//         return res.status(500).json({
//             Status: 0,
//             Message: 'something went wrong.please try again'
//         });
// }
// });


const createObservation = asyncHandler(async (req, res) => {
    const inspectionid = req.params.id;
    const {category, sub_type, issue} = req.body;
    
    const observationExists = await Obj.findOne({inspectionid: inspectionid, category: category}).countDocuments();
    if(observationExists > 0){
        return res.status(200).json({
            Status: 0,
            Message: 'Observation already exists'
        });
    }
    
    if(issue == false){
       const observation = new Obj({
        inspectionid: inspectionid,
        category: category,
        sub_type: sub_type,
        issue: issue
    });
    const createdObservation = await observation.save();
     if(createdObservation){
        return res.status(200).json({
            Status: 1,
            Message: 'Observation created successfully',
            info: createdObservation
        });
    }
   }
    else{
        if(sub_type == false){
            const observation = new Obj({
                inspectionid: inspectionid,
                category: category,
                sub_type: sub_type,
                issue: issue,
                observations: req.body.observations
            });
            const createdObservation = await observation.save();
            if(createdObservation){
                return res.status(200).json({
                    Status: 1,
                    Message: 'Observation created successfully',
                    info: createdObservation
                });
            }
        }
        else if(sub_type == true){
            const observation = new Obj({
                inspectionid: inspectionid,
                category: category,
                sub_type: sub_type,
                issue: issue,
                subtypes: req.body.subtypes
            });
            const createdObservation = await observation.save();
            if(createdObservation){
                return res.status(200).json({
                    Status: 1,
                    Message: 'Observation created successfully',
                    info: createdObservation
                });
            }
        }
    }
   
});



module.exports={createObservation}