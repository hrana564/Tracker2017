var mongoose = require('mongoose');

var ActivitySchema = new mongoose.Schema({
    ActivityName: String,
    ActivitySelectorName : String,
    ActivityActive: { type: Boolean, default: true }
});

module.exports = mongoose.model('Activities', ActivitySchema)