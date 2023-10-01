// const mongoose = require("mongoose");

// const objSchema = new mongoose.Schema({
//     inspectionid : { type: mongoose.Schema.Types.ObjectId, ref: "inspections" },  
//     issue: { type: Boolean, required: true },
//     headingid: { type: mongoose.Schema.Types.ObjectId, required: true },
//     data: [
//         {   
//             subheadingid: { type: mongoose.Schema.Types.ObjectId, required: true },
//             observations: [
//                 {
//                     type: {
//                         option: { type: String, required: true },
//                         notes: [{type: String, required: false }],
//                         media: [{ type: String, required: false }]
//                     },
//                     required: false
//                 }
//             ]
//         }
//     ]

// });

// const Obj = mongoose.model("objs", objSchema);
// module.exports = {Obj}