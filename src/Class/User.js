class User{
    constructor(socketId,email = null){
        this.socketId = socketId,
        this.email = email
    }
}

module.exports = {User}