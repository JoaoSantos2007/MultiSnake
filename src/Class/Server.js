const {User} = require('./User.js')
const {Game} = require('./Game.js')

class Server{
    constructor(){
        this.games = [],
        this.users = [],
        this.allowKeys = ['w', 'a', 's', 'd', 'ArrowUp', 'ArrowLeft', 'ArrowDown', 'ArrowRight']

        //Incrementa 1 no time a cada segundo
        setInterval(() =>{
            for(const i in this.games){
                this.games[i].time++
            }
        },1000)
    }

    syncUser(socketID,socket){
        let createNewUser = true
        
        //Verifica se já existe o usuário
        for(const i in this.users){
            if(this.users[i].socketID == socketID){
              createNewUser = false
              for(const x in this.games){
                for(const y in this.games[x].sockets){
                  if(this.games[x].sockets[y].id == socketID){
                    this.games[x].sockets[y] = socket
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
        for(const i in this.games){
          console.log(i)
          if(this.games[i].type == gameMode && this.games[i].sockets.length < 6 && findGame != true){
            this.games[i].addPlayer(socket)
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


}

module.exports = {Server}