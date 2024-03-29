﻿define('gol', ['jquery'], function ($) {
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
        var generationCount;
        var that;
        this.status;

        function gameOfLife(rownum, colnum) {
            that = this;
            rowNum = rownum;
            colNum = colnum;
            matrix = new Array(1);
            currGen = 'init val currGen';
            nextGen = 'init val nextGen';
            this.status = 'reset';
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
            resetGenerationCount();
            setStatus('reset');
        };

        var resetGenerationCount = function () {
            generationCount = 0;
            $(that).trigger('generationChanged', generationCount);
        };

        var incrementGenerationCount = function () {
            generationCount++;
            $(that).trigger('generationChanged', generationCount);
        };

        gameOfLife.prototype.start = function () {
            resetGenerationCount();
            this.resume();
        };

        gameOfLife.prototype.resume = function () {
            timer = setInterval(playNextGen, 100);
            setStatus('running');
            $(this).trigger('started');
        };

        var playNextGen = function () {
            var someAreLiving = that.calculateNextGen();
            that.switchToNextGen();
            if (!someAreLiving)
                gameOver();
        };

        var setStatus = function (newStatus) {
            that.status = newStatus;
            $(that).trigger('statusChanged');
        };

        var initMatrix = function () {
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

        var lightCell = function (rowIdx, colIdx) {
            $($('#playground').children()[0].children[rowIdx].children[colIdx]).addClass('alive');
        };

        var darkenCell = function (rowIdx, colIdx) {
            $($('#playground').children()[0].children[rowIdx].children[colIdx]).removeClass('alive');
        };

        gameOfLife.prototype.calculateNextGen = function () {
            var someAreLiving = false;
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
                    if (willBeAlive)
                        someAreLiving = true;
                }
            }
            return someAreLiving;
        };

        gameOfLife.prototype.switchToNextGen = function () {
            currGen = 1 - currGen;
            nextGen = 1 - nextGen;
            incrementGenerationCount();
            updateDisplay();
        };

        var updateDisplay = function () {
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

        gameOfLife.prototype.resetPlayground = function () {
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

        var getWillBeAliveForLivingCell = function (livingNbCnt) {
            return livingNbCnt === 2 || livingNbCnt == 3;
        };

        var getWillBeAliveForDeadCell = function (livingNbCnt) {
            return livingNbCnt === 3;
        };

        var getLivingNeighbourCount = function (row, col) {
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

        gameOfLife.prototype.pause = function () {
            clearInterval(timer);
            setStatus('paused');
            $(this).trigger('paused');
        };

        gameOfLife.prototype.reset = function () {
            this.resetPlayground();
            resetGenerationCount();
            setStatus('reset');
        };

        gameOver = function () {
            clearInterval(timer);
            setStatus('over');
            $(that).trigger('gameOver', generationCount);
        };

        gameOfLife.prototype.loadPopulation = function (populationName) {
            var data = getPopulationData(populationName);

            this.reset();
            loadPopulationData(data);
        };

        getPopulationData = function (populationName) {
            switch (populationName) {
                case 'resolvingPhils':
                    return [
                        [10, [20]],
                        [11, [20]],
                        [12, [20]],
                        [14, [16, 17, 18, 20, 22, 23, 24]],
                        [16, [20]],
                        [17, [20]],
                        [18, [20]]
                    ];
                case 'zappelPhilipp':
                    return [
                        [10, [20, 21, 22]]
                    ];
                case 'moverRightDown':
                    return [
                        [10, [21]],
                        [11, [22]],
                        [12, [20, 21, 22]],
                    ];
                case 'lineOf6':
                    return [
                        [10, [20, 21, 22, 23, 24, 25]]
                    ];
                case 'oval':
                    return [
                        [10, [21, 22]],
                        [11, [20, 23]],
                        [12, [21, 22]]
                    ];
                case 'square':
                    return [
                        [10, [20, 21]],
                        [11, [20, 21]]
                    ];
                default:
                    return [];
            }
        };

        loadPopulationData = function (populationData) {
            for (var r = 0; r < populationData.length; r++) {
                var rowIdx = populationData[r][0];
                var colIdxs = populationData[r][1];
                for (var c = 0; c < colIdxs.length; c++) {
                    var colIdx = colIdxs[c];
                    letLive(rowIdx, colIdx);
                }
            }
        };

        return gameOfLife;

    })();

    return GameOfLife;
});