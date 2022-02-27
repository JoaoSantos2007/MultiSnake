const socket = io()

function login(){
    const email = window.document.getElementById('email').value
    const password = window.document.getElementById('password').value
    const displayName = window.document.getElementById('displayName').value
    console.log(displayName)
    
    socket.emit('create-account',[email,password,displayName])

}