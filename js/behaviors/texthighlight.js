;(function ( $, window, document, undefined ) {
    $.behaviorMiner.behaviors.texthighlight = {
        load : function (options) {
            this.options = options;
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