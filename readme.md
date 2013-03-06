## Agitated User Behavior data miner (jQuery Plugin)

This plugin tracks behaviors that are considered agitated. The plugin emit events that can be logged in your system, or on Google Analytics (GA plugin  included).

You can also act on those behaviors by, for example, showing popovers to better guide your user. 

## Behaviors tracked

All behaviors sensibilities are modifiable.

+ Hitting multiple time rapidly a keyboard key
+ Maintaining multiple keyboard key at the same time
+ Clicking multiple time a dom element (generally buttons)
+ Maintaining a long click a dom element (generally buttons)
+ Highlighting text

## Installation

Include the plugin into your html, if you want to connect with Google Analytics you must also include the GA file like below.

	<script src="js/dist/jquery.behaviorminer.min.js" type="text/javascript"></script>
	<!-- below is the google analitycs plugin -->
	<script src="js/connectors/ga.js" type="text/javascript"></script>

After you can start the plugin on the document:

	<script>$(document).behaviorMiner();</script>


## Options
The are multiple options included, most importantly you can change the sensibility of the tracked behaviors to better fit your situation. The options presented below are default to the application.

	<script>
		{
            connector: false, // change to plugin name (example: "ga")
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

Depending of what type of events you are logging the data will minimally change, for keyboard events the plugin return the keys, but for clicks it return the element clicked.

### All the current event type names

+ multiple_keys_hold
+ same_key_hit_multiple
+ text_highlight
+ multiple_clicks
+ long_clicks

## Connecting to Google analytics and others

behaviorMiner has a simple plugin architecture, the GA plugin already use it, to enable GA or create your own connector here what you can do.

In the case of google analytics only enable the data connector and include the javascript file 

	<script>$(document).behaviorMiner({dataConnector:"ga"});</script>

If you want to create your own connector please base yourself on the plugin provided (jquery.behaviorMiner.ga.js). Change for your own connector name, when the plugin is intanciated the *init()* function will be automatically loaded.

The options are automatically passed to the connectors, you can retrive them using *this.options*.

## Adding behaviors

To add a behavior, first add your own js file into /behaviors, follow this namespace convention

	$.behaviorMiner.behaviors.name

After that, when launching the plugin add the behavior name to the track option

	<script>$(document).behaviorMiner({track:{name:true}});</script>

When the script init your behavior it will call the *load()* method.  The options are automatically passed to the behaviors, you can retrive them using *this.options*.

When you are done with your behavior you can send back the data using 

	$(document).trigger("behaviorMiner_data", [data]);

### Adding your new behavior to the minified file

You can always simply add your behavior file below the plugin in the html document like this:

	<script src="js/jquery.behaviorminer.min.js" type="text/javascript" charset="utf-8"></script>
	<!-- below is the google analitycs plugin -->
	<script src="js/behavior/name.js" type="text/javascript" charset="utf-8"></script>

Or you can compile your behavior in the minified script using grunt, first *load npm install* to install dependencies, then just do grunt and it's all automatic. You must comply with jslint before a compilation is completed. If that sound complicated please check gruntjs, it should be simple to pick it up from there.

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