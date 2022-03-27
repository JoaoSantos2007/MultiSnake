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
const {Server} = require('./Class/Server.js')
const server = new Server


io.on('connection', function (socket) {

  /*
  =================================
        Sync User Socket ID
  =================================
  */

  //Set Socket ID
  socket.on('setSocketID',(socketID) => {
    socket.id = socketID
    server.syncUser(socketID,socket)    
  })

  //Define Socket ID in a cookie
  socket.on('getSocketID',() => {
    socket.emit('defineSocketID',(socket.id))
  })


  /*
  ================================
        Execute User whishes
  ================================
  */

  //Enter a game
  socket.on('play',(gameMode) =>{
    server.searchGames(gameMode,socket)
  })

  //Exit a game
  socket.on('exitGame',() =>{
    server.exitPlayer(socket.id)
  })
  

  /*
  ===============================

  ==============================
  */
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

  
  //socket.on('disconnect', () => {})
})