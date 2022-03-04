const socket = io()
const socketID = localStorage.getItem("socketID")

if(socketID != undefined) socket.emit('setSocketID',socketID)
else socket.emit('getSocketID')


socket.on('defineSocketID',(socketID) => {
    localStorage.setItem("socketID",socketID);
})