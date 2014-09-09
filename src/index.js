var $ = require('jquery');

var pdbviewer = function(input) {
	var pdbviewer = this;
	var _pdbviewerCounter = 0;
	var STYLE_CARTOON = 'cartoon';
	
	pdbviewer.jsmol = function(input) {
		var self = this;
		
		self.opt = $.extend({}, {
			jsmolFolder:     undefined, // "external/jmol-14.2.4/jsmol",
			height:          undefined,
			width:           undefined,
			style:           STYLE_CARTOON,
			use:             "HTML5 JAVA",
			backgroundColor: undefined,
			viewControls:    true,
		}, input);
		
		self._id                 = pdbviewer._pdbviewerCounter++;
		self._jmolObject         = null;
		self._containerId        = self.opt.target;
		self._appletContainerId  = self.opt.target+'-applet';
		self._controlContainerId = self.opt.target+'-control';
		self._appletId           = "jmolApplet" + self._id;

		self._container          = $('#' + self.opt.target );
		
		// add our container to the target
		$('#'+self.opt.target).append(self._container);
		
		var width = self.opt.width;
		var height = self.opt.height;
		
		// Container Width 
		if ( width === undefined ) {
			width = self._container.css('width');		
			console.log( "pdbviewer: applet width not specified (using value from container: "+width+"), " );
		} else {
			self._container.width( width );
		}
		
		// Container Height
		if ( height === undefined ) {
			height = self._container.css('height');
			console.log( "pdbviewer: applet height not specified (using value from container: "+height+"), " );
		} else {
			self._container.height( height );
		}

		self.opt.backgroundColor = ( self.opt.backgroundColor !== undefined ) 
			? self.opt.backgroundColor 
			: self._container.css('background-color');
		
		self._container.html('');
	
		self._appletContainer = $('<div id="'+self._appletContainerId+'" class="biojs-pdbviewer-applet"></div>')
			.appendTo( this._container );
		
		Jmol.Info["use"] = self.opt.use;
		if ( this.opt.proxyUrl !== undefined ) {
			Jmol.Info["serverURL"] = self.opt.proxyUrl;	
		}
	
		Jmol.Info["jarPath"] = self.opt.jsmolFolder+"/java",
		Jmol.Info["jarFile"] = self.opt.jsmolFolder+"/java/JmolApplet0.jar",
		Jmol.Info["j2sPath"] = self.opt.jsmolFolder+"/j2s";
	
		Jmol.Info["addSelectionOptions"]= false;
		Jmol.Info["color"]   = "#ffffff";
		Jmol.Info["debug"]   = false;
		Jmol.Info["memoryLimit"]= 512;            // Java only
		Jmol.Info["readyFunction"]= null;
		Jmol.Info["src"]     = null;
		Jmol.Info["disableInitialConsole"] = true;
		Jmol.Info["disableJ2SLoadMonitor"] = true;
		Jmol.Info["deferUncover"] = true;
		Jmol.Info["deferApplet"]  = false;
		
		self._initializeJmolApplet();
				
		return self;
	};

	pdbviewer.loadPdb = function( pdbSrc, onLoadPdbCb ){
		console.log("LOADING pdb content");
		var self = this;
		var jmolId = self._appletId;
				
		var loadCmd;
		if( pdbSrc.length == 4 ) {
			loadCmd = "load 'http://www.rcsb.org/pdb/files/"+pdbSrc+".pdb.gz'; ";
		}
		else {
			loadCmd = "load '" + pdbSrc + "'; cartoon only; ";
		}
		
		var script = '';
		
		Jmol.setDocument( false );
		
		// NB: width and height must be > 0 (otherwise JSmol will crap out)
		// self._appletContainer.width() 

		var myInfo = $.extend( {}, Jmol.Info, {
			script: loadCmd + script,
			width:  self._container.width(),
			height: self._container.height()
		});
		
		htmlContent = Jmol.getApplet( jmolId, myInfo );
		self._jmolObject = eval( jmolId );
		
		console.log( "_jmolObject", self._jmolObject ); 
		self._appletContainer.html( Jmol.getAppletHtml( self._jmolObject ) );
		
		self._jmolAppletInitialized = true;
		
		if ( onLoadPdbCb ) {
			onLoadPdbCb.call( this, this._jmolObject );
		}
		
		console.log("loadPdb() ending");
	},
	
	pdbviewer.jmolScript = function( script ) {
		console.log( "Running jmol script", this, script );
		Jmol.script( this._jmolObject, script );
	};
		
	/*
	 * 
	 ***/
	pdbviewer._initializeJmolApplet = function() {		   
	   var self = this;
	   
	   jmolInitialize( self.opt.jmolFolder );
	   jmolSetDocument( 0 );
		
	   // Jmol needs a global function for executing up whenever a PDB is loaded
	   // Name for the function in global scope
	   var functionCbName = self._appletId + "_pdbLoadCb";
		
	   console.log("registring callback function loadStructCallback " + functionCbName);
		
	   // Register the function this._loadStructCallback as global for JmolApplet use 
	   window[functionCbName] = self._loadStructCallback;
	   
	   // Tell Jmol the name of the function in global scope
	   jmolSetCallback("loadStructCallback", functionCbName );
	   
	   self._jmolAppletInitialized = true;
	};

	pdbviewer._loadStructCallback = function( appletId, url, file, title, message, code, formerFrame, frame ) {
		
		console.log("executing _loadStructCallback for " + appletId);
		 		
 		switch (code) {
 			case 3  : result = 'success'; break;		
 			case 0  : result = 'zapped'; break; 
 			case -1 : result = 'failure'; break;
 			default : result = 'undefined'; break;
 		}
 		
 		// Ignore the execution of the callback on replacing pdb file.
 		
 		if ( "zapped" != result ) {
 			//uncover the loading image
 			var instanceId = parseInt( appletId.replace("jmolApplet",'') );
 			
 			/*
 			var instance = Biojs.getInstance(instanceId);
 			
 			instance.raiseEvent(Biojs.pdbviewer.EVT_ON_PDB_LOADED, {
 				"file": title,
 				"result": result,
 				"message": message
 			});
 			
 			instance._appletContainer.css('display','block');
 			*/
 		}
	};
	
	return pdbviewer;
};

require('biojs-events').mixin(pdbviewer.prototype);

module.exports = pdbviewer;
