;(function ( $, window, document, undefined ) {
	$.logBehavior.test = {
		init : function(options)  {
			$(document).on("log_user_behavior", function(e,data){
				console.log(data);
			});
		}
	};
})( jQuery, window, document );