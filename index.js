import {wordsEN, wordsPT, wordsES} from './words.js'

const wordInput = document.getElementById("wordInput");
const line1 = document.getElementById("line1");
const line2 = document.getElementById("line2");
const restartBtn = document.getElementById("restartBtn");

const english = document.getElementById("english");
const portuguese = document.getElementById("portuguese");
const spanish = document.getElementById("spanish");

english.checked = true;

let words = wordsEN;

const charLimit = 50;
let currentWord = 0;
let currentLine = 0;
let results;
let correctWords = 0;
let wrongWords = 0;

const displayTime = document.getElementById("displayTime");
let timer = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;

let lines = [];

function createLines(){

    shuffleWords();
    let newLine = [];
    let charCount = 0;

    for(let i=0; i<words.length; i++){

        charCount += (words[i].length + 1);

        if(charCount > charLimit){
            charCount = 0;
            lines.push(newLine);
            newLine = [];
        }

        else if(i == (words.length-1)){
            newLine.push(words[i]);
            lines.push(newLine);
            newLine = [];
        }

        else{
            newLine.push(words[i]);
        }

    }

}

function setGame(i){
    
        for(let j=0; j<lines[i].length; j++){
            const newSpan = document.createElement("span");
            newSpan.textContent = lines[i][j];
            newSpan.id = "word" + words.indexOf(lines[i][j]);
            newSpan.classList = "wordLabel";
            line1.append(newSpan);
        }

    i++;

    if(i != (lines.length)){

        for(let j=0; j<lines[i].length; j++){
            const newSpan = document.createElement("span");
            newSpan.textContent = lines[i][j];
            newSpan.id = "word" + words.indexOf(lines[i][j]);
            newSpan.classList = "wordLabel";
            line2.append(newSpan);
        }
    }

    
    if(currentWord == 0){
        const nextWord = document.getElementById("word" + words.indexOf(lines[currentLine][currentWord]));
        nextWord.style.backgroundColor = "hsla(0, 0%, 0%, 0.185)";
    }

}

function shuffleWords(){

    
    for(let i = words.length - 1; i > 0; i--){

        const randNum = Math.floor(Math.random() * (i + 1));
        [words[i], words[randNum]] = [words[randNum], words[i]];

    }
}

function checkWord(typedWord){

    const checkedWord = document.getElementById("word" + words.indexOf(lines[currentLine][currentWord]));

    if(typedWord === lines[currentLine][currentWord]){
        checkedWord.style.backgroundColor = "white";
        checkedWord.style.color = "hsl(271, 90%, 25%)";
        correctWords++;
    }
    else{
        checkedWord.style.backgroundColor = "white";
        checkedWord.style.color = "hsl(355, 90%, 40%)";
        wrongWords++;
    }

    const nextWord = document.getElementById("word" + words.indexOf(lines[currentLine][currentWord+1]));
    nextWord.style.backgroundColor = "hsla(0, 0%, 0%, 0.185)";

}

function changeLine(){

    currentWord = 0;
    currentLine++;
    line1.textContent = "";
    line2.textContent = "";

    if(currentLine == lines.length){
        line1.textContent = "Results: 88ppm";
    }
    else{
        setGame(currentLine);
    }

}

wordInput.addEventListener("input", () => {

    if(wordInput.value === ' '){
        wordInput.value = "";
    }
    else{
        if(displayTime.textContent !== "0:00"){

            if(!isRunning){
                startTimer();
            }

            if(wordInput.value.includes(" ")){

                let typedWord = wordInput.value.slice(0, (wordInput.value.length - 1));

                wordInput.value = "";

                if(currentWord == ((lines[currentLine].length)-1)){

                    changeLine();

                }
                else{

                    checkWord(typedWord);
                    currentWord++; 

                }
            }

        }   
    }
});

function startTimer(){

    if(!isRunning){
        startTime = Date.now() - elapsedTime;
        timer = setInterval(updateTimer, 10);
        isRunning = true;
    }

}

function stopTimer(){

    clearInterval(timer);
    elapsedTime = Date.now() - startTime;
    isRunning = false;

}

function resetGame(){

    currentWord = 0;
    currentLine = 0;
    results = 0;
    correctWords = 0;
    wrongWords = 0;

    clearInterval(timer);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    wordInput.value = "";
    displayTime.textContent = "1:00";

    line1.textContent = "";
    line2.textContent = "";

    if(english.checked){
        words = wordsEN;
    }
    else if(portuguese.checked){
        words = wordsPT;
    }
    else{
        words = wordsES;
    }

    lines = [];
    createLines();
    setGame(currentLine);

}

restartBtn.addEventListener("click", event => {
    resetGame();
})

function updateTimer(){

    const currentTime = Date.now();
    elapsedTime = currentTime - startTime;

    let seconds = Math.floor(elapsedTime / 1000 % 60);

   if(Math.floor(elapsedTime / (1000)) > 59.9){
        stopTimer();
        displayTime.textContent = "0:00";
        displayResults();
    }
    else if(seconds == 0){

    }
    else{
        let displaySeconds = String(60-seconds).padStart(2, "0");;
        displayTime.textContent = `0:${displaySeconds}`;
    }
}

function displayResults(){

    let precision = ((correctWords / (correctWords + wrongWords) * 100)).toFixed(1);
    results =  (correctWords + wrongWords);

    line1.textContent = "Result: " + results + "ppm";
    line2.textContent = "Precision: " + precision + "%";
}

createLines();
setGame(currentLine);


/*
const bigWord = lines[3].reduce((element, accumulator) => {
    return element + " " + accumulator;
})*/
