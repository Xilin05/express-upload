function logger(req, res, next) {
  const time = new Date()
  // console.log('req', req)
  // console.log(
  //   `[${time.toLocaleString()}]\n${req.method} ---- ${req.url}\n${
  //     req.rawHeaders
  //   }`
  // )
  next()
}

module.exports = logger
