const server = require('../main.js')

class Game{
    constructor(gameMode,id) {
        this.type = gameMode,
        this.id = id,
        this.stage = 'waitPlayers',
        this.time = 0,
        this.totPlayers = 0,

        this.players = {},
        this.teams = {},
        this.scoreArray = [],
        this.fruits = {},
        
        this.updateGameStateInterval = null,
        this.generateFruitsInterval = null,

        this.startGame()   
    }


    /*
    =========================================
                Funcões Players
    =========================================
    */

    addPlayer(playerID) {
        //Generate initial player position
        const playerX = (Math.floor(Math.random() * 30)) * 10
        const playerY = ((Math.floor(Math.random() * 15)) * 10)

        this.players[playerID] = {
            x: playerX,
            y: playerY,
            direction: null,
            positions: [[playerX, playerY]],
            score: 0,
            scored: false,
            lost: false
        }
        this.totPlayers++
    }

    //Verifica se o jogador perdeu
    verifPlayerEnd(playerID) {
        const player = this.players[playerID]
        if(player != undefined){
            let lost = false
            if (player.x >= 300 || player.x < 0 || player.y >= 150 || player.y < 0) {
                lost = true
            }
            for (var i = 0; i < player.positions.length - 1; i++) {
                if (player.positions[i][0] == player.x && player.positions[i][1] == player.y) {
                    lost = true
                }
            }
            if(lost){
                this.playerLost(playerID)
            }
        }
    }

    //Jogador perdeu
    playerLost(playerID){
        for(const playerSocketID in this.players){
            if(playerSocketID === playerID){
                this.players[playerSocketID].lost = true
            }   
        }
    }

    exitPlayer(playerID){
        this.playerLost(playerID)
        this.goLobby(playerID)
        delete this.players[playerID]
        this.totPlayers--
    }

    //Move o jogador
    movePlayer(playerID) {
        const player = this.players[playerID]
        
        const direction = player.direction
        if (direction === null) return
        
        const playerWidth = 10
        const playerHeight = 10
        
        switch(direction){
            case 'left':
                player.x = player.x - playerWidth
                break
            case 'right':
                player.x = player.x + playerWidth
                break
            case 'up':
                player.y = player.y - playerHeight
                break
            case 'down':
                player.y = player.y + playerHeight
                break
        }

        player.positions.push([player.x, player.y])
        if (player.scored !== true) {
            player.positions.splice(0, 1)
        } else {
            player.scored = false
        }

        this.verifFood(playerID)
        this.verifPlayerEnd(playerID)
    }


    /*
    ========================================
                Funções Fruits
    ======================================== 
    */

    //Função para adicionar frutas
    addFruit() {
        const fruitRandomId = Math.floor(Math.random() * 10000000)
        let fruitRandomX = null
        let fruitRandomY = null
        let validPosition = null //Fruta posição valida
        do {
            validPosition = true
            fruitRandomX = (Math.floor(Math.random() * 30)) * 10
            fruitRandomY = (Math.floor(Math.random() * 15)) * 10

            for (const fruitId in this.fruits) {
                const fruit = this.fruits[fruitId]
                if (fruit.x === fruitRandomX && fruit.y === fruitRandomY) {
                    validPosition = false
                }
            }
        } while (validPosition != true)

        this.fruits[fruitRandomId] = {
            x: fruitRandomX,
            y: fruitRandomY
        }
    }


    //MUDAR
    verifFood(playerID) {
        for (const fruitId in this.fruits) {
            const fruit = this.fruits[fruitId]
            const player = this.players[playerID]
            if (player.x === fruit.x && player.y === fruit.y) {
                player.score++
                player.scored = true
                this.updateScore()
                for(const playerSocketID in this.players){
                    if(playerSocketID === playerID){
                        this.shareMessage('playMusic',('food'))
                    }
                }
                this.removeFruit(fruitId)
                
            }
        }
    }

    removeFruit(fruitId) {
        delete this.fruits[fruitId]
    }


    /* 
    ==========================================
                    Update Key
    ==========================================
    */

    verifKey(direction,newDirection){
        let keyValid = true
        if((direction === 'up' || direction === 'down') && (newDirection === 'up' || newDirection === 'down')){
          keyValid = false
        }else if((direction === 'left' || direction === 'right') && (newDirection === 'left' || newDirection === 'right')){
          keyValid = false
        }
        return(keyValid)
    }


    changeKey(key,playerID){
        let newDirection = null
        if (key === 'w' || key === 'ArrowUp') {
          newDirection = 'up'
        } else if (key === 's' || key === 'ArrowDown') {
          newDirection = 'down'
        } else if (key === 'a' || key === 'ArrowLeft') {
          newDirection = 'left'
        } else if (key === 'd' || key === 'ArrowRight') {
          newDirection = 'right'
        } else {
          return
        }

        if(this.verifKey(this.players[playerID].direction,newDirection) && this.stage === 'running'){
            if (newDirection != this.players[playerID].direction && newDirection != null) this.players[playerID].direction = newDirection
        }
    }


    /*
    ==========================================
                Update Game Informations
    ==========================================
    */

    getGameState(){
        const gameState = {
            id: this.id,
            fruits: this.fruits,
            players: {}
        }
        for(const playerID in this.players){
            const player = this.players[playerID]
            const user = server.users[playerID]
            gameState["players"][playerID] = {
                socketID: user.socketID,
                displayName: user.displayName,
                x: player.x,
                y: player.y,
                direction: player.direction,
                positions: player.positions,
                score: player.score,
                lost: player.lost
            }
        }

        return gameState
    }

    updateScore(){
        const previewScoreArray = []
        for(const playerID in this.players) {
            const player = this.players[playerID]
            const user = server.users[playerID]
            previewScoreArray.push({
                displayName: user.displayName,
                socketID: user.socketID,
                score: player.score
            })
        }

        const scoreArraySorted = previewScoreArray.sort((first, second) => {
            if (first.score < second.score) {
                return 1
            }

            if (first.score > second.score) {
                return -1
            }

            return 0
        })

        this.scoreArray = scoreArraySorted.slice(0, 10)
        this.shareMessage('updateScore',({
            totPlayers: this.totPlayers,
            scoreArray: this.scoreArray
        }))
    }


    /*
    ===========================================
                Game Functions
    ===========================================
    */

    main() {
        if(this.stage === 'running'){
            //Executa funções para mover e verificar players
            for(const playerID in this.players){
                this.movePlayer(playerID)
                this.verifPlayerEnd(playerID)
            }
    
            //Envia informações do jogo aos players
            this.shareMessage('gameState',this.getGameState())
        }
    }

    sendTime(){
        this.shareMessage('updateTime',(this.time))
    }

    goLobby(playerID = null){
        if(playerID !== null){
            this.shareMessage('goLobby','',playerID)
        }else{
            this.shareMessage('goLobby')
        }
    }


    /* 
    =========================================
                Game Stage Functions
    =========================================
    */

    startGame(){
        let countdownTime = 5
        //CountDown to start game
        const countdownInterval = setInterval(() => {
            this.shareMessage('countdown',(countdownTime))
            countdownTime--
            if(countdownTime < -1){
                this.loadGame()
                clearInterval(countdownInterval)
            }
        },1000) 
    }

    loadGame(){
        this.stage = 'running'
        this.updateGameStateInterval = setInterval(() => {
            this.main()
        },100)
        this.generateFruitsInterval = setInterval(()=>{
            this.addFruit()
        }, 5000)
    }

    verifGameEnd(){
        let alivePlayers = this.totPlayers
        for(const playerID in this.players){
            if(this.players[playerID].lost){
                alivePlayers--
            }
        }

        if(this.time >= 180 || this.totPlayers <= 1 || alivePlayers <= 1){
          this.stage = 'showResults'
          this.showResults()
  
          setTimeout(() => {
            this.goLobby()
            
          },10000)
          return true
        }
      }

    showResults(){
        this.shareMessage('showResults', (this.scoreArray))
    }


    /*
    =======================================
              Facilitor Functions
    =======================================
    */

    shareMessage(msg,value = '',receiver = '@everyone'){
        console.log(server)
        if(receiver === '@everyone'){
            for(const playerID in this.players){
                server.users[playerID]['socket'].emit(msg, value)
            }
        }else{
            for(const playerID in this.players){
                if(playerID === receiver){
                    server.users[playerID]['socket'].emit(msg, value)
                }
            }
        }
    }
}

module.exports = {Game}