const gameContainer = document.getElementById("game");
const button = document.getElementById('play');

const ITEMS = [
  "bird1",  
  "bird2",
  "bird3",
  "bird4",
  "bird5",
  "bird6",
  "bird7",
  "bird8",
  "bird9",
  "bird10",
  "bird1",  
  "bird2",
  "bird3",
  "bird4",
  "bird5",
  "bird6",
  "bird7",
  "bird8",
  "bird9",
  "bird10"
];

let cardOne;
let cardTwo;
let cardDivs = [];
let playEnabled = true;
let shuffledITEMS;

let score = {
  moves: 0,
  matches: 0,
  totalMatches: ITEMS.length/2
}


function shuffle(array) {
  let counter = array.length;
  while (counter > 0) {
    let index = Math.floor(Math.random() * counter);
    counter--;
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }
  return array;
}

function createDivsForITEMS(arr) {
  for (let i of arr) {
    const newDiv = document.createElement("div");
    newDiv.dataset.face = i;
    newDiv.addEventListener("click", handleCardClick);
    cardDivs.push(newDiv);
    gameContainer.append(newDiv);
  }
}

function createImagePath(imgName) {
  return `images/${imgName}.jpeg`;
}

function isGameOver() {
  if (score.matches === score.totalMatches) {
    return true;
  } else {
    return false;
  }
}

function handleCardClick(event) {
  if(event.target.dataset.matched || !playEnabled) {
    return;
  }
  if(!cardOne) {
    cardOne = event.target;
    cardOne.style.backgroundImage = `url(${createImagePath(cardOne.dataset.face)})`;
  } else if (event.target != cardOne) {
    cardTwo = event.target;
    cardTwo.style.backgroundImage = `url(${createImagePath(cardTwo.dataset.face)})`;
    if (cardOne.dataset.face != cardTwo.dataset.face) {
      playEnabled = false;
      setTimeout(function() {
        cardOne.style.backgroundImage = "";
        cardTwo.style.backgroundImage = "";
        cardOne = null;
        cardTwo = null;
        playEnabled = true;
      }, 1000);
    } else {
      score.matches++;
      cardOne.dataset.matched = true;
      cardTwo.dataset.matched = true;
      cardOne = null;
      cardTwo = null;
    }
  }
  score.moves++;
  if (isGameOver()) {
    resetButton();
    endGameMessage();
    saveScore();
  }
}

function toggleCardVisibility() {
  setTimeout(function() {
    for(card of cardDivs) {
      card.classList.toggle('reveal');
    }
  },500)
}

button.addEventListener('click', function(e) {
  // first game
  if (!isGameOver()) {
    toggleCardVisibility();
    button.classList.toggle('hide');
    button.toggleAttribute('disabled');
  } else if (isGameOver()) {
    restartGame();
  }
  
})

function startGame() {
  shuffledITEMS = shuffle(ITEMS);
  createDivsForITEMS(shuffledITEMS);
  score = {
    moves: 0,
    matches: 0,
    totalMatches: ITEMS.length/2
  }
}

function endGameMessage() {
  setTimeout(function() {
    alert(
      `
      You Win! 
      Score: ${score.moves} moves!
      Best Score: ${localStorage.bestScore} moves!
      `
    );
    }, 200);
}

function resetButton() {
  // setup button to restart game
  button.innerText = 'Restart';
  button.toggleAttribute('disabled');
  button.classList.toggle('hide');
}

function saveScore() {
  // save score in local storage
  if (!localStorage.bestScore) {
    localStorage.setItem("bestScore", score.moves);
  } else if (parseInt(localStorage.bestScore) > score.moves) {
    localStorage.setItem("bestScore", score.moves)
  }
}

function restartGame() {
  button.classList.toggle('hide');
  toggleCardVisibility();
  setTimeout(function() {
    gameContainer.innerHTML = '';
    button.toggleAttribute('disabled');
    startGame();
    toggleCardVisibility();
  }, 2000);
}

// when the DOM loads
startGame();
