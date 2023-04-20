const server = require('../main.js')
const {temporaryGame} = require('../Class/temporaryGame.js')
const {Game} = require('../Class/Game.js')
const {GenerateCode} = require('../scripts/GenerateCode.js')

class MatchMaking{

  constructor(){
    this.temporaryListGame = []
    this.gameOptions = ['solo','duo','trio','squad','local','local2v2']

    setInterval(() =>{
      this.main()
    },1000)
  }

  main(){
    for(const gameIndex in this.temporaryListGame){

      const game = this.temporaryListGame[gameIndex]

      game.TimeToStart++
      this.checkGame(game)
      this.shareMessage('sendTimeStart',game.TimeToStart,game.players)
    }
  }

  checkGame(game){
    let limitPlayers = 0

    switch(game.mode){
      case 'solo':
        limitPlayers = 4
        break
      case 'duo':
        limitPlayers = 6
        break
      case 'trio':
        limitPlayers = 6
        break
      case 'squad':
        limitPlayers = 8
        break
    }

    if(game.TimeToStart > 10 || game.players.length === limitPlayers){
      this.createGame(game)
      this.shareMessage('goTo','/multplayer',game.players)
      this.temporaryListGame.splice(this.temporaryListGame.indexOf(game),1)
    }
  }

  searchGames(gameMode,playerID){
      let foundGame = false

      if(this.gameOptions.includes(gameMode) != true){
        return
      }

      switch(gameMode){
        case 'local':
          this.shareMessage('goTo','/local',playerID)
          foundGame = true
          break

        case 'local2v2':
          this.shareMessage('goTo','/local2v2',playerID)
          foundGame = true
          break
        
        default:
          for(const gameIndex in this.temporaryListGame){
            const game = this.temporaryListGame[gameIndex]
            if(game.mode === gameMode){
              this.insertPlayer(game,playerID)
              foundGame = true
              break
            }
          }
      }
      

  
      if(foundGame != true){
        this.insertPlayer(this.createProvisoryGame(gameMode),playerID)
      }    
  }

  insertPlayer(game,playerID){
    game.players.push(playerID)
    if(game.mode !== 'solo'){

      let limitPlayersTeam = 0

      switch(game.mode){
        case 'duo':
          limitPlayersTeam = 2
          break
        case 'trio':
          limitPlayersTeam = 3
          break
        case 'squad':
          limitPlayersTeam = 4
          break
      }

      // const nTeams = (Object.keys(game.teams)).length
      let foundTeam = false
      for(const indexTeam in game.teams){
        if(foundTeam !== true && game.teams[indexTeam].length < limitPlayersTeam){
          game.teams[indexTeam].push(playerID)
          foundTeam = true
        }
      }
    }
  }
  
  createProvisoryGame(gameMode){
    const randomID = GenerateCode()
    const provisoryGame = new temporaryGame(randomID,gameMode)
    let teams = {}
    switch(gameMode){
      case 'solo':
        teams = null
      case 'duo':
        teams = {
          'team1': [],
          'team2': [],
          'team3': []
        }
        break
      default:
        teams = {
          'team1': [],
          'team2': []
        }
        break
    }
    provisoryGame.teams = teams
    this.temporaryListGame.push(provisoryGame)
    return(provisoryGame)
  }

  createGame(provisoryGame){
      const newGame = new Game(provisoryGame.mode,provisoryGame.id)
      newGame.teams = provisoryGame.teams
      
      for(const playerID in provisoryGame.players){
          newGame.addPlayer(provisoryGame.players[playerID])
      }

      server.games[provisoryGame.id] = (newGame)
  }

  shareMessage(msg,value = '',list){
    for(const playerID in list){
      console.log(playerID)
      server.users[(list[playerID])]['socket'].emit(msg, value)
    }
  }
}

module.exports = {MatchMaking}