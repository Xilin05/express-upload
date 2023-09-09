const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const app = express()
require('express-async-errors')

var fs = require('fs')
var https = require('https')

// 解析表单
// for parsing application/x-www-form-urlencoded
// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))

app.set('views', 'views')
app.set('view engine', 'hbs')

app.use(cors())
app.use('/public/', express.static('public'))
app.use(express.json())

const resextra = require('./utils/resextra')
app.use(resextra)

const logger = require('./utils/logger')
app.use(logger)

// 允许跨域
// app.all('*', function (req, res, next) {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header(
//     'Access-Control-Allow-Headers',
//     'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
//   )
//   res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
//   res.header('Access-Control-Allow-Credentials', 'true')
//   res.header('X-Powered-By', ' 3.2.1')
//   if (req.method === 'OPTIONS') res.send(200) /*让options请求快速返回*/
//   else next()
// })

const Upload = require('./router/upload')
const User = require('./router/user')

app.use('/upload', Upload)
app.use('/user', User)

app.get('/', (req, res) => {
  res.send('根路径啥也没有')
})

app.use('*', (req, res) => {
  res.status(404).render('404', { url: req.originalUrl })
})

// app.use((err, req, res, next) => {
//   res.status(500).render('500')
// })

const ErrorCatch = require('./utils/async-errors')
app.use(ErrorCatch)

const port = 5012
app.listen(port, () => {
  console.log(`服务已启动，访问端口地址：${port}`)
  // console.log(`服务已启动，访问地址：http://${hostName}:${port}`)
})

// // 此处是你的ssl证书文件
// var privateKey = fs.readFileSync('./bin/dingding.shining98.top.key')
// // 此处是你的ssl证书文件
// var certificate = fs.readFileSync('./bin/dingding.shining98.top_bundle.pem')
// var credentials = { key: privateKey, cert: certificate }

// const hostName = '0.0.0.0'
// const httpsPort = 5012
// var httpsServer = https.createServer(credentials, app)
// httpsServer.listen(httpsPort, () => {
//   console.log(`服务已启动，访问端口地址：${httpsPort}`)
// })
