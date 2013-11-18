  require(["dojo/_base/fx", "dojo/on", "dojo/dom","dojo/dom-attr","dojo/query", "dojo/NodeList-manipulate", "dojo/domReady!" ], function(fx, on, dom, domAttr, query) {
        var fadeButton = dom.byId("toggleOutput"),
            fadeTarget = dom.byId("output");
 		var clearButton = dom.byId("clear");
 		var map = dom.byId("map");
		var fade = null;       
		var  secondary;
       
       
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
        	fade = false;
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
      	
      //	try{
      	
     // 	on(secondary,"click",function(){
      		//fade = true;
      	//	console.log(fade);
      //	});
      	//alert("still tried");
      //	} catch(e){ console.log(e);}
        
    });