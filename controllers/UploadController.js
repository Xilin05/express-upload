const uploadActions = require('../utils/upload')

// 上传的逻辑控制器
class UploadController {
  // 图片上传
  async uploadFile(req, res) {
    try {
      const uploadRes = await uploadActions.uploadImage(req, res)
      res.send({
        meta: { code: 200, msg: '上传成功！' },
        data: { img_url: uploadRes }
      })
    } catch (error) {
      res.send(error)
    }
  }

  // 多图片上传
  async uploadFiles(req, res) {
    try {
      const uploadRes = await uploadActions.uploadImages(req, res)

      const response = {
        data: { img_urls: uploadRes },
        code: 200,
        message: '上传成功！'
      }
      res.sendResult(response)
    } catch (error) {
      console.log('error', error)
      res.sendResult(error)
    }
  }
}

module.exports = new UploadController()
