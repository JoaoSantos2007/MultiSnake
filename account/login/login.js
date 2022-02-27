const socket = io()

function login(){
    const email = window.document.getElementById('email').value
    const password = window.document.getElementById('password').value

    socket.emit('login',[email,password])

}

socket.on('enter', () =>{
    console.log('ok11111111')
    window.location.href = '/'
})