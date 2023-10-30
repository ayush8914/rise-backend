const mongoose = require('mongoose');

const resultsofinspecitonsSchema = new mongoose.Schema({
    result : { type: String, required: true },
});

module.exports  = mongoose.model("resultsofinspecitons", resultsofinspecitonsSchema);