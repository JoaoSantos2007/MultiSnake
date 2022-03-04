const {User} = require('./User.js')

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

    syncUser(socketID){
        let createNewUser = true
        
        //Verifica se já existe o usuário
        for(const i in this.users){
            if(this.users[i].socketID === socketID){
              createNewUser = false
              for(x in this.games){
                for(y in this.games[x].sockets){
                  if(this.games[x].sockets[y].id == socket.id){
                    this.games[x].sockets[y] = socket
                  }
                }
              }
            }
        }
      
          if(createNewUser){
            this.users.push(new User(socketID))
            console.log(this.users)
          }
    }


}

module.exports = {Server}