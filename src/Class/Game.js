class Game {
    constructor(gameMode,id) {
        this.type = gameMode,
        this.id = id,
        this.sockets = [],
        this.socketIds = [],
        this.players = {},
        this.fruits = {},
        this.time = -10,
        this.stage = 'waitPlayers',
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
    }

    //Remove um jogador
    removePlayer(socketId) {
        delete this.players[socketId]
        // this.socket_ids.splice(this.socket_ids.indexOf(socketId), 1)
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
        if (newDirection != this.players[socketID].direction && newDirection != null) this.players[socketID].direction = newDirection
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

            for (const i in this.players) {
                const player = this.players[socketID]
                if (player.x === fruit.x && player.y === fruit.y) {
                    player.score++
                    player.delete_last_position = false
                    this.removeFruit(fruitId)
                }
            }
        }
    }

    verifEnd(socketId) {
        const player = this.players[socketId]
        if (player.x >= 290 || player.x < 0 || player.y >= 150 || player.y < 0) {
            player.direction = null
        }
        for (var i = 0; i < player.positions.length - 1; i++) {
            if (player.positions[i][0] == player.x && player.positions[i][1] == player.y) {
                player.direction = null
            }
        }
    }



    verifStartGame(){
        const TimeToStart = setInterval(() => {
            if(this.time >= 0 && this.stage == 'waitPlayers'){
                this.stage = 'running'
                for(const i in this.sockets){
                    this.sockets[i].emit('goMultplayer')
                }
                clearInterval(TimeToStart)
                clearInterval()
                
            }
        },1000)

    }
}

module.exports = {Game}