//引入模块
var express = require('express');
var swig = require('swig');
var mongoose = require('mongoose');
var artModel = require('./models/artmodel');//引入构造好的model数据模型对象

//调用express模块根方法
var app = express();

//引入并配置 body-parser模块
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//swig模块的配置项
app.engine('html',swig.renderFile);
app.set('views',__dirname+'/views');
app.set('view engine','html');
swig.setDefaults({cache:false});//关闭siwg模板缓存（模板缓存默认开启，用户体验较好。测试时关闭）

//静态资源托管
app.use('/public',express.static(__dirname+'/static'));

//管理端接口
app.use('/admin',require('./routers/adminRouter'))
//用户端接口
app.use('/',require('./routers/clientRouter'))

mongoose.connect('mongodb://localhost:27017/Blog',{useNewUrlParser:true},function (err) {
    if(err){
        console.log(err)
    }else{
        console.log('数据库连接成功')
        app.listen(8000) //4,启动服务
    }
});
