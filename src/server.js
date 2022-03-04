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
    server.syncUser(socket.id)    
  })
  //Define Socket ID in a cookie
  socket.on('getSocketID',() => {
    socket.emit('defineSocketID',(socket.id))
  })

  
  //Enter a game
  socket.on('play',(gameMode) =>{
    let findGame = false
    for(i in server.games){
      if(server.games[i].type == gameMode && server.games[i].players.length < 6 && findGame != true && time < 0){
        server.games[i].addPlayer(socket)
        findGame = true
      }
    }

    if(findGame != true){
      const random_gameId = Math.floor(Math.random() * 100000000000)
      let newGame = new Game(gameMode,random_gameId)
      newGame.addPlayer(socket)
      server.games.push(newGame)
      
    }

    console.log(server.games)
  })


  socket.on('changeKey', (key) => {
    //Verif key
    if (server.allowKeys.includes(key)) {
      for(i in server.games){
        for(x in server.games[i].socketIds){
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