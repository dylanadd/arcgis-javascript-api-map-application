  require(["dojo/_base/fx", "dojo/on", "dojo/dom","dojo/dom-attr","dojo/query","dojo/dom-geometry","dojo/fx", "dojo/ready", "dojo/dom-style" ,"dojo/NodeList-manipulate",  "dojo/domReady!" ], function(fx, on, dom, domAttr, query, domGeom, coreFx, ready, domStyle) {
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
     		slideIt(300, 0, slideTarget);
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
      	
   function slideIt(amtH, amtV, target){
   	console.log(domGeom.position(target));
  	console.log(target);
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
      }
  
  
	ready(function(){
		//console.log(domGeom.position(slideTarget));
		
		domAttr.set(slideTarget, "style", "top: " + domGeom.position(slideTarget).y.toString() + "px; left: " + domGeom.position(slideTarget).x.toString() + "px;");
	//	domAttr.set(fadeTarget, "style", "top: " + domGeom.position(fadeTarget).y.toString() + "px; left: " + domGeom.position(fadeTarget).x.toString() + "px;");
		domAttr.set(dom.byId("dijit_TitlePane_0_titleBarNode"), "title", "Change the application's basemap");
		setTimeout(function(){
			try{
			domAttr.set(dom.byId("dijit_form_ComboButton_0_arrow"), "title", "Print the map");
			} catch(e){}
		},2000);
		domAttr.set(dom.byId("map_zoom_slider"), "title", "Zoom the map in or out");

		
		
	});  
	
	
	var openClose = false; //closed initially
  
    on(viewButton, "click", function(){
        	if(openClose == false){
        	slideIt(-300, 0, slideTarget);
        	openClose = true;
 			} else {
 				slideIt(300, 0, slideTarget);
 				openClose = false;
 			}
        });
      	
     on(locateButton, "click", function(){
     	if(openClose){
     		slideIt(300, 0, slideTarget);
     		openClose = false;
     	}
     });
      
      
      
      
       on(bufferButton, "click", function(){
     	if(openClose){
     		slideIt(300, 0, slideTarget);
     		openClose = false;
     	}
     	dom.byId("resultsContent").innerHTML = "";
     	
     	
     	
     }); 
     var bufferOC = false;
      on(bufferMode, "click", function(){
      	if(bufferOC == false){
      		
      		if(drawOC){
      			
      			slideIt(-387, 0, "measurementDiv");
        		drawOC = false;
      			setTimeout(function(){
      				slideIt(360, 0, bufferParams);
        			bufferOC = true;
      				
      			}, 250);
      			
        		
        		
      		} else {
      		
      		
      		
        	slideIt(360, 0, bufferParams);
        	bufferOC = true;
        	}
 			 } else {
 				slideIt(-360, 0, bufferParams);
 				bufferOC = false;
 			}
      });
     
     var drawOC = false;
     on(drawMode, "click", function(){

		


      	if(drawOC == false){
			
			if(bufferOC){
			slideIt(-360, 0, bufferParams);
 				bufferOC = false;
			setTimeout(function(){
				slideIt(387, 0, "measurementDiv");
        		drawOC = true;
			}, 250);
			
		} else {
			slideIt(387, 0, "measurementDiv");
        	drawOC = true;
		}
			
        	
        	
        	
        	
 			} else {

 				slideIt(-387, 0, "measurementDiv");
 				
 				drawOC = false;
 			}
      });
      
  
 	
   
        
    });