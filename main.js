document.addEventListener('DOMContentLoaded', () => {
  let N;

  const container = document.getElementById('#container');
  let timerID, intervalID;
  let flippedCards = [];
  let flippedCardsId = [];
  let matchedCards = [];
  let movesCounter = 0;

  function chooseSize() {
    const formWrapper = document.createElement('div');
    const formHeading = document.createElement('h2');
    const text = document.createElement('p');
    const form = document.createElement('form');
    const input = document.createElement('input');
    const buttonWrapper = document.createElement('div');
    const button = document.createElement('button');

    formWrapper.classList.add('start-form__form-wrapper');
    formHeading.classList.add('start-form__heading', 'heading');
    text.classList.add('start-form__text');
    form.classList.add('start-form__form');
    input.classList.add('start-form__input');
    buttonWrapper.classList.add('start-form__button-wrapper');
    button.classList.add('start-form__button');
    button.setAttribute('disabled', true);

    formHeading.textContent = 'Choose the number of cards';
    text.textContent = 'Enter the number of cards horizontally and vertically. The number has to be even from 2 to 10.';
    input.placeholder = 'The number of cards';
    button.textContent = 'Start the game';

    input.addEventListener('input', function ({target}) {
      button.removeAttribute('disabled', 'true');
      if (!input.value) {
        button.setAttribute('disabled', 'true');
      }

      if (target.value < 2 || target.value > 10 || target.value % 2) {
        target.setCustomValidity(`This number doesn't meet the conditions. Try another`);
        target.reportValidity();
      } else if(isNaN(parseInt(target.value))) {
        target.setCustomValidity(`Dear friend, it's not a number`);
        target.reportValidity();
      }
      else {
        target.setCustomValidity('');
        N = Math.pow(parseInt(input.value), 2);
      }
    });

   form.addEventListener('submit', function(e){
     e.preventDefault();
     if (!input.value) {
      alert('Please, enter the number');
      return;
    }
    formWrapper.style.display = 'none';
    dealCards(N);
   })


    formWrapper.append(formHeading);
    formWrapper.append(text);
    form.append(input);
    buttonWrapper.append(button);
    form.append(buttonWrapper);
    formWrapper.append(form);

    return {
      formWrapper,
      form,
      input,
      button
    }
  }

  function startGame() {
    start = chooseSize();
    container.append(start.formWrapper)
  }

  function createHeading() {
    const heading = document.createElement('h2');
    heading.classList.add('heading');
    heading.textContent = 'Find all the matching cards';
    return heading;
  }

  function createWrapper() {
    const wrapper = document.createElement('ul');
    wrapper.classList.add('game-board');
    return wrapper;
  }

  function shuffleDeck(number) {
    function createDeck() {
      const deck = [];
      for (let i = 1; i <= number / 2; i++) {
        deck.push(i)
        deck.push(i)
      }
      return deck;
    }

    deck = createDeck();
    let newIndex, tempDeck;
    for (i = deck.length - 1; i > 0; i--) {
      newIndex = Math.floor(Math.random() * (i + 1));
      tempDeck = deck[i];
      deck[i] = deck[newIndex];
      deck[newIndex] = tempDeck;
    }
  };


  function createCard() {
    const card = document.createElement('li');
    cardContent = document.createElement('span');
    card.classList.add('card', 'face-down');
    cardContent.classList.add('card-content');
    card.appendChild(cardContent);

    return {
      card,
      cardContent
    }
  };

  function flipCard() {
    ++movesCounter
    this.firstChild.classList.toggle('face-up');
    this.classList.toggle('face-down');
    this.classList.add('flip')
    flippedCards.push(this.textContent);
    flippedCardsId.push(this.id)

    if (flippedCards.length === 2) {
      setTimeout(compareCards, 400);
    } else if (flippedCards.length > 2) {
      this.firstChild.classList.toggle('face-up');
      this.classList.toggle('face-down');
    }

    return {
      flippedCards,
      flippedCardsId
    }
  }

  function compareCards() {
    const cards = document.querySelectorAll('li');
    const cardValue = document.querySelectorAll('span');
    const firstCardId = flippedCardsId[0];
    const secondCardId = flippedCardsId[1];

    if (firstCardId !== secondCardId && flippedCards[0] === flippedCards[1]) {
      cards[firstCardId].removeEventListener('click', flipCard);
      cards[secondCardId].removeEventListener('click', flipCard);
      cards[firstCardId].classList.add('matched-cards');
      cards[secondCardId].classList.add('matched-cards');
      matchedCards.push(flippedCards);
    } else {
      cards[firstCardId].classList.add('face-down');
      cards[secondCardId].classList.add('face-down');
      cards[firstCardId].classList.remove('flip');
      cards[secondCardId].classList.remove('flip');
      cardValue[firstCardId].classList.remove('face-up');
      cardValue[secondCardId].classList.remove('face-up');
    }

    flippedCards = [];
    flippedCardsId = [];
    if (matchedCards.length === N / 2) {
      alert(`You won! It took ${Math.round(movesCounter / 2)} moves`);
      movesCounter = [];
      continueGame();
    }
  }

  function continueGame() {
    let wantsToPlay = confirm('Do you want to play another round?');
    if (wantsToPlay === true) {
      clearTimeout(timerID);
      clearInterval(intervalID);
      matchedCards = [];
      timer.timer.remove();
      gameBoard.remove();
      heading.remove();
      dealCards(N);
    } else {
      clearTimeout(timerID);
    }
  }

  function setTimer(time) {
    const timer = document.createElement('div');
    timer.classList.add('timer');
    timer.textContent = time;

    timerID = setInterval(() => {
      if (timer.textContent > 0) {
        timer.textContent -= 1;
      }
    }, 1000);

    intervalID = setInterval(() => {
      alert('Game over!');
      continueGame();
    }, (time + 1) * 1000);

    return {
      timer,
      timerID,
      intervalID
    }
  }

  function dealCards(number) {
    heading = createHeading();
    gameBoard = createWrapper();
    timer = setTimer(60);

    container.append(heading);
    container.append(gameBoard);
    container.append(timer.timer);
    shuffleDeck(number);

    for (let i = 0; i < number; i++) {
      const cards = createCard();

      if (number === 4) {
        cards.card.classList.add('two-in-row')
      } else if (number === 16) {
        cards.card.classList.add('four-in-row')
      } else if (number === 36) {
        cards.card.classList.add('six-in-row')
      } else if (number === 64) {
        cards.card.classList.add('eight-in-row')
      } else if (number === 100) {
        cards.card.classList.add('ten-in-row')
        heading.style.fontSize = '18px';
        heading.style.textShadow = 'none';
      }

      cards.card.setAttribute('id', i);
      cardContent.textContent = deck[i]
      cards.card.addEventListener('click', flipCard);
      gameBoard.append(cards.card)
    }
  };

  startGame();
});










