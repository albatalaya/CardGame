import Hand from "./hand.js";

class Player {
    name;
    hand;

    constructor(name){
        this.name = name;
        this.hand = new Hand();
        
    }

    addCards(cards){
        this.hand.addCards(cards);
    }

    getPoints(){
        return this.hand.getPoints();
    }

    hideCard(){
        this.hand.hideCard();
    }

    showCard(){
        this.hand.showCard();
    }

    getHandString(){
        return this.hand.getHand();
    }

    getHand(){
        return this.hand;
    }
    
}

export default Player;