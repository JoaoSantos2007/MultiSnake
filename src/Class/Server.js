const {User} = require('./User.js')
const {Game} = require('./Game.js')

class Server{
    constructor(){
        this.games = [],
        this.users = [],
        this.allowKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']

        //Incrementa 1 no time a cada segundo
        setInterval(() =>{
          this.main()
        },1000)
    }


    /*
    ===========================
          Game Functions
    ===========================
    */

    main(){
      for(const gameIndex in this.games){
        const game = this.games[gameIndex]
        if(game.stage === 'running'){
          game.time++
          game.sendTime()
          if(game.verifGameEnd()){
            this.games.splice(this.games.indexOf(game), 1);
          }
        }
      }
    }

    searchGames(gameMode,socket){
      let findGame = false
      
      for(const gamesIndex in this.games){
        if(this.games[gamesIndex].type === gameMode && this.games[gamesIndex].totPlayers < 6 && findGame != true && this.games[gamesIndex].stage == 'waitPlayers'){
          this.games[gamesIndex].addPlayer(socket)
          findGame = true
        }
      }
  
      if(findGame != true){
        const random_gameId = Math.floor(Math.random() * 100000000000)
        let newGame = new Game(gameMode,random_gameId)
        newGame.addPlayer(socket)
        this.games.push(newGame)      
      }

      console.log(this.games)
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