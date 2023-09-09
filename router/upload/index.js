const express = require('express')
const fs = require('fs')
const enumLoopAction = require('../../utils/loop')
const router = express.Router()

const UploadController = require('../../controllers/UploadController')

router.get('/list', async (req, res) => {
  const result = await enumLoopAction.LoopFiles({ req })
  const response = {
    data: result,
    code: 200,
    message: '获取成功'
  }
  res.sendResult(response)
})

router.get('/files', (req, res) => {
  // res.send({ msg: 'upload get', route: req.route })
  // res.status(404).end()
  res.render('404')
})

router.get('/download', (req, res) => {
  const file_name = req.query.file_name
  const file_path = process.cwd() + '/public/upload/' + file_name
  console.log('req.query.file_name', file_path)
  res.download(file_path)
  // res.send('upload get')
})

router.post('/update/name', (req, res) => {
  console.log('req', req.body)

  res.sendResult({ code: 200, message: 'qingqiu chenggon' })
})
router.post('/image', UploadController.uploadFile)
router.post('/images', UploadController.uploadFiles)

router.post('/oss', (req, res) => {
  // res.send('upload post')
  if (!req.files) {
    res.send({
      status: 400,
      msg: '上传文件不能为空'
    })

    return
  }

  const files = req.files
  const fileList = []

  for (let file of files) {
    //获取名字后缀
    let file_ext = file.originalname.substring(
      file.originalname.lastIndexOf('.') + 1
    )
    //使用时间戳作为文件名字
    let file_name = new Date().getTime() + '.' + file_ext
    // 移动文件并且修改文件名字
    fs.renameSync(
      process.cwd() + '/public/upload/temp/' + file.filename,
      process.cwd() + '/public/upload/' + file_name
    )
    fileList.push('/public/upload/' + file_name)
  }

  res.send({
    code: 200,
    msg: 'ok',
    data: fileList
  })
})

function formatDate(date, format) {
  const map = {
    mm: date.getMonth() + 1,
    dd: date.getDate(),
    yy: date.getFullYear().toString().slice(-2),
    yyyy: date.getFullYear()
  }

  return format.replace(/mm|dd|yy|yyy/gi, matched => map[matched])
}

module.exports = router
