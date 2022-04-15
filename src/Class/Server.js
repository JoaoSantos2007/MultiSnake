const {User} = require('./User.js')
const {matchMaking} = require('./matchMaking.js')

const {Game} = require('./Game.js')


class Server{
    constructor(){
        this.games = {},
        this.users = [],
        this.allowKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight'],
        this.matchMaking = new matchMaking

        //Incrementa 1 no time a cada segundo
        setInterval(() =>{
          this.main()
        },1000)
    }


    /*
    ===========================
          Server Functions
    ===========================
    */

    main(){
      this.verifGameStarted()
      this.updateGames()
    }


    /*
    =============================
            Game Functions
    =============================
    */

    updateGames(){
      for(const gameIndex in this.games){
        const game = this.games[gameIndex]
        if(game.stage === 'running'){
          game.time++
          game.sendTime()
          if(game.verifGameEnd()){
            delete this.games[gameIndex]
          }
        }
      }
    }

    exitPlayer(socketID){
      for(const gamesIndex in this.games){
        for(const playerSocketID in this.games[gamesIndex].players){
          if(playerSocketID === socketID){
            this.games[gamesIndex].playerExit(socketID)
          }
        }        
      }
    }


    /*
    =============================
            Match Making
    =============================
    */

    verifGameStarted(){
      for(const gameIndex in this.matchMaking.temporaryListGame){
        const provisoryGame = this.matchMaking.temporaryListGame[gameIndex]
        if(this.matchMaking.checkGame(provisoryGame) === true){
          delete this.matchMaking.temporaryListGame[gameIndex]
          this.createGame(provisoryGame)
        }
      }
    }

    createGame(provisoryGame){
      const newGame = new Game(provisoryGame.mode,provisoryGame.id)
      
      for(const socketIndex in provisoryGame.sockets){
        newGame.addPlayer(provisoryGame.sockets[socketIndex])
      }

      this.games[provisoryGame.id] = (newGame)
    }

    /*
    ============================
          User Functions
    ============================
    */

    
    syncUser(socketID,socket){
      let createNewUser = true
      
      //Verifica se já existe o usuário
      for(const usersIndex in this.users){
          if(this.users[usersIndex].socketID == socketID){
            createNewUser = false
            for(const gamesIndex in this.games){
              for(const playerSocketID in this.games[gamesIndex].players){
                if(playerSocketID === socketID){
                  this.games[gamesIndex].players[playerSocketID].socket = socket
                }
              }
            }
          }
      }
    
      if(createNewUser){
          this.users[socketID] = new User(socketID)
      }
    }

}

module.exports = {Server}