;(function ( $, window, document, undefined ) {
	$.behaviorMiner.connectors.ga = {
		init : function()  {
			$(document).on("log_user_behavior", function(e,data){
				_gaq.push([
					'_trackEvent',
					data.type,
					data.url,
					JSON.stringify(data)
				]);
			});
		}
	};
})( jQuery, window, document );