var sudokuApp = angular.module('sudokuApp', []);

function mainCtrl($scope) {

    $scope.uiState = {};
    $scope.uiState.highlightWrongAnswers = false;

    $scope.solution = [
        [
            [[5, 3, 4], [6, 7, 2], [1, 9, 8]],
            [[6, 7, 8], [1, 9, 5], [3, 4, 2]],
            [[9, 1, 2], [3, 4, 8], [5, 6, 7]]
        ],
        [
            [[8, 5, 9], [4, 2, 6], [7, 1, 3]],
            [[7, 6, 1], [8, 5, 3], [9, 2, 4]],
            [[4, 2, 3], [7, 9, 1], [8, 5, 6]]
        ],
        [
            [[9, 6, 1], [2, 8, 7], [3, 4, 5]],
            [[5, 3, 7], [4, 1, 9], [2, 8, 6]],
            [[2, 8, 4], [6, 3, 5], [1, 7, 9]]
        ]
    ];

    $scope.uiState.problem = [
        [
            [[5, 3, null], [6, null, null], [null, 9, 8]],
            [[null, 7, null], [1, 9, 5], [null, null, null]],
            [[null, null, null], [null, null, null], [null, 6, null]]
        ],
        [
            [[8, null, null], [4, null, null], [7, null, null]],
            [[null, 6, null], [8, null, 3], [null, 2, null]],
            [[null, null, 3], [null, null, 1], [null, null, 6]]
        ],
        [
            [[null, 6, null], [null, null, null], [null, null, null]],
            [[null, null, null], [4, 1, 9], [null, 8, null]],
            [[2, 8, null], [null, null, 5], [null, 7, 9]]
        ]
    ];

    $scope.uiState.activeCell = null;

    $scope.lockedCells = [];

    $scope.lockCells = function () {
        for (var boardRowIdx = 0; boardRowIdx < $scope.uiState.problem.length; boardRowIdx++) {
            var currentBoardRow = $scope.uiState.problem[boardRowIdx];
            for (var boxIdx = 0; boxIdx < currentBoardRow.length; boxIdx++) {
                var currentBox = currentBoardRow[boxIdx];
                for (var boxRowIdx = 0; boxRowIdx < currentBox.length; boxRowIdx++) {
                    var currentBoxRow = currentBox[boxRowIdx];
                    for (var cellIdx = 0; cellIdx < currentBoxRow.length; cellIdx++) {
                        if (currentBoxRow[cellIdx] !== null) {
                            $scope.lockedCells.push([boardRowIdx, boxIdx, boxRowIdx, cellIdx]);
                        }
                    }
                }
            }
        }
    };

    $scope.lockCells();

    $scope.boardIsFull = function () {
        var boardIsFull = true;
        for (var boardRowIdx = 0; boardRowIdx < $scope.uiState.problem.length; boardRowIdx++) {
            var currentBoardRow = $scope.uiState.problem[boardRowIdx];
            for (var boxIdx = 0; boxIdx < currentBoardRow.length; boxIdx++) {
                var currentBox = currentBoardRow[boxIdx];
                for (var boxRowIdx = 0; boxRowIdx < currentBox.length; boxRowIdx++) {
                    var currentBoxRow = currentBox[boxRowIdx];
                    for (var cellIdx = 0; cellIdx < currentBoxRow.length; cellIdx++) {
                        if (currentBoxRow[cellIdx] === null) {
                            boardIsFull = false;
                        }
                    }
                }
            }
        }
        return boardIsFull;
    };

    $scope.setCellValue = function(val) {
        var boardRowIdx = $scope.uiState.activeCell[0];
        var boxIdx = $scope.uiState.activeCell[1];
        var boxRowIdx = $scope.uiState.activeCell[2];
        var cellRowIdx = $scope.uiState.activeCell[3];
        $scope.cancelProblemWatch();
        $scope.uiState.problem[boardRowIdx][boxIdx][boxRowIdx][cellRowIdx] = parseInt(val);
        $scope.setProblemWatch();
    };

    $scope.helpPlayerOut = function(val) {
        var answerProvided = false;
        for (var boardRowIdx = 0; boardRowIdx < $scope.uiState.problem.length; boardRowIdx++) {
            if (answerProvided) { break; }
            var currentBoardRow = $scope.uiState.problem[boardRowIdx];
            for (var boxIdx = 0; boxIdx < currentBoardRow.length; boxIdx++) {
                var currentBox = currentBoardRow[boxIdx];
                for (var boxRowIdx = 0; boxRowIdx < currentBox.length; boxRowIdx++) {
                    var currentBoxRow = currentBox[boxRowIdx];
                    for (var cellIdx = 0; cellIdx < currentBoxRow.length; cellIdx++) {
                        if (currentBoxRow[cellIdx] === null && !answerProvided) {
                            currentBoxRow[cellIdx] = $scope.solution[boardRowIdx][boxIdx][boxRowIdx][cellIdx];
                            answerProvided = true;
                        }
                    }
                }
            }
        }
    };

    $scope.highlightError = function (cellIdentifier) {
        if (!$scope.uiState.highlightErrors) {
            return false;
        }
        var boardRowIdx = cellIdentifier[0];
        var boxIdx = cellIdentifier[1];
        var boxRowIdx = cellIdentifier[2];
        var cellRowIdx = cellIdentifier[3];
        var cellValue = $scope.uiState.problem[boardRowIdx][boxIdx][boxRowIdx][cellRowIdx];
        if (cellValue === null) {
            return false;
        }
        cellValue = parseInt(cellValue);
        return !angular.equals(cellValue, $scope.solution[boardRowIdx][boxIdx][boxRowIdx][cellRowIdx]);
    };

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

    $scope.cellIsActive = function (cellData) {
        return angular.equals($scope.uiState.activeCell, cellData);
    };

    $scope.setProblemWatch = function() {
        $scope.cancelProblemWatch = $scope.$watch('uiState.problem', function() {
            if($scope.boardIsFull()) {
                if (angular.equals($scope.uiState.problem, $scope.solution)) {
                    alert("You solved it!");
                } else {
                    alert("Sorry, your solution is wrong.");
                }
            }
        }, true);
    };

    $scope.setProblemWatch();
}
