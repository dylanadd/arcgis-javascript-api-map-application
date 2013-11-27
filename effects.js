  require(["dojo/_base/fx", "dojo/on", "dojo/dom","dojo/dom-attr","dojo/query","dojo/dom-geometry","dojo/fx", "dojo/ready", "dojo/dom-style" , "dojo/window" ,"dojo/NodeList-manipulate",  "dojo/domReady!" ], function(fx, on, dom, domAttr, query, domGeom, coreFx, ready, domStyle, win) {
        var fadeButton = dom.byId("toggleOutput"),
            fadeTarget = dom.byId("output");
 		var clearButton = dom.byId("clear");
 		var viewButton = dom.byId("openClose");
 		var locateButton = dom.byId("locate");
 		var bufferButton = dom.byId("buffer");
 		var map = dom.byId("map");
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
       
       var vs = win.getBox();
        
       var textModeHeight = 50;
       var searchWrapperHeight = 50; 
       var buttonConsoleHeight = -40; 
       var zoomOffset = 0;
        var selectionToggle = false;
       on(fadeButton, "click", function(evt){
    	
    	// console.log(domStyle.getComputedStyle(dom.byId("measurementDiv")));
        
        if(dom.byId("outTable").innerHTML == "") {
        
        } else {
        	if(fade || fade == null) {
        	    fx.fadeOut({ node: fadeTarget, duration: 225 }).play();
        	    fade = false;
        	   setTimeout(function(){
        	   	domAttr.set(fadeTarget, "class", "hide");
        	   	domAttr.set(fadeButton, "class", "closed");
        	   	}, 225);
            } else {
            	
            		domAttr.set(fadeTarget, "class", "xxhide");
            		fx.fadeIn({ node: fadeTarget, duration: 225 }).play();
            		domAttr.set(fadeButton, "class", "open");
            		fade = true;
            	 	
            
            }
            }
            
            
        });
        
        
        
        
        
        
        on(clearButton, "click", function(){
        	
        	fx.fadeOut({ node: fadeTarget, duration: 225 }).play();
        	fade = false;
        		domAttr.set(fadeTarget, "class", "hide");
        	   	domAttr.set(fadeButton, "class", "closed");
        	   	dom.byId("resultsContent").innerHTML = "";
        	   	
        	   	
        	if(openClose){
     		slideIt(300, 0, slideTarget,0);
     		openClose = false;
     	}   	
        	   	
        });
        
        var temp = true;
        
      	on(map, "click", function(){
      	
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
  
  
	ready(function(){
		//console.log(domGeom.position(slideTarget));
		console.log(domGeom.position(dom.byId("tools")));
		domAttr.set(slideTarget, "style", "top: " + domGeom.position(slideTarget).y.toString() + "px; left: " + domGeom.position(slideTarget).x.toString() + "px;");
	//	domAttr.set(fadeTarget, "style", "top: " + domGeom.position(fadeTarget).y.toString() + "px; left: " + domGeom.position(fadeTarget).x.toString() + "px;");
		domAttr.set(dom.byId("dijit_TitlePane_0_titleBarNode"), "title", "Change the application's basemap");
		setTimeout(function(){
			try{
			domAttr.set(dom.byId("dijit_form_ComboButton_0_arrow"), "title", "Print the map");
			} catch(e){}
		},2000);
		domAttr.set(dom.byId("map_zoom_slider"), "title", "Zoom the map in or out");

		query(".esriSimpleSliderIncrementButton").wrap("<div id=\"increment\"></div>");
		query(".esriSimpleSliderDecrementButton").wrap("<div id=\"decrement\"></div>");
		respond(0);
		
		
	});  
	
	function fadeConsole(){
		
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
 				/* domAttr.set(searchTemp, "class", "search_wrapper hide");
 				domAttr.set(toolbarTemp, "class", "hide");
 				domAttr.set(incTemp, "class", "hide");
 				domAttr.set(decTemp, "class", "hide");
 				*/
 			} 
 			
 			 if(openClose){
 				fx.fadeIn({ node: searchTemp, duration: 225 }).play();
 				fx.fadeIn({ node: toolbarTemp, duration: 225 }).play();
 				fx.fadeIn({ node: incTemp, duration: 225 }).play();
 				fx.fadeIn({ node: decTemp, duration: 225 }).play();
 				/* domAttr.set(searchTemp, "class", "search_wrapper");
 				domAttr.set(toolbarTemp, "class", "show");
 				domAttr.set(incTemp, "class", "show");
 				domAttr.set(decTemp, "class", "show");
 				*/
 			}
 			
		
	}
	
	var openClose = false; //closed initially
  
    on(viewButton, "click", function(){
    	
    	fadeConsole();
 			
 			
 			if(openClose == false){
        	slideIt(-300, 0, slideTarget,0);
        	openClose = true;
 			} else {
 				slideIt(300, 0, slideTarget,0);
 				openClose = false;
 			}
 			
 			
        });
      
      
      var big = true;
      var med = false;
      var small = false;
      var smallBig = false;
      var bigSmall = false;
     on(window, "resize", function(){
     	respond(1250);
     }); 
      
      var big1;
      var med1;
      var small1;
      function respond(respTime){
      	
     	if(textMode){
     		on.emit(dom.byId("iconToggle"), "click", {bubbles: true, cancelable: true});
     	}
     	
     	 vs = win.getBox();
     	//console.log(vs);
     	
     	if(openClose){
     		fadeConsole();
     	}
     	openClose = false;
		domAttr.set(dom.byId("searchResults"), "style", "top: 0px; left:" + (vs.w - 21) + "px;");
		
		//BEGIN RESPONSE FUNCTIONS
		
		setTimeout(function(){
		//console.log(domGeom.getContentBox(dom.byId("noIconMode")));
     	if(vs.w < 957 && vs.w > 490){
     		med1 = true;
     		small1 = false;
     		big1 = false;
     		if(!textMode){
     		domAttr.set(dom.byId("noIconMode"), "style", "top: -71px; left: 0px");
     		
     		}
     		
     		textModeHeight = 71;
     		buttonConsoleHeight = -82;
     		zoomOffset = 42;
     		
     		if(!med && big){
     			slideIt(0,21, "search_wrapper", 0);
     			slideIt(0,21, "tools", 0);
     			if(textMode){
     				slideIt(-10,-21, "increment", 0);
     				slideIt(-10,-21, "decrement", 0);
     			} else {
     				slideIt(-10,1, "increment", 0);
     				slideIt(-10,1, "decrement", 0);
     			}
     			searchWrapperHeight += 21;
     			med = true;
     			big = false;
     			small = false;
     		} else if (!med && small){
     			
     			slideIt(0,-25, "search_wrapper", 0);
     			slideIt(0,-25, "tools", 0);
     			
     			
     			if(textMode){
     				slideIt(-10,-20, "increment", 0);
     				slideIt(-10,-20, "decrement", 0);
     			} else {
     				slideIt(-10,-45, "increment", 0);
     				slideIt(-10,-45, "decrement", 0);
     			}
     			
     			searchWrapperHeight -= 25;
     			med = true;
     			big = false;
     			small = false;
     		}
     		     		
     	}
     	if(vs.w >= 957){
     		med1 = false;
     		small1 = false;
     		big1 = true;
     		if(!textMode){
     			domAttr.set(dom.byId("noIconMode"), "style", "top: -50px; left: 0px");
     		}
     		textModeHeight = 50;
     	//	buttonConsoleHeight = 0;
     		zoomOffset = 0;
     		
     		if(!big && med){
     			buttonConsoleHeight = -40;
     			if(domGeom.position(dom.byId("search_wrapper")).y > 10){
     			slideIt(0,-21, "search_wrapper", 0);
     			
     			slideIt(0,-21, "tools", 0);
     			
     			if(textMode){
     				slideIt(-10,-20, "increment", 0);
     				slideIt(-10,-20, "decrement", 0);
     			} else {
     				slideIt(-10,-41, "increment", 0);
     				slideIt(-10,-41, "decrement", 0);
     			}
     			
     			
     			
     			
     			}
     			searchWrapperHeight -= 21;
     			med = false;
     			big = true;
     			small = false;
     		} else if (!big && small){
     			
     			if(textMode){
     				slideIt(0,-92, "search_wrapper", 0);
     				slideIt(0,-69, "tools", 0);
     				slideIt(-10,-66, "increment", 0);
     				slideIt(-10,-66, "decrement", 0);
     				
     				buttonConsoleHeight = -40;
     			} else {
     				buttonConsoleHeight = -40;
     			slideIt(0,-46, "search_wrapper", 0);
     			slideIt(0,-46, "tools", 0);
     			slideIt(-10,-66, "increment", 0);
     			slideIt(-10,-66, "decrement", 0);
     			}
     			searchWrapperHeight -= 46;
     			med = false;
     			big = true;
     			small = false;
     			smallBig = true;
     			
     		}
     		
     	}
     	if(vs.w <= 490) {
     		med1 = false;
     		small1 = true;
     		big1 = false;
     		smallBig = false;
     		if(!textMode){
     		domAttr.set(dom.byId("noIconMode"), "style", "top: -96px; left: 0px");
     		}
     		textModeHeight = 96;
     		buttonConsoleHeight = -134;
     		zoomOffset = 92;
     		
     		if(!small && big){
     			if(textMode){
     			slideIt(0,92,"search_wrapper",0);
     			slideIt(0,92, "tools", 0);	
     			slideIt(-10,72, "increment", 0);
     			slideIt(-10,72, "decrement", 0);
     			bigSmall = true;
     			} else {
     			slideIt(0,46, "search_wrapper", 0);
     			slideIt(0,46, "tools", 0);
     			slideIt(-10,26, "increment", 0);
     			slideIt(-10,26, "decrement", 0);
     			searchWrapperHeight += 46;
     			}
     			med = false;
     			big = false;
     			small = true;
     		} else if (!small && med){
     			slideIt(0,25, "search_wrapper", 0);
     			slideIt(0,25, "tools", 0);
     			
     			
     			if(textMode){
     				slideIt(-10,-20, "increment", 0);
     				slideIt(-10,-20, "decrement", 0);
     			} else {
     				slideIt(-10,5, "increment", 0);
     				slideIt(-10,5, "decrement", 0);
     			}
     			
     			
     			searchWrapperHeight += 25;
     			med = false;
     			big = false;
     			small = true;
     		}
     	}
     	console.log(buttonConsoleHeight);
     //	domAttr.set(dom.byId("searchResults"), "style", "height: " + vs.h + "px;");
     	}, respTime);
     	//END RESPONSE FUNCTIONS
     	
     	//SPECIAL FUNCTIONS FOR SCREENS < 778PX WIDE
     	
      }
      	
     on(locateButton, "click", function(){
     	if(openClose){
     		slideIt(300, 0, slideTarget,0);
     		openClose = false;
     	}
     });
      
      
      
      
       on(bufferButton, "click", function(){
     	if(openClose){
     		slideIt(300, 0, slideTarget,0);
     		openClose = false;
     	}
     	dom.byId("resultsContent").innerHTML = "";
     	
     	
     	
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
 		textModeSwitch();
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
 		setTimeout(function(){console.log(domGeom.position(dom.byId("noIconMode")));}, 2000);
        }
        
        
    });