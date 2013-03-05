;(function ( $, window, document, undefined ) {
	$.behaviorMiner.connectors.test = {
		init : function()  {
			$(document).on("log_user_behavior", function(e,data){
				console.log(data);
			});
		}
	};
})( jQuery, window, document );