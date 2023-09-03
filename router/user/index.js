const express = require('express')

const router = express.Router()

router.get('/list', (req, res) => {
  // res.render('index')
  // res.send('get 成功 list')
  throw new Error('服务器出错')
})

router.post('/info', (req, res) => {
  // res.send('get 成功 info')
  res.render('about')
})

module.exports = router
