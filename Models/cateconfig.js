const mongoose = require("mongoose");

const cateconfigSchema = new mongoose.Schema({

   cate:[
         {
            type:{
            category: { type: String, required: true },
            subcategory: [{ type: String, required: true }],
         
            }, required: true 
        }
   ]
}, { timestamps: true});

module.exports = mongoose.model("cateconfigs", cateconfigSchema);