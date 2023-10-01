const mongoose = require("mongoose");

const observationSchema = new mongoose.Schema({
      inspectionid: { 
         type: mongoose.Schema.Types.ObjectId,
         required: true,
         ref: 'inspections'
       },
       headingid: {type:mongoose.Schema.Types.ObjectId, required:true},
       issue_identified: {type:Boolean, required:true},
       observations : [
         {
            type: {
               option: {type:String, required:true},
               notes : [{type:String, required:false}],
               media : [{type:String, required:false}]
            },
            required: false
         }
         ]
});

module.exports = mongoose.model("observations", observationSchema);
