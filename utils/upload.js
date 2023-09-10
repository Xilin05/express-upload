// 引入配置好的 multerConfig
const multerConfig = require('./multer')
const path = require('path')
const fs = require('fs')
const fsPromises = require('fs/promises')

const imagemin = require('imagemin')
const imageminJpegtran = require('imagemin-jpegtran')
const imageminMozjpeg = require('imagemin-mozjpeg')
const imageminOptipng = require('imagemin-optipng')
const imageminGifsicle = require('imagemin-gifsicle')

// 上传到服务器地址
const BaseURL = 'http://127.0.0.1:5012'
// 上传到服务器的目录
const imgPath = '/public/upload/'
const tempImgPath = '/public/upload/temp/'

const handlePath = dir => {
  return path.join(__dirname, './', dir)
}

// 封装上传单个图片的接口
function uploadImage(req, res) {
  return new Promise((resolve, reject) => {
    multerConfig.single('file')(req, res, function (err) {
      if (err) {
        // 传递的图片格式错误或者超出文件限制大小，就会reject出去
        reject(err)
      } else {
        // 拼接成完整的服务器静态资源图片路径
        resolve(BaseURL + tempImgPath + req.file.filename)

        // 对图片进行去重删除和重命名
        // hanldeImgDelAndRename(req.body.id, req.file.filename, handlePath('../../public'))
        // const img = req.file.filename.split('.')
        // resolve({
        //   id: req.body.id,
        //   img_url: BaseURL + imgPath + img[0] + '.' + req.body.id + '.' + img[1]
        // })
      }
    })
  })
}

// 封装上传多个图片的接口
function uploadImages(req, res) {
  return new Promise((resolve, reject) => {
    multerConfig.array('file_list')(req, res, async function (err) {
      if (err) {
        // 传递的图片格式错误或者超出文件限制大小，就会reject出去
        reject(err)
      } else {
        const fsError = await fsOperation(req)
        console.log('fsError', fsError)

        if (!fsError) {
          // 拼接成完整的服务器静态资源图片路径
          const paths =
            req.files?.map(m => BaseURL + imgPath + m.filename) || []
          resolve(paths)
        } else {
          throw new Error(fsError)
        }
      }
    })
  })
}

async function handleCompressImage(file) {
  if (file.mimetype == 'image/png') {
    return (
      (await imagemin(['public/upload/' + file.filename], {
        destination: 'public/upload/temp',
        plugins: [imageminOptipng({ quality: 5 })]
      })) || []
    )
  }

  if (file.mimetype == 'image/gif') {
    return (
      (await imagemin(['public/upload/' + file.filename], {
        destination: 'public/upload/temp',
        plugins: [
          imageminGifsicle({
            optimizationLevel: setImageQuality(file.size, 'png'),
            colors: 180
          })
        ]
      })) || []
    )
  }

  return (
    (await imagemin(['public/upload/' + file.filename], {
      destination: 'public/upload/temp',
      plugins: [imageminMozjpeg({ quality: setImageQuality(file.size, 'jpg') })]
    })) || []
  )

  // imageminJpegtran 调整为渐进式图片，暂时不需要
  // return (
  //   (await imagemin(['public/upload/' + file.filename], 'public/upload/temp', {
  //     use: [imageminJpegtran({ progressive: true })]
  //   })) || []
  // )
}

function fsOperation(req) {
  return new Promise(async (resolve, reject) => {
    let tempUrl = path.join(__dirname, '../public/upload/temp/')
    let mainUrl = path.join(__dirname, '../public/upload/')
    let fsError = null

    for (let index = 0; index < req?.files?.length; index++) {
      const element = req?.files[index]

      if (['image/png', 'image/jpeg', 'image/gif'].includes(element.mimetype)) {
        fsError = fs.writeFileSync(
          tempUrl + element.filename,
          (await handleCompressImage(element))[0].data
        )
      } else {
        fsError = fs.renameSync(
          process.cwd() + '/public/upload/temp/' + element.filename
        )
      }

      if (fsError) {
        reject(fsError)
        break
      }
    }

    resolve(fsError)
  })
}

function setImageQuality(size, type) {
  if (size / 1048576 < 2) {
    if (type == 'png') return 3
    if (type == 'jpg') return 100
  }

  if (size / 1048576 > 9) {
    if (type == 'png') return 7
    if (type == 'jpg') return 30
  }

  if (type == 'png') return 5
  if (type == 'jpg') return 50
}

// 对图片进行去重删除和重命名
const hanldeImgDelAndRename = (id, filename, dirPath) => {
  // TODO 查找该路径下的所有图片文件
  fs.readdir(dirPath, (err, files) => {
    for (let i in files) {
      // 当前图片的名称
      const currentImgName = path.basename(files[i])
      // 图片的名称数组：[时间戳, id, 后缀]
      const imgNameArr = currentImgName.split('.')

      // TODO 先查询该id命名的文件是否存在，有则删除
      if (imgNameArr[1] === id) {
        const currentImgPath = dirPath + '/' + currentImgName
        fs.unlink(currentImgPath, err => {})
      }

      // TODO 根据新存入的文件名(时间戳.jpg)，找到对应文件，然后重命名为: 时间戳 + id.jpg
      if (currentImgName === filename) {
        const old_path = dirPath + '/' + currentImgName
        const new_path =
          dirPath + '/' + imgNameArr[0] + '.' + id + path.extname(files[i])
        // 重命名该文件，为用户 id
        fs.rename(old_path, new_path, err => {})
      }
    }
  })
}

const uploadActions = {
  uploadImage,
  uploadImages
}

module.exports = uploadActions
