import { gameData } from './js/data';
// import { hangman } from './js/hangman';

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

const hangman = [
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
    // Pick a random word from data, ensuring has not already been played
    if (this.currentWord === '') {
      this.currentWord = this.pickNewWord();
    }
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
        return el;
      } else {
        return '_';
      }
    });
    blanksEl.innerHTML = this.blanks.join(' ');
  },

  checkGuess: function(guess) {
    // Reset the status text
    statusEl.innerHTML = '';

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

      // Update blanks element on page
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
    manEl.innerHTML = hangman.slice(0, this.misses.length).join('');

    // If total number of misses is equals number of total chances, the round is over
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

    manEl.innerHTML = '';
    missesEl.innerHTML = '';
    guessesRemainingEl.innerHTML = this.totalGuesses;

    if (this.wins + this.losses === this.gameData.length) {
      statusEl.innerHTML = 'There are no more words to play!';
    } else {
      this.startRound();
    }
  }
};

// Listen for keyboard events and validate input
document.onkeyup = e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    Game.checkGuess(e.key);
  } else {
    statusEl.innerHTML = 'Choose a letter, please!';
  }
};

// Start game on page load
window.onload = () => {
  Game.startRound();
};
