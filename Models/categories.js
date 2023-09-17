const moongoose = require('mongoose');

const observationSchema = new moongoose.Schema({
    inspectionid: {
        type: moongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'inspections'
    },
    
    category: { type: String, required: true },
    IssueIdentified: { type: String, required: true },
    observations : [
     Object   
    ]
  
});



module.exports = moongoose.model('categories', observationSchema);