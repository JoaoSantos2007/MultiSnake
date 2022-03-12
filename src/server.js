//Express e Socket IO config
const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)

webServer.listen(3000, function () {
  console.log('> Server listening on port:', 3000)
});

//Other files
const {SendFiles} = require('./Class/SendFiles.js')
SendFiles(webApp,__dirname)
const {Game} = require('./Class/Game.js')
const {Server} = require('./Class/Server.js')
const server = new Server

setInterval(() => {
  io.emit('current_connections', io.engine.clientsCount)
}, 5000)


io.on('connection', function (socket) {

  //Set Socket ID
  socket.on('setSocketID',(socketID) => {
    socket.id = socketID
    server.syncUser(socketID,socket)    
  })
  //Define Socket ID in a cookie
  socket.on('getSocketID',() => {
    socket.emit('defineSocketID',(socket.id))
  })

  
  //Enter a game
  socket.on('play',(gameMode) =>{
    server.searchGames(gameMode,socket)
  })

  socket.on('exitGame',() =>{
    console.log('sair')
    server.quitPlayer(socket.id)
  })


  socket.on('changeKey', (key) => {
    //Verif key
    if (server.allowKeys.includes(key)) {
      for(const i in server.games){
        for(const x in server.games[i].socketIds){
          if(server.games[i].socketIds[x] == socket.id){
            server.games[i].changeKey(key,socket.id)
          }
        }
      }
    }
  })



  socket.on('disconnect', () => {
  })
})