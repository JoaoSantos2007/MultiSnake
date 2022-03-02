//Express e Socket IO config
const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)

webServer.listen(3000, function () {
  console.log('> Server listening on port:', 3000)
});


//Firebase
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } = require('firebase/auth');
const { initializeApp } = require('firebase/app')
const firebaseConfig = require('./assets/firebase.json')
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)


//Other files
const {SendFiles} = require('./Class/SendFiles.js')
SendFiles(webApp,__dirname)
const {Game} = require('./Class/Game.js')
const {User} = require('./Class/User.js')

const server = {
  games: [],
  users: [],
  allowKeys: ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
  verifLogin,
}

function verifLogin(socketId) {
    const user = auth.currentUser;
    if (user) {
      return(true)
    }  
  }




setInterval(() => {
  io.emit('current_connections', io.engine.clientsCount)
}, 5000)



io.on('connection', function (socket) {
  server.users.push(new User(socket.id))
  console.log(server.users)


  socket.on('play',(gameMode) =>{
    let findGame = false
    for(i in server.games){
      if(server.games[i].type == gameMode && server.games[i].players.length < 5 && findGame != true){
        server.games[i].addPlayer(socket.id)
        findGame = true
      }
    }
    if(findGame != true){
      const random_gameId = Math.floor(Math.random() * 100000000000)
      let newGame = new Game(gameMode)
      newGame.addPlayer(socket.id)
      server.games.push(newGame)
    }

    console.log(server.games)
  })


  // socket.on('changeKey', (key) => {
  //   //Verif key
  //   let new_direction = null
  //   if (teclas_permitidas.includes(key)) {
  //     if (key === 'w' || key === 'ArrowUp') {
  //       new_direction = 'up'
  //     } else if (key === 's' || key === 'ArrowDown') {
  //       new_direction = 'down'
  //     } else if (key === 'a' || key === 'ArrowLeft') {
  //       new_direction = 'left'
  //     } else if (key === 'd' || key === 'ArrowRight') {
  //       new_direction = 'right'
  //     } else {
  //       return
  //     }

  //     if (new_direction != game.players[socket.id].direction && new_direction != null) {
  //       game.players[socket.id].direction = new_direction
  //     }
  //   }

  socket.on('login', (array) => {
    signInWithEmailAndPassword(auth, array[0], array[1]).then(() => {
      if(server.verifLogin(socket.id)){
        socket.emit('logged',[array[0], array[1]])
      }
    }).catch((e) => {
      socket.emit('error-login', e)
    });

  })

  socket.on('disconnect', () => {
    // game.removePlayer(socket.id)
    //socket.broadcast.emit('player-remove', socket.id)
  })
})