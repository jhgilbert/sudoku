// GENERATE GAME DATA/DRAW BOARD ================================================

// Returns static board, but can be replaced with a true board generator at a later date.
// Each array within the solution array is a box, and cells run left to right inside it.
function generateBoard() {
    return {
        solution: [
            [5, 3, 4, 6, 7, 2, 1, 9, 8],
            [6, 7, 8, 1, 9, 5, 3, 4, 2],
            [9, 1, 2, 3, 4, 8, 5, 6, 7],
            [8, 5, 9, 4, 2, 6, 7, 1, 3],
            [7, 6, 1, 8, 5, 3, 9, 2, 4],
            [4, 2, 3, 7, 9, 1, 8, 5, 6],
            [9, 6, 1, 2, 8, 7, 3, 4, 5],
            [5, 3, 7, 4, 1, 9, 2, 8, 6],
            [2, 8, 4, 6, 3, 5, 1, 7, 9]
        ],
        problem: [
            [5,    3,    null, 6,    null, null, null, 9,    8],
            [null, 7,    null, 1,    9,    5,    null, null, null],
            [null, null, null, null, null, null, null, 6,    null],
            [8,    null, null, 4,    null, null, 7,    null, null],
            [null, 6,    null, 8,    null, 3,    null, 2,    null],
            [null, null, 3,    null, null, 1,    null, null, 6],
            [null, 6,    null, null, null, null, null, null, null],
            [null, null, null, 4,    1,    9,    null, 8,    null],
            [2,    8,    null, null, null, 5,    null, 7,    9]
        ]
    };
}

// Renders the board HTML with appropriate values
// HTML strings are ugly -- I'd probably at least switch to JSRender
// if this were a real-life project that weren't so tiny
function drawBoard() {
    // go through each box and build the HTML
    for (var boxIdx=0; boxIdx < problem.length; boxIdx++) {
        var currentBox = problem[boxIdx];
        var boxID = "box_" + boxIdx;
        $('#board').append("<div id='" + boxID + "' class='box'></div>");

        for (var cellIdx=0; cellIdx < currentBox.length; cellIdx++ ) {
            // build cell HTML
            var cellID = "cell_" + boxIdx + "_" + cellIdx;
            var inputID = "input_" + boxIdx + "_" + cellIdx;
            $('#' + boxID).append("<div id='" + cellID + "'class='cell_container'>" +
                "    <img class='square_spacer' src='images/000000-0.png'/>" +
                "    <div class='input_container'>" +
                "        <input id='" + inputID + "'class='cell_input' type='text' />" +
                "    </div>" +
                "</div>");

            // set input value
            var cellVal = problem[boxIdx][cellIdx];
            if (cellVal) {
                $('#' + inputID).val(cellVal);
                $('#' + inputID).prop("disabled", true);
            } else {
                $('#' + inputID).addClass("editable");
            }
        }
    }
}

function initializeBoard() {
    $('#board').html("");
    var board = generateBoard();

    var solution = board.solution;
    var problem = board.problem;

    drawBoard();

    // after a value changes, see whether board is full and show game result as needed
    $('.editable').on('change', function () {
        var boardIsFull = isBoardFull();
        if (boardIsFull) {
            showGameResult(problem, solution);
        } else {
            if (errorsAreHighlighted) {
                highlightErrors();
            }
        }
    });

    // too nitpicky, maybe, but made for prettier loading
    $('#board').show();
    $('#menu').show();

    setTimeout(function() {
        resizeNumbers();
        $('.cell_input').show();
    }, 200);
}


// GAME STATUS CHECK/RESULT DISPLAY ==================================================

function isBoardFull() {
    var boardIsFull = true;
    $('.editable').each(function (index) {
        if ($(this).val() === ""){
            boardIsFull = false;
        }
    });
    return boardIsFull;
}

function getGameResult() {
    var playerWon = true;
    // did the player win?
    for (var boxIdx=0; boxIdx < solution.length; boxIdx++) {
        var currentBox = solution[boxIdx];
        for (var cellIdx = 0; cellIdx < currentBox.length; cellIdx++) {
            inputVal = parseInt($('#input_' + boxIdx + "_" + cellIdx).val());
            if (inputVal !== solution[boxIdx][cellIdx]){
                playerWon = false;
            }
        }
    }
    return playerWon;
}

function showGameResult() {
    console.log("Trying to show game result ...");
    var playerWon = getGameResult();
    if (playerWon) {
        $('#game_result').html("You won");
    } else {
        $('#game_result').html("You lost");
    }
    $('#results_overlay').show();
}


// HELP AND HINTS ========================================================================

function cancelErrorHighlight() {
    $('.editable').removeClass('wrong_answer');
}

function highlightErrors() {
    cancelErrorHighlight();
    for (var boxIdx=0; boxIdx < solution.length; boxIdx++) {
        var currentBox = solution[boxIdx];
        for (var cellIdx = 0; cellIdx < currentBox.length; cellIdx++) {
            var inputVal = $('#input_' + boxIdx + "_" + cellIdx).val();
            if (inputVal !== "" && parseInt(inputVal) !== solution[boxIdx][cellIdx]){
                $('#input_' + boxIdx + "_" + cellIdx).addClass('wrong_answer');
            }
        }
    }
}

function getHint() {
    var hintGiven = false;
    for (var boxIdx=0; boxIdx < solution.length; boxIdx++) {
        if (hintGiven) { break; }
        var currentBox = solution[boxIdx];
        for (var cellIdx = 0; cellIdx < currentBox.length; cellIdx++) {
            if (hintGiven) { break; }
            var input = $('#input_' + boxIdx + "_" + cellIdx);
            var inputVal = input.val();
            if (inputVal === ""){
                input.val(solution[boxIdx][cellIdx]);
                hintGiven = true;
            }
        }
    }
    if (isBoardFull()) {
        showGameResult();
    }
}

// HACK-ISH RESPONSIVENESS MAINTENANCE =================================================

// Sizing fonts based on viewport doesn't work on Android, so this is my generic solution
function resizeNumbers() {
    var height = $('.cell_input').first().height();

    if (height == cellHeight) {
        return;
    }

    cellHeight = height;
    var newNumberSize;

    if (height > 35) {
        newNumberSize = height / 1.8;
        $('.cell_input').css('font-size', Math.round(newNumberSize * 100) / 100 + 'px');
    } else {
        newNumberSize = height / 1.5;
        $('.cell_input').css('font-size', Math.round(newNumberSize * 100) / 100 + 'px');
    }
}


// SET GLOBALS ==========================================================================

var cellHeight = null;
var errorsAreHighlighted = false;
var board = generateBoard();
var solution = board.solution;
var problem = board.problem;


// INITIALIZE GAME ======================================================================

$(document).ready(function () {
    initializeBoard();

    $('#highlight_init_button').on('click', function () {
        errorsAreHighlighted = true;
        highlightErrors();
        $(this).hide();
        $('#highlight_cancel_button').show();
    });

    $('#highlight_cancel_button').on('click', function () {
        errorsAreHighlighted = false;
        cancelErrorHighlight();
        $(this).hide();
        $('#highlight_init_button').show();
    });

    $('#player_helper').on('click', function () {
        getHint();
    });

    $('#restart_game').on('click', function () {
        $('#results_overlay').hide();
        initializeBoard();
    });

    $(window).resize(function () {
        resizeNumbers();
    });
});
