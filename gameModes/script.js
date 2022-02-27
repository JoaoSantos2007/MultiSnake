//Width & Heigth
const width = window.innerWidth
const height = window.innerHeight
let btn = window.document.getElementById('btn')

//Canvas
const canvas = window.document.querySelector('canvas')
let tela = canvas.getContext('2d')
//Ajustar tela se a altura for maior que a largura
if(width < height){
    canvas.style.width = `${width - 10}px`
    canvas.style.height = `${(width - 3) * 0.764171123}px`
    window.document.getElementById('score_text').style.fontSize = '16px'
    window.document.getElementById('score_section').style.height = '40px'
}else{
    window.document.getElementById('hide_gamepad_checkbox').setAttribute('checked','true')
    update_gamepad()
}



const socket = io()
let game = {}

//Games musics
const music_game = new Audio('../../assets/game.mp3')
const audio_food = new Audio('../../assets/food.mp3')
const audio_end = new Audio('../../assets/end.mp3')


//Key
document.onkeydown = get_key
function get_key(event){
    setKey(event.key)   
}
function setKey(key){
    socket.emit('changeKey',key)
}


//Update Gamepad
function update_gamepad(){
    let chekbox = window.document.getElementById('hide_gamepad_checkbox')
    if(chekbox.checked){
        window.document.querySelector('.gamepad').style.display = 'none'
    }else{
        window.document.querySelector('.gamepad').style.display = 'block'
    }
}


//Default Image
function standard_screen(){
    var img = new Image()
    img.onload = function(){
        tela.drawImage(img,0,0,tela.canvas.width,tela.canvas.height)
    }
    img.src = '../../assets/snake.png'
}
standard_screen()


function limparTela(){
    tela.clearRect(0,0,tela.canvas.width, tela.canvas.height)
}

function renderGame(){

    tela.fillStyle = 'rgb(110, 180, 255)'
    tela.fillRect(0,0,game.canvasWidth,game.canvasHeight)

    Object.keys(game.players).forEach((key) => {
        var player = game.players[key]
        for(var i = 0;i < player.positions.length;i++){
            tela.fillStyle = '#000000'
            tela.globalAlpha = 0.1
            tela.fillRect(player.positions[i][0],player.positions[i][1],game.objectWidth,game.objectHeight)
        }
    });

    Object.keys(game.fruits).forEach((key) => {
        var fruit = game.fruits[key]
        tela.fillStyle = "rgb(0,255,0)"
        tela.globalAlpha = 1
        tela.fillRect(fruit.x,fruit.y,game.objectWidth,game.objectHeight)
    });

    const currentPlayer = game.players[socket.id]
    for(var i = 0;i < currentPlayer.positions.length;i++){
        tela.fillStyle = "rgb(255,0,0)"
        tela.globalAlpha = 1
        tela.fillRect(currentPlayer.positions[i][0],currentPlayer.positions[i][1],game.objectWidth,game.objectHeight)
    }
    

   
    
    
    //console.log("Score: " + currentPlayer.score)

}



socket.on('current_connections', (tot_players) =>{
    let numberPlayers = tot_players
    console.log(numberPlayers)
})

socket.on('game-state', (gameState) => {
    game = gameState
    limparTela()
    requestAnimationFrame(renderGame)
})

socket.on('play_music', (audio_name) => {
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