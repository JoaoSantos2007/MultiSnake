const {MatchMaking} = require('./MatchMaking.js')
const {Game} = require('../Class/Game.js')

class GameSystem{
    constructor(){
        this.matchMaking = new MatchMaking
        this.games = [],
        
        setInterval(() =>{
            this.main()
        },1000)
    }

    main(){
        this.updateGames()
    }

    updateGames(){
        for(const gameIndex in this.games){
            const game = this.games[gameIndex]
            if(game.stage === 'running'){
            game.time++
            game.sendTime()
            if(game.verifGameEnd()){
                delete this.games[gameIndex]
            }
            }
        }
    }

        /*
    =============================
            Match Making
    =============================
    */

    verifGameStarted(){
        for(const gameIndex in this.matchMaking.temporaryListGame){
          const provisoryGame = this.matchMaking.temporaryListGame[gameIndex]
          if(this.matchMaking.checkGame(provisoryGame) === true){
            delete this.matchMaking.temporaryListGame[gameIndex]
            this.createGame(provisoryGame)
          }
        }
      }
  
    createGame(provisoryGame){
    const newGame = new Game(provisoryGame.mode,provisoryGame.id)
    newGame.teams = provisoryGame.teams
    
    for(const socketIndex in provisoryGame.sockets){
        newGame.addPlayer(provisoryGame.sockets[socketIndex])
    }

    this.games[provisoryGame.id] = (newGame)
    console.log(this.games[provisoryGame.id])
    }
}

module.exports = {GameSystem}