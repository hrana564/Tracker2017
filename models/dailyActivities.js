var mongoose = require('mongoose');

var DailyActivitySchema = new mongoose.Schema({
    ActivityId: [mongoose.Schema.Types.ObjectId],
    DoneOn: String,
    DoneStatus: { type: Boolean, default: false },
    UpdatedOn: { type: Date, default: Date.now }
});

module.exports = mongoose.model('DailyActivity', DailyActivitySchema);