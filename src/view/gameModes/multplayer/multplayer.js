let game = {}

//Obter Tecla pressionada
document.onkeydown = getKey
//Definir Tecla pressionada
function getKey(event){
    setKey(event.key)   
}

//Games musics
const audioGame = new Audio('game.mp3')
const audioFood = new Audio('food.mp3')
const audioEnd = new Audio('end.mp3')

//Canvas
const canvas = window.document.getElementById('canvas')
let tela = canvas.getContext('2d')

//Width & Heigth
const width = window.innerWidth
const height = window.innerHeight
//Ajustar tela se a altura for maior que a largura
if(width < height){
    canvas.style.width = `${width - 10}px`
    canvas.style.height = `${(width - 3) * 0.764171123}px`
}

/* ************** */
/* Enviar Eventos */
/* ************** */

//Enviar tecla pressionada para servidor
function setKey(key){
    if(game.id != undefined){
        socket.emit('changeKey',({
            "key": key,
            "gameID": game.id,
        }))
    }
}

//Enviar pedido de sair do jogo para servidor
function exitGame(){
    if(game.id != undefined) socket.emit('exitGame',(game.id))
}


/* ************** */
/* Receber Eventos */
/* ************** */

socket.on('countdown',(time) => {
    window.document.getElementById('countdown').style.display = 'block'
    
    if(time < 0){
        window.document.getElementById('countdown').style.display = 'none'
    }else{    
        const timeIMG = window.document.getElementById('timeIMG')
        timeIMG.setAttribute('src',`${String(time)}.png`)
    }
})

//Receber Estado do jogo
socket.on('gameState', (gameState) => {
    game = gameState
    console.log(gameState)
    limparTela()
    requestAnimationFrame(renderGame)
})

//Atualizar tempo
socket.on('updateTime', (time) => {
    const data = new Date(time * 1000)
    window.document.getElementById('time').innerText = `${data.getMinutes()}:${data.getSeconds()}`
})

//Atualizar pontos
socket.on('updateScore', (updatedScore) =>{
    updatePlayerScore(updatedScore.scoreArray,updatedScore.totPlayers)
})

socket.on('showResults', (scoreList)=>{
    console.log('fim !',scoreList)
    window.document.getElementById('results').style.display = 'block'
    window.document.getElementById('pFirst').innerText = scoreList[0].socketId
    window.document.getElementById('pSecond').innerText = scoreList[1].socketId
    window.document.getElementById('pThird').innerText = scoreList[2].socketId
})

//Rodar Audios do jogo
socket.on('playMusic', (audioName) => {
    switch(audioName){
        case 'game': 
            audioGame.play()
            audioGame.loop = true
            break
        case 'food':
            audioFood.play()
            break
    }
    
})

socket.on('goLobby',() =>{
    window.location.href = '/'
})


function limparTela(){
    tela.clearRect(0,0,tela.canvas.width, tela.canvas.height)
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



//Renderizar o jogo
function renderGame(){

    tela.fillStyle = 'rgb(110, 180, 255)'
    tela.fillRect(0,0,300,150)

    Object.keys(game.players).forEach((key) => {
        var player = game.players[key]
        for(var i = 0;i < player.positions.length;i++){
            tela.fillStyle = '#000000'
            tela.globalAlpha = 0.1

            if(player.socketID == socketID){
                tela.fillStyle = "rgb(255,0,0)"
                tela.globalAlpha = 1
            } 
            
            tela.fillRect(player.positions[i][0],player.positions[i][1],10,10)
        }
    });

    Object.keys(game.fruits).forEach((key) => {
        var fruit = game.fruits[key]
        tela.fillStyle = "rgb(0,255,0)"
        tela.globalAlpha = 1
        tela.fillRect(fruit.x,fruit.y,10,10)
    });
}

//Atualizar a tabela de pontos e jogadores no jogo
function updatePlayerScore(scoreArray,totPlayers){
    
    let scoreTableInnerHTML

    scoreTableInnerHTML = `<tr class="header">
        <td>Top 10 players</td>
        <td>Score</td>
    </tr>`

    scoreArray.forEach((score) => {
        scoreTableInnerHTML += `
            <tr class="${socketID === score.socketID ? 'current-player' : ''}">
                <td class="socket-id">${score.displayName}</td>
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