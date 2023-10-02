const mongoose = require('mongoose');


const ioptionSchema = new mongoose.Schema({
      reason : { type: String, required: true },
},{ timestamps: true});

module.exports  = mongoose.model("reasons", ioptionSchema);
