var mongoose = require('mongoose');
var artSchema = require('../schemas/artschema');
var artModel = mongoose.model('artModel',artSchema);
module.exports = artModel;