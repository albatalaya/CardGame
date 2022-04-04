class Hand {

    handCards;
    totalPoints;

    constructor(){
        this.handCards = [];
        this.totalPoints = [0,0];
    }

    

    getPoints(){
        if(this.totalPoints[0] != this.totalPoints[1]){
            return this.totalPoints;
        } else {
            return this.totalPoints[0]; 
        }
        
    }

    hideCard(){
        this.handCards[1].hide();

        this.totalPoints[0] -= this.handCards[1].getPoints(); 
        if(this.handCards[1].getPoints()==1){
            if(this.handCards[0].getPoints()==1){ // case two aces
                this.totalPoints[1] = this.totalPoints[0] + 10;
            } else {
                this.totalPoints[1] -= 11; 
            }
            
        }else{
            this.totalPoints[1] -= this.handCards[1].getPoints(); 
        }
        
    }

    showCard(){
        this.handCards[1].show();

        this.totalPoints[0] += this.handCards[1].getPoints(); 
        if(this.handCards[1].getPoints()==1){
            if(this.handCards[0].getPoints()==1){ // case two aces
                this.totalPoints[1] = this.totalPoints[0];
            } else {
                this.totalPoints[1] += 11; 
            }
        }else{
            this.totalPoints[1] += this.handCards[1].getPoints(); 
        }
    }

    
    getHand(){
        let hand = [];
        for(let i=0; i<this.handCards.length; i++){
            hand.push(this.handCards[i].getCard());
        }
        return hand;
    }
    
    addCards(cards){
        for(let i=0; i<cards.length; i++){
            this.handCards.push(cards[i]);
        }

        let points= [0,0];

        for(let i=0; i< cards.length; i++){
            if(cards[i].getPoints()==1){ //case of an ace
                points[1] += 10;
            }
            points[0] += cards[i].getPoints();
            points[1] += cards[i].getPoints();
        }


        this.totalPoints[0] += points[0]; //case ace = 1
        
        if(this.totalPoints[1] + points[1] > 21){
            this.totalPoints[1]=this.totalPoints[0];
        } else {
            this.totalPoints[1] += points[1]; //case ace = 11
        }
        
    }

    getCards(){
        return this.handCards;
    }

    splitHand(){
        //card
        //points 
        //todo
        this.totalPoints = [this.handCards[0].getPoints()]
        if(this.totalPoints == 1){
            this.totalPoints[1] = this.totalPoints[0] + 10;
        }
        return this.handCards.pop();
    }

}

export default Hand;