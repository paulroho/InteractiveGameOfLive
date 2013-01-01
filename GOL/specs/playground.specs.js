require(['playground'], function (Playground) {
    describe('Playground', function () {
        it('should exist after creation', function () {
            console.log('* running playground test');
            var playground = new Playground();

            expect(playground).not.toEqual(null);
        });
    });
});