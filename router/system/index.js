const express = require('express')
const router = express.Router()

const fs = require('fs')
const path = require('path')

const version = require('../../public/version.json')

router.get('/version', (req, res) => {
  res.sendResult({ code: 200, data: version, message: '请求成功' })
})

router.post('/info', (req, res) => {
  // res.send('get 成功 info')
  res.render('about')
})

function generateUUID() {
  var d = new Date().getTime()
  var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
    /[xy]/g,
    function (c) {
      var r = (d + Math.random() * 16) % 16 | 0
      d = Math.floor(d / 16)
      return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
    }
  )
  return uuid
}

function UUIDByVersion(version) {
  return (version || 'vUndefined') + Math.random().toString(36).substr(2, 9)
}

module.exports = router
