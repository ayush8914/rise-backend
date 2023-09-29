const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    //in mongodb id is automatically generated              //project id
    userid : { type: mongoose.Schema.Types.ObjectId, ref: "users" }, //ref to particular user so we can easily get the projects of that user
    contractor_name: { type: String, required: true },     //contractor name
    site_name: { type: String, required: true },           //site name
    site_location: { type: String, required: true }, 
    image: { type: String, required: true}
          //site location
}, { timestamps: true});

module.exports = mongoose.model("projects", projectSchema); 

//On Home page rise  --  get the list of all projects and display => project_id, contractor_name, site_name, site_location
//On project details page   -- get the particular project details and display => contractor_name, site_name, site_location, inspection_reports

//Add Project page  => takes only contractor_name, site_name, site_location   -- so inspection_reports must be nullable and required is false