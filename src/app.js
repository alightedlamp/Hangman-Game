import { gameData } from './data';

// Define elements to be used in the game as global variables
const blanksEl = document.querySelector('#blanks'),
  hintEl = document.querySelector('#hint'),
  hangmanEl = document.querySelector('#hangman'),
  missesEl = document.querySelector('#misses'),
  scoreEl = document.querySelector('#score'),
  statusEl = document.querySelector('#status'),
  manEl = document.querySelector('#man');

const spacer = '&nbsp;&nbsp;';

const asciiHangman = [
  '<p>&nbsp;&nbsp;&nbsp;O</p>',
  '<p>&nbsp;&nbsp;-',
  '|',
  '-</p>',
  '<p>&nbsp;&nbsp;&nbsp;|</p>',
  '<p>&nbsp;/ ',
  '&nbsp;\\</p>'
];

const Game = {
  // Data array containing words and hints for each word
  gameData: gameData,

  score: 0,
  totalGuesses: asciiHangman.length,
  currentWord: '',
  guesses: [],
  misses: [],
  blanks: [],

  startRound: function() {
    // Check if it's a new round and reset hangman accordingly
    if (this.misses.length === 0) {
      // Reset hangman to empty string
      manEl.innerHTML = '';
      missesEl.innerHTML = '';
    }

    // Pick a random word from the gameData array and set value as word's object
    this.currentWord = this.gameData[
      Math.floor(Math.random() * this.gameData.length)
    ];

    // Set up the current round's blank letters and add to page
    this.blanks = this.currentWord.word
      .split('')
      .map(el => (el === ' ' ? spacer : '_'));
    blanksEl.innerHTML = this.blanks.join(' ');

    this.displayHint();
  },

  // Displays `hint` property from current word object
  displayHint: function() {
    hintEl.innerHTML = this.currentWord.hint;
  },

  checkGuess: function(guess) {
    // Reset the status text
    statusEl.textContent = '';

    // Make guess uppercase to match case of dispaly
    guess = guess.toUpperCase();

    // If the selected letter has already been chosen, update status text to warn player
    if (this.guesses.indexOf(guess) !== -1) {
      statusEl.textContent = 'Already chosen, pick again';
    } else {
      this.guesses.push(guess);

      let i = 0;
      let found = false;

      while (this.currentWord.word.toUpperCase().indexOf(guess, i) !== -1) {
        // Replace index at blanks array with guessed letter if found in current word
        let answer = this.currentWord.word.toUpperCase().indexOf(guess, i);
        this.blanks[answer] = guess;

        // Update blanks element on page
        blanksEl.innerHTML = this.blanks.join(' ');

        // Set found as true to check game progress below
        found = true;
        i++;
      }

      if (!found) {
        // If letter is not found, add to misses array and output to page
        this.misses.push(guess);

        // Update missed letters section
        missesEl.innerHTML = this.misses.join(' ');

        // Update hangman image
        manEl.innerHTML = asciiHangman.slice(0, this.misses.length).join('');

        // If total number of misses is equals number of total chances, the round is over
        if (this.misses.length === this.totalGuesses) {
          this.showLosingState();
          this.reset();
          this.startRound();
        }

        // Check if blanks string is equal to current word, indicating winning round
      } else if (
        this.blanks.join('').replace(spacer, '') ===
        this.currentWord.word.replace(' ', '').toUpperCase()
      ) {
        this.showWinningState();
        this.incrementScore();
      }
    }
  },

  // Utility functions for moving game progress forward
  showWinningState: function() {
    statusEl.textContent = 'You won! Here is another.';
  },
  incrementScore: function(score) {
    this.score++;
    scoreEl.textContent = this.score;
    this.reset();
    this.startRound();
  },
  showLosingState: function() {
    statusEl.textContent = 'You lose! Better luck next time.';
  },
  reset: function() {
    this.currentWord = '';
    this.guesses = [];
    this.misses = [];
    this.blanks = [];
  }
};

// Listen for keyboard events and validate input
document.onkeyup = e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    Game.checkGuess(e.key);
  } else {
    statusEl.textContent = 'Choose a letter, please!';
  }
};

// Start game on page load
window.onload = () => {
  Game.startRound();
};
