let difficulties = document.querySelectorAll("ul .difficulty");
let body = document.querySelector("body");
var turn = 1;
let abstractBoard = [];

// set event listeners for choose difficulty view
for(let i=0; i<difficulties.length; i++) {
    difficulties[i].addEventListener("mouseenter", enterDiffColor);

    difficulties[i].addEventListener("mouseout", exitDiffColor);

    difficulties[i].addEventListener("click", startGame);
}

//change color when user enters difficulty block
function enterDiffColor () {
    this.style.backgroundColor = "#A1D490";
}

//reset color when user leaves difficulty block
function exitDiffColor () {
    this.style.backgroundColor = "#D4A190";
}

//get boardSize from difficulty
function boardSize (el) {
    let xy;
    switch(el.innerHTML)
    {
        case "Easy": 
        {
            xy = 10;
            break;
        }
        case "Medium":
        {
            xy = 30;
            break;
        }
        case "Extreme":
        {
            xy = 80;
            break;
        }

    }

    return xy;
}

//create game once difficulty chosen
function startGame () {
    abstractBoard = [];
    turn = 1;
    let boardContainer = document.createElement("div");

    if(this.classList.contains("hide")) {
        this.classList.remove("hide");
    }

    boardContainer.className = "container";
    body.querySelector(".select_diff").className += " hide";
    body.querySelector(".difficulty_list").className += " hide";
    let xy = boardSize(this);

    let tempRow = [];
    for(let i=0; i<xy+2; i++) {
        tempRow.push(-1);
    }
    abstractBoard.push(tempRow);

    for(let i=0; i<xy; i++) {
        let tempRow = [-1];
        for(let j=0; j<xy; j++) {
            let gridSq = document.createElement("div");

            boardContainer.append(gridSq);
            // gridSq.className = "gridSq unclicked " + this.innerHTML;
            gridSq.className = "gridSq " + this.innerHTML;
            gridSq.setAttribute("data-x", i+1);
            gridSq.setAttribute("data-y", j+1);
            tempRow.push(0);

            gridSq.addEventListener("click", reveal);
            gridSq.addEventListener("contextmenu", rightclick);
        }
        var breaker = document.createElement('div');
        boardContainer.appendChild(breaker);
        breaker.className = 'clear';
        tempRow.push(-1);
        abstractBoard.push(tempRow);
    }

    let tempRow1 = [];
    for(let i=0; i<xy+2; i++) {
        tempRow1.push(-1);
    }
    abstractBoard.push(tempRow1);

    body.appendChild(boardContainer);

    configureBombs(body, this);
}

function reveal() {
    this.classList.remove("unclicked");
    let x = this.getAttribute("data-x");
    let y = this.getAttribute("data-y");
    abstractBoard[parseInt(x)][parseInt(y)] = 2;

    if(this.classList.contains("bomb")) {
        if(turn != 1) {
            this.style.backgroundSize = "100%";
            setTimeout(function() {
                alert("You have lost!");
                body.getElementsByTagName("h2")[0].classList.remove("hide");
                body.getElementsByTagName("ul")[0].classList.remove("hide");
                body.querySelector("div.container").parentElement.removeChild(body.querySelector("div.container"));
                
            },100)
        }
        else {
            this.classList.remove("bomb");
            turn++;
            placeSafe(this);
        }
    }
    else {
        placeSafe(this);
        determineWin(parseInt(x), parseInt(y));
        turn++;
    }
}

function rightclick () {
    this.style.backgroundImage = "url(/assets/flagged.png)";
    this.style.backgroundRepeat = "repeat-none";
    this.style.backgroundSize = "100% 100%";
}

function determineWin(x, y) {
    let won = true;
    abstractBoard.forEach((oel) => 
    oel.forEach((iel) => {
        if(iel == 0) {
            won = false;
        }
    }   
    )
    )

    if(won) {
        alert("You have won!!");
    }
    
}

// place number in each safe minesweeper square
function placeSafe(elem) {
    if (elem.classList.contains("bomb")) {
        //do nothing, is a bomb
    }
    else {
        let x = elem.getAttribute("data-x");
        let y = elem.getAttribute("data-y");
        x = parseInt(x);
        y = parseInt(y);

        let bombCount = 0;

        if (abstractBoard[x-1][y] === 1) {
            bombCount++;
        }
        if(abstractBoard[x-1][y-1] === 1){
            bombCount++;
        }
        if(abstractBoard[x][y-1] === 1){
            bombCount++;
        }
        if(abstractBoard[x+1][y] === 1){
            bombCount++;
        }
        if(abstractBoard[x+1][y+1] === 1){
            bombCount++;
        }
        if(abstractBoard[x][y+1] === 1){
            bombCount++;
        }
        if(abstractBoard[x+1][y-1] === 1){
            bombCount++;
        }
        if(abstractBoard[x-1][y+1] === 1){
            bombCount++;
        }

        if(bombCount > 0) {
            insertNumber(elem, bombCount);
        }
        else {
            //since no bombs adjacent, shade darker gray
            elem.style.backgroundColor = "darkgray";

            if(abstractBoard[x+1][y] != -1 && abstractBoard[x+1][y] != 2) {
                revealAdjacent(x+1, y);
            }
            if(abstractBoard[x+1][y+1] != -1 && abstractBoard[x+1][y+1] != 2) {
                revealAdjacent(x+1, y+1);
            }
            if(abstractBoard[x][y+1] != -1 && abstractBoard[x][y+1] != 2) {
                revealAdjacent(x, y+1);
            }
            if(abstractBoard[x-1][y] != -1 && abstractBoard[x-1][y] != 2) {
                revealAdjacent(x-1, y);
            }
            if(abstractBoard[x-1][y-1] != -1 && abstractBoard[x-1][y-1] != 2) {
                revealAdjacent(x-1, y-1);
            }
            if(abstractBoard[x][y-1] != -1 && abstractBoard[x][y-1] != 2) {
                revealAdjacent(x, y-1);
            }
            if(abstractBoard[x+1][y-1] != -1 && abstractBoard[x][y-1] != 2) {
                revealAdjacent(x, y-1);
            }
            if(abstractBoard[x-1][y+1] != -1 && abstractBoard[x][y-1] != 2) {
                revealAdjacent(x, y-1);
            }
        }
    }
}

//Reveal all adjacent squares that are adjacent
// to NO bombs.
function revealAdjacent(x, y) {
    let bombCount = 0;

    if (abstractBoard[x-1][y] == 1) {
        bombCount++;
    }
    if(abstractBoard[x-1][y-1] == 1){
        bombCount++;
    }
    if(abstractBoard[x][y-1] == 1){
        bombCount++;
    }
    if(abstractBoard[x+1][y] == 1){
        bombCount++;
    }
    if(abstractBoard[x+1][y+1] == 1){
        bombCount++;
    }
    if(abstractBoard[x][y+1] == 1){
        bombCount++;
    }
    if(abstractBoard[x+1][y-1] == 1) {
        bombCount++;
    }
    if(abstractBoard[x-1][y+1] == 1) {
        bombCount++;
    }

    if(bombCount === 0) {
        elem = body.querySelector("div.container");
        elem = elem.querySelector("[data-x=" + CSS.escape(x) + "][data-y=" + CSS.escape(y) + "]");
        elem.classList.remove("unclicked");

        //since no bombs adjacent, shade darker gray
        elem.style.backgroundColor = "darkgray";
        abstractBoard[x][y] = 2;

        if(abstractBoard[x+1][y] != -1 && abstractBoard[x+1][y] != 2) {
            revealAdjacent(x+1, y);
        }
        if(abstractBoard[x+1][y+1] != -1 && abstractBoard[x+1][y+1] != 2) {
            revealAdjacent(x+1, y+1);
        }
        if(abstractBoard[x][y+1] != -1 && abstractBoard[x][y+1] != 2) {
            revealAdjacent(x, y+1);
        }
        if(abstractBoard[x-1][y] != -1 && abstractBoard[x-1][y] != 2) {
            revealAdjacent(x-1, y);
        }
        if(abstractBoard[x-1][y-1] != -1 && abstractBoard[x-1][y-1] != 2) {
            revealAdjacent(x-1, y-1);
        }
        if(abstractBoard[x][y-1] != -1 && abstractBoard[x][y-1] != 2) {
            revealAdjacent(x, y-1);
        }
        if(abstractBoard[x+1][y-1] != -1 && abstractBoard[x+1][y-1] != 2) {
            revealAdjacent(x+1, y-1);
        }
        if(abstractBoard[x-1][y+1] != -1 && abstractBoard[x-1][y+1] != 2) {
            revealAdjacent(x-1, y+1);
        }

    }

}

function insertNumber(elem, bombCount) {
        elem.style.backgroundRepeat = "no-repeat";
        elem.style.backgroundSize = "100% 100%";

        switch(bombCount) {
            case 1:
            elem.style.backgroundImage = "url(/assets/1.png)";
            break;
            case 2:
            elem.style.backgroundImage = "url(/assets/2.png)";
            break;
            case 3:
            elem.style.backgroundImage = "url(/assets/3.png)";
            break;
            case 4:
            elem.style.backgroundImage = "url(/assets/4.png)";
            break;
            case 5:
            elem.style.backgroundImage = "url(/assets/5.png)";
            break;
            case 6:
            elem.style.backgroundImage = "url(/assets/6.png)";
            break;
            case 7:
            elem.style.backgroundImage = "url(/assets/7.png)";
            break;
            case 8:
            elem.style.backgroundImage = "url(/assets/8.png)";
            break;

        }
}

// call placeBomb on each minesweeper square
function configureBombs(el, t) {
    el = el.querySelectorAll("div [data-x], div [data-y]");
    el.forEach((elem) => placeBomb(elem, t))
}

// place bomb randomly on squares
function placeBomb(elem, t) {
    let rand = Math.floor((Math.random() * 100) + 1);

    console.log(t.innerHTML);
    if(t.innerHTML == "Easy"){
        if(rand <= 10) {
            elem.className += " bomb";
    
            let x = elem.getAttribute("data-x");
            let y = elem.getAttribute("data-y");
            abstractBoard[parseInt(x)][parseInt(y)] = 1;
        }
    }
    else if(t.innerHTML == "Medium"){
        if(rand <= 40) {
            elem.className += " bomb";
    
            let x = elem.getAttribute("data-x");
            let y = elem.getAttribute("data-y");
            abstractBoard[parseInt(x)][parseInt(y)] = 1;
        }
    }
    else if(t.innerHTML == "Extreme"){
        if(rand <= 80) {
            elem.className += " bomb";
    
            let x = elem.getAttribute("data-x");
            let y = elem.getAttribute("data-y");
            abstractBoard[parseInt(x)][parseInt(y)] = 1;
        }
    }

}

