const express = require('express')
const router = express.Router()
const fs = require('fs')
const path = require("path")
const saveWebImgToLocal = require('../tools/saveWebImgToLocal')

router.get('/', (req, res)=>{
  fs.readdir(path.resolve('../static'), (err, files)=>{
    if (err) res.send({
      status: 0,
      msg: err
    })
    else res.send({
      status: 1,
      data: files,
      msg: '成功'
    })
  })
})
router.post('/save', (req, res)=>{
  const serverBaseUrl = req.headers['origin']
  const webImgUrl = req.body.source
  saveWebImgToLocal(path.resolve('./static'), webImgUrl)
    .then((fileName)=>{
      res.send({
        status: 1,
        msg: '成功',
        data: `${serverBaseUrl}/${fileName}`
      })
    })
    .catch(err=>{
      res.send({
        status: 0,
        msg: '失败',
        data: err
      })
    })
})

module.exports = router