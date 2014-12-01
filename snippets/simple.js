// get an instance of the PDB viewer manager
var viewer = require("biojs-vis-pdbviewer");

var p3d = viewer().jsmol({
  target: yourDiv.id,
  jsmolFolder: '../external/jmol-14.2.4/jsmol',
  width: 500,
  height: 400,
});

p3d.loadPdb( "./data/1fup.pdb" );

p3d.jmolScript( "color structure" );
/*
   if (!BIOJS) {
// this is here to let me test the JSmol insertion code outside of biojs

jmolInitialize( "/external/jmol-14.2.4/jsmol" );

var jsmolDefaultInfo = {
color: "#FFFFFF",                // white background (note this changes legacy default which was black)
height: 300,                     // pixels (but it may be in percent)
width: '100%',
use: "HTML5",                    // "HTML5" or "Java" (case-insensitive)
j2sPath: "/external/jmol-14.2.4/jsmol/j2s", // only used in the HTML5 modality
defaultModel: "",
script: "",
readyFunction: null,
addSelectionOptions: false,
debug: false,
disableInitialConsole: true
};

Jmol.setDocument(0);
var jmolId = 'foo';
var myInfo = $.extend( {}, jsmolDefaultInfo, {
script: "load '1fup.pdb'",
width:  500,
height: 500
});
var htmlContent = Jmol.getApplet( jmolId, myInfo );
var _jmolObject = eval( jmolId );
$('#testDiv').html( Jmol.getAppletHtml( _jmolObject ) );  
}
*/
