/*
---
description: wordevents is a class that let's you execute functions when the defined words are typed on the keyboard. Instead of listening to single chars, wordevents can listen to words (a word is considered to be a set of characters typed with a time interval minor than the digit_interval option). Callbacks functions are given the list of events which formed the word, the context is set to be the target element.

license: MIT-style

authors:
- abidibo <dev@abidibo.net>

requires:
- core/1.4.5

provides:
- wordevents

...

For documentation, demo and download link please visit http://www.abidibo.net/projects/js/wordevents

*/
"use strict";
var wordevents = new Class({
  Implements: [Options],
  options: {
    target: document,
    digit_interval: 500,
    event_type: 'keyup',
    acceptedCode: function(code) {
      return ((code > 47 && code < 58) || (code > 64 && code < 91)) || false;
    }
  },
  /**
   * @summary Word events manager.
   * @classdesc <p>The class allows to listen to typed words events.</p>
   *            <p>A word is considered a set of characters typed with a time interval between each other defined thorugh options.</p>
   *            <p>It is possible to set a dictionary of words an callback functions to call when such word is typed</p>
   * @constructs wordevents
   * @param {Object} options the class options object:
   * @param {String|Element} [options.target=document] the element to which attach the keyboard event
   * @param {Integer} [options.digit_interval=500] time interval (ms) used to consider characters belonging to the same word
   * @param {String} [options.event_type='keyup'] the keyboard event type
   * @param {Function} [options.acceptedCode] the function used to check if a typed char can be accepted and so can form part of the word or not, by default all alpha-numerical characters are accepted [a-z0-9]. The function is invoked passing the parameter code which is the keycode of the key pressed, and must return true if it is accepted, false otherwise.
   * @example
   *  var we = new wordevents({digit_interval: 400, acceptedCode: function(code) {return (code>47 && code<58) : false; // only numbers}});
   */
  initialize: function(options) {
    this.setOptions(options);
    this.target = $(this.options.target);
    this.dictionary = {};
  },
  /**
   * @summary Adds the given words and callbacks to the dictionary, parameters can be a pair of word and callback or two arrays of words and callbacks (tied through indexes)
   * @param {String|Array} words to add to the dictionary
   * @param {Function|Array} callbacks to call when the word event is fired. The callbacks are binded to the target element and are passed the array of event objects which generated the word.
   * @return {void}
   */
  listen: function(words, callbacks) {
    words = typeof words === 'string' ? [words] : words;
    callbacks = typeof callbacks === 'function' ? [callbacks] : callbacks;

    for(var i = 0, l = words.length; i < l; i++) {
      this.dictionary[words[i]] = callbacks[i];
    }
  },
  /**
   * @summary Removes the the given words from the dictionary. Parameter can be a single word or an array of words.
   * @param {String|Array} words to remove from dictionary
   * @return {void}
   */
  unlisten: function(words) {
    words = typeof words === 'string' ? [words] : words;
    for(var i = 0, l = words.length; i < l; i++) {
      delete this.dictionary[words[i]];
    }
  },
  /**
   * @summary Class activation, the class starts listening to typed words
   * @return {void}
   */
  activate: function() {
    var self = this;
    // closure to construct the word
    var word = '';
    var events = [];
    var last_time = null;
    var word_ctrl = {
      checkTime: function() {
        var time = new Date().getTime();
        var result = (last_time === null || time - last_time <= self.options.digit_interval) || false;
        last_time = time;
        return result;
      },
      append: function(evt) {
        if(self.options.acceptedCode(evt.code)) {
          word += evt.key;
          events.push(evt);
        }
      },
      read: function() {
        return word;
      },
      events: function() {
        return events;
      },
      reset: function() {
        word = '';
        events = [];
      }
    };
    this.target.addEvent(this.options.event_type, this.elistener = function(evt) { self.eventListener(evt, word_ctrl); });
  },
  /**
   * @summary Class deactivation, the class stops listening to typed words
   * @return {void}
   */
  deactivate: function() {
    this.target.removeEvent(this.options.event_type, this.elistener);
  },
  /**
   * @summary method called every time the event_type is fired
   * @description Sets a timeout to dispatch the word event, such timeout is cleared if the next character is typed before the end of digit_interval milliseconds.
   * @return {void}
   */
  eventListener: function(evt, word_ctrl) {
    if(word_ctrl.checkTime()) {
      clearTimeout(this.to);
      word_ctrl.append(evt);
    }
    else {
      word_ctrl.reset();
      word_ctrl.append(evt);
    }
    this.to = setTimeout(this.dispatch.bind(this, word_ctrl), this.options.digit_interval);
  },
  /**
   * @summary Executes the callback for the typed word if it is included in the dictionary
   * @param [Array] events the collection of events which generated the word
   * @return {void}
   */
  dispatch: function(word_ctrl) {
    if(typeof this.dictionary[word_ctrl.read()] !== 'undefined') {
      this.dictionary[word_ctrl.read()].call(this.target, word_ctrl.events());
    }
  }
})
