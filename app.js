"use strict";!function(e){function n(t){if(s[t])return s[t].exports;var i=s[t]={i:t,l:!1,exports:{}};return e[t].call(i.exports,i,i.exports,n),i.l=!0,i.exports}var s={};n.m=e,n.c=s,n.d=function(e,s,t){n.o(e,s)||Object.defineProperty(e,s,{configurable:!1,enumerable:!0,get:t})},n.n=function(e){var s=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(s,"a",s),s},n.o=function(e,n){return Object.prototype.hasOwnProperty.call(e,n)},n.p="",n(n.s=0)}([function(e,n,s){Object.defineProperty(n,"__esModule",{value:!0});var t=s(1),i=s(2),r=document.querySelector("#blanks"),o=document.querySelector("#hint"),h=(document.querySelector("#hangman"),document.querySelector("#misses")),a=document.querySelector("#wins"),u=document.querySelector("#losses"),c=document.querySelector("#status"),d=document.querySelector("#guesses-remaining"),l=document.querySelector("#man"),m=/([,\-\'\s])|((&nbsp;){2})/g,g={gameData:t.a,wins:0,losses:0,totalGuesses:i.a.length,currentWord:"",wordsPlayed:[],guesses:[],misses:[],blanks:[],startRound:function(){for(""===this.currentWord&&(d.innerHTML=this.totalGuesses,this.currentWord=this.pickNewWord());-1!==this.wordsPlayed.indexOf(this.currentWord.word);)this.currentWord=this.pickNewWord();this.wordsPlayed.push(this.currentWord.word),this.setBlanks(),this.displayHint()},setBlanks:function(){this.blanks=this.currentWord.word.split("").map(function(e){return" "===e?"&nbsp;&nbsp;":e.match(m)?e:"_"}),r.innerHTML=this.blanks.join(" ")},checkGuess:function(e){c.innerHTML="",0===this.misses.length&&(l.innerHTML="",h.innerHTML="",d.innerHTML=this.totalGuesses),e=e.toUpperCase(),-1!==this.guesses.indexOf(e)?c.innerHTML="Already chosen, pick again":(this.guesses.push(e),this.findMatches(e)?this.blanks.join("").replace(m,"")===this.currentWord.word.replace(m,"").toUpperCase()&&this.incrementScore():this.handleMiss(e))},findMatches:function(e){for(var n=0,s=!1,t=this.currentWord.word.toUpperCase(),i=t.indexOf(e,n);-1!==i;)this.blanks[i]=e,r.innerHTML=this.blanks.join(" "),s=!0,n++,i=t.indexOf(e,n);return s},handleMiss:function(e){this.misses.push(e),h.innerHTML=this.misses.join(" "),d.innerHTML=this.totalGuesses-this.misses.length,l.innerHTML='\n      <img \n        src="'+i.a[this.misses.length-1]+'"\n        alt="Hangman miss '+this.misses.length+'"\n      />\n    ',this.misses.length===this.totalGuesses&&this.decrementScore()},pickNewWord:function(){return this.gameData[Math.floor(Math.random()*this.gameData.length)]},displayHint:function(){o.innerHTML=this.currentWord.hint},incrementScore:function(e){this.wins++,a.innerHTML=this.wins,l.innerHTML="",h.innerHTML="",d.innerHTML=this.totalGuesses,c.innerHTML="&rsquo;"+this.currentWord.word+"&rsquo; is correct! Here is another.",this.reset()},decrementScore:function(){this.losses++,u.innerHTML=this.losses,c.innerHTML="You lose!<br />The correct answer was &rsquo;"+this.currentWord.word+"&rsquo;",this.reset()},reset:function(){this.currentWord="",this.guesses=[],this.misses=[],this.blanks=[],this.wins+this.losses===this.gameData.length?c.innerHTML="There are no more words to play!":this.startRound()}};document.onkeyup=function(e){e.keyCode>=65&&e.keyCode<=90?g.checkGuess(e.key):c.innerHTML="Choose a letter, please!"},function(){var e=new Array;!function(){Array.prototype.slice.call(arguments).map(function(n,s){e[s]=new Image,e[s].src=n})}("./img/miss1.png","./img/miss2.png","./img/miss3.png","./img/miss4.png","./img/miss5.png","./img/miss6.png")}(),document.addEventListener("DOMContentLoaded",function(){g.startRound()})},function(e,n,s){n.a=[{word:"Eleven",hint:"Person"},{word:"Shadow Monster",hint:"Thing"},{word:"Chief Jim Hopper",hint:"Person"},{word:"Hawkins Lab",hint:"Place"},{word:"The Upside Down",hint:"Place"},{word:"Demogorgon",hint:"Thing"},{word:"Jonathan Byers",hint:"Person"},{word:"Mike Wheeler",hint:"Person"},{word:"Dustin Henderson",hint:"Person"},{word:"Lucas Sinclair",hint:"Person"},{word:"Will Byers",hint:"Person"},{word:"Christmas Lights",hint:"Thing"},{word:"Snow Ball",hint:"Event"},{word:"Walkie-Talkie",hint:"Thing"},{word:"Bicycle",hint:"Thing"},{word:"Ghostbusters",hint:"Thing"},{word:"Castle Byers",hint:"Place"},{word:"Dart",hint:"Thing"},{word:"Should I Stay Or Should I Go",hint:"Soundtrack"},{word:"Survive",hint:"Soundtrack"}]},function(e,n,s){n.a=["./img/miss1.png","./img/miss2.png","./img/miss3.png","./img/miss4.png","./img/miss5.png","./img/miss6.png"]}]);