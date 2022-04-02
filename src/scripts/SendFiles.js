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



    webApp.get('/local', function (req, res) {
        res.sendFile(path + '/view/gameModes/local/local.html')
    })


    webApp.get('/local.js', function (req, res) {
        res.sendFile(path + '/view/gameModes/local/local.js')
    })

    webApp.get('/local.css', function (req, res) {
        res.sendFile(path + '/view/gameModes/local/local.css')
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


    webApp.get('/0.png', function (req, res) {
        res.sendFile(path + '/assets/zero.png')
    })
    webApp.get('/1.png', function (req, res) {
        res.sendFile(path + '/assets/one.png')
    })
    webApp.get('/2.png', function (req, res) {
        res.sendFile(path + '/assets/two.png')
    })
    webApp.get('/3.png', function (req, res) {
        res.sendFile(path + '/assets/three.png')
    })
    webApp.get('/4.png', function (req, res) {
        res.sendFile(path + '/assets/four.png')
    })
    webApp.get('/5.png', function (req, res) {
        res.sendFile(path + '/assets/five.png')
    })

    webApp.get('/medal1.png', function (req, res) {
        res.sendFile(path + '/assets/medal1.png')
    })
    webApp.get('/medal2.png', function (req, res) {
        res.sendFile(path + '/assets/medal2.png')
    })
    webApp.get('/medal3.png', function (req, res) {
        res.sendFile(path + '/assets/medal3.png')
    })

    webApp.get('/1v1.png', function (req, res) {
        res.sendFile(path + '/assets/1v1.png')
    })
    webApp.get('/2v2.png', function (req, res) {
        res.sendFile(path + '/assets/2v2.png')
    })
    webApp.get('/3v3.png', function (req, res) {
        res.sendFile(path + '/assets/3v3.png')
    })
    webApp.get('/4v4.png', function (req, res) {
        res.sendFile(path + '/assets/4v4.png')
    })
    webApp.get('/create.png', function (req, res) {
        res.sendFile(path + '/assets/create.png')
    })
    
}

module.exports = { SendFiles }