const { UserSystem } = require('./UserSystem.js')
const { GameSystem } = require('./GameSystem.js')
const { MatchMaking } = require('./MatchMaking.js')

class Server {
  constructor() {
    this.gameSystem = new GameSystem,
    this.userSystem = new UserSystem,
    this.matchMaking = new MatchMaking,
    this.allowKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']
  }

  SocketIO(socket){
    /*
    =================================
          Sync User Socket ID
    =================================
    */

    //Set Socket ID
    socket.on('setSocketID', (socketID) => {
      socket.id = socketID
      this.userSystem.syncUser(socket)
    })

    //Define Socket ID in a cookie
    socket.on('getSocketID', () => {
      socket.emit('defineSocketID', (socket.id))
    })


    /*
    ================================
          Execute User whishes
    ================================
    */

    //Enter a game
    socket.on('play', (gameMode) => {
      let UserID = this.userSystem.getUserID(socket.id)
      this.matchMaking.searchGames(gameMode, UserID)
    })

    //Exit a game
    socket.on('exitGame', (gameID) => {
      let UserID = this.userSystem.getUserID(socket.id)
      this.games[gameID].exitPlayer(UserID)
    })

    //
    socket.on('changeKey', (data) => {
      let UserID = this.userSystem.getUserID(socket.id)
      //Verif key
      if (this.allowKeys.includes(data.key)) {
        this.gameSystem.games[data.gameID].changeKey(data.key,UserID)
      }
    })

    //socket.on('disconnect', () => {})
  }
}

module.exports = { Server }