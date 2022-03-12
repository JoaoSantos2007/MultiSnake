class Game{
    constructor(gameMode,id) {
        this.type = gameMode,
        this.id = id,
        this.sockets = [],
        this.socketIds = [],
        this.players = {},
        this.alivePlayers = [],
        this.fruits = {},
        this.time = 0,
        this.stage = 'waitPlayers',
        this.scoreArray = [],
        this.totPlayers = 0,
        this.updateGame = setInterval(() => {
            this.main()
        },100),
        setInterval(()=>{
            this.addFruit()
        }, 5000)

        this.verifStartGame()   
    }

    main() {
        for(const i in this.players){
            this.movePlayer(i)
            this.verifEnd(i)
            
        }

        for(const i in this.sockets){
            this.sockets[i].emit('gameState',{
                "players": this.players,
                "fruits": this.fruits,
                "scoreArray": this.scoreArray,
                "totplayers": this.totPlayers,
            })
        }
    }


    //Adiciona um jogador
    addPlayer(socket) {
        //retorna um obj
        const player_x = (Math.floor(Math.random() * 30)) * 10
        const player_y = ((Math.floor(Math.random() * 15)) * 10)
        const newPlayer = {
            x: player_x,
            y: player_y,
            direction: null,
            score: 0,
            positions: [[player_x, player_y]],
            delete_last_position: true
        }
        this.players[socket.id] = newPlayer
        this.socketIds.push(socket.id)
        this.sockets.push(socket)
        this.alivePlayers.push(socket.id)
        this.totPlayers++
    }

    //Remove um jogador
    removePlayer(socketId) {
        this.totPlayers--
        delete this.players[socketId]
        this.alivePlayers.splice(this.alivePlayers.indexOf(socketId), 1);
        // this.socket_ids.splice(this.socket_ids.indexOf(socketId), 1)
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
        if (player.delete_last_position) {
            player.positions.splice(0, 1)
        } else {
            player.delete_last_position = true
        }

        //return player

        this.verifFood(socketID)

    }



    //Função para adicionar frutas
    addFruit() {
        const fruitRandomId = Math.floor(Math.random() * 10000000)
        let fruitRandomX = null
        let fruitRandomY = null
        let valid_food_position = null
        do {
            valid_food_position = true
            fruitRandomX = (Math.floor(Math.random() * 30)) * 10
            fruitRandomY = (Math.floor(Math.random() * 15)) * 10


            // for(var i = 0;i < positions.length;i++){
            //     if(n1 == positions[i][0] && n2 == positions[i][1]){
            //         valid_food_position = false
            //     }
            // }


            for (const fruitId in this.fruits) {
                const fruit = this.fruits[fruitId]
                if (fruit.x === fruitRandomX && fruit.y === fruitRandomY) {
                    return false
                }
            }
        } while (valid_food_position != true)



        this.fruits[fruitRandomId] = {
            x: fruitRandomX,
            y: fruitRandomY
        }

        return {
            fruitId: fruitRandomId,
            x: fruitRandomX,
            y: fruitRandomY
        }

    }

    removeFruit(fruitId) {
        delete this.fruits[fruitId]
    }

    verifFood(socketID) {
        for (var fruitId in this.fruits) {
            const fruit = this.fruits[fruitId]
            const player = this.players[socketID]
            if (player.x === fruit.x && player.y === fruit.y) {
                player.score++
                this.updateScore()
                this.removeFruit(fruitId)
                player.delete_last_position = false
            }
        }
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
    }

    verifEnd() {


        // const player = this.players[socketId]
        // if (player.x >= 300 || player.x < 0 || player.y >= 150 || player.y < 0) {
        //     player.direction = null
        // }
        // for (var i = 0; i < player.positions.length - 1; i++) {
        //     if (player.positions[i][0] == player.x && player.positions[i][1] == player.y) {
        //         player.direction = null
        //     }
        // }
    }



    verifStartGame(){
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