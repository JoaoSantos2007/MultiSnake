const {User} = require('./User.js')
const {Game} = require('./Game.js')

class Server{
    constructor(){
        this.games = [],
        this.users = [],
        this.allowKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']

        //Incrementa 1 no time a cada segundo
        setInterval(() =>{
            for(const gameIndex in this.games){
              if(this.games[gameIndex].stage === 'running'){
                this.games[gameIndex].time++
                this.games[gameIndex].sendTime()
                this.verifGameEnd(this.games[gameIndex])
              }
            }
        },1000)
    }

    syncUser(socketID,socket){
      let createNewUser = true
      
      //Verifica se já existe o usuário
      for(const usersIndex in this.users){
          if(this.users[usersIndex].socketID == socketID){
            createNewUser = false
            for(const gamesIndex in this.games){
              for(const playersIndex in this.games[gamesIndex].players){
                if(this.games[gamesIndex].players[playersIndex].socket.id == socketID){
                  this.games[gamesIndex].players[playersIndex].socket = socket
                }
              }
            }
          }
      }
    
      if(createNewUser){
          this.users[socketID] = new User(socketID)
          console.log(this.users)
      }
    }

    searchGames(gameMode,socket){
        let findGame = false
        
        for(const gamesIndex in this.games){
          if(this.games[gamesIndex].type === gameMode && Number((Object.keys(this.games[gamesIndex].players).length)+1) < 6 && findGame != true && this.games[gamesIndex].stage == 'waitPlayers'){
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
        if(this.games[gamesIndex].players === socketID){
          this.games[gamesIndex].playerExit(socketID)
        }
        
      }
    }

    verifGameEnd(game){
      if(game.time >= 180 || game.players.length <= 1){
        game.stage = 'showResults'
        game.showResults()
        setTimeout(() => {
          game.goLobby()
          this.games.splice(this.games.indexOf(game), 1);
        },10000)
      }
    }



}

module.exports = {Server}