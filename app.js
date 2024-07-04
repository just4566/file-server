const express = require('express')
const cors = require('cors')
const https = require('https')
const bodyParser = require('body-parser')
const fs = require('fs')
const chalk = require('chalk')
const path = require("path")
const imgRouter = require('./route/img')
const domain = 'localhost'


const app = express()

app.use(cors())

app.use(express.static(__dirname + '/public'))
app.use(express.static(path.resolve('./static')))

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/img', imgRouter)

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