'use strict';

/******/(function (modules) {
  // webpackBootstrap
  /******/ // The module cache
  /******/var installedModules = {};
  /******/
  /******/ // The require function
  /******/function __webpack_require__(moduleId) {
    /******/
    /******/ // Check if module is in cache
    /******/if (installedModules[moduleId]) {
      /******/return installedModules[moduleId].exports;
      /******/
    }
    /******/ // Create a new module (and put it into the cache)
    /******/var module = installedModules[moduleId] = {
      /******/i: moduleId,
      /******/l: false,
      /******/exports: {}
      /******/ };
    /******/
    /******/ // Execute the module function
    /******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
    /******/
    /******/ // Flag the module as loaded
    /******/module.l = true;
    /******/
    /******/ // Return the exports of the module
    /******/return module.exports;
    /******/
  }
  /******/
  /******/
  /******/ // expose the modules object (__webpack_modules__)
  /******/__webpack_require__.m = modules;
  /******/
  /******/ // expose the module cache
  /******/__webpack_require__.c = installedModules;
  /******/
  /******/ // define getter function for harmony exports
  /******/__webpack_require__.d = function (exports, name, getter) {
    /******/if (!__webpack_require__.o(exports, name)) {
      /******/Object.defineProperty(exports, name, {
        /******/configurable: false,
        /******/enumerable: true,
        /******/get: getter
        /******/ });
      /******/
    }
    /******/
  };
  /******/
  /******/ // getDefaultExport function for compatibility with non-harmony modules
  /******/__webpack_require__.n = function (module) {
    /******/var getter = module && module.__esModule ?
    /******/function getDefault() {
      return module['default'];
    } :
    /******/function getModuleExports() {
      return module;
    };
    /******/__webpack_require__.d(getter, 'a', getter);
    /******/return getter;
    /******/
  };
  /******/
  /******/ // Object.prototype.hasOwnProperty.call
  /******/__webpack_require__.o = function (object, property) {
    return Object.prototype.hasOwnProperty.call(object, property);
  };
  /******/
  /******/ // __webpack_public_path__
  /******/__webpack_require__.p = "";
  /******/
  /******/ // Load entry module and return exports
  /******/return __webpack_require__(__webpack_require__.s = 0);
  /******/
})(
/************************************************************************/
/******/[
/* 0 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_0__js_data__ = __webpack_require__(1);
  /* harmony import */var __WEBPACK_IMPORTED_MODULE_1__js_hangman__ = __webpack_require__(2);

  // Define elements to be used in the game as global variables
  var blanksEl = document.querySelector('#blanks'),
      hintEl = document.querySelector('#hint'),
      hangmanEl = document.querySelector('#hangman'),
      missesEl = document.querySelector('#misses'),
      winsEl = document.querySelector('#wins'),
      lossesEl = document.querySelector('#losses'),
      statusEl = document.querySelector('#status'),
      guessesRemainingEl = document.querySelector('#guesses-remaining'),
      manEl = document.querySelector('#man');

  var spacer = '&nbsp;&nbsp;';
  var re = /([,\-\'\s])|((&nbsp;){2})/g;

  var preloadImages = function preloadImages() {
    var images = new Array();
    function preload() {
      Array.prototype.slice.call(arguments).map(function (img, i) {
        images[i] = new Image();
        images[i].src = img;
      });
    }
    preload('./img/miss1.png', './img/miss2.png', './img/miss3.png', './img/miss4.png', './img/miss5.png', './img/miss6.png');
  };

  var Game = {
    gameData: __WEBPACK_IMPORTED_MODULE_0__js_data__["a" /* gameData */],

    // Initialize game state
    wins: 0,
    losses: 0,
    totalGuesses: __WEBPACK_IMPORTED_MODULE_1__js_hangman__["a" /* hangman */].length,
    currentWord: '',
    wordsPlayed: [],
    guesses: [],
    misses: [],
    blanks: [],

    startRound: function startRound() {
      // Only set currentWord here if very first execution of function
      if (this.currentWord === '') {
        guessesRemainingEl.innerHTML = this.totalGuesses;
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

    setBlanks: function setBlanks() {
      // Set up the current round's blank letters and add to page
      this.blanks = this.currentWord.word.split('').map(function (el) {
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

    checkGuess: function checkGuess(guess) {
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
        } else if (this.blanks.join('').replace(re, '') === this.currentWord.word.replace(re, '').toUpperCase()) {
          this.incrementScore();
        }
      }
    },

    // Find matches based on guess and replace respective blank spaces in DOM
    findMatches: function findMatches(guess) {
      // Initialize values for checking player's guess
      var i = 0;
      var found = false;
      var currentWord = this.currentWord.word.toUpperCase();
      var testCase = currentWord.indexOf(guess, i);

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

    handleMiss: function handleMiss(guess) {
      this.misses.push(guess);

      // Update game state
      missesEl.innerHTML = this.misses.join(' ');
      guessesRemainingEl.innerHTML = this.totalGuesses - this.misses.length;
      manEl.innerHTML = '\n      <img \n        src="' + __WEBPACK_IMPORTED_MODULE_1__js_hangman__["a" /* hangman */][this.misses.length - 1] + '"\n        alt="Hangman miss ' + this.misses.length + '"\n      />\n    ';

      // Check if there are any guesses left
      if (this.misses.length === this.totalGuesses) {
        this.decrementScore();
      }
    },

    // Utility functions for moving game progress forward
    pickNewWord: function pickNewWord() {
      return this.gameData[Math.floor(Math.random() * this.gameData.length)];
    },
    displayHint: function displayHint() {
      hintEl.innerHTML = this.currentWord.hint;
    },
    incrementScore: function incrementScore(score) {
      this.wins++;
      winsEl.innerHTML = this.wins;

      // Reset the board immediately if a winning round
      manEl.innerHTML = '';
      missesEl.innerHTML = '';
      guessesRemainingEl.innerHTML = this.totalGuesses;
      statusEl.innerHTML = 'You won! Here is another.';
      this.reset();
    },
    decrementScore: function decrementScore() {
      this.losses++;
      lossesEl.innerHTML = this.losses;
      statusEl.innerHTML = 'You lose!<br />The correct answer was &rsquo;' + this.currentWord.word + '&rsquo;';
      this.reset();
    },
    reset: function reset() {
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
  document.onkeyup = function (e) {
    e.keyCode >= 65 && e.keyCode <= 90 ? Game.checkGuess(e.key) : statusEl.innerHTML = 'Choose a letter, please!';
  };

  // Prepare images
  preloadImages();

  // Start game when DOM loaded -> this is equivalent of jQuery's document.ready
  document.addEventListener('DOMContentLoaded', function () {
    Game.startRound();
  });

  /***/
},
/* 1 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  var gameData = [{
    word: 'Eleven',
    hint: 'Person'
  }, {
    word: 'Shadow Monster',
    hint: 'Thing'
  }, {
    word: 'Cheif Jim Hopper',
    hint: 'Person'
  }, {
    word: 'Hawkins Lab',
    hint: 'Place'
  }, {
    word: 'The Upside Down',
    hint: 'Place'
  }, {
    word: 'Demogorgon',
    hint: 'Thing'
  }, {
    word: 'Jonathan Byers',
    hint: 'Person'
  }, {
    word: 'Mike Wheeler',
    hint: 'Person'
  }, {
    word: 'Dustin Henderson',
    hint: 'Person'
  }, {
    word: 'Lucas Sinclair',
    hint: 'Person'
  }, {
    word: 'Will Byers',
    hint: 'Person'
  }, {
    word: 'Christmas Lights',
    hint: 'Thing'
  }, {
    word: 'Snow Ball',
    hint: 'Event'
  }, {
    word: 'Walkie-Talkie',
    hint: 'Thing'
  }, {
    word: 'Bicycle',
    hint: 'Thing'
  }, {
    word: 'Ghostbusters',
    hint: 'Thing'
  }, {
    word: 'Castle Byers',
    hint: 'Place'
  }, {
    word: 'Dart',
    hint: 'Thing'
  }, {
    word: 'Should I Stay Or Should I Go',
    hint: 'Soundtrack'
  }, {
    word: 'Survive',
    hint: 'Soundtrack'
  }];
  /* harmony export (immutable) */__webpack_exports__["a"] = gameData;

  /***/
},
/* 2 */
/***/function (module, __webpack_exports__, __webpack_require__) {

  "use strict";

  var hangman = ['./img/miss1.png', './img/miss2.png', './img/miss3.png', './img/miss4.png', './img/miss5.png', './img/miss6.png'];
  /* harmony export (immutable) */__webpack_exports__["a"] = hangman;

  /***/
}]
/******/);