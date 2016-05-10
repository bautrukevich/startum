// # iCHECK

@@include('vendor/iCheck/icheck.min.js')

// # CHECKBOX

var CheckboxBlock = (function(){

	// Private vars
    var prefix = 'js-',
        blockName = 'checkbox',
        block = $('.' + prefix + blockName),
        isExists = block.length,
        debug = false;

	return {

        // Init module
		init: function(){

            var instance = this;

            instance.debug(blockName + ' init');
			if (isExists) {
                this.load();
            }
		},

        // Load module
        load: function () {

            var instance = this;

            instance.debug(blockName + ' load');

            block.iCheck({
                checkboxClass: 'checkbox checkbox_color_primary',
                checkedCheckboxClass: 'checkbox_checked',
                disabledCheckboxClass: 'checkbox_disabled',
            });

        },

        debug: function (message) {
            if (debug) {
                console.log(message);
            }
        }

	}

})();

CheckboxBlock.init();
