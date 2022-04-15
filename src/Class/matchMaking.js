const {temporaryGame} = require('./temporaryGame.js')

class matchMaking{

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
      for(const socketIndex in game.sockets){
        game.sockets[socketIndex].emit('sendTimeStart',(game.TimeToStart))
      }
    }
  }

  checkGame(game){
    let limitPlayers = 0
    let startGame = false

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

    if(game.TimeToStart > 10 || game.sockets.length === limitPlayers){
      for(const socketIndex in game.sockets){
        game.sockets[socketIndex].emit('goTo',('/multplayer'))
      }

      return true
    }

    return false
  }

  searchGames(gameMode,socket){
      let foundGame = false

      if(this.gameOptions.includes(gameMode) != true){
        console.log(gameMode)
        return
      }

      switch(gameMode){
        case 'local':
          socket.emit('goTo',('/local'))
          foundGame = true
          break

        case 'local2v2':
          socket.emit('goTo',('/local2v2'))
          foundGame = true
          break
        
        default:
          for(const gameIndex in this.temporaryListGame){
            const game = this.temporaryListGame[gameIndex]
            if(game.mode === gameMode){
              this.insertPlayer(game,socket)
              foundGame = true
              break
            }
          }
      }
      

  
      if(foundGame != true){
        this.insertPlayer(this.createGame(gameMode),socket)
      }    
  }

  insertPlayer(game,socket){
    game.sockets.push(socket)
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
          game.teams[indexTeam].push(socket.id)
          foundTeam = true
          console.log(game)
        }
      }
    }
  }
  
  createGame(gameMode){
    const random_gameId = Math.floor(Math.random() * 100000000000)
    const provisoryGame = new temporaryGame(random_gameId,gameMode)
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
}

module.exports = {matchMaking}