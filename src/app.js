import { gameData } from './js/data';
import { hangman } from './js/hangman';

// Define elements to be used in the game as global variables
const blanksEl = document.querySelector('#blanks'),
  hintEl = document.querySelector('#hint'),
  hangmanEl = document.querySelector('#hangman'),
  missesEl = document.querySelector('#misses'),
  winsEl = document.querySelector('#wins'),
  lossesEl = document.querySelector('#losses'),
  statusEl = document.querySelector('#status'),
  guessesRemainingEl = document.querySelector('#guesses-remaining'),
  manEl = document.querySelector('#man');

const spacer = '&nbsp;&nbsp;';
const re = /([,\-\'\s])|((&nbsp;){2})/g;

const preloadImages = () => {
  let images = new Array();
  function preload() {
    Array.prototype.slice.call(arguments).map((img, i) => {
      images[i] = new Image();
      images[i].src = img;
    });
  }
  preload(
    'img/miss1.png',
    'img/miss2.png',
    'img/miss3.png',
    'img/miss4.png',
    'img/miss5.png',
    'img/miss6.png'
  );
};

const Game = {
  gameData: gameData,

  // Initialize game state
  wins: 0,
  losses: 0,
  totalGuesses: hangman.length,
  currentWord: '',
  wordsPlayed: [],
  guesses: [],
  misses: [],
  blanks: [],

  startRound: function() {
    // Only set currentWord here if very first execution of function
    if (this.currentWord === '') {
      this.currentWord = this.pickNewWord();
    }
    // Pick a random word from data, ensuring has not already been played
    while (this.wordsPlayed.indexOf(this.currentWord.word) !== -1) {
      this.currentWord = this.pickNewWord();
    }
    this.wordsPlayed.push(this.currentWord.word);

    this.setBlanks();
    this.displayHint();
  },

  setBlanks: function() {
    // Set up the current round's blank letters and add to page
    this.blanks = this.currentWord.word.split('').map(el => {
      if (el === ' ') {
        return spacer;
      } else if (el.match(re)) {
        return el; // Keeps dashes, apostrophes, and commas
      } else {
        return '_';
      }
    });
    blanksEl.innerHTML = this.blanks.join(' ');
  },

  checkGuess: function(guess) {
    // Reset the status on new guess
    statusEl.innerHTML = '';

    // Reset game state on new round
    if (this.misses.length === 0) {
      manEl.innerHTML = '';
      missesEl.innerHTML = '';
      guessesRemainingEl.innerHTML = this.totalGuesses;
    }

    // Make guess uppercase to match case of display
    guess = guess.toUpperCase();

    // If the selected letter has already been chosen, update status text to warn player
    if (this.guesses.indexOf(guess) !== -1) {
      statusEl.innerHTML = 'Already chosen, pick again';
    } else {
      this.guesses.push(guess);

      // Handle an incorrect guess
      if (!this.findMatches(guess)) {
        // If letter is not found, add to misses array and output to page
        this.handleMiss(guess);
        // Check if blanks string is equal to current word, indicating winning round
      } else if (
        this.blanks.join('').replace(re, '') ===
        this.currentWord.word.replace(re, '').toUpperCase()
      ) {
        this.incrementScore();
      }
    }
  },

  // Find matches based on guess and replace respective blank spaces in DOM
  findMatches: function(guess) {
    // Initialize values for checking player's guess
    let i = 0;
    let found = false;
    let currentWord = this.currentWord.word.toUpperCase();
    let testCase = currentWord.indexOf(guess, i);

    while (testCase !== -1) {
      // Replace index at blanks array with guessed letter if found in current word
      this.blanks[testCase] = guess;
      blanksEl.innerHTML = this.blanks.join(' ');

      // Set found as true to check game progress below
      found = true;
      i++;

      // Update test case with new index
      testCase = currentWord.indexOf(guess, i);
    }
    return found;
  },

  handleMiss: function(guess) {
    this.misses.push(guess);

    // Update game state
    missesEl.innerHTML = this.misses.join(' ');
    guessesRemainingEl.innerHTML = this.totalGuesses - this.misses.length;
    manEl.innerHTML = `
      <img 
        src="${hangman[this.misses.length - 1]}"
        alt="Hangman miss ${this.misses.length}"
      />
    `;

    // Check if there are any guesses left
    if (this.misses.length === this.totalGuesses) {
      this.decrementScore();
    }
  },

  // Utility functions for moving game progress forward
  pickNewWord: function() {
    return this.gameData[Math.floor(Math.random() * this.gameData.length)];
  },
  displayHint: function() {
    hintEl.innerHTML = this.currentWord.hint;
  },
  incrementScore: function(score) {
    this.wins++;
    winsEl.innerHTML = this.wins;
    manEl.innerHTML = '';
    missesEl.innerHTML = '';
    statusEl.innerHTML = 'You won! Here is another.';
    this.reset();
  },
  decrementScore: function() {
    this.losses++;
    lossesEl.innerHTML = this.losses;
    statusEl.innerHTML = `You lose!<br />The correct answer was &rsquo;${this
      .currentWord.word}&rsquo;`;
    this.reset();
  },
  reset: function() {
    this.currentWord = '';
    this.guesses = [];
    this.misses = [];
    this.blanks = [];

    if (this.wins + this.losses === this.gameData.length) {
      statusEl.innerHTML = 'There are no more words to play!';
    } else {
      this.startRound();
    }
  }
};

// Listen for keyboard events and validate input, perhaps too cleverly
document.onkeyup = e => {
  e.keyCode >= 65 && e.keyCode <= 90
    ? Game.checkGuess(e.key)
    : (statusEl.innerHTML = 'Choose a letter, please!');
};

// Prepare images
preloadImages();

// Start game when DOM loaded -> this is equivalent of jQuery's document.ready
document.addEventListener('DOMContentLoaded', () => {
  Game.startRound();
});
