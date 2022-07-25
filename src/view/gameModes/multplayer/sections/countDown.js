function countDown(time){
    if(time < 0){
        window.document.getElementById('countdown').remove()
        return
    }

    if(window.document.getElementById('timeIMG') == undefined){
        createTimeDiv()
    }

    const timeIMG = window.document.getElementById('timeIMG')
    timeIMG.setAttribute('src',`${String(time)}.png`)


}

function createTimeDiv(){
    let divCountdown = window.document.createElement('div')
    divCountdown.setAttribute('class','countdown')
    divCountdown.setAttribute('id','countdown')
    
    let divTime = window.document.createElement('div')
    divTime.setAttribute('class','time')
    
    let imgTime = window.document.createElement('img')
    imgTime.setAttribute('src','')
    imgTime.setAttribute('class','timeImg')
    imgTime.setAttribute('id','timeIMG')
    
    divTime.appendChild(imgTime)
    divCountdown.appendChild(divTime)
    
    window.document.body.appendChild(divCountdown)
}

