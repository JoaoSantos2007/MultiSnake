class User{
    constructor(socket){
        this.email;
        this._password;
        this.displayName;
        this.socket = socket;
        this.socketID = socket.id;
        this.setting = {};
    }


}

module.exports = {User}