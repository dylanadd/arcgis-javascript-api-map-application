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
   	console.log(domGeom.position(target));
  	console.log(target);
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
		//console.log(vs);
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
		
	});  
	
	
	var openClose = false; //closed initially
  
    on(viewButton, "click", function(){
    	
        	if(openClose == false){
        	slideIt(-300, 0, slideTarget,0);
        	openClose = true;
 			} else {
 				slideIt(300, 0, slideTarget,0);
 				openClose = false;
 			}
        });
      
      
      
      
     on(window, "resize", function(){
     	 vs = win.getBox();
     	//console.log(vs);
     	openClose = false;
		domAttr.set(dom.byId("searchResults"), "style", "top: 0px; left:" + (vs.w - 21) + "px;");
		
		//console.log(domGeom.getContentBox(dom.byId("noIconMode")));
     	if(vs.w < 957 && vs.w > 490){
     		domAttr.set(dom.byId("noIconMode"), "style", "top: -71px; left: 0px");
     		textModeHeight = 71;
     	}
     	if(vs.w >= 957){
     		domAttr.set(dom.byId("noIconMode"), "style", "top: -50px; left: 0px");
     		textModeHeight = 50;
     	}
     	if(vs.w <= 490) {
     		domAttr.set(dom.byId("noIconMode"), "style", "top: -96px; left: 0px");
     		textModeHeight = 96;
     	}
     }); 
      
      
      	
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
 			slideIt(400, 50, "search_wrapper",1600);
 			textMode = true;
 		} else {
 			domAttr.set(body, "class", "tundra buttonMode");
 			slideIt(0, (textModeHeight * -1), "noIconMode",0);
 			slideIt(0, -50, "search_wrapper",150);
 			slideIt(380, -40, "decrement",250);
 			slideIt(380, -40, "increment",350);
 			slideIt(248, -40, "clear", 450);
 			slideIt(182, -40, "bufferMode", 550);
 			slideIt(116, -40, "draw", 650);
 			slideIt(248, -40, "gallery", 750);
 			slideIt(248, -40, "print_button", 850);
 			slideIt(248, -40, "toggleOutput",950);
 			slideIt(248, -40, "legendToggle",1050);
 			slideIt(348, -40, "helpButton",1150);
 			
 			textMode = false;
 		}
 	});
   
        
    });