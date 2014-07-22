// Returns static board, but can be replaced with a true board generator at a later date
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

function drawBoard() {
    for (var i=0; i < problem.length; i++) {
        var currentBox = problem[i];
        var boxID = "box_" + i;
        $('#board').append("<div id='" + boxID + "' class='box'></div>");
        for (var n=0; n < currentBox.length; n++ ) {
            var cellID = "cell_" + i + "_" + n;
            var inputID = "input_" + i + "_" + n;
            $('#' + boxID).append("<div id='" + cellID + "'class='cell_container'>" +
                "    <div class='image_container'><img class='square_spacer' src='images/000000-0.png'/></div>" +
                "    <div class='input_container'>" +
                "        <input id='" + inputID + "'class='cell_input' type='text' />" +
                "    </div>" +
                "</div>");
            var inputVal = problem[i][n];
            if (inputVal) {
                $('#' + inputID).val(inputVal);
                $('#' + inputID).prop("disabled", true);
            } else {
                $('#' + inputID).addClass("editable");
            }
        }
    }
}

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

function initializeBoard() {
    $('#board').html("");
    var board = generateBoard();

    var solution = board.solution;
    var problem = board.problem;

    drawBoard();

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

    $('#board').show();
    $('#menu').show();

    setTimeout(function() {
        resizeNumbers();
        $('.cell_input').show();
    }, 200);
}

var cellHeight = null;

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

var errorsAreHighlighted = false;
var board = generateBoard();
var solution = board.solution;
var problem = board.problem;

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

    $('#restart_game').on('click', function () {
        $('#results_overlay').hide();
        initializeBoard();
    });

    $(window).resize(function () {
        resizeNumbers();
    });
});


/*

var sudokuApp = angular.module('sudokuApp', []);

function mainCtrl($scope, $window) {

    // Container for anything manipulated by the UI -- otherwise primitives can break data bindings
    $scope.uiState = {};

    // BOARD VALUES ========================================================

    $scope.setBoard = function () {
        // each array is a box, running left to right
        $scope.solution = [
            [5, 3, 4, 6, 7, 2, 1, 9, 8],
            [6, 7, 8, 1, 9, 5, 3, 4, 2],
            [9, 1, 2, 3, 4, 8, 5, 6, 7],
            [8, 5, 9, 4, 2, 6, 7, 1, 3],
            [7, 6, 1, 8, 5, 3, 9, 2, 4],
            [4, 2, 3, 7, 9, 1, 8, 5, 6],
            [9, 6, 1, 2, 8, 7, 3, 4, 5],
            [5, 3, 7, 4, 1, 9, 2, 8, 6],
            [2, 8, 4, 6, 3, 5, 1, 7, 9]
        ];

        // copy of the solution, but with values missing
        $scope.uiState.problem = [
            [5,    3,    null, 6,    null, null, null, 9,    8],
            [null, 7,    null, 1,    9,    5,    null, null, null],
            [null, null, null, null, null, null, null, 6,    null],
            [8,    null, null, 4,    null, null, 7,    null, null],
            [null, 6,    null, 8,    null, 3,    null, 2,    null],
            [null, null, 3,    null, null, 1,    null, null, 6],
            [null, 6,    null, null, null, null, null, null, null],
            [null, null, null, 4,    1,    9,    null, 8,    null],
            [2,    8,    null, null, null, 5,    null, 7,    9]
        ];
    };

    // CELL STATE/BEHAVIOR =================================================

    // Disable editing of any cells that already have solutions in them.
    $scope.lockCells = function () {
        angular.forEach($scope.uiState.problem, function (box, boxIdx) {
            angular.forEach(box, function (cell, cellIdx) {
                if (cell !== null) {
                    $scope.lockedCells.push([boxIdx, cellIdx]);
                }
            });
        });
    };

    // Set numerical cell value when user edits a cell.
    $scope.setCellValue = function (val) {
        var acceptableValues = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
        var newVal;
        if (acceptableValues.indexOf(val) === -1) {
            newVal = null;
        } else {
            newVal = parseInt(val);
        }
        var boxIdx = $scope.uiState.activeCell[0];
        var cellIdx = $scope.uiState.activeCell[1];
        $scope.cancelProblemWatch();
        $scope.uiState.problem[boxIdx][cellIdx] = newVal;
        $scope.setProblemWatch();
    };

    // When the board changes, check to see whether it's full, and if so, tell the user the outcome.
    $scope.setProblemWatch = function () {
        $scope.cancelProblemWatch = $scope.$watch('uiState.problem', function () {
            if ($scope.boardIsFull()) {
                if (angular.equals($scope.uiState.problem, $scope.solution)) {
                    $scope.gameOutcome = "You won";
                } else {
                    $scope.gameOutcome = "You lost";
                }
            }
        }, true);
    };

    // GAME OUTCOME ================================================

    // See whether the board is full, so we know whether to update the user on the game's outcome.
    $scope.boardIsFull = function () {
        var boardIsFull = true;
        angular.forEach($scope.uiState.problem, function (box) {
            angular.forEach(box, function (cell) {
                if (cell === null) {
                    boardIsFull = false;
                }
            });
        });
        return boardIsFull;
    };

    // PLAYER HINTS ====================================================================

    $scope.toggleErrorHighlighting = function () {
        $scope.uiState.highlightErrors = !$scope.uiState.highlightErrors;
    };

    // Gives the user a cell's value and locks the cell.
    $scope.helpPlayerOut = function () {
        var answerProvided = false;
        angular.forEach($scope.uiState.problem, function (box, boxIdx) {
            angular.forEach(box, function (cell, cellIdx) {
                if (cell === null && !answerProvided) {
                    box[cellIdx] = $scope.solution[boxIdx][cellIdx];
                    $scope.lockedCells.push([boxIdx, cellIdx]);
                    answerProvided = true;
                }
            });
        });
    };

    // Decides whether to highlight an error based on the user's preferences and the cell's value.
    $scope.highlightError = function (cellIdentifier) {
        if (!$scope.uiState.highlightErrors) {
            return false;
        }
        var boxIdx = cellIdentifier[0];
        var cellIdx = cellIdentifier[1];
        var cellValue = $scope.uiState.problem[boxIdx][cellIdx];
        if (cellValue === null) {
            return false;
        }
        cellValue = parseInt(cellValue);
        return !angular.equals(cellValue, $scope.solution[boxIdx][cellIdx]);
    };

    // Sets the active cell on user click.
    $scope.setActiveCell = function (cellIdentifier) {
        var cellIsLocked = false;
        for (var i = 0; i < $scope.lockedCells.length; i++) {
            if (angular.equals($scope.lockedCells[i], cellIdentifier)) {
                cellIsLocked = true;
            }
            if (cellIsLocked) { break;}
        }
        if (!cellIsLocked) {
            $scope.uiState.activeCell = cellIdentifier;
        }
    };

    // Cells use this function to decide whether to disable themselves.
    $scope.cellIsLocked = function (cellIdentifier) {
        var cellIsLocked = false;
        for (var i = 0; i < $scope.lockedCells.length; i++) {
            if (angular.equals($scope.lockedCells[i], cellIdentifier)) {
                cellIsLocked = true;
            }
            if (cellIsLocked) { break;}
        }
        return cellIsLocked;
    };

    // INITIALIZE ============================================================

    $scope.gameOutcome = null;
    $scope.uiState.highlightErrors = false;
    $scope.uiState.activeCell = null;

    $scope.lockedCells = [];
    $scope.setBoard();

    $scope.lockCells();
    $scope.setProblemWatch();

    $scope.restartGame = function() {
        $window.location.reload();
    };

}

// set size of numbers when the board is resized

var cellHeight = null;

function resizeNumbers() {
    var height = $('.cell_input').first().height();
    if (height == cellHeight) {
        return;
    }
    cellHeight = height;
    var newNumberSize;
    if (height > 35) {
        newNumberSize = height/1.8;
        $('.cell_input').css('font-size', Math.round(newNumberSize * 100) / 100 + 'px');
    } else {
        newNumberSize = height/1.5;
        $('.cell_input').css('font-size', Math.round(newNumberSize * 100) / 100 + 'px');
    }
}

$(window).resize(function () {
    resizeNumbers();
});

$(document).ready(function () {
    setTimeout(function() {
        resizeNumbers();
        $('.cell_input').show();
    }, 300);
});

*/
