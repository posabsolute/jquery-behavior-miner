## Agitated User Tracking Behavior jQuery Plugin

This plugin tracks behaviors that are considered agitated. The plugin emit events that can be logged in your system, or on Google Analytics (GA plugin  included).

You can also act on those behaviors by, for example, emittings popovers to better guide your user. 

## Behaviors tracked

All behaviors sensibilities are modifiable.

+ Hitting multiple time rapidly a keyboard key
+ Maintaining multiple keyboard key at the same time
+ Clicking multiple time a dom element (generally buttons)
+ Highlighting text

## Installation

Include the plugin into your website or code, if you want to connect with Google Analitics you must also include the GA file like below.

	<script src="js/jquery.logbehavior.js" type="text/javascript" charset="utf-8"></script>
	<!-- below is the google analitycs plugin -->
	<script src="js/jquery.logbehavior.ga.js" type="text/javascript" charset="utf-8"></script>

After you can simply start the plugin on the document :

	<script>$(document).logBehavior();</script>

## Options
The are multiple options included, most importantly you can change the sensibility of the tracked behavior to better fit your situation. The options presented below are default to the application.

	<script>
		{
            dataConnector: false, // change to plugin name (example: ga)
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
	</script>


## Emitted event

The plugin will emit a jquery event on the document that you can catch to act or save data.

$(document).on("log_user_behavior", function(e,data){
	console.log(data);
});

Example of the data returned:
	 {
	    keys : [multiplekeys],
	    timestamp : 234234234234, // javascript timestamp
	    url : "http://www.google.com/",
	    type : "multiple_keys_hold",
	    behavior : "User is hitting multiple keyboard keys at once"
	};

Depending of what type of events you log the data will change a bit, for keyboards event the plugin returns the keys, but for click events we return the element clicked.

### All the current event types name

+ multiple_keys_hold
+ same_key_hit_multiple
+ text_highlight
+ multiple_clicks


## Connecting to Google analitics and others

logBehavior has a simple plugin architecture, the GA plugin already use it, to enable GA or create your own connector here what you can do.

In the case of google analitycs the only things to do is enable the data connector and included the javascript file 

	<script>$(document).logBehavior({dataConnector:"ga"});</script>

If you want to create your own connector please base yourself on the plugin provided (jquery.logbehavior.ga.js). Change for your own connector name, when the plugin is intanciated the *init()* function will be automatically loaded.

## Contributors

Original idea by Jonathan LeBlanc (https://github.com/jcleblanc) 

## License (MIT)

Copyright 2013 Cedric Dugas
http://www.position-relative.net/

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.