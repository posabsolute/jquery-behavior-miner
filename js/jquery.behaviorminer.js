/*
 *  Project: Agitated User behavior data miner
 *  Description: Help you track where your users becomes agitated in your web application
 *  Author: Cedric Dugas, http://www.position-relative.net
 *  License: MIT
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "behaviorMiner",
        defaults = {
            connector: false,
            track : {
                keymultiplepress:true,
                repeatkey:true,
                multipleclick:true,
                longclick:true,
                texthighlight:true
            },
            sensibility : {
                multipleclick : 3, // number of click before logging
                multipleclicktime : 1000, // time elapsed for hitting for clicking the same dom element
                repeatkey : 3,  // number of same key hit before logging
                repeatkeytime : 1000, // time elapsed for hitting the same key
                keymultiplepress : 4, // number of click pressed at the same time before logging
                longclick: 3000 // time elapsed before conseding a long click
            }
        };

    function Plugin( element, options ) {
        this.element = element;
        this.options = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    Plugin.prototype = {
        init: function() {
            var trackOptions = this.options.track,
                self = this;
            // Load dataConnector plugin and pass options to init
            if($.behaviorMiner.connectors[this.options.connector] && $.behaviorMiner.connectors[this.options.connector].init){
                $.behaviorMiner.connectors[this.options.connector].options = this.options;
                $.behaviorMiner.connectors[this.options.connector].init();
            }
            // load all behaviors
            $.each(trackOptions, function(behavior, state){
                if(state && $.behaviorMiner.behaviors[behavior] && $.behaviorMiner.behaviors[behavior].load)
                    $.behaviorMiner.behaviors[behavior].options = self.options;
                    $.behaviorMiner.behaviors[behavior].load();
            });
            // receive data from behaviors
            $(document).on("behaviorMiner_data", function(e,data){
                self.pushData(data);
            });
        },
        disable : function() {
            $(document).off("mouseup.behaviorMiner");
            $(document).off("mousedown.behaviorMiner");
            $(document).off("keydown.behaviorMiner");
            $(document).off("keyup.behaviorMiner");
            $(document).off("log_multiple_click");
        },
        enable : function () {
            this.disable();
            this.init();
        },
        pushData : function(custom){
            var defaults = {
                timestamp : new Date().getTime(),
                url : window.location.href
            };
            var data = $.extend({}, defaults, custom );
            $(document).trigger("log_user_behavior", [data]);
        }
    };

    $[pluginName] = {
        behaviors : {},
        connectors : {}
    };
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );