class Game {
    constructor(gameMode) {
        this.players = [],
            this.fruits = {},
            this.type = gameMode;
    }

    main() {
        for (const socketId in this.socket_ids) {
            this.movePlayer(this.socket_ids[socketId])
            this.verif_end(this.socket_ids[socketId])
        }
        io.emit('game-state', game)
    }


    //Adiciona um jogador
    addPlayer(socketId) {
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
        return this.players.push(newPlayer)
    }



    //Remove um jogador
    removePlayer(socketId) {
        delete this.players[socketId]
        this.socket_ids.splice(this.socket_ids.indexOf(socketId), 1)
    }




    //Move o jogador
    movePlayer(socketId) {
        const player = this.players[socketId]
        const playerWidth = this.objectWidth
        const playerHeight = this.objectHeight
        const direction = this.players[socketId].direction
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

        this.verif_food(socketId)

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


            for (fruitId in this.fruits) {
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

    verif_food(socket) {
        for (var fruitId in this.fruits) {
            const fruit = this.fruits[fruitId]

            for (var socketId in this.players) {
                const player = this.players[socketId]
                if (player.x === fruit.x && player.y === fruit.y) {
                    player.score++
                    player.delete_last_position = false
                    this.removeFruit(fruitId)
                    io.to(socket).emit('play_music', 'food')
                }
            }
        }
    }

    verif_end(socketId) {
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
}

module.exports = {Game}