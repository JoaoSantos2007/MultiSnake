function updateTable(scoreArray,totPlayers){
    
    let scoreTableInnerHTML

    scoreTableInnerHTML = 
    `<tr class="header">
        <td>Top 10 players</td>
        <td>Score</td>
    </tr>`

    scoreArray.forEach((score) => {
        scoreTableInnerHTML += `
            <tr class="${socketID === score.socketID ? 'current-player' : ''}">
                <td class="socket-id">${score.displayName}</td>
                <td class="score-value">${score.score}</td>
            </tr>
        `
    })

    scoreTableInnerHTML += `
        <tr class="footer">
            <td>Total de jogadores</td>
            <td align="right">${totPlayers}</td>
        </tr>
    `

    window.document.getElementById("scoreTable").innerHTML = scoreTableInnerHTML
}