var sudokuApp = angular.module('sudokuApp', []);

function mainCtrl($scope) {

    // BOARD VALUES ========================================================


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


    // Container for anything manipulated by the UI -- otherwise primitives can break data bindings
    $scope.uiState = {};

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
                    alert("You solved it!");
                } else {
                    alert("Sorry, your solution is wrong.");
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

    $scope.uiState.highlightWrongAnswers = false;
    $scope.uiState.activeCell = null;

    $scope.lockedCells = [];

    $scope.lockCells();
    $scope.setProblemWatch();
}
