const mongoose = require("mongoose");

const liftSchema = new mongoose.Schema({
    //in mongodb id is automatically generated              
    inspectionid : { type: mongoose.Schema.Types.ObjectId, ref: "inspections" }, 
    isissue: { type: Boolean, required: true },     
    observations : [ {
        type: {
    Standards : [
        {
         type: {
            option: {type:String, required:true},
            notes : [{type:String, required:false}],
            media : [{type:String, required:false}]
            },
            required: false   
        }
    ],
    Ledgers : [
        {
            type: {
                option: {type:String, required:true},
                notes : [{type:String, required:false}],
                media : [{type:String, required:false}]
                },
                required: false
        }
    ],

    Braces : [
        {
            type: {
                option: {type:String, required:true},
                notes : [{type:String, required:false}],
                media : [{type:String, required:false}]
                },
                required: false
        }
    ],

    Transoms : [
        {
            type: {
                option: {type:String, required:true},
                notes : [{type:String, required:false}],
                media : [{type:String, required:false}]
                },
                required: false
        }
    ],

    work_area :  [
        {
            type: {
                option: {type:String, required:true},
                notes : [{type:String, required:false}],
                media : [{type:String, required:false}]
                },
                required: false
        }

    ],

    stability : [
        {
            type: {
                option: {type:String, required:true},
                notes : [{type:String, required:false}],
                media : [{type:String, required:false}]
                },
                required: false
        }
    ],

    Access_Egress : [
        {
            type: {
                option: {type:String, required:true},
                notes : [{type:String, required:false}],
                media : [{type:String, required:false}]
                },
                required: false
        }
    ],
   }, required: false
  },
 ]
}, { timestamps: true});

module.exports = mongoose.model("lifts", liftSchema);