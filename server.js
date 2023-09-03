const express = require('express')
const bodyParser = require('body-parser')
const app = express()

app.set('views', 'views')
app.set('view engine', 'hbs')

app.use('/public/', express.static('public'))
app.use(express.json())
app.use(bodyParser.json())
// 解析表单
// for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }))

const logger = require('./utils/logger')
app.use(logger)

const resextra = require('./utils/resextra')
app.use(resextra)

// 允许跨域
app.all('*', function (req, res, next) {
  // res.header('Access-Control-Allow-Origin', req.headers.origin)
  res.header('Access-Control-Allow-Origin', '*')
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type,Content-Length, Authorization, Accept,X-Requested-With'
  )
  res.header('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header('X-Powered-By', ' 3.2.1')
  if (req.method === 'OPTIONS') res.send(200) /*让options请求快速返回*/
  else next()
})

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

app.use((err, req, res, next) => {
  res.status(500).render('500')
})

const port = 39008

app.listen(port, '127.0.0.1', () => {
  console.log(`服务已启动，访问地址：http://127.0.0.1:${port}`)
})
