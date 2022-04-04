
import Table from "./classes/table.js";

// controlador del juego
document.getElementById("Start").addEventListener("click", startGame);
document.getElementById("Deal").addEventListener("click", deal);
document.getElementById("Hit").addEventListener("click", hit);
document.getElementById("Stand").addEventListener("click", stand);
document.getElementById("Split").addEventListener("click", split);

let table;

let NOTHING = '00';
let PLAYING = '01';
let NEXT = '10';
let FINISHED = '11';

let playerHand;
let dealerHand;

let gameState = NOTHING;

function startGame(){
    gameState = NOTHING;

    table = new Table();

    document.getElementById("Deal").style.visibility="visible";
    document.getElementById("Hit").style.visibility="hidden";
    document.getElementById("Stand").style.visibility="hidden";

    document.getElementById("deck").style.visibility="visible";
    document.getElementById("discards").style.visibility="hidden";

    document.getElementById("result").style.visibility="hidden";
    document.getElementById("playerPoints").style.visibility="hidden";
    document.getElementById("dealerPoints").style.visibility="hidden";

    let dealer = document.getElementById("dealer");
    while (dealer.firstChild) {
        dealer.removeChild(dealer.lastChild);
    }

    let player = document.getElementById("player");
    while (player.firstChild) {
        player.removeChild(player.lastChild);
    }
}

function deal(){

    if(gameState != NOTHING){
        document.getElementById("discards").style.visibility="visible";

        let dealer = document.getElementById("dealer");
        while (dealer.firstChild) {
            dealer.removeChild(dealer.lastChild);
        }

        let player = document.getElementById("player");
        while (player.firstChild) {
            player.removeChild(player.lastChild);
        }
    }
    
    document.getElementById('result').style.visibility="hidden";

    gameState = table.deal();

    document.getElementById("dealer").style.visibility="visible";
    document.getElementById("player").style.visibility="visible";

    document.getElementById("dealerPoints").style.visibility="visible";
    document.getElementById("playerPoints").style.visibility="visible";

    for(let i=0; i<table.getHandString()[0].length; i++){
        drawCard(table.getHandString()[0][i], 'dealer');
    }
    dealerHand = [table.getHandString()[0][0]];

    for(let i=0; i<table.getHandString()[1].length; i++){
        drawCard(table.getHandString()[1][i], 'player');
    }
    playerHand = table.getHandString()[1];

    updatePoints(table.getPoints());


    if(gameState[0] == PLAYING){

        document.getElementById("Deal").style.visibility="hidden";
        document.getElementById("Hit").style.visibility="visible";
        document.getElementById("Stand").style.visibility="visible";

        if(gameState[1] == 'SPLIT'){
            document.getElementById("Split").style.visibility="visible";
        }

    } else if (gameState[0] == NEXT){
        document.getElementById('dealer').removeChild(document.getElementById('dealer').lastChild);
        drawCard(table.getHandString()[0][1], 'dealer');

        reveal('BLACKJACK | WINNER: '+gameState[1]);
        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }

    
}

function split(){
    console.log("SPLIT")
    table.split();
    document.getElementById("Split").style.visibility="hidden";
}

function hit(){
    document.getElementById("Split").style.visibility="hidden";

    gameState = table.hit();

    let found;
    for(let i=0; i<table.getHandString()[1].length; i++){
        found=false;
        for(let j=0; j< playerHand.length; j++){
            if(table.getHandString()[1][i] == playerHand [j]){
                found = true;
            }
        }
        if(!found){
            drawCard(table.getHandString()[1][i], 'player');
            playerHand.push(table.getHandString()[1][i]);
        }
    }
    updatePoints(table.getPoints());

    if(gameState[0] == NEXT){
        document.getElementById('dealer').removeChild(document.getElementById('dealer').lastChild);
        drawCard(table.getHandString()[0][1], 'dealer');

        reveal('BUST | WINNER: DEALER');
        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }
}

function stand(){
    document.getElementById("Split").style.visibility="hidden";

    gameState = table.stand();

    document.getElementById('dealer').removeChild(document.getElementById('dealer').lastChild);
    let found;
    for(let i=0; i<table.getHandString()[0].length; i++){
        found=false;
        for(let j=0; j< dealerHand.length; j++){
            if(table.getHandString()[0][i] == dealerHand [j]){
                found = true;
            }
        }
        if(!found){
            drawCard(table.getHandString()[0][i], 'dealer');
            dealerHand.push(table.getHandString()[0][i]);
        }
    }
    updatePoints(table.getPoints());

    if(gameState[0] == NEXT){
        reveal(gameState[1]);
        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }
} 


function drawCard(card, player){
    let div;
    let img = document.createElement("img");
    img.src = cardName(card);
    if(player == 'dealer'){
        img.classList.add('dealerCards');
        div = document.getElementById("dealer");
    } else if(player = 'player') {
        img.classList.add('playerCards');
        div = document.getElementById("player");
    }
    
    div.appendChild(img);
}

function updatePoints(points){
    let span1 = document.createElement('span')
    span1.textContent=points[0];
    let div1 = document.getElementById('dealerPoints');
    div1.removeChild(div1.lastChild);
    div1.appendChild(span1);

    let span2 = document.createElement('span')
    span2.textContent=points[1];
    let div2 = document.getElementById('playerPoints');
    div2.removeChild(div2.lastChild);
    div2.appendChild(span2);
}

function reveal(message){

    let finalDealer = table.getPoints()[0];
    let finalPlayer = table.getPoints()[1];
    let finalPoints = [finalDealer[1]??finalDealer, finalPlayer[1]??finalPlayer];

    updatePoints(finalPoints);

    let h1 = document.getElementById('result');
    
    if(message == 'DEALER' || message == 'PLAYER'){
        h1.textContent = 'WINNER: '+ message;
    } else {
        h1.textContent = message;
    }
    h1.style.visibility="visible";

}

function cardName(card){
    let path = './assets/cards/'; 
    if(card!= 'X'){
        let split_card = card.split('');
        let rank;
        let suit;
        if(split_card.length==3){
            rank = '10';
            suit = split_card[2];
        } else {
            rank = split_card[0];
            suit = split_card[1];
        }
        

        switch(rank){
            case '2':
                path += "Two";
            break;
            case '3':
                path += "Three";
            break;
            case '4':
                path += "Four";
            break;
            case '5':
                path += "Five";
            break;
            case '6':
                path += "Six";
            break;
            case '7':
                path += "Seven";
            break;
            case '8':
                path += "Eight";
            break;
            case '9':
                path += "Nine";
            break;
            case '10':
                path += "Ten";
            break;
            case 'J':
                path += "Jack";
            break;
            case 'Q':
                path += "Queen";
            break;
            case 'K':
                path += "King";
            break;
            case 'A':
                path += "Ace";
            break;
        }

        path += ' of ';

        switch(suit){
            case '♦':
                path += 'Diamonds';
            break;
            case '♠':
                path += 'Spades';
            break;
            case '♥':
                path += 'Hearts';
            break;
            case '♣':
                path += 'Clubs';
            break;
        }

    } else{
        path += 'Back';
    }

    path += '.png';

    return path;
}


//todo split
//todo end of deck



