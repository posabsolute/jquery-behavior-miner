;(function ( $, window, document, undefined ) {
	$.behaviorMiner.behaviors.longclick = {
		load : function(options)  {
			var pressTimer,
            self = this;
            this.options = options;

            $(document).on("mouseup.behaviorMiner", "*",function(e){
                e.stopPropagation();
                clearTimeout(pressTimer);
            }).on("mousedown.behaviorMiner", "*", function(e){
              e.stopPropagation();
              var el = this;
              pressTimer = window.setTimeout(function() {
                self.logData(el);
              },self.options.sensibility.longclick);

            });
		},
		logData : function(el){
			var $el = $(el),
            data = {
                type : "long_click",
                elem : {
                    tagname : el.nodeName.toLowerCase(),
                    text    : $el.text(),
                    class   : $el.attr("class"),
                    id      : $el.attr("id")
                },
                behavior : "User is maintaining the mouse for a long time"
            };
            $(document).trigger("behaviorMiner_data", [data]);
		}
	};
})( jQuery, window, document );