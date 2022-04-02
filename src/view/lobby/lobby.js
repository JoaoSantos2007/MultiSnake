let to_select_game = false

function select_game(){
    to_select_game = !to_select_game
    const div = window.document.getElementById('gameCards')
    const btn_to_play = window.document.getElementById('btn_play')

    if(to_select_game){
        div.style.display = 'block'
        btn_to_play.value = 'Back'
    }else{
        div.style.display = 'none'
        btn_to_play.value = 'Play'
    }
    
}

function play(mode){
    socket.emit('play',mode)
    console.log(mode)
}

socket.on('goTo',(url) =>{
    window.location.href = url
})
