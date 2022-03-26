//Express e Socket IO config
const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)

webServer.listen(3000, function () {
  console.log('> Server listening on port:', 3000)
});


//Other files
const {SendFiles} = require('./scripts/SendFiles.js')
SendFiles(webApp,__dirname)
const {Server} = require('./Class/Server.js')
const server = new Server

setInterval(() => {
  io.emit('current_connections', io.engine.clientsCount)
}, 5000)

// io.set('log level', false)

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
    server.exitPlayer(socket.id)
  })


  socket.on('changeKey', (key) => {
    //Verif key
    if (server.allowKeys.includes(key)) {
      for(const gameIndex in server.games){
        for(const socketID in server.games[gameIndex].players){
          if(socketID == socket.id){
            server.games[gameIndex].changeKey(key,socket.id)
          }
        }
      }
    }
  })



  socket.on('disconnect', () => {
  })
})