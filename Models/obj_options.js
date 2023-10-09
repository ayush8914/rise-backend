const mongoose = require('mongoose');


const objoptionSchema = new mongoose.Schema({
      option : { type: String, required: true },
},{ timestamps: true});

module.exports  = mongoose.model("objoptions", objoptionSchema);
