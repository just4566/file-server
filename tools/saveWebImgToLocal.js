const fs = require('fs')
const http = require("http");

function isExist(path) {
  return fs.existsSync(path)
}

let idx = 0
function writeFileToLocal(path, fileName, data){
  return new Promise((resolve, reject) => {
    if (isExist(`${path}/${fileName}`)){
      writeFileToLocal(path, `${idx++}_${fileName}`, data).then((curName)=>resolve(curName), err=>reject(err))
    }else{
      fs.writeFile(`${path}/${fileName}`, data, 'binary', (err)=>{
        if (err) reject(err)
        else resolve(fileName)
      })
    }
  })
}


let defaultName = '文件'
let defaultNameIdx = 0
function getWebImageName(webUrl){
  if (typeof webUrl !== 'string') return `${defaultName}_${defaultNameIdx}`
  const subs = webUrl.split('/')
  return subs[subs.length - 1]
}

function getFileFromWeb(webUrl) {
  return new Promise((resolve, reject) => {
    http.get(webUrl,(response)=>{
      let data = ''
      response.setEncoding('binary')
      response.on('data', (chunk)=>{
        data += chunk
      })
      response.on('end', (err)=>{
        if (err) reject(err)
        else resolve(data)
      })
    }).on('error', (response, socket, head)=>{
      reject(response)
    })
  })
}

function saveWebImgToLocal(path, webUrl){
  const fileName = getWebImageName(webUrl)
  const protocol = webUrl.split(':')[0]
  return new Promise((resolve, reject) => {
    if (protocol === 'https') {
      reject('暂不支持 https 协议')
    }else {
      getFileFromWeb(webUrl).then((buffer)=>{
        writeFileToLocal(path, fileName, buffer).then(resolve).catch(reject)
      })
    }
  })
}

module.exports = saveWebImgToLocal