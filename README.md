wordevents
===========

![Screenshot](http://github.com/abidibo/wordevents/raw/master/logo.jpg)

wordevents is a class that let's you execute functions when the defined words are typed on the keyboard. Instead of listening to single chars, wordevents can listen to words (a word is considered to be a set of characters typed with a time interval minor than the digit interval option). Callbacks functions are given the list of events which formed the word, the context is set to be the target element.
It is possible to define which characters are allowed by providing a custion acceptedCode function through options, such function receives the event object and must return true if it accepted, false otherwise.
wordevents allows you to register not only words, but also regular expressions!

How to use
----------

wordevents requires 

- core/1.4.5 

**Include mootools framework and wordevents plugin**

	<script src="path-to-mootools-framework" type="text/javascript"></script>
	<script src="path-to-wordevents-js" type="text/javascript"></script>

**Example code**

Javascript:

    window.addEvent('domready', function() {

        var dosomething = function(evts) {
            console.log('you've typed the command "cmd"');
        }
        var kw = new wordevents({event_type: 'keydown', acceptedCode: function(evt) { return (evt.code > 64 && evt.code < 91) || false; // only [a-z] }});
        kw.listen(['lol', /^7[a-z]*/], [function(evts) { alert('lol'); }, searchme]);
        kw.activate();
    }

For more demos please visit the wordevents demo page at http://www.abidibo.net/projects/js/wordevents/demo

Links
-----------------

The project page: http://www.abidibo.net/projects/js/wordevents   
The documentation page: http://www.abidibo.net/projects/js/wordevents/doc   
The demo page: http://www.abidibo.net/projects/js/wordevents/demo   

Please report bugs, errors and advices in the github project page: http://github.com/abidibo/wordevents
