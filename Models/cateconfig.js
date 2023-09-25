const mongoose = require("mongoose");

const cateconfigSchema = new mongoose.Schema({

    fields: [{typr:Object, required:true}],
}, { timestamps: true});