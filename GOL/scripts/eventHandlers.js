require(['jquery', 'gol'], function ($, GameOfLife) {
    $(document).ready(function () {
        var game = new GameOfLife(50, 70);
        $(game).bind('started', function () {
            $('#btnStart').attr('disabled', 'disabled');
            $('#btnResume').attr('disabled', 'disabled');
            $('#btnPause').removeAttr('disabled');
            $('#btnNextGen').attr('disabled', 'disabled');
        });
        $(game).bind('paused', function () {
            $('#btnStart').removeAttr('disabled');
            $('#btnResume').removeAttr('disabled');
            $('#btnNextGen').removeAttr('disabled');
            $('#btnPause').attr('disabled', 'disabled');
        });
        $(game).bind('gameOver', function (event, generation) {
            $('#btnStart').removeAttr('disabled');
            $('#btnResume').attr('disabled');
            $('#btnPause').attr('disabled', 'disabled');
            $('#btnNextGen').removeAttr('disabled');

            (function (headerText, message) {
                $('#toast .heading').text(headerText);
                $('#toast .detail').html(message);
                $('#toast').css('visibility', 'visible').css('opacity', '0.6');
                setTimeout(function () {
                    $('#toast').css('opacity', '0');
                    setTimeout(function () {
                        $('#toast').css('visibility', 'hidden');
                    }, 500);
                }, 3000);
            })('Game Over', 'There are no more living cells.<br/>Your game survived for ' + generation + ' generations.');
        });
        $(game).bind('generationChanged', function (event, generation) {
            $('#generationInfo').text("Generation #" + generation);
        });
        $(game).bind('statusChanged', function () {
            $('#status').text('The game is ' + game.status + '.');
        });

        game.initPlayground();

        $('#btnStart').click(function () {
            game.start();
        });

        $('#btnResume').click(function () {
            game.resume();
        });

        $('#btnPause').click(function () {
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

        $('#btnTogglePopulation').click(function () {
            $('#populationFlyout').slideToggle();
        });

        $('#btnLoadPopulation').click(function () {
            var population = $('#populationList');

            game.loadPopulation(population.val());
        });

        $('#playground').delegate('td', 'click', function () {
            var colIdx = $(this).index();
            var rowIdx = $(this).parent().index();
            game.cellClicked(rowIdx, colIdx);
        });
    });

    $(document).mouseup(function (e) {
        var flyout = $('#populationFlyout');
        var toggle = $('#btnTogglePopulation');

        if (!flyout.is(e.target) && flyout.has(e.target).length === 0) {
            flyout.slideUp();
        }
    });
});