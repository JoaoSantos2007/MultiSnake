function SendFiles(webApp,path) {
    webApp.get('/', function (req, res) {
        res.sendFile(path + '/view/lobby/lobby.html')
    })

    webApp.get('/checkUser.js', function (req, res) {
        res.sendFile(path + '/scripts/checkUser.js')
    })

    webApp.get('/lobby.js', function (req, res) {
        res.sendFile(path + '/view/lobby/lobby.js')
    })

    webApp.get('/lobby.css', function (req, res) {
        res.sendFile(path + '/view/lobby/lobby.css')
    })

    webApp.get('/multplayer', function (req, res) {
        res.sendFile(path + '/view/gameModes/multplayer/multplayer.html')
    })


    webApp.get('/multplayer.js', function (req, res) {
        res.sendFile(path + '/view/gameModes/multplayer/multplayer.js')
    })

    webApp.get('/multplayer.css', function (req, res) {
        res.sendFile(path + '/view/gameModes/multplayer/multplayer.css')
    })



    webApp.get('/login', function (req, res) {
        res.sendFile(path + '/view/user/login/login.html')
    })

    webApp.get('/login.js', function (req, res) {
        res.sendFile(path + '/view/user/login/login.js')
    })

    webApp.get('/login.css', function (req, res) {
        res.sendFile(path + '/view/user/login/login.css')
    })




    //Assets
    webApp.get('/reset.css', function (req, res) {
        res.sendFile(path + '/assets/reset.css')
    })

    webApp.get('/up-arrow.png', function (req, res) {
        res.sendFile(path + '/assets/up-arrow.png')
    })

    webApp.get('/arrow-down.png', function (req, res) {
        res.sendFile(path + '/assets/arrow-down.png')
    })

    webApp.get('/arrow-right.png', function (req, res) {
        res.sendFile(path + '/assets/arrow-right.png')
    })

    webApp.get('/left-arrow.png', function (req, res) {
        res.sendFile(path + '/assets/left-arrow.png')
    })

    webApp.get('/snake.png', function (req, res) {
        res.sendFile(path + '/assets/snake.png')
    })

    webApp.get('/game.mp3', function (req, res) {
        res.sendFile(path + '/assets/game.mp3')
    })

    webApp.get('/food.mp3', function (req, res) {
        res.sendFile(path + '/assets/food.mp3')
    })

    webApp.get('/end.mp3', function (req, res) {
        res.sendFile(path + '/assets/end.mp3')
    })

    webApp.get('/favicon.ico', function (req, res) {
        res.sendFile(path + '/assets/favicon.ico')
    })
}

module.exports = { SendFiles }