//Width & Heigth
const width = window.innerWidth
const height = window.innerHeight
console.log(width,height)
let btn = window.document.getElementById('btn')

//Canvas
const canvas = window.document.querySelector('canvas')
let tela = canvas.getContext('2d')

const snake_width = 10
const snake_height = 10

if(width < height){
    canvas.style.width = `${width - 10}px`
    canvas.style.height = `${(width - 3) * 0.764171123}px`
    window.document.getElementById('score_text').style.fontSize = '16px'
    window.document.getElementById('score_section').style.height = '40px'
}else{
    window.document.getElementById('hide_gamepad_checkbox').setAttribute('checked','true')
    update_gamepad()
}

//Canvas Width & Height
const width_center = tela.canvas.width / 2
const height_center = tela.canvas.height / 2 - 10/2
console.log(tela.canvas.width,tela.canvas.height)

//Key
document.onkeydown = get_key

const teclas_permitidas = ['w','a','s','d','ArrowUp','ArrowLeft','ArrowDown','ArrowRight']
let tecla_atual = null

function get_key(event){
    if(teclas_permitidas.includes(event.key)){
        verif_key(event.key)   
    }
}

function set_key(key){
    verif_key(key)
}

function verif_key(key){
    if(game){
        if((tecla_atual == 'w' || tecla_atual == 'ArrowUp' || tecla_atual == 's' || tecla_atual =='ArrowDown') && (key == 'w' || key == 'ArrowUp' || key == 's' || key == 'ArrowDown')){
            return
        } else if((tecla_atual == 'a' || tecla_atual == 'ArrowLeft' || tecla_atual == 'd' || tecla_atual =='ArrowRight') && (key == 'a' || key == 'ArrowLeft' || key == 'd' || key == 'ArrowRight')){
                return
        }
        tecla_atual = key
    }
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


//Variáveis Game

let game = false
let snake_position = [width_center,height_center]
let positions = [[width_center,height_center]]
let food = [null,null]
let get_food = false
let score = 0



//Games musics
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



//Update Screen
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


//Game functions
function move_snake(){
    let delta_x = 0
    let delta_y = 0
    if(tecla_atual === 'd' || tecla_atual === 'ArrowRight'){
        delta_x += snake_width
    }else if(tecla_atual === 'a' || tecla_atual === 'ArrowLeft'){
        delta_x -= snake_width
    }else if(tecla_atual === 'w' || tecla_atual === 'ArrowUp'){
        delta_y -= snake_height
    }else if(tecla_atual === 's' || tecla_atual === 'ArrowDown'){
        delta_y += snake_height
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
    for(var i = 0;i < positions.length;i++){
        tela.fillStyle = "rgb(255,0,0)"
        tela.fillRect(positions[i][0],positions[i][1],snake_width,snake_height)
    }

}

function drawn_food(){
    if(food[0] != null && food[1] != null){
        tela.fillStyle = "rgb(138,0,0)"
        tela.fillRect(food[0],food[1],snake_width,snake_height)
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
        let n1 = null
        let n2 = null
        let valid_food_position = true
        do{
            valid_food_position = true
            n1 = (Math.floor(Math.random() * 30)) * 10
            n2 = (Math.floor(Math.random() * 15)) * 10
            for(var i = 0;i < positions.length;i++){
                if(n1 == positions[i][0] && n2 == positions[i][1]){
                    valid_food_position = false
                }
            }
        }while(valid_food_position != true)

        food = []
        food.push([n1],[n2])
    }
}

function verif_end(){
    if(snake_position[0] >= 300 || snake_position[0] < 0 || snake_position[1] >= 150 || snake_position[1] < 0){
        restart_game()
    }
    for(var i = 0;i < positions.length-1;i++){
        if(positions[i][0] == snake_position[0] && positions[i][1] == snake_position[1]){
            restart_game()
        } 
    }
}

function write_score(){
    let text = window.document.getElementById('score_text')
    text.innerHTML = `Score: ${score}`
}


function main(){
    if(game != true) return
    move_snake()
    verif_food()
    verif_end()
    limparTela()
    drawn_snake()
    drawn_food()
    write_score()
}
setInterval(main,100)

standard_screen()

function start_game(){
    game = true
    btn.style.display = 'none'
    score = 0
    music()
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
    tecla_atual = null
}