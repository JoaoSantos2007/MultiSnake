//Express e Socket IO config
const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)


//Print server working 
webServer.listen(3000, function () {
  console.log('> Server Working...')
});

//Send files to client
const {SendFiles} = require('./scripts/SendFiles.js')
SendFiles(webApp,__dirname)

//Create Server Object
const {Server} = require('./systems/Server.js')
const server = new Server


io.on('connection', (socket) => {
    server.SocketIO(socket)
})