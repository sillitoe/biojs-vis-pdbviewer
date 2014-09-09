'use strict';

/*
 * TODO: currently these tests aren't working:
 *  - jQuery requires a DOM (do we need jQuery?)
 *  - jsdom() isn't playing nicely
 *  - haven't had time to look into phantom
 */

var jsdom  = require('jsdom');
var window = jsdom.jsdom().createWindow();
var $      = require('jquery')(window);

var assert = require("chai").assert;
var pdbviewer = require("../");

// you can find more docu about mocha here
// https://visionmedia.github.io/mocha/

describe('pdbviewer', function(){
  // do any init stuff here
  beforeEach(function(){
	  //manager = pdbviewer;
  });
  describe('new', function(){
    it('should be able to create a new instance', function(){
    	
    	var manager = pdbviewer;
  		assert.isObject( manager, "new protein3d viewer instance" );

  		var jsmol1 = new manager.jsmol('testDiv');
  		assert.isObject( jsmol1, "new jsmol instance" );
    });
  });
});
