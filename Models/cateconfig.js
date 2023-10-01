const mongoose = require("mongoose");

const cateconfigSchema = new mongoose.Schema({

   category:[
         {
            type:{
            heading: { type: String, required: true },
            subheading: [
              { type: String, required: true }
            ],
            }, required: true
          }
   ]
}, { timestamps: true});

module.exports = mongoose.model("cateconfigs", cateconfigSchema);