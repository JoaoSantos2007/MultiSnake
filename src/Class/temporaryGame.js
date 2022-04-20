class temporaryGame{
    constructor(random_gameId,gameMode){
        this.id = random_gameId,
        this.mode = gameMode,
        this.teams = {},
        this.sockets = [],
        this.TimeToStart = 0
    }
}

module.exports = {temporaryGame}