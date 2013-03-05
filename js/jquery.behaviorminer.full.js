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

})( jQuery, window, document );;(function ( $, window, document, undefined ) {
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
})( jQuery, window, document );;(function ( $, window, document, undefined ) {
	$.behaviorMiner.behaviors.longclick = {
		load : function()  {
			var pressTimer,
            self = this;

            $(document).on("mouseup.behaviorMiner", "*",function(e){
                clearTimeout(pressTimer);
            }).on("mousedown.behaviorMiner", "*", function(e){
              console.log(e)
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
})( jQuery, window, document );;(function ( $, window, document, undefined ) {
	$.behaviorMiner.behaviors.multipleclick = {
		load : function()  {
            var self = this;
            $(document).on("click", "*", function(event){
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
})( jQuery, window, document );;(function ( $, window, document, undefined ) {
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
})( jQuery, window, document );;(function ( $, window, document, undefined ) {
    $.behaviorMiner.behaviors.texthighlight = {
        load : function () {
            $(document).on("mouseup.behaviorMiner", "*", function(){
                var html = '',
                    parentEl;
                if (typeof window.getSelection !== "undefined") {
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        var container = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        html = container.innerHTML;
                    }
                } else if (typeof document.selection !== "undefined") {
                    if (document.selection.type === "Text") {
                        html = document.selection.createRange().htmlText;
                    }
                }
                if(html){
                    if (document.selection)
                        parentEl =  document.selection.createRange().parentElement();
                    else
                    {
                        var selection = window.getSelection();
                        if (selection.rangeCount > 0)
                            parentEl =  selection.getRangeAt(0).startContainer.parentNode;
                    }
                    var $parentEl = $(parentEl),
                        data = {
                        type : "text_highlight",
                        text :  html,
                        parent : {
                            class   : $parentEl.attr("class"),
                            id      : $parentEl.attr("id"),
                            tagname : (parentEl) ?  parentEl.nodeName.toLowerCase() : ""
                        },
                        behavior : "User highlighted some text"
                        };
                    $(document).trigger("behaviorMiner_data", [data]);
                }
            });
        }
    };
})( jQuery, window, document );