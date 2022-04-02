import Table from "./classes/table.js";

// controlador del juego

document.getElementById("Start").addEventListener("click", startGame);
document.getElementById("Deal").addEventListener("click", deal);
document.getElementById("Hit").addEventListener("click", hit);
document.getElementById("Stand").addEventListener("click", stand);

let table;

function startGame(){
    table = new Table();

    document.getElementById("Deal").style.visibility="visible";
}

function deal(){
    table.deal();

    document.getElementById("Deal").style.visibility="hidden";
    document.getElementById("Hit").style.visibility="visible";
    document.getElementById("Stand").style.visibility="visible";
}

function hit(){
    table.hit();
}

function stand(){
    table.stand();
} 

//todo split

//doing a 1 or 11

//todo new deal after turn
//todo end of deck



