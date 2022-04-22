class temporaryGame{
    constructor(gameID,gameMode){
        this.id = gameID,
        this.mode = gameMode,
        this.teams = {},
        this.players = [],
        this.TimeToStart = 0
    }
}

module.exports = {temporaryGame}