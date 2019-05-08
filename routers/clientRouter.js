var express = require('express');
var router = express.Router(); //创建一个路由对象

var artModel = require('../models/artmodel');
var msgModel = require('../schemas/msgschema');//引入数据库的msg数据模型对象

//1.用户进入的接口
router.get('/',function (req,res) {
    artModel.find().limit(6).then(function (data) {
        res.render('client/blog',{
            blogData:data
        })
    })
})

//2.用户点击加载更多的接口
var n = 0;
router.post('/client/more',function (req,res) {
    n = parseInt(req.body.n)+6;
    // console.log(typeof n)
    // console.log(n)
    setTimeout(function () {
        artModel.find().limit(n).then(function (data) {
            res.send(data)
        })
    },1500);

});


//3.文章内容信息
router.get('/detail',function (req,res) {
    var aId = req.query.id;
    artModel.findOne({_id:aId}).then(function (data) {
        msgModel.find({aid:aId}).then(function (msgData) {
            res.render('client/contact',{
                detailD:data,
                msgD:msgData,
            })
        })
    })
});
//4.留言部分
router.post('/detail/leavemsg',function (req,res) {
    // console.log(req.body)
    new msgModel(req.body).save().then(function (data) {
        if (data._id){
            res.send({
                code:1,
                msg:'留言成功'
            })
        }else {
            res.send({
                code:0,
                msg:'留言失败'
            })
        }
    })

});
module.exports = router;