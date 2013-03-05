;(function ( $, window, document, undefined ) {
	$.behaviorMiner.behaviors.repeatkey = {
        load : function () {
            var self = this,
                samekey = 0,
                sametimes = 0,
                timestamp = 0;

            function logit(key) {
                var data = {
                    type : "same_key_hit_multiple",
                    key : key,
                    behavior : "User is repeadly hitting this key rapidly"
                };
                $(document).trigger("behaviorMiner_data", [data]);
            }

            $(document).on("keyup.behaviorMiner", function(e){
                window.setTimeout(function(){
                    var currentTime = new Date().getTime();
                    if ((currentTime - timestamp)<= self.options.sensibility.repeatkeytime) {
                        if(samekey === e.which){
                            sametimes = sametimes + 1;
                            if(sametimes === self.options.sensibility.repeatkey){
                                logit(e.which);
                                sametimes= 0;
                            }
                        }else{
                            sametimes = 0;
                        }
                    }
                    samekey =  e.which;
                    timestamp = currentTime;
                },100);
            });
        }
	};
})( jQuery, window, document );