const mongoose = require('mongoose');


const ioptionSchema = new mongoose.Schema({
   options: [
        {
             type: {
                option: { type: String, required: true },
             },
                required: false
        }
   ]
});

const Ioption = mongoose.model("ioptions", ioptionSchema);
module.exports = {Ioption}