const {UserSystem} = require('./UserSystem.js')
const {GameSystem} = require('./GameSystem.js')

class Server{
  constructor(){
      this.game = new GameSystem,
      this.UserSystem = new UserSystem,
      this.allowKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
  }

  SocketIO(socket){
      /*
  =================================
        Sync User Socket ID
  =================================
  */

  //Set Socket ID
  socket.on('setSocketID',(socketID) => {
    socket.id = socketID
    this.UserSystem.syncUser(socket)    
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
    this.matchMaking.searchGames(gameMode,socket)
  })

  //Exit a game
  socket.on('exitGame',(gameID) =>{
    this.games[gameID].exitPlayer(socket.id)
  })
  

  /*
  ===============================

  ==============================
  */
  socket.on('changeKey', (data) => {
    //Verif key
    if (this.allowKeys.includes(data.key)) {
      this.games[data.gameID].changeKey(data.key,socket.id)
    }
  })

  //socket.on('disconnect', () => {})
  }
}

module.exports = {Server}