const {GenerateCode} = require('../scripts/GenerateCode.js')
const { User } = require('../Class/User.js')

class UserSystem{
    constructor(){
        this.users = {}
    }

    getUserID(socketID){
        for(const UserID in this.users){
            if(this.users[UserID].socketID === socketID){
                return(UserID)
            }
        }   
    }

    addUser(socket){
        const randomID = GenerateCode()
        this.users[randomID] = new User(socket)
    }

    syncUser(socket){
        let foundUser = false
        
        //Verifica se já existe o usuário
        for(const usersIndex in this.users){
            if(this.users[usersIndex].socketID === socket.id){
                foundUser = true
                this.users[usersIndex].socket = socket
            }
        }
      
        if(foundUser != true){
            this.addUser(socket)
        }
    }
}

module.exports = {UserSystem}