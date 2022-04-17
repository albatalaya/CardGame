
import Table from "./classes/table.js";

// controlador del juego
document.getElementById("Start").addEventListener("click", startGame);
document.getElementById("Deal").addEventListener("click", deal);
document.getElementById("Hit").addEventListener("click", hit);
document.getElementById("Stand").addEventListener("click", stand);
document.getElementById("Split").addEventListener("click", splitHand);

let table;

let NOTHING = '000';
let PLAYING = '001';
let SPLIT1 = '010';
let SPLIT2 = '011';
let NEXT = '100';

let playerHand;
let dealerHand;

let gameState = NOTHING;

let wasSplit = false;

let dealerPoints = 0;
let playerPoints = 0;

function startGame(){
    gameState = NOTHING;

    table = new Table();

    document.getElementById("Deal").style.visibility="visible";
    document.getElementById("Hit").style.visibility="hidden";
    document.getElementById("Stand").style.visibility="hidden";
    document.getElementById("Split").style.visibility="hidden";
    document.getElementById("Start").style.visibility="hidden";

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
    if(wasSplit){
        unflex();
        wasSplit = false;
    }

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

        if(gameState[1] == 'DEALER'){
            dealerPoints += 1;
        } else if ( gameState[1] == 'PLAYER'){
            playerPoints += 1;
        } 

        document.getElementById('dealer-score').textContent = dealerPoints;
        document.getElementById('player-score').textContent = playerPoints;


        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }

    
}

function splitHand(){
    gameState = table.splitHand();

    document.getElementById("Split").style.visibility="hidden";

    playerHand = table.getHandString()[1];

    //delete player cards
    let player = document.getElementById("player");
    while (player.firstChild) {
        player.removeChild(player.lastChild);
    }

    //delete playerPoints
    let player_points = document.getElementById('playerPoints');
    while (player_points.firstChild) {
        player_points.removeChild(player_points.lastChild);
    }

    flex();

    drawCard(table.getHandString()[1][0], 'split_1')
    drawCard(table.getHandString()[2][0], 'split_2')

    document.getElementById('split_2').style.opacity = '0.5';
}

function hit(){
    document.getElementById("Split").style.visibility="hidden";
    

    let player;
    let num = 1; 
    switch (gameState[0]){
        case PLAYING:
            player = 'player';
            break; 
        case SPLIT1: 
            player = 'split_1';
            break;
        case SPLIT2:
            player = 'split_2';
            num = 2;
            break;
    }
    
    gameState = table.hit();


    let found;
    for(let i=0; i<table.getHandString()[num].length; i++){
        found=false;
        for(let j=0; j< playerHand.length; j++){
            if(table.getHandString()[num][i] == playerHand [j]){
                found = true;
            }
        }
        if(!found){
            drawCard(table.getHandString()[num][i], player);
            playerHand.push(table.getHandString()[num][i]);
        }
    }
    updatePoints(table.getPoints());

    if(gameState[0] == NEXT && gameState.length < 3){
        document.getElementById('dealer').removeChild(document.getElementById('dealer').lastChild);
        drawCard(table.getHandString()[0][1], 'dealer');

        reveal('BUST | WINNER: DEALER');
        dealerPoints += 1;
        document.getElementById('dealer-score').textContent = dealerPoints;
            
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }

    if(gameState[0] == NEXT && gameState.length == 3){
        document.getElementById('dealer').removeChild(document.getElementById('dealer').lastChild);
        drawCard(table.getHandString()[0][1], 'dealer');

        reveal([gameState[1], gameState[2]]);

        document.getElementById('result').style.opacity = '1';

        document.getElementById('split_1').style.opacity = '1';
        document.getElementById('split_1_points').style.opacity = '1';

        document.getElementById('split_2').style.opacity = '1';
        document.getElementById('split_2_points').style.opacity = '1';

        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    }


    if(gameState[0] == SPLIT2 && gameState[1] != undefined){
        playerHand = table.getHandString()[2];

        reveal('BUST | WINNER: DEALER');
        document.getElementById('result').style.opacity = '0.5';

        document.getElementById('split_1').style.opacity = '0.5';
        document.getElementById('split_1_points').style.opacity = '0.5';

        document.getElementById('split_2').style.opacity = '1';
        document.getElementById('split_2_points').style.opacity = '1';
    }
}

function stand(){
    document.getElementById("Split").style.visibility="hidden";

    gameState = table.stand();

    if(gameState[0] == NEXT){
    document.getElementById('dealer').removeChild(document.getElementById('dealer').lastChild);
    let found;
    for(let i=0; i<table.getHandString()[0].length; i++){
        found=false;
        for(let j=0; j< dealerHand.length; j++){
            if(table.getHandString()[0][i] == dealerHand[j]){
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
        if(gameState.length==3){
            reveal([gameState[1],gameState[2]]);
            document.getElementById('result').style.opacity = '1';

            document.getElementById('split_1').style.opacity = '1';
            document.getElementById('split_1_points').style.opacity = '1';

            document.getElementById('split_2').style.opacity = '1';
            document.getElementById('split_2_points').style.opacity = '1';
        }else{
            reveal(gameState[1]);
        }
        
        
        document.getElementById("Deal").style.visibility="visible";
        document.getElementById("Hit").style.visibility="hidden";
        document.getElementById("Stand").style.visibility="hidden";
    
    }

    } else if( gameState[0] == SPLIT2){
        playerHand = table.getHandString()[2];

        document.getElementById('split_1').style.opacity = '0.5';
        document.getElementById('split_1_points').style.opacity = '0.5';

        document.getElementById('split_2').style.opacity = '1';
        document.getElementById('split_2_points').style.opacity = '1';
    }
} 


function drawCard(card, player){
    let div = document.getElementById(player);
    let img = document.createElement("img");
    img.src = cardName(card);
    img.classList.add('cards');
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

    if(points.length == 2){
        let div2 = document.getElementById('playerPoints');
        div2.removeChild(div2.lastChild);
        div2.appendChild(span2);
    } else {
        let split1 = document.getElementById('split_1_points');
        split1.removeChild(split1.lastChild);
        split1.appendChild(span2);

        let span3 = document.createElement('span')
        span3.textContent=points[2];
        let split2 = document.getElementById('split_2_points');
        split2.removeChild(split2.lastChild);
        split2.appendChild(span3);
    }

}

function reveal(message){

    let finalDealer = table.getPoints()[0];
    let finalPlayer = table.getPoints()[1];
    let finalPoints;

    if(gameState[0] == NEXT && table.getPoints()[2] == undefined){
        finalPoints = [finalDealer[1]??finalDealer, finalPlayer[1]??finalPlayer];
    } else{
        let finalSplit = table.getPoints()[2];
        finalPoints = [finalDealer[1]??finalDealer, finalPlayer[1]??finalPlayer, finalSplit[1]??finalSplit];
    } 

    updatePoints(finalPoints);

    let h1 = document.getElementById('result');
    
    if(message == 'DEALER' || message == 'PLAYER'){
        h1.textContent = 'WINNER: '+ message;
    } else if(typeof message == 'string') {
        h1.textContent = message;
    } else {
        h1.textContent = 'WINNER: '+ message[0]+' | WINNER: '+message[1];
        wasSplit = true;
    }

    if(message == 'DEALER'){
        dealerPoints += 1;
    } else if ( message == 'PLAYER'){
        playerPoints += 1;
    } 

    if ( message[0] == 'PLAYER'){
        playerPoints += 1;
    } 

    if ( message[1] == 'PLAYER'){
        playerPoints += 1;
    } 

    if ( message[0] == 'DEALER'){
        dealerPoints += 1;
    }

    if ( message[1] == 'DEALER'){
        dealerPoints += 1;
    }

    //update score board
    document.getElementById('dealer-score').textContent = dealerPoints;
    document.getElementById('player-score').textContent = playerPoints;




    h1.style.visibility="visible";
}

function flex(){ //modify DOM to allow two hands to be playing

    //create divs for the split hand
    let split1 = document.createElement('div');
    split1.id= 'split_1';
    document.getElementById('player').appendChild(split1); 

    let split2 = document.createElement('div');
    split2.id= 'split_2';
    document.getElementById('player').appendChild(split2);

    //turn player div to flexbox
    player.classList.add('flex');
    player.style.padding = '0';

    //turn points to flex

    let h7_1 = document.createElement('h7');
    h7_1.textContent='POINTS:';

    let split1_points = document.createElement('span');
    split1_points.id= 'split_1_points';

    let p1 = document.createElement('span');
    p1.textContent = table.getPoints()[1];

    split1_points.appendChild(h7_1);
    split1_points.appendChild(p1);
    document.getElementById('playerPoints').appendChild(split1_points);

    let h7_2 = document.createElement('h7');
    h7_2.textContent='POINTS:';

    let split2_points = document.createElement('span');
    split2_points.id= 'split_2_points';
    let p2 = document.createElement('span');
    p2.textContent = table.getPoints()[2];

    split2_points.appendChild(h7_2);
    split2_points.appendChild(p2)
    document.getElementById('playerPoints').appendChild(split2_points); 
    document.getElementById('split_2_points').style.opacity = '0.5';

    document.getElementById('playerPoints').classList.add('flex');
    document.getElementById('playerPoints').style.gap = "13vw";
}

function unflex(){ //modify DOM to its initial settings

    let split1 = document.getElementById('split_1');
    document.getElementById('player').removeChild(split1); 

    let split2 = document.getElementById('split_2');
    document.getElementById('player').removeChild(split2);

    player.classList.remove('flex');
    player.style.paddingLeft = '49vw';

    //POINTS
    let h7 = document.createElement('h7');
    h7.textContent='POINTS:';

    let points = document.createElement('h7');
    points.textContent='0';

    //delete playerPoints
    let player_points = document.getElementById('playerPoints');
    while (player_points.firstChild) {
        player_points.removeChild(player_points.lastChild);
    }

    player_points.appendChild(h7);
    player_points.appendChild(points);

    document.getElementById('playerPoints').classList.remove('flex');
    document.getElementById('playerPoints').style.gap = "auto";

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





