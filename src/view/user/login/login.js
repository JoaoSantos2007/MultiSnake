function login(){
    const email = window.document.getElementById('email').value
    const password = window.document.getElementById('password').value

    socket.emit('login',[email,password])

}

socket.on('logged', (array) =>{
    console.log(array[0],array[1])
    localStorage.setItem("email", array[0]);
    localStorage.setItem("password", array[1]);
    // window.location.href = '/'
})