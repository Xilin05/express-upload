function ErrorCatch(err, req, res, next) {
  console.log('=====================》', err)
  if (err.status === 401) {
    console.log('token Invalid')
    return res.sendResult({ code: 401, message: 'token Invalid' })
  }

  if (err.message.indexOf('BadRequestError') !== -1) {
    return res.sendResult({ code: 400, message: err.message.split('#')[1] })
  }

  return res.sendResult({ code: 500, message: '服务器异常，请联系管理员' })
}

module.exports = ErrorCatch
