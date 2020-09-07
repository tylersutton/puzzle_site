"use strict";

// manually load boards for now
const easy = [
    "6------7------5-2------1---362----81--96-----71--9-4-5-2---651---78----345-------",
    "685329174971485326234761859362574981549618732718293465823946517197852643456137298"
  ];
  const medium = [
    "--9-------4----6-758-31----15--4-36-------4-8----9-------75----3-------1--2--3--",
    "619472583243985617587316924158247369926531478734698152891754236365829741472163895"
  ];
  const hard = [
    "-1-5-------97-42----5----7-5---3---7-6--2-41---8--5---1-4------2-3-----9-7----8--",
    "712583694639714258845269173521436987367928415498175326184697532253841769976352841"
  ];

// create variables
var timer;
var timePassed;
var selectedNum;
var selectedTile;
var disableSelect;

window.onload = function() {
    // Run startgame function when button is clicked
    id("start-btn").addEventListener("click", startGame);
    // add click event listener to each number in number container
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].addEventListener("click", function() {
            // if selecting is not disabled
            if (!disableSelect) {
                // if number is already selected
                if (this.classList.contains("selected")) {
                    // then remove selection
                    this.classList.remove("selected");
                    selectedNum = null;
                } else {
                    for (let i = 0; i < id("number-container").children.length; i++) {
                        id("number-container").children[i].classList.remove("selected");
                    }
                    this.classList.add("selected");
                    selectedNum = this;
                    updateMove();
                }
            }
        });
    }
    // add keydown event listener to window for number container (check for numbers entered)
    window.addEventListener('keydown', function(event) {
        let key_num = Number(event.key) - 1;
        if (key_num < 0 || key_num > 8) return;
        // if selecting is not disabled
        if (!disableSelect) {
            // if number is already selected
            if (id("number-container").children[key_num].classList.contains("selected")) {
                // then remove selection
                id("number-container").children[key_num].classList.remove("selected");
                selectedNum = null;
            } else {
                for (let i = 0; i < id("number-container").children.length; i++) {
                    id("number-container").children[i].classList.remove("selected");
                }
                id("number-container").children[key_num].classList.add("selected");
                selectedNum = id("number-container").children[key_num];
                updateMove();
            }
        }
    });
}

function startGame() {
    let board;
    if (id("diff-easy").checked) board = easy[0];
    else if (id("diff-medium").checked) board = medium[0];
    else board = hard[0];
    
    // enables selecting numbers and tiles
    disableSelect = false;

    // create board based on difficulty
    generateBoard(board);

    // starts timer
    startTimer();

    // sets theme based on input
    if (id("theme-light").checked) {
        qs("body").classList.remove("dark");
    } else {
        qs("body").classList.add("dark");
    }

    //show number container
    id("number-container").classList.remove("hidden");
}

function startTimer() {
    timePassed = 0;
    // sets initial time for timer (0s)
    id("timer").textContent = timeConversion(timePassed);

    // sets timer to update every second
    timer = setInterval(function() {
        timePassed++;
        id("timer").textContent = timeConversion(timePassed);
    }, 1000)
}

// converts seconds into MM:SS format
function timeConversion(time) {
    let minutes = Math.floor(time/60);
    if (minutes < 10) minutes = "0" + minutes;
    let seconds = time % 60;
    if (seconds < 10) seconds = "0" + seconds;
    return minutes + ":" + seconds;
}

function generateBoard(board) {
    // clear previous board
    clearPrevious();

    // Let used to increment tile id's
    let idCount = 0;
    for (let i = 0; i < 81; i++) {
        // create new paragraph element
        let tile = document.createElement("p");
        if (board.charAt(i) != "-") {
            // set tile text to correct number
            tile.textContent = board.charAt(i);
        } else {
            // add click event listener to tile
            tile.addEventListener("click", function() {
                if (!disableSelect) {
                    // if the tile is already selected
                    if (tile.classList.contains("selected")) {
                        // then remove selection
                        tile.classList.remove("selected");
                        selectedTile = null;
                    } else {
                        // deselect all other tiles
                        for (let i = 0; i < 81; i++) {
                            qsa(".tile")[i].classList.remove("selected");
                        }
                        // add selection and update variable
                        tile.classList.add("selected");
                        selectedTile = tile;
                        updateMove();
                    }
                }
            });
        }
        // assign tile id
        tile.id = idCount;
        // increment for next tile
        idCount++;
        // add tile class to all tiles
        tile.classList.add("tile");
        
        // add bottom border to separate sections
        if ((tile.id > 17 && tile.id < 27) || (tile.id > 44 && tile.id < 54)) {
            tile.classList.add("bottomBorder");
        }

        // add right border to separate sections
        if ((tile.id + 1) % 9 == 3 || (tile.id + 1) % 9 == 6) {
            tile.classList.add("rightBorder");
        }

        //add tile to board
        id("board").appendChild(tile);
    }
}

function updateMove() {
    // if a tile and number are selected
    if (selectedTile && selectedNum) {
        // set the tile to the correct number
        selectedTile.textContent = selectedNum.textContent;
        // if the number matches the corresponding number in the number key
        if (checkCorrect(selectedTile)) {
            // deselect the tile
            selectedTile.classList.remove("selected");
            selectedNum.classList.remove("selected");
            // clear selected variables
            selectedTile = null;
            selectedNum = null;
        }
        // if the number does not match solution
        else {
            // disable selecting new numbers for 1 second
            disableSelect = true;
            // make tile turn red
            selectedTile.classList.add("incorrect");
            //run in 1 second
            setTimeout(function() {
                // reenable selecting numbers
                disableSelect = false;
                // restore tile color and remove tile/number selection
                selectedTile.classList.remove("incorrect");
                selectedTile.classList.remove("selected");
                selectedNum.classList.remove("selected");
                // clear the tile text and clear selected tile/number
                selectedTile.textContent = "";
                selectedTile = null;
                selectedNum = null;
            }, 1000);
        }
    }
}

function checkCorrect(tile) {
    // set solution based on difficulty
    let solution;
    if (id("diff-easy").checked) solution = easy[1];
    else if (id("diff-medium").checked) solution = medium[1];
    else solution = hard[1];
    // check if tile number is equal to solution's number
    return (solution.charAt(tile.id) === tile.textContent);
}

function clearPrevious() {
    let tiles = qsa(".tile");
    
    // remove each tile
    for (let i = 0; i < tiles.length; i++) {
        tiles[i].remove();
    }
    
    // clear timer
    if (timer) clearInterval(timer);

    // deselect any numbers
    for (let i = 0; i < id("number-container").children.length; i++) {
        id("number-container").children[i].classList.remove("selected");
    }
    selectedTile = null;
    selectedNum = null;
}

// Helper Functions

function id(id) {
    return document.getElementById(id);
}

function qs(selector) {
    return document.querySelector(selector);
}

function qsa(selector) {
    return document.querySelectorAll(selector);
}