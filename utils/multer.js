// 1. 引入依赖
const multer = require('multer')
const path = require('path')

// 2. 封装处理路径函数
const handlePath = dir => path.join(__dirname, './', dir)

// 3. 设置 multer 的配置对象
const storage = multer.diskStorage({
  // 3.1 存储路径
  destination: function (req, file, cb) {
    const enumMimetType = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp'
    ]
    if (enumMimetType.includes(file.mimetype)) {
      cb(null, handlePath('../public/upload'))
    } else {
      cb({ error: '仅支持 jpg/jpeg/png/gif/svg/webp 格式的图片！' })
    }
  },
  //  3.2 存储名称
  filename: function (req, file, cb) {
    // 将图片名称分割伪数组，用于截取图片的后缀
    const fileFormat = file.originalname.split('.')
    // 自定义图片名称
    // cb(null, Date.now() + '.' + fileFormat[fileFormat.length - 1])
    const fileName = Date.now() + '-time-' + file.originalname
    cb(null, fileName)
  }
})

// 4. 为 multer 添加配置
const multerConfig = multer({
  storage: storage,
  limits: { fileSize: 10485760 } // 10M
})

module.exports = multerConfig
