/*
 *  Project: Agitated User behavior logger
 *  Description: Help you track where your users becomes agitated in your web applications
 *  Author: Cedric Dugas, http://www.position-relative.net
 *  License: MIT
 */
;(function ( $, window, document, undefined ) {

    var pluginName = "logBehavior",
        defaults = {
            logger: "test",
            track : {
                mouseMovement:true,
                keyboard:true,
                click:true,
                textHightlight:true
            },
            sensibility : {
                clicks : 3, // number of click before logging
                key : 3,  // number of same key hit before logging
                multiplePress : 4, // number of click pressed at the same time before logging,
                keyTime : 1000, // time elapsed for hitting the same key
                clickTime : 1000 // time elapsed for hitting for clicking the same dom element
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
            var trackOptions = this.options.track;
            // Load dataConnector plugin and pass options to init
            if($.logBehavior[this.options.logger] && $.logBehavior[this.options.logger].init){
                $.logBehavior[this.options.logger].init(this.options);
            }
            if(trackOptions.mouseMovement)  this.logMouseMovement();
            if(trackOptions.keyboard)       this.logKeyboard();
            if(trackOptions.click)          this.createClickHandler();
            if(trackOptions.textHightlight) this.logTextHighlight();
        },
        disable : function() {
            $(document).off("mouseup.logbehavior");
            $(document).off("keydown.logbehavior");
            $(document).off("keyup.logbehavior");
            $(document).off("log_multiple_click");
        },
        enable : function () {
            this.disable();
            this.init();
        },
        logMouseMovement : function()  {
            // need to be done
        },
        logTextHighlight : function() {
            $(document).on("mouseup.logbehavior", function(){
                var html = '',
                    parentEl;
                if (typeof window.getSelection != "undefined") {
                    var sel = window.getSelection();
                    if (sel.rangeCount) {
                        var container = document.createElement("div");
                        for (var i = 0, len = sel.rangeCount; i < len; ++i) {
                            container.appendChild(sel.getRangeAt(i).cloneContents());
                        }
                        html = container.innerHTML;
                    }
                } else if (typeof document.selection != "undefined") {
                    if (document.selection.type == "Text") {
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
                        timestamp : new Date().getTime(),
                        url : window.location.href,
                        behavior : "User highlighted some text"
                        };
                    $(document).trigger("log_user_behavior", [data]);
                }
            });
        },
        logKeyboard : function() {
            this.logMultiplePress();
            this.logSameKey();
        },
        logSameKey : function () {
            var self = this,
                samekey = 0,
                sametimes = 0,
                timestamp = 0;
            $(document).on("keyup.logbehavior", function(e){
                window.setTimeout(function(){
                    var currentTime = new Date().getTime();
                    if ((currentTime - timestamp)<= self.options.sensibility.keyTime) {
                        if(samekey == e.which){
                            console.log(sametimes);
                            sametimes = sametimes + 1;
                            if(sametimes == self.options.sensibility.key){
                                logit(e.which, currentTime);
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
            function logit(key, time) {
                var data = {
                    type : "same_key_hit_multiple",
                    key : key,
                    timestamp : time,
                    url : window.location.href,
                    behavior : "User is repeadly hitting this key rapidly"
                };
                $(document).trigger("log_user_behavior", [data]);
            }
        },
        logMultiplePress : function() {
            var self = this,
                multiplekeys = [];
            $(document).on("keydown.logbehavior", function(e){
                multiplekeys[e.which] = true;
                //if(multiplekeys.filter(String).length >= self.options.sensibility.multiplePress){
                if($.grep(multiplekeys,function(n){return(n);}).length >= self.options.sensibility.multiplePress){
                    var data = {
                        type : "multiple_keys_hold",
                        keys : multiplekeys,
                        timestamp : new Date().getTime(),
                        url : window.location.href,
                        behavior : "User is hitting multiple keyboard keys at once"
                    };
                    $(document).trigger("log_user_behavior", [data]);
                }
            });
            $(document).on("keyup.logbehavior", function (e) {
                delete multiplekeys[e.which];
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
                timestamp : new Date().getTime(),
                url : window.location.href,
                behavior : "User seems to be clicking franctically on this element"
            };
            $(document).trigger("log_user_behavior", [data]);
        },
        createClickHandler : function () {
            var self = this;
            $(document).on("click", "*", function(event){
                event.stopPropagation();
                var elem = this,
                    $elem = jQuery(elem),
                    clicks = $elem.data('clicks') || 0,
                    start = $elem.data('startTimeTC') || 0;

                if ((new Date().getTime() - start)>= self.options.sensibility.clickTime){
                    clicks = 0;
                }
                if(clicks === 0) {
                    start = new Date().getTime();
                }
                clicks = clicks +1;
                $elem.data('clicks', clicks +1);

                if ( clicks === self.options.sensibility.clicks ) {
                    $elem.data('clicks', 0);
                    self.logClicks(this);
                }
                $elem.data('clicks', clicks);
                $elem.data('startTimeTC', start);
            });
        }
    };

    $[pluginName] = {};
    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, "plugin_" + pluginName)) {
                $.data(this, "plugin_" + pluginName, new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );