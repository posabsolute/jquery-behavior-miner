;(function ( $, window, document, undefined ) {
	$.behaviorMiner.connectors.ga = {
		init : function()  {
			$(document).on("log_user_behavior", function(e,data){
				var content = (window.JSON) ? JSON.stringify(data) : "";
				_gaq.push([
					'_trackEvent',
					data.type,
					data.url,
					content
				]);
			});
		}
	};
})( jQuery, window, document );