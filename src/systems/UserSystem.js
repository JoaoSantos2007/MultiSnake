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
        const getCircularReplacer = () => {
            const seen = new WeakSet();
            return (key, value) => {
              if (typeof value === "object" && value !== null) {
                if (seen.has(value)) {
                  return;
                }
                seen.add(value);
              }
              return value;
            };
          };

        console.log((socket))
        let test = JSON.stringify(socket,getCircularReplacer())
        console.log(test.length)
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