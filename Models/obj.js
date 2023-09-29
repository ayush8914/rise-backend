const mongoose = require("mongoose");

const objSchema = new mongoose.Schema({
  
    category: { type: String, required: true },
    issue: { type: Boolean, required: true },
    data: [
        {   
            subheading: { type: String, required: true },
            observations: [
                {
                    type: {
                        option: { type: String, required: true },
                        notes: [{ type: String, required: false }],
                        media: [{ type: String, required: false }]
                    },
                    required: false
                }
            ]
        }
    ]

});

const Obj = mongoose.model("objs", objSchema);
module.exports = {Obj}