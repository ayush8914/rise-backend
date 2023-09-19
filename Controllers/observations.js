const asyncHandler = require('express-async-handler');
const Category = require('../Models/categories');
const {Observation}  = require("../Models/observations")

//create observation
const createObservation = asyncHandler(async (req, res) => {
    const inspectionid = req.params.id;
    console.log(req.body);
    const {category, IssueIdentified,observations } = req.body;
    const observation1 =new Category( {
        inspectionid,
        category,
        IssueIdentified
    });
    const newobservation =await observation1.save();

    if(IssueIdentified){
        observations.forEach(element => {
            const t= new Observation(element);
            t.save();
            newobservation.observations.push(t);
        });   
        await newobservation.save();
    }
    res.status(200).json(newobservation);
});



module.exports={createObservation}