"use strict";

// Define elements to be used in the game as global variables
var blanksEl = document.querySelector("#blanks"),
    hintEl = document.querySelector("#hint"),
    hangmanEl = document.querySelector("#hangman"),
    missesEl = document.querySelector("#misses"),
    scoreEl = document.querySelector("#score"),
    statusEl = document.querySelector("#status"),
    manEl = document.querySelector("#man");

var spacer = "&nbsp;&nbsp;";

var asciiHangman = ["<p>&nbsp;&nbsp;&nbsp;O</p>", "<p>&nbsp;&nbsp;-", "|", "-</p>", "<p>&nbsp;&nbsp;&nbsp;|</p>", "<p>&nbsp;/ ", "&nbsp;\\</p>"];

// Build Hangman game as an object
var Game = {
  // Data array containing words and hints for each word
  gameWords: [{
    word: "Airplane",
    hint: "Thing"
  }, {
    word: "Canada",
    hint: "Place"
  }, {
    word: "Brendan Eich",
    hint: "Person"
  }, {
    word: "Honda",
    hint: "Brand"
  }, {
    word: "Big Bend",
    hint: "Place"
  }],

  score: 0,
  totalGuesses: asciiHangman.length,
  currentWord: "",
  guesses: [],
  misses: [],
  blanks: [],

  startRound: function startRound() {
    // Pick a random word from the gameWords array and set value as word's object
    this.currentWord = this.gameWords[Math.floor(Math.random() * this.gameWords.length)];

    // Split the word so can be used as an array later in game
    this.blanks = this.currentWord.word.toLowerCase().split("").map(function (el) {
      return el === " " ? spacer : "_";
    });
    blanksEl.innerHTML = this.blanks.join(" ");

    this.displayHint();
  },

  // Display a hint
  displayHint: function displayHint() {
    hintEl.innerHTML = this.currentWord.hint;
  },

  checkGuess: function checkGuess(guess) {
    statusEl.textContent = "";
    // If the selected letter has already been chosen, display a note to the user
    if (this.guesses.indexOf(guess) !== -1) {
      statusEl.textContent = "Already chosen, pick again";
    } else {
      this.guesses.push(guess);

      var i = 0;
      var found = false;

      while (this.currentWord.word.toLowerCase().indexOf(guess, i) !== -1) {
        // Replace index at blanks array with guessed letter if found in current word
        var answer = this.currentWord.word.toLowerCase().indexOf(guess, i);
        found = true;
        this.blanks[answer] = guess;
        blanksEl.innerHTML = this.blanks.join(" ");
        i++;
      }

      // If letter is not found, add to misses array and output to page
      if (!found) {
        // Add missed letter to misses array
        this.misses.push(guess);
        missesEl.innerHTML = this.misses.join(" ");
        manEl.innerHTML = asciiHangman.slice(0, this.misses.length).join("");

        // If total number of misses is equals number of total changes, end the game
        if (this.misses.length === this.totalGuesses) {
          statusEl.textContent = "You lose! Refresh to play again.";
        }
      } else if (this.blanks.join("").replace(spacer, "") === this.currentWord.word.replace(" ", "").toLowerCase()) {
        statusEl.textContent = "You win this round!";
        this.incrementScore();
      }
    }
  },
  incrementScore: function incrementScore(score) {
    this.score++;
    scoreEl.textContent = this.score;
    this.reset();
    this.startRound();
  },
  reset: function reset() {
    this.currentWord = "";
    this.guesses = [];
    this.misses = [];
    this.blanks = [];
  }
};

document.onkeyup = function (e) {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    Game.checkGuess(e.key);
  } else {
    statusEl.textContent = "Choose a letter, please!";
  }
};

// Start game on page load
window.onload = function () {
  Game.startRound();
};