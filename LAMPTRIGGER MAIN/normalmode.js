var board = [];
var rows = 14;
var columns = 14;

var minesCount = 22;
var minesLocation = [];
var lampCount =  minesCount;

var tilesClicked = 0;
var lampEnabled = false;

var gameOver = false;



document.addEventListener("DOMContentLoaded", startgame);

function setMines(){


    let minesLeft = minesCount;
    while (minesLeft > 0) {
        let r = Math.floor(Math.random()* rows);
        let c = Math.floor(Math.random()* columns)
        let id = r.toString() + "-" + c.toString();

        if (!minesLocation.includes(id)){
            minesLocation.push(id);
            minesLeft -= 1;
        }
    }
   
}

function startgame() {
    document.getElementById("mines-count").innerText = minesCount;
    setMines();

   
    for (let r = 0; r < rows; r++) { 
        let row = [];
        for (let c = 0; c < columns; c++) {
            
 
            let tile = document.createElement("div");
            tile.id = r.toString() + "-" + c.toString();
            tile.addEventListener ("click", clickTile);
            tile.addEventListener ("contextmenu", lampTiled)
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }

}

function lampTiled(event) {
    event.preventDefault();

    let tile = event.target;

    if (gameOver || tile.classList.contains("tile-clicked")) {
        return;
    }

    if (tile.innerText === "💡") {
        tile.innerText = "";
        tile.classList.remove("lamped");
        lampCount++;
    
    } 
    
    else if (lampCount === 0) {
        alert("Sudah Mencapai Batas Maksimal")
    }

    else {
        tile.innerText = "💡"; 
        tile.classList.add("lamped");
        lampCount--;
    }


    document.getElementById("mines-count").innerText = lampCount;
}



function setLamp(){
    if (lampEnabled){
        lampEnabled = false;
        document.getElementById("lamp-button").style.backgroundColor = "white";
    }
    else {
        lampEnabled = true;
        document.getElementById("lamp-button").style.backgroundColor = "lightgray";
    }
}

function clickTile() {
    if (gameOver || this.classList.contains("tile-clicked")) {
        return;
    }

    if (this.classList.contains("lamped")) {
        console.log("Cannot Click Flagged Tile:", this.id);
        return;
    }

    let tile = this;
    console.log("Tile clicked:", tile.id);

    if (lampEnabled) {
        if (tile.innerText == "") {
            tile.innerText = "💡";
        } else if (tile.innerText == "💡") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        document.getElementById("message").innerText = "Game Over! 💣";
        return;
    }

    let coords = tile.id.split("-");
    let r = parseInt(coords[0]);
    let c = parseInt(coords[1]);
    checkMine(r, c);


    if (tilesClicked === rows * columns - minesCount) {
        gameOver = true;
        document.getElementById("message").innerText = "Congratulations! You Win! 🎉";
        document.getElementById("mines-count").innerText = "Cleared";
    }
}

function revealMines(){
    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < columns; c++) {
            let tile = board [r][c];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";
            }
        }
    }
}

function checkMine (r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return;
    }
    if (board [r][c].classList.contains("tile-clicked")){
        return;
    }

    board [r][c].classList.add("tile-clicked");
    tilesClicked += 1;

    let minesFound = 0;

    minesFound += checkTile(r-1, c-1); 
    minesFound += checkTile(r-1, c); 
    minesFound += checkTile(r-1, c+1); 

    minesFound += checkTile (r, c-1)
    minesFound += checkTile (r, c+1)

    minesFound += checkTile (r+1, c-1)
    minesFound += checkTile (r+1, c)
    minesFound += checkTile (r+1, c+1)
    
    if (minesFound > 0){
        board[r][c].innerText = minesFound;
        board[r][c].classList.add("x"+ minesFound.toString());
    }
    else {

        checkMine(r-1, c-1);
        checkMine(r-1, c);
        checkMine(r-1, c+1);

        checkMine(r, c-1);
        checkMine(r, c+1);

        checkMine(r+1, c-1);
        checkMine(r+1, c);
        checkMine(r+1, c+1);
    }

    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("mines-count").innerText = "Cleared";
        gameOver = true;
    }

}

function checkTile(r, c){
    if (r < 0 || r >= rows || c < 0 || c >= columns){
        return 0;
    }
    if (minesLocation.includes(r.toString() + "-" + c.toString())){
        return 1;
    }
    return 0;
}

function goHome() {
    
    document.getElementById("message").innerText = "Redirecting to Home..."; 
    window.location.href = "home.html";
   
}

function resetGame() {
    gameOver = false;
    tilesClicked = 0;
    board = [];
    minesLocation = [];
    document.getElementById("message").innerText = "";
    document.getElementById("board").innerHTML = ""; 
    document.getElementById("mines-count").innerText = minesCount; 
    lampCount = minesCount
    startgame(); 
}