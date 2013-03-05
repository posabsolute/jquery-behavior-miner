;(function ( $, window, document, undefined ) {
	$.behaviorMiner.behaviors.multipleclick = {
		load : function()  {
            var self = this;
            $(document).on("click", "*", function(event){
                event.stopPropagation();
                var elem = this,
                    $elem = jQuery(elem),
                    clicks = $elem.data('clicks') || 0,
                    start = $elem.data('startTimeTC') || 0;

                if ((new Date().getTime() - start)>= self.options.sensibility.multipleclicktime){
                    clicks = 0;
                }
                if(clicks === 0) {
                    start = new Date().getTime();
                }
                clicks = clicks +1;
                $elem.data('clicks', clicks +1);

                if ( clicks === self.options.sensibility.multipleclick ) {
                    $elem.data('clicks', 0);
                    self.logClicks(this);
                }
                $elem.data('clicks', clicks);
                $elem.data('startTimeTC', start);
            });
		},
		logClicks: function(el) {
            var $el = $(el),
                data = {
                type : "multiple_clicks",
                elem : {
                    tagname : el.nodeName.toLowerCase(),
                    text    : $el.text(),
                    class   : $el.attr("class"),
                    id      : $el.attr("id")
                },
                behavior : "User seems to be clicking franctically on this element"
            };
            $(document).trigger("behaviorMiner_data", [data]);
        }
	};
})( jQuery, window, document );