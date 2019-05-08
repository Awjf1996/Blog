var mongoose =require('mongoose');
var Schema = mongoose.Schema;
var msgSchema = new Schema({
    'aid':String,
    'tit':String,
    'name':String,
    'email':String,
    'msg':String,
});
var msgModel = mongoose.model('msgModel',msgSchema);
module.exports = msgModel;