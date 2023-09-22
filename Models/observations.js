const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema({
      inspectionid: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'inspections'
       },
       category: {type:String, required:true},
       isissue: {type:Boolean, required:true},
       observations : [
         {
            type: {
               option: {type:String, required:true},
               notes : [{type:String, required:false}],
               media : [{type:String, required:false}]
            },
            required: false
         }
         ,]
  
});


const subTypeSchema = new mongoose.Schema({
    type:{type:String, required:true},
    observations:[
    observationSchema
   ]
});

const Observation = mongoose.model("observations", observationSchema);
// const subType = mongoose. model("subType", subTypeSchema);
module.exports = {Observation}

//On Home page rise  --  get the list of all projects and display => project_id, contractor_name, site_name, site_location
//On project details page   -- get the particular project details and display => contractor_name, site_name, site_location, inspection_reports

//Add Project page  => takes only contractor_name, site_name, site_location   -- so inspection_reports must be nullable and required is false