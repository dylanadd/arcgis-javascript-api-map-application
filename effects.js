  require(["dojo/_base/fx", "dojo/on", "dojo/dom","dojo/dom-attr","dojo/query","dojo/dom-geometry","dojo/fx", "dojo/ready", "dojo/NodeList-manipulate",  "dojo/domReady!" ], function(fx, on, dom, domAttr, query, domGeom, coreFx, ready) {
        var fadeButton = dom.byId("toggleOutput"),
            fadeTarget = dom.byId("output");
 		var clearButton = dom.byId("clear");
 		var viewButton = dom.byId("openClose");
 		var locateButton = dom.byId("locate");
 		var map = dom.byId("map");
		var fade = null;       
		var  secondary;
       var slideTarget = dom.byId("searchResults");
       
        on(fadeButton, "click", function(evt){
    
        console.log(fade);
        console.log(dom.byId("outTable").innerHTML);
        
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
            console.log(fade);
            
        });
        
        
        
        
        
        
        on(clearButton, "click", function(){
        	
        	fx.fadeOut({ node: fadeTarget, duration: 225 }).play();
        	fade = false;
        		domAttr.set(fadeTarget, "class", "hide");
        	   	domAttr.set(fadeButton, "class", "closed");
        	   	dom.byId("resultsContent").innerHTML = "";
        	   	
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
    	      console.log(t);
      	  } catch(e) {}
      	
      	
      	
      	
      	});
      	
   function slideIt(amt){
   	console.log(domGeom.position(slideTarget));
  
   
   coreFx.slideTo({
      node: slideTarget,
      top: domGeom.position(slideTarget).y.toString(),
      left: (domGeom.position(slideTarget).x + amt).toString(),
      unit: "px",
      duration: 150
    }).play();
   // setTimeout(function(){console.log(domGeom.position(slideTarget));}, 2000);
   
      }
  
  
	ready(function(){
		console.log(domGeom.position(slideTarget));
		domAttr.set(slideTarget, "style", "top: " + domGeom.position(slideTarget).y.toString() + "px; left: " + domGeom.position(slideTarget).x.toString() + "px;");
	});  
	
	
	var openClose = false; //closed initially
  
    on(viewButton, "click", function(){
        	if(openClose == false){
        	slideIt(-300);
        	openClose = true;
 			} else {
 				slideIt(300);
 				openClose = false;
 			}
        });
      	
     on(locateButton, "click", function(){
     	if(openClose){
     		slideIt(300);
     		openClose = false;
     	}
     });
        
    });