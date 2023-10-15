(function() {
    //Function representing the dealer to generate a shuffled deck from the API
function pokerDealer(){
    const cardShuffler = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

    //Fetch Shuffled Deck
    fetch(cardShuffler)
    .then(response => {
        return response.json();
    })
    //Get DeckID and pass it to the drawCard function
    .then(shuffledDeck => {
        const deckId = shuffledDeck.deck_id;

        //Draw five card from the generated deckID
        drawCards(deckId);
        
        //Display the deckID if you want to save the hand
        console.log("Deck ID: ", deckId)
    })
}

//Array in global scope to store drawn cards into a hand
const myHand = [];
//HTML element where we will be displaying the cards
const handContainer = document.getElementById('hand-container')

//Function to draw five cards and display them to the browser
function drawCards(deckId) {
    const cardDrawer = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5`;

    fetch(cardDrawer)
    .then(response => {
        return response.json();
    })
    .then(data => {
        //Get the cards for the hand
        const pokerHand = data.cards;
        //Push the cards to the previously declared myHand Array
        myHand.push(...pokerHand);
        //Sort the generated hand
        myHand.sort(sortHand)
        
        //Generating the HTML code for each card by drawing the image property
        //and wrapping it in the required HTML tags and passing it to handContainer
        myHand.forEach(card => {
            const cardImage = document.createElement('img');
            cardImage.src = card.image;
            cardImage.alt = card.code;
            handContainer.appendChild(cardImage);
        });

        //Ranking the hand and displaying the result
        const result = rankHand(myHand);
        console.log("Your Hand: ", myHand);
        console.log("Hand Rank: ", result);
    })
    }
    //Sorting the hand by value and suit
    //https://exercism.org/tracks/javascript/exercises/poker/solutions/jfrz38

    function sortHand(a,b){
        //Variables to store the values of the suits and cards and compare them
        const valueA = ranks.indexOf(a.value);
        const valueB = ranks.indexOf(b.value);
        const suitA = a.suit;
        const suitB = b.suit

        //Comparing the card values and suits for sorting
        if (valueA === valueB){
            return suits.indexOf(suitA) - suits.indexOf(suitB);
        } else {
            return valueA - valueB
        }
        }
    
    //Arrays to store the values and suits of the cards to compare to
    const ranks = '2 3 4 5 6 7 8 9 10 JACK QUEEN KING ACE'.split(' ');
    const suits = 'CLUBS SPADES HEARTS DIAMONDS'.split(' ');
    
    //Function to define poker hands and determine which is most appropriate
    //https://gameplaycoder.com/page/4/
    //https://github.com/topics/poker-hands

    function rankHand(myHand){

        //Checking for a flush or a staight - every card must be the starting suit
        //and every card must be consecutive
        const hasFlush = myHand.every(card => card.suit === myHand[0].suit);
        const isConsecutive = myHand.every((card, index) => {
          return ranks.indexOf(card.value) === ranks.indexOf(myHand[0].value) + index;
        });
        
        //Checking if both are true, and if the hand starts at 10 a Royal is defined
        if (hasFlush && isConsecutive) {
            if (ranks.indexOf(myHand[0].value) === ranks.indexOf("10")){
                return "Royal Flush"
            }
          return 'Straight Flush';
        }
        
        //Checks for flush
        if (hasFlush) {
          return 'Flush';
        }
        //Checks for Straight
        if (isConsecutive) {
          return 'Straight';
        }

        //Checks for the occurences of each card's value and adds to the count
        const cardCounts = {};
        myHand.forEach(card => {
          cardCounts[card.value] = (cardCounts[card.value] || 0) + 1;
        });
        
        //Creating an array of card value counts to check against
        const counts = Object.values(cardCounts);
        
        //Check if one count reaches 4
        if (counts.includes(4)) {
          return 'Four of a Kind';
        }
        //If there is two counts of both 3 and 2 for two different values, Full house
        if (counts.includes(3) && counts.includes(2)) {
          return 'Full House';
        }
        //If one count reaches 3
        if (counts.includes(3)) {
          return 'Three of a Kind';
        }
        //Checks count array has a length of two and values of 2
        if (counts.filter(count => count === 2).length === 2) {
          return 'Two Pair';
        }
        //Checks if the count is just 2
        if (counts.includes(2)) {
          return 'One Pair';
        }
        return 'High Card';
      }

pokerDealer();


})();