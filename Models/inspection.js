const mongoose = require("mongoose");
//its basically inspection of sites

const inspectionSchema = new mongoose.Schema({
    //ref to project
    projectid: { type: mongoose.Schema.Types.ObjectId, ref: "projects" }, //ref to particular project so we can easily get the inspection reports of that project
    Date : { type: Date, required: true },                   //date of inspection
    starttime: { type: String, required: true },            //start time of inspection
    inspector_name : { type: String, required: true },        //name of inspector
    inspector_role : { type: String, required: true },           //role of inspector   => advanced scaffold inspector
    scaffold_description : { type: String, required: true },   //description of scaffold
    referenceImages : [{ type: String, required: false  }],          //reference images of scaffold
    bespokedesigns : [{ type: String, required: false }],            //bespoke designs of scaffold
    statutory_inspection : { type: Boolean, required: false },     //is it statutory   -> required is false because it is not mandatory
    reason_for_inspection : { type: String, required: false },      //reason for statutory inspection -> required is false because it is not mandatory
    inspection_date : { type: Date, required: false },   //last inspection date  -> required is false because it is not mandatory
});


module.exports = mongoose.model("inspections", inspectionSchema);

