class Card {

    rank;
    suit;
    visible;

    constructor(rank, suit){
        this.rank = rank;
        this.suit = suit;
        this.visible = true; 
    }

    getCard(){
        if(this.visible){
            return this.rank+this.suit;
        } else{
            return 'X';
        }
    }

    getPoints(){
        let points=this.rank;
        switch (this.rank){ 
            case 'J':
                points='10';
                break;
            case 'Q':
                points='10';
                break;
            case 'K':
                points='10';
                break;
            case 'A': //bug case 1 or 11
                points='11';
                break;
        }
        return parseInt(points);
    }

    hide(){
        this.visible = false;
    }

    show(){
        this.visible = true;
    }


    
}

export default Card;