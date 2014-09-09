
biojs.vis.pdbviewer
===================

Version: 0.0.1

### Note: the interface should be currently considered experimental and liable to change without notice

```html
<div id="testDiv" style="width: 500; height: 400"></div>
```

```javascript
var viewer = biojs.vis.pdbviewer();

// create a new jsmol applet
var app1 = viewer.jsmol({
            target: 'testDiv',
            jsmolFolder: '../external/jmol-14.2.4/jsmol',
         });

// load PDB file from server
app1.loadPdb( "./1cuk.pdb" );

// interact with jsmol
app1.jmolScript( "color structure" ); 
```

See the ```examples``` folder for live examples (requires local web server)

Background
----------

This is a first attempt to bring a PDB viewer component into new BioJS framework (v2.0) and is losely based on the original BioJS 1.0 component BioJS.PdbViewer (written by John Gomez).

In keeping with the biojs 2.0 principles that each component should "do one thing well", the intention is to keep this component stripped back to the following:

  * Initialise JSmol
  * Insert JSmol applet into the page
  * Load PDB file
  * Provide access to the JSmol applet

The previous incarnation included a control panel, but the intention is to move this kind of functionality to a separate component.

