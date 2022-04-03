import Table from "./classes/table.js";

// controlador del juego

document.getElementById("Start").addEventListener("click", startGame);
document.getElementById("Deal").addEventListener("click", deal);
document.getElementById("Hit").addEventListener("click", hit);
document.getElementById("Stand").addEventListener("click", stand);

let table;

let PLAYING = '01';
let NEXT = '10';
let FINISHED = '11';

let gameState;

function startGame(){
    console.clear();

    table = new Table();

    document.getElementById("Deal").style.visibility="visible";
    document.getElementById("Hit").style.visibility="hidden";
    document.getElementById("Stand").style.visibility="hidden";
}

function deal(){
    gameState = table.deal();

    console.log('DEALER: ', table.getHandString()[0] , table.getPoints()[0])
    console.log('PLAYER: ', table.getHandString()[1] , table.getPoints()[1])
    console.log('.........................................................')


    if(gameState[0] == PLAYING){

        document.getElementById("Deal").style.visibility="hidden";
        document.getElementById("Hit").style.visibility="visible";
        document.getElementById("Stand").style.visibility="visible";

    } else if(gameState[0] == NEXT){

        console.log('DEALER: ', table.getHandString()[0] , table.getPoints()[0][1]??table.getPoints()[0]) //prints second element of array. if undefined prints single number
        console.log('PLAYER: ', table.getHandString()[1] , table.getPoints()[1][1]??table.getPoints()[1])
        console.log('////////////////////////////////////////////////////')
        console.log('BLACKJACK');
        console.log('WINNER: ', gameState[1]);
        console.log('////////////////////////////////////////////////////')
        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }

    
}

function hit(){
    gameState = table.hit();

    console.log('DEALER: ', table.getHandString()[0] , table.getPoints()[0])
    console.log('PLAYER: ', table.getHandString()[1] , table.getPoints()[1])
    console.log('.........................................................')

    if(gameState[0] == NEXT){
        console.log('////////////////////////////////////////////////////')
        console.log('BUST');
        console.log('WINNER: ', gameState[1]);
        console.log('////////////////////////////////////////////////////')
        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }
}

function stand(){
    gameState = table.stand();

    console.log('DEALER: ', table.getHandString()[0] , table.getPoints()[0][1]??table.getPoints()[0])
    console.log('PLAYER: ', table.getHandString()[1] , table.getPoints()[1][1]??table.getPoints()[1])
    console.log('.........................................................')

    if(gameState[0] == NEXT){
        console.log('////////////////////////////////////////////////////')
        console.log('WINNER: ', gameState[1]);
        console.log('////////////////////////////////////////////////////')
        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }
} 

//todo split
//todo end of deck



