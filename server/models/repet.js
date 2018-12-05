var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var RepetSchema = new Schema({
  date: Date,
  songs: Array
});

var Repet = mongoose.model("Repet", RepetSchema);
module.exports = Repet;
