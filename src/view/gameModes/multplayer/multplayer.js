//Cookie socketId
const socketId = localStorage.getItem("socketID")
//Width & Heigth
const width = window.innerWidth
const height = window.innerHeight
//Canvas
const canvas = window.document.getElementById('canvas')
let tela = canvas.getContext('2d')

//Ajustar tela se a altura for maior que a largura
if(width < height){
    canvas.style.width = `${width - 10}px`
    canvas.style.height = `${(width - 3) * 0.764171123}px`
}

let game = {}

//Games musics
const music_game = new Audio('game.mp3')
const audio_food = new Audio('food.mp3')
const audio_end = new Audio('end.mp3')


//Key
document.onkeydown = get_key
function get_key(event){
    setKey(event.key)   
}
function setKey(key){
    socket.emit('changeKey',key)
}


//Default Image
function standard_screen(){
    var img = new Image()
    img.onload = function(){
        tela.drawImage(img,0,0,tela.canvas.width,tela.canvas.height)
    }
    img.src = 'snake.png'
}
standard_screen()


function limparTela(){
    tela.clearRect(0,0,tela.canvas.width, tela.canvas.height)
}

function exitGame(){
    socket.emit('exitGame')
}

function updatePlayerScore(scoreArray,totPlayers){
    let scoreTableInnerHTML = `
        <tr class="header">
            <td>Top 10 players</td>
            <td>Score</td>
        </tr>
    `
    scoreArray.forEach((score) => {
        scoreTableInnerHTML += `
            <tr class="${socketId === score.socketId ? 'current-player' : ''}">
                <td class="socket-id">${score.socketId}</td>
                <td class="score-value">${score.score}</td>
            </tr>
        `
    })

    scoreTableInnerHTML += `
        <tr class="footer">
            <td>Total de jogadores</td>
            <td align="right">${totPlayers}</td>
        </tr>
    `

    window.document.getElementById("scoreTable").innerHTML = scoreTableInnerHTML
}

function renderGame(){

    tela.fillStyle = 'rgb(110, 180, 255)'
    tela.fillRect(0,0,300,150)

    Object.keys(game.players).forEach((key) => {
        var player = game.players[key]
        for(var i = 0;i < player.positions.length;i++){
            tela.fillStyle = '#000000'
            tela.globalAlpha = 0.1
            tela.fillRect(player.positions[i][0],player.positions[i][1],10,10)
        }
    });

    Object.keys(game.fruits).forEach((key) => {
        var fruit = game.fruits[key]
        tela.fillStyle = "rgb(0,255,0)"
        tela.globalAlpha = 1
        tela.fillRect(fruit.x,fruit.y,10,10)
    });

    Object.keys(game.players).forEach((index) => {
        if(index == socketId){
            const currentPlayer = game.players[index]
            for(const i in currentPlayer.positions){
                tela.fillStyle = "rgb(255,0,0)"
                tela.globalAlpha = 1
                tela.fillRect(currentPlayer.positions[i][0],currentPlayer.positions[i][1],10,10)
            }
        }
    });
}

socket.on('gameState', (gameState) => {
    game = gameState
    limparTela()
    requestAnimationFrame(renderGame)
    updatePlayerScore(game.scoreArray,game.totplayers)
})

socket.on('updateTime', (time) => {
    console.log(time.time)
    const data = new Date(time * 1000)
    window.document.getElementById('time').innerText = `${data.getMinutes()}:${data.getSeconds()}`
})

socket.on('playMusic', (audio_name) => {
    switch(audio_name){
        case 'game': 
            music_game.play()
            music_game.loop = true
            break
        case 'food':
            audio_food.play()
            
            break
    }
    
})