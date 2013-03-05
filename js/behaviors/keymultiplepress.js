;(function ( $, window, document, undefined ) {
	$.behaviorMiner.behaviors.keymultiplepress = {
        load : function() {
            var self = this,
                multiplekeys = [];
            $(document).on("keydown.logbehavior", function(e){
                multiplekeys[e.which] = true;
                //if(multiplekeys.filter(String).length >= self.options.sensibility.multiplePress){
                if($.grep(multiplekeys,function(n){return(n);}).length >= self.options.sensibility.keymultiplepress){
                    var data = {
                        type : "multiple_keys_hold",
                        keys : multiplekeys,
                        timestamp : new Date().getTime(),
                        url : window.location.href,
                        behavior : "User is hitting multiple keyboard keys at once"
                    };
                    $(document).trigger("behaviorMiner_data", [data]);
                }
            });
            $(document).on("keyup.logbehavior", function (e) {
                delete multiplekeys[e.which];
            });
        }
	};
})( jQuery, window, document );