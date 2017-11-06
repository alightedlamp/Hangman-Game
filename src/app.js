import { gameData } from "./data";

// Define elements to be used in the game as global variables
const blanksEl = document.querySelector("#blanks"),
  hintEl = document.querySelector("#hint"),
  hangmanEl = document.querySelector("#hangman"),
  missesEl = document.querySelector("#misses"),
  scoreEl = document.querySelector("#score"),
  statusEl = document.querySelector("#status"),
  manEl = document.querySelector("#man");

const spacer = "&nbsp;&nbsp;";

const asciiHangman = [
  "<p>&nbsp;&nbsp;&nbsp;O</p>",
  "<p>&nbsp;&nbsp;-",
  "|",
  "-</p>",
  "<p>&nbsp;&nbsp;&nbsp;|</p>",
  "<p>&nbsp;/ ",
  "&nbsp;\\</p>"
];

// Build Hangman game as an object
const Game = {
  // Data array containing words and hints for each word
  gameData: gameData,

  score: 0,
  totalGuesses: asciiHangman.length,
  currentWord: "",
  guesses: [],
  misses: [],
  blanks: [],

  startRound: function() {
    // Pick a random word from the gameData array and set value as word's object
    this.currentWord = this.gameData[
      Math.floor(Math.random() * this.gameData.length)
    ];

    this.blanks = this.currentWord.word
      .toLowerCase()
      .split("")
      .map(el => (el === " " ? spacer : "_"));
    blanksEl.innerHTML = this.blanks.join(" ");

    this.displayHint();
  },

  // Display a hint
  displayHint: function() {
    hintEl.innerHTML = this.currentWord.hint;
  },

  checkGuess: function(guess) {
    statusEl.textContent = "";
    // If the selected letter has already been chosen, display a note to the user
    if (this.guesses.indexOf(guess) !== -1) {
      statusEl.textContent = "Already chosen, pick again";
    } else {
      this.guesses.push(guess);

      let i = 0;
      let found = false;

      while (this.currentWord.word.toLowerCase().indexOf(guess, i) !== -1) {
        // Replace index at blanks array with guessed letter if found in current word
        let answer = this.currentWord.word.toLowerCase().indexOf(guess, i);
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
          statusEl.textContent = "You lose! Better luck next time.";
          this.reset();
          this.startRound();
        }
      } else if (
        this.blanks.join("").replace(spacer, "") ===
        this.currentWord.word.replace(" ", "").toLowerCase()
      ) {
        statusEl.textContent = "You win this round!";
        this.incrementScore();
      }
    }
  },
  incrementScore: function(score) {
    this.score++;
    scoreEl.textContent = this.score;
    this.reset();
    this.startRound();
  },
  reset: function() {
    this.currentWord = "";
    this.guesses = [];
    this.misses = [];
    this.blanks = [];

    manEl.innerHTML = "";
  }
};

document.onkeyup = e => {
  if (e.keyCode >= 65 && e.keyCode <= 90) {
    Game.checkGuess(e.key);
  } else {
    statusEl.textContent = "Choose a letter, please!";
  }
};

// Start game on page load
window.onload = () => {
  Game.startRound();
};
