var mongoose = require('mongoose');
var mySchema = mongoose.Schema;
var artSchema = new mySchema({
    'title':String,
    'author':String,
    'intro':String,
    'words':String,
    'time':String,
    'imgUrl':String,
    'isTop':Boolean
})
module.exports = artSchema;