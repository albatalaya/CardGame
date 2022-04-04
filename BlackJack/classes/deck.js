import Card from "./card.js";

class Deck {

    cards;

    constructor(){
        const card_suits = ['♦', '♠', '♥', '♣'];
        const card_ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

        this.cards=[];

        for(let i=0; i< card_suits.length; i++){ 
            for(let j=0; j< card_ranks.length; j++){ 
                this.cards.push(new Card( card_ranks[j], card_suits[i])) 
            }
        }

        this.shuffle();
    }

    shuffle(){
        this.cards = this.cards.sort(() => Math.random() - 0.5);
    }

    dealCards(n){
        let aux = [];
        for (let i=0; i< n; i++){
            aux.push(this.cards[this.cards.length-1]);
            this.cards.pop();
        }

        return aux;
    }
    
}

export default Deck;