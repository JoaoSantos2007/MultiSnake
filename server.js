//Express e Socket IO config
const express = require('express')
const webApp = express()
const webServer = require('http').createServer(webApp)
const io = require('socket.io')(webServer)


const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, updateProfile } = require('firebase/auth');
const { initializeApp } = require('firebase/app')
const firebaseConfig = require('./assets/firebase.json')

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp)



webApp.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html')
})





webServer.listen(3000, function () {
  console.log('> Server listening on port:', 3000)
});

setInterval(() => {
  io.emit('current_connections', io.engine.clientsCount)
}, 5000)


const teclas_permitidas = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']


server = {
  socket_ids: []
}

io.on('connection', function (socket) {

  //Verifica se a conexão está cheia
  const admin = socket.handshake.query.admin
  if (io.engine.clientsCount > 15 && !admin) {
    socket.conn.close()//Fecha conexão
    return//Acaba a função
  }

  const playerState = game.addPlayer(socket.id)

  // game.socket_ids.push(socket.id)

  // socket.emit('game-state', game)
  // socket.emit('play_music', 'game')


  socket.on('changeKey', (key) => {
    //Verif key
    let new_direction = null
    if (teclas_permitidas.includes(key)) {
      if (key === 'w' || key === 'ArrowUp') {
        new_direction = 'up'
      } else if (key === 's' || key === 'ArrowDown') {
        new_direction = 'down'
      } else if (key === 'a' || key === 'ArrowLeft') {
        new_direction = 'left'
      } else if (key === 'd' || key === 'ArrowRight') {
        new_direction = 'right'
      } else {
        return
      }

      if (new_direction != game.players[socket.id].direction && new_direction != null) {
        game.players[socket.id].direction = new_direction
      }
    }
  })

  socket.on('play',(gameMode) =>{
    server.games.push(new Game(mode))
  })


  socket.on('login', (array) => {
    signInWithEmailAndPassword(auth, array[0], array[1]).then(() => {
      if(game.verif_login(socket.id)){
        socket.emit('enter')
      }
    }).catch((e) => {
      socket.emit('error-login', e)
    });

  })

  socket.on('create-account', (array) => {
    createUserWithEmailAndPassword(auth, array[0], array[1]).then(() => {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          updateProfile(user, {
            displayName: array[2],
            score: 0
          }).then(() => {
            console.log(user.displayName)
            game.verif_login(socket.id)

          }).catch((error) => {
            // An error occurred
            // ...
          });
          const uid = user.uid;
        } else {
          console.log('error')
        }
      });
    }).catch((e) => {
      socket.emit('error-create_account', e)
    });

  })





  socket.on('disconnect', () => {
    game.removePlayer(socket.id)
    //socket.broadcast.emit('player-remove', socket.id)
  })
})



class Game{
  constructor(){
    this.canvasWidth = 300,
    this.canvasHeight = 150,
    this.objectWidth = 10,
    this.objectHeight = 10,
    this.players = {},
    this.fruits = {},
    this.socket_ids = [],
    this.type = mode;
  }

  main() {
    for (const socketId in game.socket_ids) {
      game.movePlayer(game.socket_ids[socketId])
      game.verif_end(game.socket_ids[socketId])
    }
    io.emit('game-state', game)
  }
  
  
  //Adiciona um jogador
  addPlayer(socketId) {
    //retorna um obj
    const player_x = (Math.floor(Math.random() * 30)) * 10
    const player_y = ((Math.floor(Math.random() * 15)) * 10)
    return game.players[socketId] = {
      x: player_x,
      y: player_y,
      direction: null,
      score: 0,
      positions: [[player_x, player_y]],
      delete_last_position: true
    }
  }
  
  
  
  //Remove um jogador
  removePlayer(socketId) {
    delete game.players[socketId]
    game.socket_ids.splice(game.socket_ids.indexOf(socketId), 1)
  }
  
  
  
  
  //Move o jogador
  movePlayer(socketId) {
    const player = game.players[socketId]
    const playerWidth = game.objectWidth
    const playerHeight = game.objectHeight
    const direction = game.players[socketId].direction
    if (direction == null) return
  
    if (direction === 'left') {
      player.x = player.x - playerWidth
    }
  
    if (direction === 'up') {
      player.y = player.y - playerHeight
    }
  
    if (direction === 'right') {
      player.x = player.x + playerWidth
    }
  
    if (direction === 'down') {
      player.y = player.y + playerHeight
    }
  
    player.positions.push([player.x, player.y])
    if(player.delete_last_position){
      player.positions.splice(0, 1)
    }else{
      player.delete_last_position = true
    }
    
    //return player
  
    game.verif_food(socketId)
  
  }
  
  
  
  //Função para adicionar frutas
  addFruit() {
    const fruitRandomId = Math.floor(Math.random() * 10000000)
    let fruitRandomX = null
    let fruitRandomY = null
    let valid_food_position = null
    do {
      valid_food_position = true
      fruitRandomX = (Math.floor(Math.random() * 30)) * 10
      fruitRandomY = (Math.floor(Math.random() * 15)) * 10
  
  
      // for(var i = 0;i < positions.length;i++){
      //     if(n1 == positions[i][0] && n2 == positions[i][1]){
      //         valid_food_position = false
      //     }
      // }
  
  
      for (fruitId in game.fruits) {
        const fruit = game.fruits[fruitId]
        if (fruit.x === fruitRandomX && fruit.y === fruitRandomY) {
          return false
        }
      }
    } while (valid_food_position != true)
  
  
  
    game.fruits[fruitRandomId] = {
      x: fruitRandomX,
      y: fruitRandomY
    }
  
    return {
      fruitId: fruitRandomId,
      x: fruitRandomX,
      y: fruitRandomY
    }
  
  }
  
  removeFruit(fruitId) {
    delete game.fruits[fruitId]
  }
  
  verif_food(socket) {
    for (var fruitId in game.fruits) {
      const fruit = game.fruits[fruitId]
  
      for (var socketId in game.players) {
        const player = game.players[socketId]
        if (player.x === fruit.x && player.y === fruit.y) {
          player.score++
          player.delete_last_position = false
          game.removeFruit(fruitId)
          io.to(socket).emit('play_music', 'food')
        }
      }
    }
  }
  
  verif_end(socketId) {
    const player = game.players[socketId]
    if (player.x >= 290 || player.x < 0 || player.y >= 150 || player.y < 0) {
      player.direction = null
    }
    for (var i = 0; i < player.positions.length - 1; i++) {
      if (player.positions[i][0] == player.x && player.positions[i][1] == player.y) {
        player.direction = null
      }
    }
  }
}



function verif_login(socketId) {
  return onAuthStateChanged(auth, (user) => {
    console.log(socketId)
    if (user) {
      game.players[socketId].user_information = {
        email: user.email,
        displayName: user.displayName,
        score: user.score
      }
      const uid = user.uid;
      return true
    } else {
      return false
      // User is signed out
      // ...
    }
  });
}


// setInterval(game.main, 100)
// setInterval(game.addFruit, 5000)