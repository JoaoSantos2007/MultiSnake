var mysql = require('mysql')

var con = mysql.createConnection({
    "host": '192.168.15.50',
    "user": 'iot',
    "password": 'iotdb', 
    "database": 'IOTDB'
})

con.connect((err) => {
    if (err) {
        console.log('Erro connecting to database...', err)
        return
    }
    console.log('Connection established!')
})

// function viewUsers(){
//     con.query('SELECT * FROM users',(err,rows) => {
//         if(err) throw err

//         console.log(rows)
//     })
// }

// viewUsers()

// function addUser(){
//     con.query(`INSERT INTO users(email,password,displayName) VALUES ('joao.santos.2007sp@gmail.com','teste123"','JPGamerPlay')`,(err,res) => {
//         if(err) throw err

//         console.log("Users adicionado: ",res)
//         // viewUsers()
//     })
// }


// // addUser()

// con.end((err) => {
//     if(err) {
//         console.log('Erro to finish connection...', err)
//         return 
//     }
//     console.log('The connection was finish...')
// })