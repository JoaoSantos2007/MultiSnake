const {GenerateCode} = require('../scripts/GenerateCode.js')
const { User } = require('../Class/User.js')

class UserSystem{
    constructor(){
        this.users = {}
    }

    getUser(){
        return(this.socketID)
    }

    findUser(){
        for(const userSocketID in this.users.socketID){
            console
        }
    }

    addUser(socket){
        const randomID = GenerateCode()
        this.users[randomID] = new User(socket)
    }

    syncUser(socket){
        // console.log(this.users)
        let findUser = false
        
        //Verifica se já existe o usuário
        for(const usersIndex in this.users){
            if(this.users[usersIndex].socketID === socket.id){
                findUser = true
                this.users[usersIndex].socket = socket
                console.log(this.users[usersIndex].User)
            }
        }
      
        if(findUser != true){
            this.addUser(socket)
        }
    }
}

module.exports = {UserSystem}