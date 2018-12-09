var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var VersionSchema = new Schema({
  version: Number,
});

var Version = mongoose.model("Version", VersionSchema);
module.exports = Version;
