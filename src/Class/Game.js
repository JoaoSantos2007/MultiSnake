class Game{
    constructor(gameMode,id) {
        this.type = gameMode,
        this.id = id,
        this.stage = 'waitPlayers',
        this.time = 0,

        this.sockets = [],
        this.socketIds = [],
        
        this.players = {},
        this.alivePlayers = [],
        this.totPlayers = 0,

        this.fruits = {},
        this.scoreArray = [],
        
        this.updateGame = setInterval(() => {
            this.main()
        },100),

        this.generateFruits = setInterval(()=>{
            this.addFruit()
        }, 5000)

        this.startGame()   
    }

    main() {
        for(const socketID in this.players){
            this.movePlayer(socketID)
            this.verifPlayerEnd(socketID)
        }

        for(const i in this.sockets){
            this.sockets[i].emit('gameState',{
                "players": this.players,
                "fruits": this.fruits,
            })
        }
    }


    //Adiciona um jogador
    addPlayer(socket) {
        const playerX = (Math.floor(Math.random() * 30)) * 10
        const playerY = ((Math.floor(Math.random() * 15)) * 10)
        this.players[socket.id] = {
            x: playerX,
            y: playerY,
            direction: null,
            positions: [[playerX, playerY]],
            score: 0,
            scored: false
        }
        this.sockets.push(socket)
        this.socketIds.push(socket.id)
        
        this.alivePlayers.push(socket.id)
        this.totPlayers++
    }

    //Verifica se o jogador perdeu
    verifPlayerEnd(socketId) {
        const player = this.players[socketId]
        let playerLost = false
        if (player.x >= 300 || player.x < 0 || player.y >= 150 || player.y < 0) {
            playerLost = true
        }
        for (var i = 0; i < player.positions.length - 1; i++) {
            if (player.positions[i][0] == player.x && player.positions[i][1] == player.y) {
                playerLost = true
            }
        }
        if(playerLost){

        }
    }

    //Jogador perdeu
    playerLost(socketId){
        this.alivePlayers.splice(this.alivePlayers.indexOf(socketId), 1);
    }

    playerExit(socketId){
        this.totPlayers--
        delete this.players[socketId]
        this.playerLost(socketId)
        this.socketIds.splice(this.socketIds.indexOf(socketId,1))
        this.sockets.splice(this.sockets.indexOf(socketId,1))
    }
    


    verifKey(direction,newDirection){
        let keyValid = true
        if((direction === 'up' || direction === 'down') && (newDirection === 'up' || newDirection === 'down')){
          keyValid = false
        }else if((direction === 'left' || direction === 'right') && (newDirection === 'left' || newDirection === 'right')){
          keyValid = false
        }
        return(keyValid)
    }


    changeKey(key,socketID){
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

        if(this.verifKey(this.players[socketID].direction,newDirection)){
            if (newDirection != this.players[socketID].direction && newDirection != null) this.players[socketID].direction = newDirection
        }
    }

    //Move o jogador
    movePlayer(socketID) {
        const player = this.players[socketID]
        const playerWidth = 10
        const playerHeight = 10
        const direction = player.direction
        if (direction == null) return

        if (direction === 'left') {
            player.x = player.x - playerWidth
        }

        if (direction === 'up') {
            player.y = player.y - playerHeight
        }

        if (direction === 'right') {
            player.x = player.x + playerWidth
        }

        if (direction === 'down') {
            player.y = player.y + playerHeight
        }

        player.positions.push([player.x, player.y])
        if (player.scored != true) {
            player.positions.splice(0, 1)
        } else {
            player.scored = false
        }

        this.verifFood(socketID)
        this.verifPlayerEnd(socketID)
    }





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

    verifFood(socketID) {
        for (var fruitId in this.fruits) {
            const fruit = this.fruits[fruitId]
            const player = this.players[socketID]
            if (player.x === fruit.x && player.y === fruit.y) {
                player.score++
                player.scored = true
                this.updateScore()
                this.removeFruit(fruitId)
                
            }
        }
    }

    removeFruit(fruitId) {
        delete this.fruits[fruitId]
    }



    updateScore(){
        const previewScoreArray = []
        for(const socketId in this.players) {
            const player = this.players[socketId]
            previewScoreArray.push({
                socketId: socketId,
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
        for(const index in this.sockets){
            this.sockets[index].emit('updateScore',({
                totPlayers: this.totPlayers,
                scoreArray: this.scoreArray
            }))
        }
    }



    startGame(){
        let TimeToStart = 0
        const intervalTimeToStart = setInterval(() => {
            TimeToStart ++
            if(TimeToStart > 10 && this.stage == 'waitPlayers'){
                this.stage = 'running'
                for(const i in this.sockets){
                    this.sockets[i].emit('goMultplayer')
                }
                clearInterval(intervalTimeToStart)
            }
        },1000)
    }

    sendTime(){
        for(const i in this.sockets){
            this.sockets[i].emit('updateTime',(this.time))
        }
    }
}

module.exports = {Game}