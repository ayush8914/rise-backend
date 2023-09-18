const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema({
   option: {type:String, required : true},
   notes : [{type:String}],
   media : [{type:String}]
});


const subTypeSchema = new mongoose.Schema({
    type:{type:String, required:true},
    observations:[
    observationSchema
   ]
});

const Observation = mongoose.model("observations", observationSchema);
const subType = mongoose. model("subType", subTypeSchema);
module.exports = {Observation,subType}

//On Home page rise  --  get the list of all projects and display => project_id, contractor_name, site_name, site_location
//On project details page   -- get the particular project details and display => contractor_name, site_name, site_location, inspection_reports

//Add Project page  => takes only contractor_name, site_name, site_location   -- so inspection_reports must be nullable and required is false