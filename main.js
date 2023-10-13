(function() {
function pokerDealer(){
    const cardShuffler = "https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1"

    fetch(cardShuffler)
    .then(response => {
        return response.json();
    })
    .then(shuffledDeck => {
        const deckId = shuffledDeck.deck_id;
        drawCards(deckId);
        console.log("Deck ID: ", deckId)
    })
}

const pokerHandArray = [];
const handContainer = document.getElementById('hand-container')

function drawCards(deckId) {
    const cardDrawer = `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5`;

    fetch(cardDrawer)
    .then(response => {
        return response.json();
    })
    .then(data => {
        const pokerHand = data.cards;
        console.log("Drawn cards: ", pokerHand);
        pokerHandArray.push(...pokerHand);
        pokerHandArray.sort(byValue)
        
        pokerHandArray.forEach(card => {
            const cardImage = document.createElement('img');
            cardImage.src = card.image;
            cardImage.alt = card.code;
            handContainer.appendChild(cardImage);
        })
    })

    }

    function byValue(a,b){
        return ranks.indexOf(a.value) - ranks.indexOf(b.value);
        }


    const ranks = '2 3 4 5 6 7 8 9 10 JACK QUEEN KING ACE'.split(' ');
    const suits = 'CLUBS SPADES HEARTS DIAMONDS'.split(' ');

pokerDealer();
console.log(pokerHandArray)

})();