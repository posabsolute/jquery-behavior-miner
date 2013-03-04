;(function ( $, window, document, undefined ) {
	$.logBehavior.ga = {
		init : function(options)  {
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