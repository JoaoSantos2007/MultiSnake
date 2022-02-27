let to_select_game = false

function select_game(){
    to_select_game = !to_select_game
    const div = window.document.getElementById('gameCards')
    const btn_to_play = window.document.getElementById('btn_play')

    if(to_select_game){
        div.style.display = 'block'
        btn_to_play.value = 'Cancel'
    }else{
        div.style.display = 'none'
        btn_to_play.value = 'Play'
    }
    
}

function play(mode){
    window.location.href = '../gameModes/local/index.html'
    console.log(mode)
}