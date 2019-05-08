var express = require('express');
var router = express.Router(); //创建一个路由对象

//引入并配置 connect-multiparty模块 处理文件（图片）
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();

//引入构造好的model数据模型对象
var artModel = require('../models/artmodel');
var msgModel = require('../schemas/msgschema')
//1,管理员端文章列表页面
router.get('/list',function(req,res){
    // res.render('manager/list')
    artModel.find().count().then(function (allnum) {
        // console.log(allnum)
        var pageNum = Math.ceil(allnum/5);
        var pageArr = [];
        // console.log(pageNum)
        for (var i=0;i<pageNum;i++) {
            pageArr.push(i+1)
        }
        artModel.find().limit(5).then(function (data) {
            res.render('manager/list',{
                mylistData:data,
                num:pageArr,
            })
        })
    })
});
//2.分页功能
router.get('/list/page',function (req,res) {
    var p = req.query.p;
    var skipNum = (p-1)*5;
    artModel.find().skip(skipNum).limit(5).then(function (data) {
        res.send(data)
    })
});
//3,管理员端发布文章页面
router.get('/pub',function(req,res){
    res.render('manager/pub')
});

//4.图片上传接口
var fs = require('fs');
router.post('/upload',multipartMiddleware, function(req, res) {
    // console.log(req.files);// don't forget to delete all req.files when done
    var imgFile = req.files.file;
    var fType = imgFile.type.split('/')[1];
    fs.readFile(imgFile.path, function(err, data){
        if (err){
            throw err;
        }
        var newPath = '/upload/'+new Date().getTime()+'.'+fType;
        fs.writeFile(__dirname+'/static'+newPath, data, function(err){
            if (err) {
                throw err
            };
            res.send('/public'+newPath);
        });
        // console.log(data);
    });
});

//5.接收发布文章内容的接口
router.post('/pub/add',function (req,res) {
    new artModel({
        title:req.body.title,
        author:req.body.author,
        intro:req.body.intro,
        imgUrl:req.body.imgUrl,
        time:req.body.time,
        words:req.body.words,
    }).save().then(function (data) {
        if(data){
            console.log('存储成功');
            res.send({
                code:1,
                msg:'发布成功'
            })
        }
    })
});
//6.删除文章接口
router.get('/del',function (req,res) {
    artModel.remove({_id:req.query.id}).then(function (data) {
        // console.log(data)  //{ n: 1, ok: 1, deletedCount: 1 } 代表成功删除    { n: 0, ok: 1, deletedCount: 0 }删除失败
        if (data.deletedCount!=0){
            res.send({
                code:1,
                msg:'删除成功'
            })
        }else{
            res.send({
                code:0,
                msg:'删除失败'
            })
        }
    })
});
//7.编辑文章接口
router.get('/edit',function (req,res) {
    var eid = req.query.eid;
    artModel.findOne({_id:eid}).then(function (data) {
        res.render('manager/edit',
            {
                editData:data
            })
    })
})
//8.更新数据的接口
router.post('/edit/upload',function (req,res) {
    var id =req.body._id;
    artModel.update({_id:id},{
        title:req.body.title,
        author:req.body.author,
        intro:req.body.intro,
        imgUrl:req.body.imgUrl,
        time:req.body.time,
        words:req.body.words,
    }).then(function (result) {
        if(result.nModified!=0){
            res.send({
                code:1,
                msg:'编辑成功'
            })
        }else{
            res.send({
                code:0,
                msg:'编辑失败'
            })
        }
    })
});
// 9.留言页面接口
router.get('/msg',function(req,res){
    // res.render('manager/list')
    msgModel.find().count().then(function (allnum) {
        // console.log(allnum)
        var pageNum = Math.ceil(allnum/5);
        var pageArr = [];
        // console.log(pageNum)
        for (var i=0;i<pageNum;i++) {
            pageArr.push(i+1)
        }
        msgModel.find().limit(5).then(function (data) {
            res.render('manager/msg',{
                mylistData:data,
                num:pageArr,
            })
        })
    })
});
// 10.删除留言接口
router.get('/msgdel',function (req,res) {
    msgModel.remove({_id:req.query.id}).then(function (data) {
        // console.log(data)  //{ n: 1, ok: 1, deletedCount: 1 } 代表成功删除    { n: 0, ok: 1, deletedCount: 0 }删除失败
        if (data.deletedCount!=0){
            res.send({
                code:1,
                msg:'删除成功'
            })
        }else{
            res.send({
                code:0,
                msg:'删除失败'
            })
        }
    })
});
//11.留言分页功能
router.get('/msg/page',function (req,res) {
    var p = req.query.p;
    var skipNum = (p-1)*5;
    msgModel.find().skip(skipNum).limit(5).then(function (data) {
        res.send(data)
    })
});
module.exports = router;
