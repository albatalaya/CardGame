import Player from "./player.js";
import Deck from "./deck.js";

class Table {
    deck;
    dealer;
    player;

    NOTHING; //before starting the game
    PLAYING; //playing the game
    NEXT; //finished turn, you can deal again 
    FINISHED; //finished deck //todo

    state;

    
    constructor(){
        this.deck = new Deck(); 
        this.dealer = new Player("Dealer");
        this.player = new Player("Player");

        this.NOTHING = '00';
        this.PLAYING = '01';
        this.NEXT = '10';
        this.FINISHED = '11';

        this.state = [this.NOTHING];
    }

    deal(){
        this.dealer.restartHand();
        this.player.restartHand();

        this.state = [this.PLAYING];

        this.dealer.addCards(this.deck.dealCards(2));
        this.dealer.hideCard();
        this.player.addCards(this.deck.dealCards(2));

        if(this.isBlackJack(this.player.getHand())){
            this.dealer.showCard();
            this.state = [this.NEXT, 'PLAYER'];
        }

        if(this.isBlackJack(this.dealer.getHand())){
            this.dealer.showCard();

            if(this.state[0] != this.NEXT){
                this.state = [this.NEXT, 'DEALER'];
            }else{
                this.state = [this.NEXT, 'PUSH'];
            }
            
        }
        
        return this.state;
    }

    isBlackJack(hand){
        let cards= hand.getCards();

        if(cards[0].getPoints() == 10 && cards[1].getPoints() == 1){
            return true;
        } else if(cards[0].getPoints() == 1 && cards[1].getPoints() == 10){
            return true;
        }
        return false;


    }

    hit(){
        this.player.addCards(this.deck.dealCards(1));

        if(this.player.getPoints()>21){
            this.dealer.showCard();
            this.state = [this.NEXT, 'DEALER'];
        }

        return this.state;
    }

    stand(){
        this.dealer.showCard();

        let dealerPoints = this.dealer.getPoints();
        if(dealerPoints.length==2){
            dealerPoints = dealerPoints[1];
        }

        while(dealerPoints<17){ //dealer gets more cards
            this.dealer.addCards(this.deck.dealCards(1));

            dealerPoints = this.dealer.getPoints()[1]??this.dealer.getPoints();
        }

        dealerPoints = this.dealer.getPoints()[1]??this.dealer.getPoints();
        let playerPoints = this.player.getPoints()[1]??this.player.getPoints();

        if(dealerPoints>21 || playerPoints> dealerPoints){
            this.state = [this.NEXT, 'PLAYER'];
        } else if(playerPoints == dealerPoints){
            this.state = [this.NEXT, 'PUSH'];
        } else {
            this.state = [this.NEXT, 'DEALER']; 
        }
        return this.state;
    }

    getPoints(){
        return [this.dealer.getPoints(), this.player.getPoints()];
    }

    getHandString(){
        return [this.dealer.getHandString(), this.player.getHandString()];
    }
    
}

export default Table;