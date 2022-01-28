//Key
document.onkeydown = get_key

//Canvas
let canvas = window.document.querySelector('canvas')
let tela = canvas.getContext('2d')

//Altura e Largura da tela
let width_center = tela.canvas.width / 2
let height_center = tela.canvas.height / 2 - 10/2


let game = false
var btn = window.document.getElementById('btn')


const teclas_permitidas = ['w','a','s','d','ArrowUp','ArrowLeft','ArrowDown','ArrowRight','r']
let tecla_atual = null

let snake_position = [width_center,height_center]
let positions = [[width_center,height_center]]
let food = [null,null]
let get_food = false
let score = 0

function get_key(event){
    if(teclas_permitidas.includes(event.key)){
        if(game == true){
            tecla_atual = event.key
        }
        
    }
}




standard_screen()


const music_game = new Audio('assets/game.mp3')
function music() {
    music_game.play()
    music_game.loop = true
}

const audio_food = new Audio('assets/food.mp3')
function music_food(){
    audio_food.play()
    audio_food.loop = false
}

const audio_end = new Audio('assets/end.mp3')
function music_end(){
    audio_end.play()
    audio_end.loop = false
}


function standard_screen(){
    var img = new Image()
    img.onload = function(){
        tela.drawImage(img,0,0,tela.canvas.width,tela.canvas.height)
    }
    img.src = 'assets/snake.png'
}

function limparTela(){
    tela.clearRect(0,0,tela.canvas.width, tela.canvas.height)
}

function move_snake(){
    let delta_x = 0
    let delta_y = 0
    if(tecla_atual === 'd' || tecla_atual === 'ArrowRight'){
        delta_x += 10
    }else if(tecla_atual === 'a' || tecla_atual === 'ArrowLeft'){
        delta_x -= 10
    }else if(tecla_atual === 'w' || tecla_atual === 'ArrowUp'){
        delta_y -= 10
    }else if(tecla_atual === 's' || tecla_atual === 'ArrowDown'){
        delta_y += 10
    }else{
        delta_x = 0
        delta_y = 0
    }

    positions.push([delta_x += positions[positions.length - 1][0],delta_y += positions[positions.length - 1][1]])
    if(get_food){
        get_food = false
    }else{
        positions.splice(0,1)
    }
        

    
    
    snake_position[0] = positions[positions.length - 1][0]
    snake_position[1] = positions[positions.length - 1][1]
}

function drawn_snake(){
    limparTela()
    for(var i = 0;i < positions.length;i++){
        tela.fillStyle = "rgb(255,0,0)"
        tela.fillRect(positions[i][0],positions[i][1],10,10)
    }

}

function drawn_food(){
    if(food[0] != null && food[1] != null){
        tela.fillStyle = "rgb(0,255,0)"
        tela.fillRect(food[0],food[1],10,10)
    }

}

function verif_food(){
    if((snake_position[0] == food[0]) && (snake_position[1] == food[1])){
        score ++
        food = [null,null]
        get_food = true
        music_food()
    }
    
    if(food[0] == null && food[1] == null){
        let n1 = (Math.floor(Math.random() * 30)) * 10
        let n2 = (Math.floor(Math.random() * 15)) * 10

        food = []
        food.push([n1],[n2])
    }
}

function verif_end(){
    if(snake_position[0] >= 300 || snake_position[0] < 0 || snake_position[1] >= 150 || snake_position[1] < 0){
        console.log('fim')
        restart_game()
    }
    for(var i = 0;i < positions.length-1;i++){
        if(positions[i][0] == snake_position[0] && positions[i][1] == snake_position[1]){
            console.log('FIM!')
            restart_game()
        } 
    }
}


function main(){
    if(game != true){
        return
    }
    move_snake()
    verif_food()
    verif_end()
    drawn_snake()
    drawn_food()
}
setInterval(main,100)

function start_game(){
    game = true
    music()
    btn.style.display = 'none'
}

function restart_game(){
    music_end()
    music_game.pause()
    limparTela()
    standard_screen()
    btn.style.display = 'block'
    game = false
    snake_position = [width_center,height_center]
    positions = [[width_center,height_center]]
    food = [null,null]
    get_food = false
    score = 0
    tecla_atual = null
}