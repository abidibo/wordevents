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
"use strict";var wordevents=new Class({Implements:[Options],options:{target:document,digit_interval:500,event_type:"keyup",acceptedCode:function(a){var b=a.code;return((b>47&&b<58)||(b>64&&b<91))||false}},initialize:function(a){this.setOptions(a);this.target=$(this.options.target);this.dictionary={string:[],rexp:[]}},listen:function(d,c){d=d instanceof Array?d:[d];c=c instanceof Array?c:[c];for(var b=0,a=d.length;b<a;b++){if(d[b] instanceof RegExp){this.dictionary.rexp[d[b]]=c[b]}else{this.dictionary.string[d[b]]=c[b]}}},unlisten:function(c){c=c instanceof Array?c:[c];for(var b=0,a=c.length;b<a;b++){delete this.dictionary[c[b] instanceof RegExp?"rexp":"string"][c[b]]}},activate:function(){var a=this;var e="";var b=[];var d=null;var c={checkTime:function(){var g=new Date().getTime();var f=(d===null||g-d<=a.options.digit_interval)||false;d=g;return f},append:function(f){if(a.options.acceptedCode(f)){e+=f.key;b.push(f)}},read:function(){return e},events:function(){return b},reset:function(){e="";b=[]}};this.target.addEvent(this.options.event_type,this.elistener=function(f){a.eventListener(f,c)})},deactivate:function(){this.target.removeEvent(this.options.event_type,this.elistener)},eventListener:function(a,b){if(b.checkTime()){clearTimeout(this.to);b.append(a)}else{b.reset();b.append(a)}this.to=setTimeout(this.dispatch.bind(this,b),this.options.digit_interval)},dispatch:function(a){var b=this.find(a.read());if(b){b.call(this.target,a.events(),a.read())}},find:function(c){if(typeof this.dictionary.string[c]!=="undefined"){return this.dictionary.string[c]}for(var a in this.dictionary.rexp){if(this.dictionary.rexp.hasOwnProperty(a)){var b=new RegExp(a.substring(1,a.length-1));if(b.test(c)){return this.dictionary.rexp[a]}}}return null}});
