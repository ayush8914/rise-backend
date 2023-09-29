const mongoose = require("mongoose");

const objSchema = new mongoose.Schema({
  
    sub_type: { type: Boolean, required: true },
    category: { type: String, required: true },
    issue: { type: Boolean, required: true },
    observations : [
        {
            type: {
                option: {type:String, required:true},
                notes : [
                    {  type:
                        {
                        noteid : {type:String, required:false}, 
                        note : {type:String, required:false}    
                    },
                    required: false
                    }
                ],
                media : [{type:String, required:false}]
                },
                required: false
        }
    ],
    subtypes: [
        {
            type: {
                category: { type: String, required: true },
                observations : [
                    {
                        type: {
                            option: {type:String, required:true},
                            notes : [
                                {  type:
                                    {
                                    noteid : {type:String, required:false}, 
                                    note : {type:String, required:false}    
                                },
                                required: false
                                }
                            ],
                            media : [{type:String, required:false}]
                            },
                            required: false
                    }
                ]
            },
            required: false
        }
    ]

});

const Obj = mongoose.model("objs", objSchema);
module.exports = {Obj}