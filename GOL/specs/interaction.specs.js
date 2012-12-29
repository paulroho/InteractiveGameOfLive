// TODO: use page object
describe('On a fresh page', function () {
    beforeEach(function () {
        loadFixtures('\index.html');
    });

    it('the button "Start" should be enabled', function () {
        var theButton = $('#btnStart');
        expect(theButton).toBeEnabled();
    });

    it('the button "Pause" should be disabled', function () {
        var theButton = $('#btnPause');
        expect(theButton).toBeDisabled();
    });
});