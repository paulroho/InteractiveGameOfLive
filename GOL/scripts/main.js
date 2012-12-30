(function () {
    require.config({
        paths: {
            jquery: 'libs/jQuery/jquery-1.8.3.min'
        }
    });

    require(['gol', 'eventHandlers'], function () {
        console.log('all scripts loaded');
    });
})();