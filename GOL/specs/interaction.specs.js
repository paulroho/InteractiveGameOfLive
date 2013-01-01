require(['jquery'], function ($) {
    // TODO: use page object
    describe('On a fresh page', function () {
        beforeEach(function () {
            console.log('loading fixtures');
            loadFixtures('\index.html');
            console.log('loaded fixtures');
        });

        it('the button "Start" should be enabled', function () {
            console.log('* running test 1');
            var theButton = $('#btnStart');
            expect(theButton).toBeEnabled();
        });

        it('the button "Pause" should be disabled', function () {
            console.log('* running test 2');
            var theButton = $('#btnPause');
            expect(theButton).toBeDisabled();
        });
    });
});