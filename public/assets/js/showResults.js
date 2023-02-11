function showResults(scoreList){
    console.log(scoreList[0]["displayName"])
    let divResults = window.document.createElement('div')
    divResults.setAttribute('class','results')
    divResults.setAttribute('div','results')
    
    let ul = window.document.createElement('ul')
    
    let li1 = window.document.createElement('li')
    
    let div1 = window.document.createElement('div')
    div1.setAttribute('class','divMedal')
    
    let imgMedal1 = window.document.createElement('img')
    imgMedal1.setAttribute('class','imgMedal')
    imgMedal1.setAttribute('src','medal1.png')
    
    let pMedal1 = window.document.createElement('p')
    pMedal1.setAttribute('class','pMedal')
    pMedal1.setAttribute('id','pFirst')
    if(scoreList[0] != undefined) pMedal1.innerText = scoreList[0]["displayName"]
    
    div1.appendChild(imgMedal1)
    div1.appendChild(pMedal1)
    
    li1.appendChild(div1)
    ul.appendChild(li1)
    
    
    
    
    let li2 = window.document.createElement('li')
    
    let div2 = window.document.createElement('div')
    div2.setAttribute('class','divMedal')
    
    let imgMedal2 = window.document.createElement('img')
    imgMedal2.setAttribute('class','imgMedal')
    imgMedal2.setAttribute('src','medal2.png')
    
    let pMedal2 = window.document.createElement('p')
    pMedal2.setAttribute('class','pMedal')
    pMedal2.setAttribute('id','pSecond')
    if(scoreList[1] != undefined) pMedal2.innerText = scoreList[1]["displayName"]

    div2.appendChild(imgMedal2)
    div2.appendChild(pMedal2)
    
    li2.appendChild(div2)
    ul.appendChild(li2)
    
    
    
    
    let li3 = window.document.createElement('li')
    
    let div3 = window.document.createElement('div')
    div3.setAttribute('class','divMedal')
    
    let imgMedal3 = window.document.createElement('img')
    imgMedal3.setAttribute('class','imgMedal')
    imgMedal3.setAttribute('src','medal3.png')
    
    let pMedal3 = window.document.createElement('p')
    pMedal3.setAttribute('class','pMedal')
    pMedal3.setAttribute('id','pThird')
    if(scoreList[2] != undefined) pMedal3.innerText = scoreList[2]["displayName"]
    
    div3.appendChild(imgMedal3)
    div3.appendChild(pMedal3)
    
    li3.appendChild(div3)
    ul.appendChild(li3)
    
    
    divResults.appendChild(ul)
    window.document.body.appendChild(divResults)
}