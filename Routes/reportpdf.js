
const express = require('express');
var pdf = require("pdf-creator-node");
const fs = require('fs');
const router = express.Router();
const axios = require('axios');
const Inspection = require('../Models/inspection');

const getInspections = async (id) => {
    const res = await axios.get(`http://159.65.20.7:5000/api/inspections/details/${id}`,timeout=300000);
    return res.data;
}

const getconclusion = async (id) => {
    const res = await axios.get(`http://159.65.20.7:5000/api/conclusions/getconclusion/${id}`,timeout=300000);
    return res.data.info;
}

const Handlebars = require('handlebars');
const { time } = require('console');

Handlebars.registerHelper('incrementedIndex', function(value) {
  return value + 1;
});


Handlebars.registerHelper('formatDateTime', function(dateString) {

    const date = new Date(dateString);

    const optionsDate = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = date.toLocaleDateString('en-US', optionsDate);

    const optionsTime = { hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formattedTime = date.toLocaleTimeString('en-US', optionsTime);

    return `${formattedDate} ${formattedTime}`;
  
});


router.put('/:id', async(req,res)=>{
try{

    const data = await getInspections(req.params.id);
    console.log(data);
    const inspectionid = req.params.id;

const logo = `${req.protocol}://${req.get('host')}/pdf.png`;

var html = fs.readFileSync("./Routes/Viewreport.html", "utf8");

var options = {
    format: "A3",
    orientation: "portrait",
    border: "10mm",
    header: {
      height: "20mm",

    },
    footer: {
      height: "20mm",
    },
    timeout: '300000'
};

  var document = {
    html: html,
    data: {
      logo : logo,
      inspection : data.info,
      observations : data.observations,
      lifts : data.lifts,
      conclusion : await getconclusion(inspectionid),
    },
    path: "./public/pdf/"+ inspectionid + ".pdf",
    type: "",
  };

  await pdf
  .create(document, options)
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log("error");
    console.error(error);
  });
    
  const file = `${req.protocol}://${req.get('host')}/pdf/`+ inspectionid+ ".pdf";
  console.log(file);
  
  const insp = await Inspection.findById({_id:inspectionid});
   console.log(insp);
  if(!insp){
    return res.status(200).json({
      Status:0,
      Message:'Inspection not found',
  });
  }


  insp.reporturl = file;
  const updated_inspection = await insp.save();
    res.status(200).json({
        Status:1,
        Message:'Fetched successfully',
        info: updated_inspection,
    });

}catch(err){
  console.log(err);
  res.status(200).json({
    Status:0,
    Message:'Failed to fetch',
    error: err
});

}

});

module.exports = router;    
