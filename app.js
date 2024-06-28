const express = require('express')
const cors = require('cors')
const https = require('https')
const fs = require('fs')
const chalk = require('chalk')
const domain = 'localhost'

const app = express()

app.use(cors())

app.use(express.static(__dirname + '/public'))

app.use('', (req, res)=>{
    res.send('服务器状态：running')
})

const httpsServer = https.createServer({
        key: fs.readFileSync('./cert/key.pem'),
        cert: fs.readFileSync('./cert/cert.pem')
    },
    app
)

start(app, 5000, false)
start(httpsServer, 5001, true)

function start(app, port, https){
    const protool = https? "https" : "http"
    const url = `${protool}://${domain}:${port}`
    const logHead = chalk.yellow( `[${protool}服务] `)

    app.listen(port, ()=>{
        console.log(`\n====================${protool}====================`)
        console.log(logHead + '开启端口：' + `${chalk.green(port)}`)
        console.log(logHead + '访问地址：' + `${chalk.green(url)}`)
        console.log('============================================'+ (https ? '=' : ''))
    })
}