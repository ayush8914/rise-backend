const mongoose = require("mongoose");

const liftSchema = new mongoose.Schema({
    //in mongodb id is automatically generated       
    headingid: {type:mongoose.Schema.Types.ObjectId, required:true},       
    inspectionid : { type: mongoose.Schema.Types.ObjectId, ref: "inspections" }, 
    isissue: { type: Boolean, required: true },     
    observations :  [
        {   
            type: {
            id : {type:String, required:false},
            obj:{
                Standards : [
                    {
                     type: {
                        option: {type:String, required:false},
                        notes : [{type:String, required:false}],
                        media : [{type:String, required:false}],
                        rectifyInspection : {type: Boolean , required: false},
                        },
                        required: false   
                    }
                ],
                Ledgers : [
                    {
                        type: {
                            option: {type:String, required:false},
                            notes : [{type:String, required:false}],
                            media : [{type:String, required:false}],
                            rectifyInspection : {type: Boolean , required: false},
                            },
                            required: false
                    }
                ],
            
                Braces : [
                    {
                        type: {
                            option: {type:String, required:false},
                            notes : [{type:String, required:false}],
                            media : [{type:String, required:false}],
                            rectifyInspection : {type: Boolean , required: false},
                            },
                            required: false
                    }
                ],
            
                Transoms : [
                    {
                        type: {
                            option: {type:String, required:false},
                            notes : [{type:String, required:false}],
                            media : [{type:String, required:false}],
                            rectifyInspection : {type: Boolean , required: false},
                            },
                            required: false
                    }
                ],
            
                "Work Area" :  [
                    {
                        type: {
                            option: {type:String, required:false},
                            notes : [{type:String, required:false}],
                            media : [{type:String, required:false}],
                            rectifyInspection : {type: Boolean , required: false},

                            },
                            required: false
                    }
            
                ],
            
                Stability : [
                    {
                        type: {
                            option: {type:String, required:false},
                            notes : [{type:String, required:false}],
                            media : [{type:String, required:false}],
                            rectifyInspection : {type: Boolean , required: false},

                            },
                            required: false
                    }
                ],
            
                "Access Egress" : [
                    {
                        type: {
                            option: {type:String, required:false},
                            notes : [{type:String, required:false}],
                            media : [{type:String, required:false}],
                            rectifyInspection : {type: Boolean , required: false},

                            },
                            required: false
                    }
                ]
            }
        },required:false
    }
    ]
}, { timestamps: true});

module.exports = mongoose.model("lifts", liftSchema);