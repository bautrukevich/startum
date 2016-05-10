// # iCHECK

// # RADIO BUTTON

var RadioBlock = (function(){

	// Private vars
    var prefix = 'js-',
        blockName = 'radio',
        block = $('.' + prefix + blockName),
        isExists = length,
        debug = false;

	return {

		// Init module
		init: function(){

            var instance = this;

            instance.debug('radio init');
			if (block.length !== 0) {
                this.load();
                instance.debug('radio init');
            }
		},

        // Load module
        load: function () {

            var instance = this;

            instance.debug('radio load');
            block.iCheck({
                radioClass: 'radio radio_color_primary',
                checkedClass: 'radio_checked',
                checkedRadioClass: 'radio_checked',
                disabledRadioClass: 'radio_disabled',
            });
        },

        debug: function (message) {
            if (debug) {
                console.log(message);
            }
        }

	}

})();

RadioBlock.init();
