beforeEach(function () {
    this.addMatchers({
        toBeEnabled: function () {
            console.log('toBeEnabled()');
            var element = this.actual;

            if (element.length === 0)
                return false;

            return !element.is(':disabled');
        }
    });
});