var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var SelectionSchema = new Schema({
  creationDate: Date,
  track: Object,
  userId: String,
  vote: Array
});

var Selection = mongoose.model("Selection", SelectionSchema);
module.exports = Selection;
