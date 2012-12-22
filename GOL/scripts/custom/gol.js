$(document).ready(function () {
    var game = new GameOfLife(50, 100);
    game.initPlayground();

    $('#btnStart').click(function () {
        $(this).attr('disabled', 'disabled');
        $('#btnNextGen').attr('disabled', 'disabled');
        $('#btnPause').removeAttr('disabled');
        game.start();
    });

    $('#btnPause').click(function () {
        $(this).attr('disabled', 'disabled');
        $('#btnStart').removeAttr('disabled');
        $('#btnNextGen').removeAttr('disabled');
        game.pause();
    });

    $('#btnReset').click(function () {
        game.reset();
    });

    $('#btnNextGen').click(function () {
        game.calculateNextGen();
        game.switchToNextGen();
    });

    $('#btnInvert').click(function () {
        game.invertPlayground();
    });

    $('#playground').delegate('td', 'click', function () {
        var colIdx = $(this).index();
        var rowIdx = $(this).parent().index();
        game.cellClicked(rowIdx, colIdx);
    });
});


/*
Game of Life
live cell
    0 or 1 live neighbours:
        -> dead cell
    2 or 3 live neighbours:
        -> (stay alive)
    4 or more live neighbours:
        -> dead cell
dead cell
    3 live neighbours:
        -> live cell
*/

var GameOfLife = (function () {

    var rowNum;
    var colNum;
    var matrix;
    var currGen;
    var nextGen;
    var timer;
    
    function gameOfLife(rownum, colnum) {
        rowNum = rownum;
        colNum = colnum;
        matrix = new Array(1);
        currGen = 'init val currGen';
        nextGen = 'init val nextGen';
    }
    
    gameOfLife.prototype.initPlayground = function () {
        var pg = $('#playground');
        for (var row = 0; row < rowNum; row++) {
            var markup = "";
            for (var col = 0; col < colNum; col++) {
                markup += "<td></td>";
            }
            pg.append('<tr>' + markup + '</tr>');
        }
        
        currGen = 0;
        nextGen = 1;
        matrix = new Array(2);
        matrix[currGen] = initMatrix();
        matrix[nextGen] = initMatrix();
    };

    gameOfLife.prototype.start = function () {
        var that = this;
        timer = setInterval(function() {
            that.calculateNextGen();
            that.switchToNextGen();
        }, 100);
    };

    var initMatrix = function() {
        var matrix = new Array(rowNum);
        for (var rowIdx = 0; rowIdx < rowNum; rowIdx++) {
            matrix[rowIdx] = new Array(colNum);
        }
        return matrix;
    };

    gameOfLife.prototype.cellClicked = function (rowIdx, colIdx) {
        toggleCell(rowIdx, colIdx);
    };

    var toggleCell = function (rowIdx, colIdx) {
        if (isAlive(rowIdx, colIdx))
            letDie(rowIdx, colIdx);
        else
            letLive(rowIdx, colIdx);
    };

    var isAlive = function (rowIdx, colIdx) {
        if (rowIdx < 0 || rowIdx >= rowNum)
            return false;
        if (colIdx < 0 || colIdx >= colNum)
            return false;
        return matrix[currGen][rowIdx][colIdx] === true;
    };

    var letDie = function (rowIdx, colIdx) {
        matrix[currGen][rowIdx][colIdx] = false;
        darkenCell(rowIdx, colIdx);
    };

    var letLive = function (rowIdx, colIdx) {
        matrix[currGen][rowIdx][colIdx] = true;
        lightCell(rowIdx, colIdx);
    };

    var letDieNextGen = function (rowIdx, colIdx) {
        matrix[nextGen][rowIdx][colIdx] = false;
    };

    var letLiveNextGen = function (rowIdx, colIdx) {
        matrix[nextGen][rowIdx][colIdx] = true;
    };

    var invert = function (rowIdx, colIdx) {
        if (matrix[currGen][rowIdx][colIdx]) {
            darkenCell(rowIdx, colIdx);
        } else {
            lightCell(rowIdx, colIdx);
        }
    };

    var lightCell = function(rowIdx, colIdx) {
        $($('#playground').children()[0].children[rowIdx].children[colIdx]).addClass('alive');
    };

    var darkenCell = function(rowIdx, colIdx) {
        $($('#playground').children()[0].children[rowIdx].children[colIdx]).removeClass('alive');
    };
    
    gameOfLife.prototype.calculateNextGen = function () {
        for (var row = 0; row < rowNum; row++) {
            for (var col = 0; col < colNum; col++) {
                var livingNbCnt = getLivingNeighbourCount(row, col);
                var willBeAlive;
                var itIsAlive = isAlive(row, col);
                if (itIsAlive) {
                    willBeAlive = getWillBeAliveForLivingCell(livingNbCnt);
                } else {
                    willBeAlive = getWillBeAliveForDeadCell(livingNbCnt);
                }
                setAliveStateNextGen(row, col, willBeAlive);
            }
        }
    };

    gameOfLife.prototype.switchToNextGen = function() {
        currGen = 1 - currGen;
        nextGen = 1 - nextGen;
        updateDisplay();
    };

    var updateDisplay = function() {
        for (var rowIdx = 0; rowIdx < rowNum; rowIdx++) {
            for (var colIdx = 0; colIdx < colNum; colIdx++) {
                if (matrix[currGen][rowIdx][colIdx] === true) {
                    lightCell(rowIdx, colIdx);
                } else {
                    darkenCell(rowIdx, colIdx);
                }
            }
        }
    };

    gameOfLife.prototype.resetPlayground = function() {
        for (var rowIdx = 0; rowIdx < rowNum; rowIdx++) {
            for (var colIdx = 0; colIdx < colNum; colIdx++) {
                matrix[currGen][rowIdx][colIdx] = false;
                matrix[nextGen][rowIdx][colIdx] = false;
                letDie(rowIdx, colIdx);
            }
        }
    };
    
    gameOfLife.prototype.fillupPlayground = function () {
        var pg = $('#playground').children()[0];
        for (var rowIdx = 0; rowIdx < rowNum; rowIdx++) {
            var row = pg.children[rowIdx];
            for (var colIdx = 0; colIdx < colNum; colIdx++) {
                letLive(rowIdx, colIdx);
            }
        }
    };
    
    gameOfLife.prototype.invertPlayground = function () {
        var pg = $('#playground').children()[0];
        for (var rowIdx = 0; rowIdx < rowNum; rowIdx++) {
            var row = pg.children[rowIdx];
            for (var colIdx = 0; colIdx < colNum; colIdx++) {
                invert(rowIdx, colIdx);
            }
        }
    };

    var setAliveStateNextGen = function (row, col, shallBeAlive) {
        if (shallBeAlive) {
            letLiveNextGen(row, col);
        }
        else {
            letDieNextGen(row, col);
        }
    };

    var getWillBeAliveForLivingCell = function(livingNbCnt) {
        return livingNbCnt === 2 || livingNbCnt == 3;
    };

    var getWillBeAliveForDeadCell = function(livingNbCnt) {
        return livingNbCnt === 3;
    };

    var getLivingNeighbourCount = function(row, col) {
        var cnt = 0;
        for (var rowOff = -1; rowOff <= 1; rowOff++) {
            for (var colOff = -1; colOff <= 1; colOff++) {
                if (rowOff !== 0 || colOff !== 0) {
                    if (isAlive(row + rowOff, col + colOff)) {
                        cnt++;
                    }
                }
            }
        }
        return cnt;
    };
    
    gameOfLife.prototype.pause = function() {
        clearInterval(timer);
    };

    gameOfLife.prototype.reset = function () {
        this.resetPlayground();
    };

    return gameOfLife;
    
})();

