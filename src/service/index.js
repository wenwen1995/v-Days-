const Koa = require('koa');
const cors = require('koa2-cors');
const koajwt = require('koa-jwt');
const bodyParser = require('koa-bodyparser');
const Router = require('koa-router');
const static = require('koa-static');


//引入连接文件,引入其他router
const { connect }= require('./init');
let user = require('../api/user');
let record = require('../api/record');
let img = require('../api/upload'); //图片

const app = new Koa(); 

//加载跨域中间件
app.use(cors());


//加载处理前端请求中间件
app.use(bodyParser());


//错误处理
app.use((ctx,next) => {
  return next().catch(error => {
    console.log('author error ===>',error.status)
    if(error.status === 401) {
      ctx.status = 401;
      ctx.body = { errorMsg:'未授权，拒绝访问！' };
    }else {
      throw error;
    }
  })
})

// /user/login  /user/forgetPwd /user/register /record/modifyRecord 不需要不需要token
// app.use(koajwt({ secret: "userToken" }).unless({
//   path: [/\/user\/login/,/\/user\/register/,/\/user\/forgetPwd/ ]
// }));


//指定服务器的静态资源地址，在当前目录下的文件可以直接localhost:3000/filename访问到
app.use(static('../../static/')); //该目录是相对于server入口文件而言的


let router = new Router();

//装载user的路由
router.use('/user',user.routes());

//装载record的路由
router.use('/record',record.routes());


//装载img 上传的路由
router.use('/img',img.routes());


//加载路由中间件
app.use(router.routes());
app.use(router.allowedMethods());


app.listen(3000,() => {
	console.log('koa works ----~~~')
});

(async () => {
  await connect(); 
})();