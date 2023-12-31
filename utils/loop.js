const fs = require('fs')

function LoopFiles({ dirPath = 'public/upload', req, res }) {
  // const res = fs.readdirSync(dirPath)
  // console.log('loopfiles req', req.rawHeaders)
  console.log('req.get host', req.get('Host'), req.protocol)
  return new Promise((resolve, reject) => {
    fs.readdir(dirPath, (err, files) => {
      const fileNameList =
        files
          ?.map(m => {
            const info = fs.statSync(`${dirPath}/${m}`)
            if (!info.isDirectory()) {
              return {
                uid: GenNonDuplicateID(),
                img_url: `${req.protocol}://${req.get(
                  'Host'
                )}/public/upload/${m}`,
                img_url_temp: `${req.protocol}://${req.get(
                  'Host'
                )}/public/upload/temp/${m}`,
                size: formatSize(info.size),
                name: m?.split('-time-')?.[1],
                timestamp: new Date(info.ctime).getTime(),
                create_time: new Date(info.ctime).toLocaleString()
              }
            }
          })
          ?.filter(f => f) || []

      fileNameList.sort((a, b) => b.timestamp - a.timestamp)

      if (err) {
        reject(err)
      } else {
        resolve(fileNameList)
      }
    })
  })
}

// console.log(formatSize(100)) // => 100B
// console.log(formatSize(1024)) // => 1.00K
// console.log(formatSize(1024, 0)) // => 1K
// console.log(formatSize(1024 * 1024)) // => 1.00M
// console.log(formatSize(1024 * 1024 * 1024)) // => 1.00G
// console.log(formatSize(1024 * 1024 * 1024, 0, ['B', 'KB', 'MB'])) // => 1024MB

function formatSize(size, pointLength, units) {
  var unit
  units = units || ['B', 'KB', 'MB', 'GB', 'TB']
  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024
  }
  return (unit === 'B' ? size : size.toFixed(pointLength || 2)) + unit
}

function GenNonDuplicateID(randomLength = 10) {
  let idStr = Date.now().toString(36)
  idStr += Math.random().toString(36).substr(3, randomLength)
  return idStr
}

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

const enumLoopAction = {
  LoopFiles
}

module.exports = enumLoopAction
