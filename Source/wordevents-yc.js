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
"use strict";var wordevents=new Class({Implements:[Options],options:{target:document,digit_interval:500,event_type:"keyup",acceptedCode:function(a){return((a>47&&a<58)||(a>64&&a<91))||false}},initialize:function(a){this.setOptions(a);this.target=$(this.options.target);this.dictionary={}},listen:function(d,c){d=typeof d==="string"?[d]:d;c=typeof c==="function"?[c]:c;for(var b=0,a=d.length;b<a;b++){this.dictionary[d[b]]=c[b]}},unlisten:function(c){c=typeof c==="string"?[c]:c;for(var b=0,a=c.length;b<a;b++){delete this.dictionary[c[b]]}},activate:function(){var a=this;var e="";var b=[];var d=null;var c={checkTime:function(){var g=new Date().getTime();var f=(d===null||g-d<=a.options.digit_interval)||false;d=g;return f},append:function(f){if(a.options.acceptedCode(f.code)){e+=f.key;b.push(f)}},read:function(){return e},events:function(){return b},reset:function(){e="";b=[]}};this.target.addEvent(this.options.event_type,this.elistener=function(f){a.eventListener(f,c)})},deactivate:function(){this.target.removeEvent(this.options.event_type,this.elistener)},eventListener:function(a,b){if(b.checkTime()){clearTimeout(this.to);b.append(a)}else{b.reset();b.append(a)}this.to=setTimeout(this.dispatch.bind(this,b),this.options.digit_interval)},dispatch:function(a){if(typeof this.dictionary[a.read()]!=="undefined"){this.dictionary[a.read()].call(this.target,a.events())}}});;
