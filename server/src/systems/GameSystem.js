class GameSystem{
    constructor(){       
        this.games = {},
        
        setInterval(() =>{
            this.main()
        },1000)
    }

    main(){
        this.updateGames()
    }

    updateGames(){
        for(const gameIndex in this.games){
            const game = this.games[gameIndex]
            if(game.stage === 'running'){
                game.time++
                game.sendTime()
                if(game.verifGameEnd()){
                    delete this.games[gameIndex]
                }
            }
        }
    }
}

module.exports = {GameSystem}