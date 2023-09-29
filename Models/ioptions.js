const mongoose = require('mongoose');


const ioptionSchema = new mongoose.Schema({
   options: [
     {type : String, required: true}
   ]
});

module.exports  = mongoose.model("ioptions", ioptionSchema);
