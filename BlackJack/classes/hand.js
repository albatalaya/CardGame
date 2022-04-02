class Hand {

    cards;
    totalPoints;
    aces;

    constructor(){
        this.cards = [];
        this.totalPoints = 0;
        this.aces=0;
    }

    

    getPoints(){
        return this.totalPoints;
    }

    hideCard(){
        this.cards[1].hide();

        this.totalPoints -= this.cards[1].getPoints();
    }

    showCard(){
        this.cards[1].show();
        this.totalPoints += this.cards[1].getPoints();
    }

    
    getHand(){ //temp
        let hand = [];
        for(let i=0; i<this.cards.length; i++){
            hand.push(this.cards[i].getCard());
        }
        return hand;
    }
    
    addCards(cards){
        for(let i=0; i<cards.length; i++){
            this.cards.push(cards[i]);
        }

        let points= 0;
        for(let i=0; i< cards.length; i++){
            if(cards[i].getPoints()==11){ //case of an ace
                this.aces +=1;
            }
            points += cards[i].getPoints();
        }
        this.totalPoints += points;
    }

    getCards(){
        return this.cards;
    }

    getAces(){
        return this.aces;
    }

    setPoints(points){
        this.totalPoints=points;
        this.aces=0;
    }
}

export default Hand;