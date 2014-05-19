  var ieAlert;
  require(["dojo/_base/fx", "dojo/on", "dojo/dom","dojo/dnd/Moveable","dijit/Dialog","dijit/layout/AccordionContainer","dijit/layout/ContentPane", "dojo/dom-attr","dojo/query","dojo/dom-geometry","dojo/fx", "dojo/ready", "dojo/dom-style" , "dojo/window", "dojo/_base/xhr", "dojo/request/iframe","dojo/NodeList-manipulate",  "dojo/domReady!" ], function(fx, on, dom, Moveable, Dialog, AccordionContainer, ContentPane, domAttr, query, domGeom, coreFx, ready, domStyle, win, xhr, iframe) {
        var fadeButton = dom.byId("toggleOutput"),
            fadeTarget = dom.byId("output");
 		var clearButton = dom.byId("clear");
 		var viewButton = dom.byId("openClose");
 		var locateButton = dom.byId("locate");
 		var bufferButton = dom.byId("buffer");
 		var map1 = dom.byId("map");
		var fade = null;       
		var  secondary;
        var slideTarget = dom.byId("searchResults");
		var bufferParams = dom.byId("buffer-params");
		var bufferMode = dom.byId("bufferMode");
        var drawMode = dom.byId("draw");
        var drawPanel = dom.byId("measurementDiv");
       	var textModeButton = dom.byId("iconToggle");
       	var textMapButton = dom.byId("textMap");
       	var	galleryBox = dom.byId("dijit_layout_ContentPane_2");
        var body = dom.byId("body");
        var fix1 = dom.byId("button-console");
        var logo = dom.byId("pclogo");
        var outputJson = dom.byId("filler");
        var helpButton = dom.byId("helpButton");
        var legendButton = dom.byId("legendToggle");
        var exportButton = dom.byId("exportResults");
        var vs = win.getBox();
        var zoomToggle = dom.byId("zoom");
        var textModeHeight = 50;
        var searchWrapperHeight = 50; 
        var buttonConsoleHeight = -40; 
        var zoomOffset = 0;
        var selectionToggle = false;
        var closeButton = dom.byId("close");
        var pan = dom.byId("pan");
        var selectButton = dom.byId("selection");
        var selectHelp = dom.byId("selectHelp");
        var dnd;   
        var dockButton = dom.byId("dockButton");
        var scalebar;
        var identify = dom.byId("identify");
        var displayHelp = dom.byId("displayHelp");
        
        
        
        
       
       
         var aContainer = new AccordionContainer({style:"height:inherit"}, "accordion");
          aContainer.addChild(new ContentPane({
        title: '<div class="accordionTitle">Labels & Data</div>',
        content: '<div class="accordionContent">' +
                        '<div class="optionFit"><ul class="sortableData">' + 
                        //'<li><label><input type="checkbox"  name="layer" id="togglePuebloCounty"><span>Pueblo County</span></label></li>' +
                    //    '<div class="pcUD"><li ><label title="Add/Remove Pueblo County layer (Shift + C)"><input type="checkbox" checked="checked" name="layer" id="togglePuebloCounty"><span>Pueblo County</span></label><div class="UDControls" title="Move layer down/up one level"><div class="pcSlideToggle">+</div><span class="pcDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="pcUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel pc">Opacity:</div><div id="sliderPC"></div></div>' +
                        '<div class="roadUD"> <li ><label title="Add/Remove Streets layer (Shift + S)"><input type="checkbox" checked="checked"  name="layer" id="toggleRoads"><span>Streets</span></label><div class="UDControls" title="Move layer down/up one level"><div class="roadSlideToggle">+</div><span class="roadDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="roadUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel road">Opacity:</div><div id="sliderRoad"></div></div>' +
                        
                        '<div class="parcelUD"><li ><label title="Add/Remove Parcel layer (Shift + Y)"><input type="checkbox" checked="checked" name="layer" id="toggleParcels"><span>Parcels</span></label><div class="UDControls" title="Move layer down/up one level"><div class="parcSlideToggle">+</div><span class="parcDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="parcUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel parcs">Opacity:</div><div id="sliderParc"></div></div>' +
                        '<div class="addrUD"><li ><label title="Add/Remove Address Point layer (Shift + A)"><input type="checkbox"  name="layer" id="togglePoints"><span>Address Points</span></label><div class="UDControls" title="Move layer down/up one level"><div class="addrSlideToggle">+</div><span class="addrDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="addrUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel addr">Opacity:</div><div id="sliderAddr"></div></div>' +
                        '<div  class="railUD"><li><label title="Add/Remove Railroad layer (Shift + R)" class="buttonup"><input type="checkbox"  name="layer" id="toggleRailroads"><span>Railroads</span></label><div class="UDControls" title="Move layer down/up one level"><div class="railSlideToggle">+</div><span class="railDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="railUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel rail">Opacity:</div><div id="sliderRail"></div></div>' +
                       // '<li><label><input type="checkbox"  name="layer" id="toggleTowns"><span>Municipalities</span></label></li>' +
                        '<div  class="boundUD"><li><label title="Add/Remove Boundary layer (Shift + B)"><input type="checkbox"  name="layer" id="toggleBoundaries"><span>Boundaries</span></label><div class="UDControls" title="Move layer down/up one level"><div class="boundSlideToggle">+</div><span class="boundDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="boundUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel bounds">Opacity:</div><div id="sliderBounds"></div></div>' +
                        
                        '<div class="esriBoundUD"><li><label title="Add/Remove World Labels layer (Shift + W)"><input type="checkbox"  name="layer" id="toggleEsriLabels"><span>World Labels</span></label><div class="UDControls" title="Move layer down/up one level"><div class="worldSlideToggle">+</div><span class="esriBoundDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="esriBoundUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel world">Opacity:</div><div id="sliderWorld"></div></div>' +
                       
                       
                        '<div  class="floodUD"><li><label title="Add/Remove Floodplain layer (Shift + F)"><input type="checkbox" name="layer" id="toggleFlood"><span>Floodplain</span></label> <div class="UDControls" title="Move layer down/up one level"><div class="floodSlideToggle">+</div><span class="floodDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="floodUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel flood">Opacity:</div><div id="sliderFlood"></div></div>' +
                        '<div  class="zoneUD"><li><label title="Add/Remove Zoning layer (Shift + Z)"><input type="checkbox" name="layer"  id="toggleZoning"><span>Zoning</span></label><div class="UDControls" title="Move layer down/up one level"><div class="zoneSlideToggle">+</div><span class="zoneDown cDown">&nbsp;&nbsp;&nbsp;&nbsp;</span>&nbsp;<span class="zoneUp cUp">&nbsp;&nbsp;&nbsp;&nbsp;</span></div></li><div class="sliderLabel zone">Opacity:</div><div id="sliderZone"></div></div>' +
                                              
                       
                        '</ul></div>' + 
                        '' +
                '</div>',
        'class':"minwax2"
    }));
      
 
    aContainer.addChild(new ContentPane({
        title:'<div class="accordionTitle"><span class="basemapsTitle">Basemaps</span></div>',
        content:'<div class="accordionContent basemaps">' +
                '<div class="optionFit">' +
                '<div class="basemap-pad"><label><input type="radio" name="blayer"  id="toggle2013"><span>Aerial 2013</span></label><br/></div>' +
                
        		'<div class="basemap-pad"><label><input type="radio" name="blayer" checked="checked" id="toggleSat"><span>ESRI Satellite</span></label><br/></div>' +
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleStreet"><span>ESRI Street</span></label><br/></div>' +
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleTopo"><span>ESRI Topographic</span></label><br/></div>' +
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleNat"><span>National Geographic</span></label><br/></div>'+
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleOpenStreet"><span>Open Street</span></label><br/></div>'+
      			//'<label><input type="radio" name="blayer" id="toggleGSat"><span>Google Satellite*</span></label><br/>'+
      			//'<label><input type="radio" name="blayer" id="toggleGStreet"><span>Google Street*</span></label><br/>'+
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleSTerrain"><span>Stamen Terrain*</span></label><br/></div>'+
      			
      			'</div><div class="optionFit">' +
      			
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleMapbox"><span>MapBox Terrain*</span></label><br/></div>'+
      			'<div style="display:none;"  class="basemap-pad"><label><input type="radio" name="blayer" id="toggleMapquest"><span>MapQuest Street*</span></label><br/></div>'+
      			'<div style="display:none;"  class="basemap-pad"><label><input type="radio" name="blayer" id="toggleCPale"><span>Cloudmade Pale*</span></label><br/></div>'+
      			'<div  style="display:none;" class="basemap-pad"><label><input type="radio" name="blayer" id="toggleCNight"><span>Cloudmade Midnight*</span></label><br/></div>'+
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleToner"><span>Toner*</span></label><br/></div>'+
      			'<div class="basemap-pad"><label><input type="radio" name="blayer" id="toggleWColor"><span>Watercolor*</span></label><br/></div>'+
				'</div>' +
				'<div id="caveats">*Not Printable</div>' +
      			'</div>',
         'class':"minwax3"
    }));
  
    aContainer.startup();
   
       $(".pcSlideToggle").click(function(){
          if($(".pcSlideToggle").get()[0].innerText == "+"){
              $(".pcSlideToggle").text("-");
          } else {
              $(".pcSlideToggle").text("+");
          }
             $("div.sliderLabel.pc").toggle();
           $("div.sliderLabel.pc + table").toggle();
          });
      
      $(".parcSlideToggle").click(function(){
          if($(".parcSlideToggle").get()[0].innerText == "+"){
              $(".parcSlideToggle").text("-");
          } else {
              $(".parcSlideToggle").text("+");
          }
             $("div.sliderLabel.parcs").toggle();
           $("div.sliderLabel.parcs + table").toggle();
          });
      
     $(".addrSlideToggle").click(function(){
         
          if($(".addrSlideToggle").get()[0].innerText == "+"){
              $(".addrSlideToggle").text("-");
          } else {
              $(".addrSlideToggle").text("+");
         }
         
             $("div.sliderLabel.addr").toggle();
           $("div.sliderLabel.addr + table").toggle();
          });
          
          
    $(".roadSlideToggle").click(function(){
        
         if($(".roadSlideToggle").get()[0].innerText == "+"){
              $(".roadSlideToggle").text("-");
          } else {
              $(".roadSlideToggle").text("+");
          }
             $("div.sliderLabel.road").toggle();
           $("div.sliderLabel.road + table").toggle();
          });
          
    $(".railSlideToggle").click(function(){
        
         if($(".railSlideToggle").get()[0].innerText == "+"){
              $(".railSlideToggle").text("-");
          } else {
              $(".railSlideToggle").text("+");
          }
             $("div.sliderLabel.rail").toggle();
           $("div.sliderLabel.rail + table").toggle();
          });
    $(".boundSlideToggle").click(function(){
        
         if($(".boundSlideToggle").get()[0].innerText == "+"){
              $(".boundSlideToggle").text("-");
          } else {
              $(".boundSlideToggle").text("+");
          }
             $("div.sliderLabel.bounds").toggle();
           $("div.sliderLabel.bounds + table").toggle();
          });
    $(".worldSlideToggle").click(function(){
        
         if($(".worldSlideToggle").get()[0].innerText == "+"){
              $(".worldSlideToggle").text("-");
          } else {
              $(".worldSlideToggle").text("+");
          }
             $("div.sliderLabel.world").toggle();
           $("div.sliderLabel.world + table").toggle();
          });
     $(".floodSlideToggle").click(function(){
         
          if($(".floodSlideToggle").get()[0].innerText == "+"){
              $(".floodSlideToggle").text("-");
          } else {
              $(".floodSlideToggle").text("+");
          }
             $("div.sliderLabel.flood").toggle();
           $("div.sliderLabel.flood + table").toggle();
          });
     $(".zoneSlideToggle").click(function(){
         
          if($(".zoneSlideToggle").get()[0].innerText == "+"){
              $(".zoneSlideToggle").text("-");
          } else {
              $(".zoneSlideToggle").text("+");
          }
             $("div.sliderLabel.zone").toggle();
           $("div.sliderLabel.zone + table").toggle();
          });
      
     
      
      
      
       try{aContainer.resize();}catch(e){console.log(e);}
         on(dom.byId(query(".accordionTitle")),"click",function(){
        	
        });        
       
        
      
         ieAlert = new Dialog({
        	title: "Web Browser Outdated",
        	style: "width:300px"
        });
        
        helpAlert = new Dialog({
        	title:"Help",
        	style:"width: 90%; height:90%; overflow:scroll;"
        });
        
        helpAlert.set("content",' <div id="mapHelpContent" class="help"> <div class="content left"> <div> <h4>Zoom In/Out</h4> <p>Zooming in on the map.</p> <ol> <li><img src="images/icons/zoomexample.png"> , or</li> <li><div class="example"><img src="images/icons/rbzoom.png"></div> , and drag the mouse across the map, or</li> <li>Use the mouse wheel</li> </ol> </div> <div> <h4>Select Items</h4> <p>Select Items on the map graphically with the mouse</p> <ol> <li>Click the select button <div class="example"><img src="images/icons/select.png"></div></li> <li>Choose a shape and the type of data you wish to select</li> <li>Draw a shape around the item to select on the map</li> </ol> </div> <div> <h4>Clear</h4> <p>Clear all graphics from the map and items in the Results Window</p> <ol> <li><div class="example" style="padding-left: 0px !important;"><img src="images/icons/clear.png"></div> </li></ol> </div> <div> <h4>Measure</h4> <p>Measure the distance between two or more points.</p> <ol> <li>Turn on the measure tool by clicking <div class="example" style="padding-left: 0px !important;"><img src="images/icons/measure.png"></div> </li><li>Select the measure tool from the measure dialog</li> <li>Click on the map, then connect to another point on the map and click.</li> <li>Repeat as necessary</li> <li>Turn off the measure tool by double-clicking on the map, or clicking <div class="example" style="padding-left: 0px !important;"><img src="images/icons/measure.png"></div></li> </ol> </div> <div> <h4>Buffer Selection</h4> <p>Selects parcels/address points/roads within a specified distance of currently selected item(s) on map</p> <ol> <li>Turn on the buffer tool by clicking <div class="example" style="padding-left: 0px !important;"><img src="images/icons/buffer.png"></div> </li> <li>Input the distance you wish to buffer</li> <li>Choose what type of items you want the buffer to return (Parcels, Address Points, or Roads)</li> <li>Click the "Buffer" button to begin the buffer</li> <li>Repeat as necessary</li> <li>Turn off the buffer tool by again clicking <div class="example" style="padding-left: 0px !important;"><img src="images/icons/buffer.png"></div></li> </ol> </div> </div> <div class="content right"> <div> <h4>Results Window</h4> <p>The Results Window is located by default in the bottom panel and displays selected items and search results</p> <ol> <li>Click the export button <div class="example" style="padding-right: 5px; padding-top: 5px;"><img src="images/icons/download.png"></div> to export content of Results Window to a CSV</li> <li style="margin-top: 10px;">Click the dock button <div class="example"><img src="images/icons/lock.png"></div> to move Results Window around the screen</li> <li style="margin-top: 10px;">Click the show/hide button <div class="example" style="padding-left: 3px !important;padding-right: 3px !important;"><img src="images/icons/table.png"></div> to toggle the Results Window</li> <li style="margin-top: 10px;">Click the close button <div class="example" style="padding-right: 5px; padding-top: 5px;"><img src="images/icons/close.png"></div> to hide the results window</li> <li>Click the zoom button <img src="images/icons/zoomRecord.png"> to zoom to selected item and highlight on map</li> </ol> </div> <div> <h4>Identify Tool</h4> <p>Quickly identifies items on the map</p> <ol> <li>Click the identify button <div class="example" style="padding-left: 0px !important; "><img src="images/icons/identify.png" style="margin-bottom: -5px;"></div> </li> <li>Click on a location on the map to identify items at that location</li> </ol> </div> <div> <h4>Pan</h4> <p>Pan the map in a given direction.</p> <ol> <li>Click the pan button <div class="example" style="padding-left: 0px !important; "><img src="images/icons/pan.png"></div> and drag the mouse over the map</li> </ol> </div> <div> <h4>Overview Map</h4> <p>Shows the position of the main map in a small overview map</p> <ol> <li>Click "Overview" to toggle on/off</li> </ol> </div> <div> <h4>Layers</h4> <p>Add or remove layers from the map</p> <ol> <li>Click "Layers" to open the Layers Window and click on any checkbox under the "Labels & Data" menu to toggle a layer on/off. You can have as many layers on or off as you wish.</li> <li>These layers can be reordered by using the Up and Down arrows to make reading them easier.</li><li>By clicking on any "+" symbol next to a layer name, you can open a slider bar that controls the opacity of that individual layer. All layers can have different opacities set.</li><li>Basemap options are stored under the "Basemaps" menu at the bottom of the Layers window. Only one basemap can be selected at a time. Basemaps marked with an asterisk(*) cannot be printed.</li> </ol> </div> <div> <h4>Legend</h4> <p>The visible map\'s legend</p> <ol> <li>Click "Legend" to toggle the map legend on/off</li> <li>The legend will change automatically when you change the basemap</li> </ol> </div> <div> <h4>Print</h4> <p>Print whatever is currently visible on the map, including graphics</p> <ol> <li>Click "Print" to generate a PDF in the default size.</li> <li>Click &#x25BC; to view a dropdown list of available alternative sizes and options</li> </ol> </div> </div> </div>');
        
        var isMoving = false; //to help detect whether window is being moved
        var position = "bottom";
        var docked = true;
        var moved = false;
        var box;
        on(dockButton,"click", function(){
        	
        	
        	if(docked){
        	 dnd = new Moveable(dom.byId("searchResults")); 
        		domAttr.set(dockButton,"class","undocked"); 
        		domAttr.set(dom.byId("modeHelper"),"class","undockMode");
        		
        		dojo.connect(dnd, "onMove", function(e){
        			aContainer.resize();
        			isMoving = true;
        			moved = true;
      			 //	console.log(scalebar);
      			 	vs = win.getBox();
       			//	console.log(vs);
      				 	 box = domGeom.position(searchResults);
      			// 	console.log(box);
       	
      			 	if((vs.h - box.y) <= 175){  
      			 		//console.log("snap bottom");
     			  		domAttr.set(dom.byId("moveHelper"),"class","searchSnapBottom");
     			  		domAttr.set(dom.byId("resultsContent"),"style",  "height:" + (vs.h - box.y - 25) + "px !important;");
     			  	//	domAttr.set(dom.byId("pclogo"), "style", "top: " + (box.y - 65) + "px !important;");
     			  	//	domAttr.set(scalebar, "style", "top: " + (box.y - 30) + "px !important; left: 25px;");
     			  		domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");
     			  		position = "bottom";
     			  		//console.log(vs.h - box.y);
     			  	} else if((vs.w - box.x) <= 375 && box.y < 150 ) {
   			    		domAttr.set(dom.byId("moveHelper"),"class", "searchSnapRight");
    			   		domAttr.set(dom.byId("resultsContent"),"style",  "");
    			   	//	domAttr.set(dom.byId("pclogo"), "style", "left: " + (box.x - 50) +"px;");
    			   		domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");
    			   		position = "right";
     			  	} else if((box.x) <= 66 && box.y < 150 ) {
    			   		domAttr.set(dom.byId("moveHelper"),"class", "searchSnapLeft");
    			   		domAttr.set(dom.byId("resultsContent"),"style",  "");
    			   	//	domAttr.set(scalebar, "style", "left: " + (box.w + (box.x + 22) + 20) +"px;");
    			   		domAttr.set(dom.byId("map_zoom_slider"), "style", "left: " + (box.w + (box.x + 22) ) +"px; z-index: 30;");
    			   		domAttr.set(dom.byId(query(".searchFix")[0]),"style","left: " + (box.w + (box.x + 88) ) +"px; z-index: 30;");
    			   		//console.log(query(".searchFix"));
    			   		position = "left";
    			   	} else {
    			   		domAttr.set(dom.byId("moveHelper"),"class", "searchFreeFloat");
    			   		domAttr.set(dom.byId("resultsContent"),"style",  "");
    			   		//domAttr.set(dom.byId("pclogo"), "style", "");
     			  		//domAttr.set(scalebar, "style", "left: 25px;");
     			  		 if(!layerLeft[0] || layerHidden[0]){
    			   domAttr.set(dom.byId("map_zoom_slider"), "style", "z-index: 30;");
     			  		try{domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");}catch(e){}
     			  	}
     			  		position = "free";
     			  	}
       				
       				

       	
      			 });
       
        		 
        		    dojo.connect(dnd, "onMoveStop", function(e){
       					//alert();
       				isMoving = false;
       				setTimeout(function(){
       					if(!isMoving){
       						dnd.destroy();
        					docked = true;
        					domAttr.set(dockButton,"class","docked");
        					domAttr.set(dom.byId("modeHelper"),"class","dockMode");
       					}
       				},3000);
       				      	
        			});        		 
        		docked = false;
        		
        		setTimeout(function(){
       					if(!isMoving){
       						dnd.destroy();
        					docked = true;
        					domAttr.set(dockButton,"class","docked");
        					domAttr.set(dom.byId("modeHelper"),"class","dockMode");
       					}
       				},3000);
        		
        		
        	} else {
        		dnd.destroy();
        		docked = true;
        		domAttr.set(dockButton,"class","docked");
        		domAttr.set(dom.byId("modeHelper"),"class","dockMode");
        	}
        });
        
       var ldMoving = false;
		var ldButton = dom.byId("layerDock");
        on(ldButton,"click", function(){
        	
        	
        	if(docked){
        	 dnd = new Moveable(dom.byId("sliderWrap")); 
        		domAttr.set(ldButton,"class","undocked"); 
        		domAttr.set(dom.byId("layerModeHelper"),"class","undockMode");
        		
        		dojo.connect(dnd, "onMove", function(e){
        			ldMoving = true;
        			isMoving = true;
        			aContainer.resize();
        			moved = true;
      			 //	console.log(scalebar);
      			 	vs = win.getBox();
       			//	console.log(vs);
      				 	 box = domGeom.position(sliderWrap);
      			// 	console.log(box);
       			console.log(query("#sliderWrap .dijitSelected .dijitContentPane")[0]);
      			 	if((vs.h - box.y) <= 201){  
      			 		
      			 		if(!searchBottom[0] || searchHidden[0]){
      			 		console.log("bottom");
      			 		domAttr.set(dom.byId("sliderWrapHelper"),"class", "layerSnapBottom");
      			 		//domAttr.set(dom.byId("sliderWrap"),"style", "width:" + (vs.w - 34) + "px;");
      			 		}
      			 	
     			  	} else if((vs.w - box.x) <= 375 && box.y < 150 ) {
     			  		console.log("right");
     			  		domAttr.set(dom.byId("sliderWrapHelper"),"class", "layerSnapRight");
						
   			    	
     			  	} else if((box.x) <= 66 && box.y < 150 ) {
     			  		console.log(box);
     			  		domAttr.set(dom.byId("sliderWrapHelper"),"class", "layerSnapLeft");
     			  		
    			  	
    			   	}else {
    			   		//console.log("free");
    			   		domAttr.set(dom.byId("sliderWrapHelper"),"class", "layerFreeFloat");
    			  	//	domAttr.set(dom.byId(query("#sliderWrap .dijitSelected .dijitContentPane")[0]),"style","height:" + (box.h - 100 ) + "px;");
    			  if(!searchLeft[0]){
    			   domAttr.set(dom.byId("map_zoom_slider"), "style", "z-index: 30;");
     			  		try{domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");}catch(e){}
     			  	}
     			  	}
       				
       				

       	
      			 });
       
        		 
        		    dojo.connect(dnd, "onMoveStop", function(e){
       					//alert();
       					ldMoving = false;
       				isMoving = false;
       				setTimeout(function(){
       					if(!isMoving){
       						dnd.destroy();
        					docked = true;
        					domAttr.set(ldButton,"class","docked");
        				//	domAttr.set(dom.byId("modeHelper"),"class","dockMode");
       					}
       				},3000);
       				      	
        			});        		 
        		docked = false;
        		
        		setTimeout(function(){
       					if(!isMoving){
       						dnd.destroy();
        					docked = true;
        					domAttr.set(ldButton,"class","docked");
        					domAttr.set(dom.byId("layerModeHelper"),"class","dockMode");
       					}
       				},3000);
        		
        		
        	} else {
        		dnd.destroy();
        		docked = true;
        		//domAttr.set(dockButton,"class","docked");
        		domAttr.set(dom.byId("layerModeHelper"),"class","dockMode");
        	}
        });
        
       

       
  
         
        
        
        
        var idTF = false;
        on(identify,"click",function(){
        	
        	if(!idTF){
        	domAttr.set(dom.byId("identify"),"class","idActive");
        	//domAttr.set(popTemp,"class","esriPopup");
        	idTF = true;
        	} else {
        		domAttr.set(dom.byId("identify"),"class","idInactive");
        		//domAttr.set(popTemp,"class","esriPopup hide");
        		idTF = false;
        	}
        	$('#identifyMenu').toggle();
        });
        
        
        
       // var selectTF = false;
        on(selectButton,"click",function(){
        	//if(!selectTF){
        		if(!selectionTF){
        		domAttr.set(dom.byId("selectionTools"), "class", "show");
        		fx.fadeIn({node: dom.byId("selectionTools"), duration: 225}).play();
        		//selectTF = true;
        		
        		//selectionTF = true;
        	} else {
        		fx.fadeOut({node: dom.byId("selectionTools"), duration: 225}).play();
        		setTimeout(function(){
        			domAttr.set(dom.byId("selectionTools"), "class", "hide");
        			
        		}, 250);
        		//selectTF = false;
        		//selectionTF = false;
        	}
        	
        });
        
        
        on(selectHelp,"click",function(){
        	if(selectionTF){
        		fx.fadeOut({node: dom.byId("selectionTools"), duration: 225}).play();
        		setTimeout(function(){
        			domAttr.set(dom.byId("selectionTools"), "class", "hide");
        		}, 250);
        		selectionTF = false;
        	}
        	dom.byId("fpoly").checked = false;
        	dom.byId("poly").checked = false;
        	dom.byId("rect").checked = false;
        	dom.byId("triangle").checked = false;
        	dom.byId("circ").checked = false;
        	dom.byId("pt").checked = false;
        	dom.byId("line").checked = false;
        	dom.byId("polyline").checked = false;
        	dom.byId("parcs").checked = false;
        	dom.byId("addr").checked = false;
        	dom.byId("roads").checked = false;
        	
        });
        
        on(closeButton, "click", function(){
        	on.emit(fadeButton, "click", {bubbles: true, cancelable: true});
        });
       
       
       
       on(helpButton,"click",function(){
       			//ieAlert.set("title","Comming Soon");
       			//ieAlert.set("content", "<p>This feature is not available yet.</p><p>Please check again later.</p>");
				helpAlert.show();
       		//alert("Feature comming soon.")
       	});
       
       
       
       var showLayerWindow = false;
       on(dom.byId("toggleLayerMenu"), "click",function(){
       	
       	
       	
       		if(showLayerWindow){
       			domAttr.set(dom.byId("sliderWrap"), "class","xslider hide");
       			showLayerWindow = false;
       			aContainer.resize();
       		} else {
       			domAttr.set(dom.byId("sliderWrap"), "class","xslider");
       			showLayerWindow = true;
       			aContainer.resize();
       		}
       		
       		
       			
       });
       
       on(dom.byId("layerClose"),"click",function(){
       		on.emit(dom.byId("toggleLayerMenu"), "click", {bubbles: true, cancelable: true});
       });
       
       var showLegend = false;
       on(legendButton,"click",function(){
       	if(!showLegend){
       	domAttr.set(dom.byId("legendWrapper"), "class", "abc");
       	showLegend = true;
       	} else {
       		domAttr.set(dom.byId("legendWrapper"), "class", "hide");
       		showLegend = false;
       	}
       	
       	});
        
         on(exportButton, "click", function(){
       	setTimeout(function(){
        	var zz = outputJson.innerHTML;
        	var x = dom.byId("filler").innerHTML;
        	//zz = json.stringify(zz);
        	console.log(zz);
        	
        	//on.emit(dom.byId("click"), "click", {bubbles: true, cancelable: true});
        	dom.byId("filler").innerHTML = '{"export": [' + dom.byId("filler").innerHTML + ']}';
        	console.log(dom.byId("filler").innerHTML);
        	 xhr.post({
        	 		url:"test.php",
      				 form:"form",
     				  load: function(data, ioArgs){
     				     console.log(data);
     				     console.log(ioArgs);
     				     data = data.replace(" ","");
     				     if(data != "false"){
     				    // domAttr.set(dom.byId("expLink"), "href", "temp/" + data);
     				    // domAttr.set(dom.byId("expLink"), "style", "visibility:visible;");
     				    window.open("./temp/" + data, '_parent');
     				     }
     				     
     				     
     				      // ioArgs is loaded with XHR information, but not useful in simple cases
        				   // data is the response from the form's action="" url
    				   },
     				  error: function(err, ioArgs){
       				     console.log(err);
     				     console.log(ioArgs);// again, ioArgs is useful, but not in simple cases
       				  //  console.error(err); // display the error
      				 }
   				 }); 
   				 dom.byId("filler").innerHTML = x;
   				 
   				},1000);
        });
        
        var zoomTF = false;
        on(zoomToggle,"click",function(){
        	
        	if(!zoomTF){
        	//	fx.fadeOut({node: dom.byId("increment"), duration: 225}).play();
        	//	fx.fadeOut({node: dom.byId("decrement"), duration: 225}).play();
        		zoomTF = true;
        	} else {
        	//	fx.fadeIn({node: dom.byId("increment"), duration: 225}).play();
        	//	fx.fadeIn({node: dom.byId("decrement"), duration: 225}).play();
        		zoomTF = false;
        	}
        	
        });
        
        on(pan,"click", function(){
        	if(!zoomTF){
        	//	fx.fadeOut({node: dom.byId("increment"), duration: 225}).play();
        	//	fx.fadeOut({node: dom.byId("decrement"), duration: 225}).play();
        		zoomTF = true;
        		
        	}
        	fx.fadeOut({node: dom.byId("selectionTools"), duration: 225}).play();
                setTimeout(function(){
                    domAttr.set(dom.byId("selectionTools"), "class", "hide");
                    
                }, 250);
        });
        
        var unmovedView = false;
       on(fadeButton, "click", function(evt){
    
    	on.emit(viewButton, "click", {bubbles: true, cancelable: true});
    	
    showIt();
         
        });
      
      on(displayHelp,"click",function(){
      	showIt(true);
      	openClose = true;
      });
      
        
        function showIt(showTF) {
        	
        	
        	
        		
        		
        	     if((!moved && !unmovedView)  ){
         	domAttr.set(dom.byId("pclogo"), "style", "bottom: 180px;");
         	domAttr.set(scalebar, "style", "bottom: 180px; left: 25px;");
         	unmovedView = true;
         }   else if((!moved && unmovedView) || (moved && unmovedView && position == "bottom" )){
         	domAttr.set(dom.byId("pclogo"), "style", "");
         	domAttr.set(scalebar, "style", "left: 25px;");
         	unmovedView = false;
         } else if ((moved && !unmovedView && position == "bottom")){
         		
     			domAttr.set(dom.byId("pclogo"), "style", "top: " + (box.y - 65) + "px !important;");
     			domAttr.set(scalebar, "style", "top: " + (box.y - 30) + "px !important; left: 25px;");
     			unmovedView = true;
         }
         
         
        if (showTF && position == "bottom"){
         		domAttr.set(dom.byId("pclogo"), "style", "bottom: 180px;");
         		domAttr.set(scalebar, "style", "bottom: 180px; left: 25px;");
         		unmovedView = true;
     			
         }
         	
         
         
        }
        
        
        
        on(clearButton, "click", function(){
        	try{
        	dom.byId("tableContent").innerHTML = "";
        	dom.byId("tableTallContent").innerHTML = "";
        	} catch(e){
    
				document.getElementById('tableContent').innerText="";
				document.getElementById('tableTallContent').innerText="";
				
			}
        	dom.byId("filler").innerHTML = "";
        	/*
        	fx.fadeOut({ node: fadeTarget, duration: 225 }).play();
        	fade = false;
        		domAttr.set(fadeTarget, "class", "hide");
        	   	domAttr.set(fadeButton, "class", "closed");
        	   	
        	   	
        	   	
        	if(openClose){
     		//slideIt(300, 0, slideTarget,0);
     		fx.fadeOut({node: slideTarget, duration: 0}).play();
     		setTimeout(function(){domAttr.set(slideTarget, "class", "hide");}, 0);
     		openClose = false;
     		
     	}   	
        	  */ 	
        });
        
        var temp = true;
        
      	on(map1, "click", function(){
      	
      	  try{
      	  
      	  secondary = dom.byId("asdf");
      	  
      	  
      	  
      	  }catch(e){
      	  console.log(e);}
      	
      	
      	  try{
        	  var t = query(".action");
  	    	  t.splice(0,1);
    	  	  t.wrap('<div id="asdf"></div>');
    	    //  console.log(t);
      	  } catch(e) {}
      	
      	
      	
      	
      	});
      	
   function slideIt(amtH, amtV, target, delay){
   //	console.log(domGeom.position(target));
  	//console.log(target);
  	setTimeout(function(){
  		
  		try{
   coreFx.slideTo({
      node: target,
      top: (domGeom.position(target).y + amtV).toString(),
      left: (domGeom.position(target).x + amtH).toString(),
      unit: "px",
      duration: 150
    }).play();
   // setTimeout(function(){console.log(domGeom.position(slideTarget));}, 2000);
   } catch(e){
   	console.log(e);
   }
  		
  	}, delay);
   
      }
  var sWidth;
  var sHeight;
  var popTemp;
  
  
  var searchHidden; 
				var searchLeft; 
				var searchVisible; 
				var searchBottom; 
				var searchFree;
				var searchRight;
				var mobilePortrait; 
				var mobileLandscape; 
				var layerHidden; 
				var layerLeft;
				var layerFree; 
				var layerRight;
				var layerBottom; 
  var screenSize;
	ready(function(){
		var initialSize = win.getBox();
		sWidth = initialSize.w;
		sHeight = initialSize.h;
		
	//console.log(map);
	//	console.dir(dnd);
		//domAttr.set(slideTarget, "style", "top: " + domGeom.getMarginBox(dom.byId("button-console")).h + "px; height: " + (win.getBox().h - domGeom.getMarginBox(dom.byId("button-console")).h) + "px;" );
	domAttr.set(slideTarget, "style", "bottom: 0px;" );
	
	
	ldMoving = true;
	setTimeout(function(){

		//aContainer.resize();
	},1000);
	
	try{	
		setTimeout(function(){
			try{
			domAttr.set(dom.byId("dijit_form_ComboButton_0_arrow"), "title", "Print the map");
					domAttr.set(dom.byId("map_zoom_slider"), "title", "Zoom the map in or out");

			} catch(e){console.log(e);}
		},5000);
		} catch(e){console.log(e);}

	//	query(".esriSimpleSliderIncrementButton").wrap("<div id=\"increment\"></div>");
	//	query(".esriSimpleSliderDecrementButton").wrap("<div id=\"decrement\"></div>");
		try{
		setTimeout(function(){
			scalebar = query(".esriScalebar");
        	scalebar = dom.byId(scalebar[0]);
        	respond(0);
        	popTemp = query(".esriPopup");
        	popTemp = popTemp[0];
		domAttr.set(popTemp,"class","esriPopup hide");
			
			
		},500);	
		
	}catch(e){console.log(e);}
	
	//	domAttr.set(dom.byId("sliderWrap2"),"style","height: " + (initialSize.h - 70) + "px;");
		
		setInterval(function(){
			var screenSize = win.getBox();
			
			
			if(sWidth != screenSize.w || sHeight != screenSize.h){
				//console.log(screenSize);
				sWidth = screenSize.w;
				sHeight = screenSize.h;
				respond();
			}
			
			
		},500);
		
		//Ultimate response algorithm for objects moving out of way of results window.
		setInterval(function(){
			
			try{
			screenSize = win.getBox();
			box = domGeom.position(searchResults);
	
			var box1 = domGeom.position(dom.byId("sliderWrap"));
			var sliderWrap = dom.byId("sliderWrap");
			//
			try{
				 searchHidden = query("#searchResults.hide");
				 searchLeft = query("#moveHelper.searchSnapLeft");
				 searchVisible = query("#searchResults.showx");
				 searchBottom = query("#moveHelper.searchSnapBottom");
				 searchFree = query("#moveHelper.searchFreeFloat");
				 searchRight = query("#moveHelper.searchSnapRight");
				 mobilePortrait = query(".mobile-mode-portrait");
				 mobileLandscape = query(".mobile-mode-landscape");
				 layerHidden = query("#sliderWrap.hide");
				 layerLeft = query("#sliderWrapHelper.layerSnapLeft");
				 layerFree = query("#sliderWrapHelper.layerFreeFloat");
				 layerRight = query("#sliderWrapHelper.layerSnapRight");
				 layerBottom = query("#sliderWrapHelper.layerSnapBottom");
				//console.log(domAttr.get(dom.byId("searchResults"),"style"));
				
				if(!layerHidden[0] && layerLeft[0] && searchBottom[0]){
					//domAttr.set(searchResults,"style",domAttr.get(dom.byId("searchResults"),"style") + "padding-left:" + (box1.w + box1.x) + "px;");
					domAttr.set(dom.byId("sizeHelper"),"class","resultsBottomLayerLeft");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsBottomLayerLeft");
					
				}  else if(layerHidden[0] && searchBottom[0] && !searchHidden[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsBottomLayerHidden");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsBottomLayerHidden");
				}  else if(!layerHidden[0] && layerFree[0] && searchBottom[0] && !searchHidden[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsBottomLayerFree");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsBottomLayerFree");
				}  else if(!layerHidden[0] && layerRight[0] && searchBottom[0]&& !searchHidden[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsBottomLayerRight");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsBottomLayerRight");
					
				}  else if(!searchHidden[0] && searchLeft[0] && layerBottom[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsLeftLayerBottom");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsLeftLayerBottom");
					domAttr.set(dom.byId("sliderWrap"),"style", "width:" + (screenSize.w - 334) + "px;");
					//console.log("bingo");
				}  else if(!searchHidden[0] && !searchBottom[0] && !layerBottom[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsNotBottomLayerNotBottom");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsNotBottomLayerNotBottom");
					//domAttr.set(dom.byId("sliderWrap"),"style", "width:" + (screenSize.w - 334) + "px;");
					//console.log("bingo");
				}  else if(!searchHidden[0] && searchRight[0] && layerBottom[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsRightLayerBottom");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsRightLayerBottom");
					domAttr.set(dom.byId("sliderWrap"),"style", "width:" + (screenSize.w - 334) + "px;");
					
					//console.log("bingo");
				} else if(searchHidden[0] && layerBottom[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsRightLayerBottom");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsRightLayerBottom");
					domAttr.set(dom.byId("sliderWrap"),"style", "width:" + (screenSize.w - 34) + "px;");
					
					//console.log("bingo");
				} else if(!searchHidden[0] && searchFree[0] && layerBottom[0] && !layerHidden[0]){
					domAttr.set(dom.byId("sizeHelper"),"class","resultsFreeLayerBottom");
					domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsFreeLayerBottom");
					domAttr.set(dom.byId("sliderWrap"),"style", "width:" + (screenSize.w - 34) + "px;");
					domAttr.set(dom.byId("resultsContent"),"style", "height:" + (box.h - 34) + "px;");
					//console.log("bingo");
				}
				
				
				
				
				
				
				
				
				
				
				
				
				
				//console.log(layer1);
		
				} catch(e){}
			
			
			try{
			if((searchHidden[0] && searchLeft[0])){
				//console.log(searchHidden);
				//console.log(searchLeft);
				domAttr.set(scalebar, "style", "left: 25px;");
				domAttr.set(dom.byId("map_zoom_slider"), "style", "z-index: 30;");
					if(!mobilePortrait[0] && !mobileLandscape[0]){
						domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");
					}
     			
			} else if(layerLeft[0] && layerHidden[0]){
				//console.log(searchHidden);
				//console.log(searchLeft);
				domAttr.set(scalebar, "style", "left: 25px;");
				domAttr.set(dom.byId("map_zoom_slider"), "style", "z-index: 30;");
					if(!mobilePortrait[0] && !mobileLandscape[0]){
						domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");
					}
     			
			} 
			} catch(e){}
			  
			 if((searchLeft[0] && searchVisible[0]) || (layerLeft[0] && !layerHidden[0])){
				
						if(layerLeft[0] && !layerHidden[0]){
						
						
							
						domAttr.set(scalebar, "style", "left: " + (box1.w + (box1.x + 22) + 20) +"px;");
    			   		domAttr.set(dom.byId("map_zoom_slider"), "style", "left: " + (box1.w + (box1.x + 22) ) +"px; z-index: 30;");
    			   		//try{domAttr.set(dom.byId(query(".searchFix")[0]),"style","left: " + (box1.w + (box1.x + 88) ) +"px; z-index: 30;");}catch(e){}
    			   		if(!mobilePortrait[0] && !mobileLandscape[0]){
						try{domAttr.set(dom.byId(query(".searchFix")[0]),"style","left: " + (box1.w + (box1.x + 88) ) +"px; z-index: 30;");}catch(e){}
						} }else{
				
				
						domAttr.set(scalebar, "style", "left: " + (box.w + (box.x + 22) + 20) +"px;");
    			   		domAttr.set(dom.byId("map_zoom_slider"), "style", "left: " + (box.w + (box.x + 22) ) +"px; z-index: 30;");
    			   		if(!mobilePortrait[0] && !mobileLandscape[0]){
						domAttr.set(dom.byId(query(".searchFix")[0]),"style","left: " + (box.w + (box.x + 88) ) +"px; z-index: 30;");
						}
    			   		
    			   	}
    			   		
    			   		
			}	
    				
    		if(layerRight[0] && !layerHidden[0] && !searchVisible[0] && searchBottom[0]){
    			domAttr.set(dom.byId("pclogo"), "style", "left: " + (box1.x - 70) +"px;");
    		}
    				
			  if(searchBottom[0] && searchVisible[0]){
				//console.log("bazinga");
     			  		//domAttr.set(dom.byId("resultsContent"),"style",  "height:" + (vs.h - box.y - 25) + "px !important;");
     			  		
     			  		
     			  		if(layerLeft[0] && !layerHidden[0]){
     			  			domAttr.set(scalebar, "style", "left: " + (box1.w + (box1.x + 22) + 20) +"px;" +  "top: " + (box.y - 30) + "px !important;");
     			  		} else {
     			  		domAttr.set(scalebar, "style", "top: " + (box.y - 30) + "px !important; left: 25px;");
     			  		}
     			  		
     			  		if(layerRight[0] && !layerHidden[0]){
     			  			domAttr.set(dom.byId("pclogo"), "style", "left: " + (box1.x - 70) +"px;" + "top: " + (box.y - 65) + "px !important;");
     			  		} else{
     			  		
     			  		domAttr.set(dom.byId("pclogo"), "style", "top: " + (box.y - 65) + "px !important;");
     			  		}
     			  		if(!mobilePortrait[0] && !mobileLandscape[0] && !layerLeft[0] && layerHidden[0]){
						try{domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");} catch(e){}
						}
     			  		
			} 
			 if(searchBottom[0] && searchHidden[0]){
			 	if(!layerRight[0] && !layerHidden[0]){
				domAttr.set(dom.byId("pclogo"), "style", "");
				}
				if((layerHidden[0]) || (!layerHidden[0] && layerFree[0]) || (!layerHidden[0] && layerRight[0])){

     			domAttr.set(scalebar, "style", "left: 25px;");
     		}
     			if(!mobilePortrait[0] && !mobileLandscape[0] && !layerLeft[0] && layerHidden[0]){
					try{domAttr.set(dom.byId(query(".searchFix")[0]),"style","z-index: 30;");} catch(e){}
					}
     		
			} 
			 if(searchRight[0] && searchHidden[0]){
				domAttr.set(dom.byId("pclogo"), "style", "");
			}  
			 if(searchRight[0] && searchVisible[0]){
				domAttr.set(dom.byId("pclogo"), "style", "left: " + (box.x - 50) +"px;");
			} 
			 if(searchFree[0] && searchVisible[0]){
				domAttr.set(dom.byId("resultsContent"),"style", "height:" + (box.h - 34) + "px;");
				if((screenSize.w - box.x) <= 375){
					domAttr.set(dom.byId("pclogo"), "style", "left: " + (box.x - 50) +"px;");
				} else {domAttr.set(dom.byId("pclogo"), "style", "");}
				if((box.x) <= 66){
					domAttr.set(scalebar, "style", "left: " + (box.w + (box.x + 22) + 20) +"px;");
				} else {
					domAttr.set(scalebar, "style", "left: 25px;");
				}
			}	
			 if(searchFree[0] && searchHidden[0]){
				domAttr.set(dom.byId("pclogo"), "style", "");
     			domAttr.set(scalebar, "style", "left: 25px;");
			}
			
			
			} catch(e){}
		},75);
		
		
		
		
		
		
		
		
		
		
		setInterval(function(){
			//console.log(screenSize);
			try{
			if(screenSize.w <= 1380){
				domAttr.set(dom.byId("search_wrapper"), "class", "search_wrapper searchFix");
				//console.log(screenSize);
			}
			} catch(e){console.log(screenSize);}
		
			
		}, 2000);
		
		setInterval(function(){
			//console.log(screenSize.w);
		try{
			if(screenSize.w <= 680){
				var mobDet = query(".dj_ios");
				var mobDet2 = query(".dj_android");
				if(mobDet[0] || mobDet2[0]){
					if(screenSize.w <= 479){
					domAttr.set(dom.byId("button-console"),"class","mobile-mode-portrait");
				//	domAttr.set(dom.byId("tools"),"style","width: 310px;");
					}
					if(screenSize.w >= 480 ){
						domAttr.set(dom.byId("button-console"),"class","mobile-mode-landscape");
					//	domAttr.set(dom.byId("tools"),"style","width: 412px;");
					}
					domAttr.set(dom.byId("map_zoom_slider"),"class","esriSimpleSlider esriSimpleSliderVertical esriSimpleSliderTL hide");
					domAttr.set(dom.byId("dockButton"),"class","hide");
					//domAttr.set(dom.byId("tools"),"style","width: 412px;");
					domAttr.set(dom.byId("search_wrapper"),"style","z-index: 30; left: 7px !important;");
				}
				
			}
		}catch(e){}
		}, 50);
	});  
	
	function fadeConsole(){
		/*
		var searchTemp = dom.byId("search_wrapper");
    	var toolbarTemp = dom.byId("tools");
    	var incTemp = dom.byId("increment");
    	var decTemp = dom.byId("decrement");
        	
 			
 			vs = win.getBox();
 			if(vs.w < 778 && openClose == false){
 				fx.fadeOut({ node: searchTemp, duration: 225 }).play();
 				fx.fadeOut({ node: toolbarTemp, duration: 225 }).play();
 				fx.fadeOut({ node: incTemp, duration: 225 }).play();
 				fx.fadeOut({ node: decTemp, duration: 225 }).play();
 			    setTimeout(function(){
 			    	domAttr.set(fix1, "class", "invisible");
 			    }, 240);
 			
 				
 			} 
 			
 			 if(openClose){
 			 	domAttr.set(fix1, "class", "visible");
 				fx.fadeIn({ node: searchTemp, duration: 225 }).play();
 				fx.fadeIn({ node: toolbarTemp, duration: 225 }).play();
 				fx.fadeIn({ node: incTemp, duration: 225 }).play();
 				fx.fadeIn({ node: decTemp, duration: 225 }).play();
 				/* domAttr.set(searchTemp, "class", "search_wrapper");
 				domAttr.set(toolbarTemp, "class", "show");
 				domAttr.set(incTemp, "class", "show");
 				domAttr.set(decTemp, "class", "show");
 				
 			}
 			
		*/
	}
	
	var openClose = false; //closed initially
  
    on(viewButton, "click", function(){
    	
    	//fadeConsole();
 			
 			
 			if(openClose == false){
        	//slideIt(-300, 0, slideTarget,0);
        	fx.fadeIn({node: slideTarget, duration: 0}).play();
        	setTimeout(function(){domAttr.set(slideTarget, "class", "showx");}, 0);
        	openClose = true;
 			} else {
 				//slideIt(300, 0, slideTarget,0);
 				fx.fadeOut({node: slideTarget, duration: 0}).play();
 				setTimeout(function(){domAttr.set(slideTarget, "class", "hide");}, 0);
 				openClose = false;
 			setTimeout(function(){
 				//domAttr.set(dom.byId("searchResults"), "style", "top: 37px; left:" + (vs.w - 21) + "px;");
 			}, 500);
 			}
 			if(layerBottom[0] && searchBottom[0] ){
       			respond();
       		}
 			
        });
      
      
      var big = true;
      var med = false;
      var small = false;
      var smallBig = false;
      var bigSmall = false;
     on(window, "resize", function(){
     	//respond(1250);
     }); 
      
      var big1;
      var med1;
      var small1;
      function respond(respTime){
      	
     	 vs = win.getBox();
		
     	domAttr.set(dom.byId(query(".search_wrapper")[0]),"style","");
     	domAttr.set(dom.byId(query("#sliderWrap")[0]),"style","");
     	domAttr.set(dom.byId("sliderWrapHelper"),"class","layerSnapLeft");
     	domAttr.set(dom.byId("sliderWrapHelper0"),"class","resultsBottomLayerLeft");
     	domAttr.set(dom.byId("sizeHelper"),"class","resultsBottomLayerLeft");
     	
     	aContainer.resize();
     	
		//domAttr.set(slideTarget, "style", "top: " + domGeom.getMarginBox(dom.byId("button-console")).h + "px; height: " + (win.getBox().h - domGeom.getMarginBox(dom.byId("button-console")).h) + "px;" );
		moved = false;
		try{
			dnd.destroy();
		} catch(e){}
		if(!unmovedView){
			domAttr.set(slideTarget, "style", "bottom: 0px; opacity: 0;" );
			
         	
        
         	domAttr.set(dom.byId("pclogo"), "style", "");
         	domAttr.set(scalebar, "style", "left: 25px;");
 
         
         	
		} 
		if(unmovedView) {
			domAttr.set(slideTarget, "style", "bottom: 0px; opacity: 1;" );
		
         		 domAttr.set(dom.byId("pclogo"), "style", "bottom: 180px;");
         	domAttr.set(scalebar, "style", "bottom: 180px; left: 25px;");
         		
      
         	
		}
		domAttr.set(dom.byId("map_zoom_slider"),"style","z-index:30;");
		domAttr.set(dom.byId("moveHelper"), "class", "searchSnapBottom ssbInitial" );
		domAttr.set(dom.byId("resultsContent"),"style",  "height: 150px !important;");
		docked = true;
		domAttr.set(dockButton, "class","docked");
		domAttr.set(dom.byId("modeHelper"),"class","dockMode");
		if(vs.w <= 1380){
			domAttr.set(dom.byId("search_wrapper"), "class", "search_wrapper searchFix");
			
		} else {
			domAttr.set(dom.byId("search_wrapper"), "class", "search_wrapper");
			
		}
		
		
		//to center print menu
		  $("#printMenu").position({
            my: "center",
            at: "center",
            of: "#map"
        });
        
     
		
      }
      	
     on(locateButton, "click", function(){
     	
     	
     	
     		//slideIt(300, 0, slideTarget,0);
     		domAttr.set(slideTarget, "class", "showx");
     		fx.fadeIn({node: slideTarget, duration: 0}).play();
     		showIt(true);
     		
     		openClose = true;
     	
     	
     });
      
      
      
      
       on(bufferButton, "click", function(){
     	
     	/*
     	if(openClose){
     		//slideIt(300, 0, slideTarget,0);
     		fx.fadeOut({node: slideTarget, duration: 225}).play();
     		setTimeout(function(){domAttr.set(slideTarget, "class", "hide");}, 250);
     		openClose = false;
     	} 
     	try{
     	dom.byId("tableContent").innerHTML = "";
     	} catch(e){
     		document.getElementById('tableContent').innerText="";
     	}
     	*/
     	
     }); 
     var bufferOC = false;
      on(bufferMode, "click", function(){
      	if(bufferOC == false){
      		
      		if(drawOC){
      			
      			slideIt(-387, 0, "measurementDiv",0);
        		drawOC = false;
      			setTimeout(function(){
      				slideIt(380, 0, bufferParams,0);
        			bufferOC = true;
      				
      			}, 250);
      			
        		
        		
      		} else {
      		
      		
      		
        	slideIt(380, 0, bufferParams,0);
        	bufferOC = true;
        	}
 			 } else {
 				slideIt(-380, 0, bufferParams,0);
 				bufferOC = false;
 			}
      });
     
     var drawOC = false;
     on(drawMode, "click", function(){

		


      	if(drawOC == false){
			
			if(bufferOC){
			slideIt(-380, 0, bufferParams,0);
 				bufferOC = false;
			setTimeout(function(){
				slideIt(387, 0, "measurementDiv",0);
        		drawOC = true;
			}, 250);
			
		} else {
			slideIt(387, 0, "measurementDiv",0);
        	drawOC = true;
		}
			
        	
        	
        	
        	
 			} else {

 				slideIt(-387, 0, "measurementDiv",0);
 				
 				drawOC = false;
 			}
      });
      
    
    var textMode = false;
 	on(textModeButton, "click", function(){ 
 		//textModeSwitch();
 	});
   
        
        function textModeSwitch(){
        	console.log(domGeom.position(dom.byId("noIconMode")));
 		if(!textMode){
 				domAttr.set(body, "class", "tundra textMode");	
 			//slideIt(-400, 0, "button-console",0);
 			slideIt(-400, 0, "search_wrapper",0);
 			slideIt(-400, 0, "increment",250);
 			slideIt(-400, 0, "decrement",350);
 			slideIt(-400, 0, "clear",450);
 			slideIt(-400, 0, "bufferMode",550);
 			slideIt(-400, 0, "draw",650);
 			slideIt(-400, 0, "gallery",750);
 			slideIt(-400, 0, "print_button",850);
 			slideIt(-400, 0, "toggleOutput",950);
 			slideIt(-400, 0, "legendToggle",1050);
 			slideIt(-500, 0, "helpButton",1150);
 			slideIt(0, textModeHeight, "noIconMode",1500);
 			slideIt(400, searchWrapperHeight, "search_wrapper",1600);
 			setTimeout(function(){
 				switch (domGeom.position(dom.byId("noIconMode")).h) {
 					case 71:
 					slideIt(0, 50, "searchResults",150);
 					break;
 					
 					case 90:
 					slideIt(0, 50, "searchResults",150);
 					break;
 					
 					case 117:
 					slideIt(0, 96, "searchResults",150);
 					break;
 				}
 				
 			},100);
 			
 		
 			
 			textMode = true;
 			
 		} else {
 			
 			domAttr.set(body, "class", "tundra buttonMode");
 			slideIt(0, (textModeHeight * -1), "noIconMode",0);
 			slideIt(0, (searchWrapperHeight * -1), "search_wrapper",150);
 			slideIt(380, (buttonConsoleHeight + zoomOffset), "decrement",250);
 			slideIt(380, (buttonConsoleHeight + zoomOffset), "increment",350);
 	
 			if (smallBig && domGeom.position(dom.byId("clear")).y <= 59){
 				slideIt(248, 6, "clear", 450);
 				slideIt(182, 6, "bufferMode", 550);
 				slideIt(116, 6, "draw", 650);
 				slideIt(248, 6, "gallery", 750);
 				slideIt(248, 6, "print_button", 850);
 				slideIt(248, 6, "toggleOutput",950);
 				slideIt(248, 6, "legendToggle",1050);
 				slideIt(348, 6, "helpButton",1150);
 			} else if(bigSmall){
 				slideIt(248, buttonConsoleHeight, "clear", 450);
 				slideIt(182, buttonConsoleHeight, "bufferMode", 550);
 				slideIt(116, buttonConsoleHeight, "draw", 650);
 				slideIt(248, buttonConsoleHeight, "gallery", 750);
 				slideIt(248, buttonConsoleHeight, "print_button", 850);
 				slideIt(248, buttonConsoleHeight, "toggleOutput",950);
 				slideIt(248, buttonConsoleHeight, "legendToggle",1050);
 				slideIt(348, buttonConsoleHeight, "helpButton",1150);
 				//bigSmall = false;
 				buttonConsoleHeight = -92;
 			} 
 			
 			else {
 				slideIt(248, buttonConsoleHeight, "clear", 450);
 				slideIt(182, buttonConsoleHeight, "bufferMode", 550);
 				slideIt(116, buttonConsoleHeight, "draw", 650);
 				slideIt(248, buttonConsoleHeight, "gallery", 750);
 				slideIt(248, buttonConsoleHeight, "print_button", 850);
 				slideIt(248, buttonConsoleHeight, "toggleOutput",950);
 				slideIt(248, buttonConsoleHeight, "legendToggle",1050);
 				slideIt(348, buttonConsoleHeight, "helpButton",1150);
 			
 			/*
 				setTimeout(function(){
 				switch (domGeom.position(dom.byId("noIconMode")).h) {
 					case 71:
 					slideIt(0, -50, "searchResults",150);
 					break;
 					
 					case 90:
 					slideIt(0, -50, "searchResults",150);
 					break;
 					
 					case 117:
 					slideIt(0, -96, "searchResults",150);
 					break;
 				}
 				
 			},500);
 				*/
 				
 				
 			}
 			
 			textMode = false;
 		}
 		//
 		setTimeout(function(){console.log(domGeom.position(dom.byId("noIconMode")));}, 2000);
        }
        
        
    });