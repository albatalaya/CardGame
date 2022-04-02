import Player from "./player.js";
import Deck from "./deck.js";

class Table {
    deck;
    dealer;
    player;
    
    constructor(){
        this.deck = new Deck(); 
        this.dealer = new Player("Dealer");
        this.player = new Player("Player");
    }

    deal(){
        this.dealer.addCards(this.deck.dealCards(2));
        this.dealer.hideCard();
        this.player.addCards(this.deck.dealCards(2));

        console.log('DEALER: ', this.dealer.getHandString(), this.dealer.getPoints());
        console.log('PLAYER: ', this.player.getHandString(), this.player.getPoints());

        if(this.isBlackJack(this.player.getHand())){
            console.log("BLACKJACK");
            console.log("WINNER: PLAYER");
        }

        if(this.isBlackJack(this.dealer.getHand())){
            this.dealer.showCard();

            console.log('DEALER: ', this.dealer.getHandString(), this.dealer.getPoints());
            console.log('PLAYER: ', this.player.getHandString(), this.player.getPoints());

            console.log("BLACKJACK");
            console.log("WINNER: DEALER");
        }
        
    }

    isBlackJack(hand){
        let cards= hand.getCards();

        if(cards[0].getPoints() == 10 && cards[1].getPoints() == 11){
            return true;
        } else if(cards[0].getPoints() == 11 && cards[1].getPoints() == 10){
            return true;
        }
        return false;
    }

    hit(){
        this.player.addCards(this.deck.dealCards(1));

        console.log('DEALER: ', this.dealer.getHandString(), this.dealer.getPoints());
        console.log('PLAYER: ', this.player.getHandString(), this.player.getPoints());

        if(this.player.getPoints()>21){
            if(this.player.getHand().getAces()>0){
                this.player.getHand().setPoints(this.player.getPoints()-this.player.getHand().getAces()*10);
                console.log('DEALER: ', this.dealer.getHandString(), this.dealer.getPoints());
                console.log('PLAYER: ', this.player.getHandString(), this.player.getPoints());
            }else if(this.player.getPoints()>21){
                console.log("BUST");
                this.dealer.showCard();
                console.log('DEALER: ', this.dealer.getHandString(), this.dealer.getPoints());
                console.log('PLAYER: ', this.player.getHandString(), this.player.getPoints());

                console.log("WINNER: DEALER")
            }
        }
    }

    stand(){
        console.log("STAND");
        this.dealer.showCard();
        console.log('DEALER: ', this.dealer.getHandString(), this.dealer.getPoints());
        console.log('PLAYER: ', this.player.getHandString(), this.player.getPoints());

        while(this.dealer.getPoints()<=17){
            this.dealer.addCards(this.deck.dealCards(1));
            console.log('DEALER: ', this.dealer.getHandString(), this.dealer.getPoints());
            console.log('PLAYER: ', this.player.getHandString(), this.player.getPoints());
        }

        if(this.dealer.getPoints()>21 || this.player.getPoints()> this.dealer.getPoints()){
            console.log("WINNER: PLAYER")
        } else if(this.player.getPoints()== this.dealer.getPoints()){
            console.log("PUSH")
            console.log("WINNER: TIE")
        } else {
            console.log("WINNER: DEALER")
        }
    }
    
}

export default Table;