const mongoose = require("mongoose");


const cateconfigSchema = new mongoose.Schema({
    inspectionid : { type: mongoose.Schema.Types.ObjectId, ref: "inspections" },
    result_of_inspection: { type: String, required: true },
    result_of_inspection_data : { type: String, required: true },
    further_action: { type: String, required: true },
    report_Communicated_to : { type: String, required: true },
    Time_inspection_finished : { type: String, required: true},
    inspector_signature : { type: String, required: true },

},{timestamps: true});
    
module.exports = mongoose.model("conclusions", cateconfigSchema);



