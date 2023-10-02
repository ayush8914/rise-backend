const mongoose = require('mongoose');


const ioptionSchema = new mongoose.Schema({
      option : { type: String, required: true },
},{ timestamps: true});

module.exports  = mongoose.model("ioptions", ioptionSchema);
