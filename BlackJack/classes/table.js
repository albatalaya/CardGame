import Player from "./player.js";
import Deck from "./deck.js";

class Table {
    deck;
    dealer;
    player;
    split_player;

    NOTHING; //before starting the game
    PLAYING; //playing the game
    SPLIT1; //hand split turn 1
    SPLIT2; //hand split turn 2
    NEXT; //finished turn, you can deal again 
    FINISHED; //finished deck //todo end deck

    state;

    
    constructor(){
        this.deck = new Deck(); 
        this.dealer = new Player("Dealer");
        this.player = new Player("Player");

        this.NOTHING = '000';
        this.PLAYING = '001';
        this.SPLIT1 = '010';
        this.SPLIT2 = '011';
        this.NEXT = '100';
        this.FINISHED = '101';

        this.state = [this.NOTHING];
    }

    deal(){
        this.dealer.restartHand();
        this.player.restartHand();

        this.state = [this.PLAYING];

        this.dealer.addCards(this.deck.dealCards(2));
        this.dealer.hideCard();
        this.player.addCards(this.deck.dealCards(2));

        if(this.player.getHand().getCards()[0].getPoints()==this.player.getHand().getCards()[1].getPoints()){
            this.state = [this.PLAYING, 'SPLIT'];
        }

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
        let points;
        if(this.state[0] == this.SPLIT2){
            this.split_player.addCards(this.deck.dealCards(1));
            points = this.split_player.getPoints();
        } else {
            this.player.addCards(this.deck.dealCards(1));
            points = this.player.getPoints();
        }
        

        if(points>21){
            if(this.state[0] == this.SPLIT1){
                this.state = [this.SPLIT2, 'DEALER'];
            } else if(this.state[0] == this.SPLIT2){
                this.state = this.stand();
            } else {
                this.dealer.showCard();
                this.state = [this.NEXT, 'DEALER'];
            }
            
        }

        return this.state;
    }

    stand(){
        if(this.state == this.SPLIT1){
            this.state = [this.SPLIT2];
            return this.state
        }
        
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

        let stateSplit = false;
        if(this.state[0] == this.SPLIT2){
            stateSplit = true;
        }

        if(dealerPoints>21 || playerPoints> dealerPoints && playerPoints <=21 ){
            this.state = [this.NEXT, 'PLAYER'];
        } else if(playerPoints == dealerPoints){
            this.state = [this.NEXT, 'PUSH'];
        } else {
            this.state = [this.NEXT, 'DEALER']; 
        }
        
        if(stateSplit){
            let splitPoints = this.split_player.getPoints()[1]??this.split_player.getPoints();

            if(dealerPoints>21 || splitPoints> dealerPoints && splitPoints <=21){
                this.state.push('PLAYER');
            } else if(splitPoints == dealerPoints){
                this.state.push('PUSH');
            } else {
                this.state.push('DEALER'); 
            }
        }

        return this.state;
    }

    getPoints(){
        if(this.split_player == undefined){ 
            return [this.dealer.getPoints(), this.player.getPoints()];
        }
        return [this.dealer.getPoints(), this.player.getPoints(), this.split_player.getPoints()];
    }

    getHandString(){
        if(this.split_player == undefined){ //todo finish split player
            return [this.dealer.getHandString(), this.player.getHandString()];
        }

        return [this.dealer.getHandString(), this.player.getHandString(), this.split_player.getHandString()];
    }

    splitHand(){
        this.split_player = new Player("Split");
        let card = this.player.getHand().splitHand();
        this.split_player.addCards([card]);

        

        //console.log("PLAYER 1 ", this.player.getHandString(), this.player.getPoints());
        //console.log("PLAYER 2 ", this.split_player.getHandString(), this.split_player.getPoints());

        this.state = [this.SPLIT1];

        return this.state;

    }
    
}

export default Table;