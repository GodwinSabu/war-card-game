// Card class to represent individual cards
class Card {
    constructor(public value: number, public suit: string) {}

    // Optional: Method to compare cards
    compare(otherCard: Card): number {
        return this.value - otherCard.value;
    }
}

// Deck class to represent a deck of cards
class Deck {
    cards: Card[] = [];

    constructor() {
        this.initializeDeck();
        this.shuffle();
    }

    // Initialize the deck with 52 cards
    initializeDeck() {
        const suits = ["spades", "clubs", "hearts", "diamonds"];
        for (const suit of suits) {
            for (let value = 2; value <= 14; value++) {
                // Assuming 11=Jack, 12=Queen, 13=King, 14=Ace
                this.cards.push(new Card(value, suit));
            }
        }
    }

    // Shuffle the cards randomly
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    // Deal a card
    deal(): Card | undefined {
        return this.cards.pop();
    }
}

// Player class to represent each player
class Player {
    hand: Card[] = [];

    constructor(public name: string) {}

    // Add cards to the bottom of the hand
    addCards(cards: Card[]) {
        this.hand.push(...cards);
    }

    // Play the top card
    playCard(): Card | undefined {
        return this.hand.shift();
    }

    // Check if player is out of cards
    isOutOfCards(): boolean {
        return this.hand.length === 0;
    }
}

// WarGame class to manage the game
class WarGame {
    player1: Player;
    player2: Player;
    deck: Deck;

    constructor() {
        this.deck = new Deck();
        this.player1 = new Player("Player 1");
        this.player2 = new Player("Player 2");
        this.dealCards();
    }

    // Deal cards equally to both players
    dealCards() {
        while (this.deck.cards.length > 0) {
            const card1 = this.deck.deal();
            const card2 = this.deck.deal();
            if (card1) this.player1.addCards([card1]);
            if (card2) this.player2.addCards([card2]);
        }
    }

    // Play a single round
    playRound(): string {
        const card1 = this.player1.playCard();
        const card2 = this.player2.playCard();

        if (!card1 || !card2) {
            return "Game over!";
        }

        console.log(`${this.player1.name} plays ${card1.value} of ${card1.suit}`);
        console.log(`${this.player2.name} plays ${card2.value} of ${card2.suit}`);

        if (card1.value > card2.value) {
            this.player1.addCards([card1, card2]);
            return `${this.player1.name} wins the round!`;
        } else if (card2.value > card1.value) {
            this.player2.addCards([card1, card2]);
            return `${this.player2.name} wins the round!`;
        } else {
            return this.war([card1, card2]);
        }
    }

    // Handle the "War" scenario
    war(pot: Card[]): string {
        console.log("War!");

        if (this.player1.hand.length < 4 || this.player2.hand.length < 4) {
            // If either player cannot complete the war, they lose
            return this.player1.isOutOfCards() ? `${this.player2.name} wins the game!` : `${this.player1.name} wins the game!`;
        }

        // Each player places three cards face down and one face up
        const warCards1 = [this.player1.playCard(), this.player1.playCard(), this.player1.playCard(), this.player1.playCard()];
        const warCards2 = [this.player2.playCard(), this.player2.playCard(), this.player2.playCard(), this.player2.playCard()];

        // Add all war cards to the pot
        pot.push(...(warCards1 as Card[]), ...(warCards2 as Card[]));

        const finalCard1 = warCards1[3];
        const finalCard2 = warCards2[3];

        if (!finalCard1 || !finalCard2) return "Game over due to insufficient cards.";

        console.log(`${this.player1.name} final war card: ${finalCard1.value} of ${finalCard1.suit}`);
        console.log(`${this.player2.name} final war card: ${finalCard2.value} of ${finalCard2.suit}`);

        if (finalCard1.value > finalCard2.value) {
            this.player1.addCards(pot);
            return `${this.player1.name} wins the war!`;
        } else if (finalCard2.value > finalCard1.value) {
            this.player2.addCards(pot);
            return `${this.player2.name} wins the war!`;
        } else {
            // Recursive war if there is another tie
            return this.war(pot);
        }
    }

    // Check if the game is over
    isGameOver(): boolean {
        return this.player1.isOutOfCards() || this.player2.isOutOfCards();
    }

    // Play the entire game
    playGame() {
        while (!this.isGameOver()) {
            console.log(this.playRound());
        }
        console.log(this.player1.isOutOfCards() ? `${this.player2.name} wins the game!` : `${this.player1.name} wins the game!`);
    }
}

// Start the game
const game = new WarGame();
game.playGame();
