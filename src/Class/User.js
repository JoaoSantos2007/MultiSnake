class User{
    constructor(socketID,email = null){
        this.socketID = socketID,
        this.email = email
    }
}

module.exports = {User}