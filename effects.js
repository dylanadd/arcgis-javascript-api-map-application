  require(["dojo/_base/fx", "dojo/on", "dojo/dom","dojo/dnd/Moveable","dojo/dom-attr","dojo/query","dojo/dom-geometry","dojo/fx", "dojo/ready", "dojo/dom-style" , "dojo/window", "dojo/_base/xhr", "dojo/request/iframe","dojo/NodeList-manipulate",  "dojo/domReady!" ], function(fx, on, dom, Moveable, domAttr, query, domGeom, coreFx, ready, domStyle, win, xhr, iframe) {
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
        			moved = true;
      			 	console.log(scalebar);
      			 	vs = win.getBox();
       				console.log(vs);
      				 	 box = domGeom.position(searchResults);
      			 	console.log(box);
       	
      			 	if((vs.h - box.y) <= 175){
      			 		//console.log("snap bottom");
     			  		domAttr.set(dom.byId("moveHelper"),"class","searchSnapBottom");
     			  		domAttr.set(dom.byId("resultsContent"),"style",  "height:" + (vs.h - box.y - 25) + "px !important;");
     			  		domAttr.set(dom.byId("pclogo"), "style", "top: " + (box.y - 65) + "px !important;");
     			  		domAttr.set(scalebar, "style", "top: " + (box.y - 30) + "px !important; left: 25px;");
     			  		position = "bottom";
     			  		//console.log(vs.h - box.y);
     			  	} else if((vs.w - box.x) <= 375 && box.y < 150 ) {
   			    		domAttr.set(dom.byId("moveHelper"),"class", "searchSnapRight");
    			   		domAttr.set(dom.byId("resultsContent"),"style",  "");
    			   		domAttr.set(dom.byId("pclogo"), "style", "left: " + (box.x - 50) +"px;");
    			   		position = "right";
     			  	} else if((box.x) <= 66 && box.y < 150 ) {
    			   		domAttr.set(dom.byId("moveHelper"),"class", "searchSnapLeft");
    			   		domAttr.set(dom.byId("resultsContent"),"style",  "");
    			   		domAttr.set(scalebar, "style", "left: " + (box.w + (box.x + 22) + 20) +"px;");
    			   		domAttr.set(dom.byId("map_zoom_slider"), "style", "left: " + (box.w + (box.x + 22) ) +"px; z-index: 30;");
    			   		position = "left";
    			   	}else {
    			   		domAttr.set(dom.byId("moveHelper"),"class", "searchFreeFloat");
    			   		domAttr.set(dom.byId("resultsContent"),"style",  "");
    			   		domAttr.set(dom.byId("pclogo"), "style", "");
     			  		domAttr.set(scalebar, "style", "left: 25px;");
     			  		domAttr.set(dom.byId("map_zoom_slider"), "style", "z-index: 30;");
     			  		position = "free";
     			  	}
       	
       	
       	
      			 });
       
        		 
        		 
        		 
        		docked = false;
        	} else {
        		dnd.destroy();
        		docked = true;
        		domAttr.set(dockButton,"class","docked");
        		domAttr.set(dom.byId("modeHelper"),"class","dockMode");
        	}
        });
        
       
        
        dojo.connect(dnd, "onMoveStop", function(e){
        	//dnd.destroy();
        });
        
        
        
        
        var idTF = false;
        on(identify,"click",function(){
        	
        	if(!idTF){
        	domAttr.set(dom.byId("identify"),"class","idActive");
        	domAttr.set(popTemp,"class","esriPopup");
        	idTF = true;
        	} else {
        		domAttr.set(dom.byId("identify"),"class","idInactive");
        		domAttr.set(popTemp,"class","esriPopup hide");
        		idTF = false;
        	}
        });
        
        
        
        var selectTF = false;
        on(selectButton,"click",function(){
        	if(!selectTF){
        		domAttr.set(dom.byId("selectionTools"), "class", "show");
        		fx.fadeIn({node: dom.byId("selectionTools"), duration: 225}).play();
        		selectTF = true;
        	} else {
        		fx.fadeOut({node: dom.byId("selectionTools"), duration: 225}).play();
        		setTimeout(function(){
        			domAttr.set(dom.byId("selectionTools"), "class", "hide");
        		}, 250);
        		selectTF = false;
        	}
        	
        });
        
        
        on(selectHelp,"click",function(){
        	if(selectTF){
        		fx.fadeOut({node: dom.byId("selectionTools"), duration: 225}).play();
        		setTimeout(function(){
        			domAttr.set(dom.byId("selectionTools"), "class", "hide");
        		}, 250);
        		selectTF = false;
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
       
       
       
       on(helpButton,"click",function(){alert("Feature comming soon.")});
       
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
        });
        
        var unmovedView = false;
       on(fadeButton, "click", function(evt){
    	
    	on.emit(viewButton, "click", {bubbles: true, cancelable: true});
    	
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
         
         
         
        });
      
        
        
        
        
        
        on(clearButton, "click", function(){
        	
        	dom.byId("tableContent").innerHTML = "";
        	
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
  
  var popTemp;
	ready(function(){

	//	console.dir(dnd);
		//domAttr.set(slideTarget, "style", "top: " + domGeom.getMarginBox(dom.byId("button-console")).h + "px; height: " + (win.getBox().h - domGeom.getMarginBox(dom.byId("button-console")).h) + "px;" );
	domAttr.set(slideTarget, "style", "bottom: 0px;" );
	
	
		domAttr.set(dom.byId("dijit_TitlePane_0_titleBarNode"), "title", "Change the application's basemap");
		setTimeout(function(){
			try{
			domAttr.set(dom.byId("dijit_form_ComboButton_0_arrow"), "title", "Print the map");
			} catch(e){}
		},2000);
		domAttr.set(dom.byId("map_zoom_slider"), "title", "Zoom the map in or out");
		query(".dijitTitlePaneTextNode").innerHTML("Basemap");

	//	query(".esriSimpleSliderIncrementButton").wrap("<div id=\"increment\"></div>");
	//	query(".esriSimpleSliderDecrementButton").wrap("<div id=\"decrement\"></div>");
		
		scalebar = query(".esriScalebar");
        	scalebar = dom.byId(scalebar[0]);
        	respond(0);
        	popTemp = query(".esriPopup");
        	popTemp = popTemp[0];
		domAttr.set(popTemp,"class","esriPopup hide");
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
      	
     	
     	 vs = win.getBox();

     	
     	
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
		if(vs.w <= 1225){
			domAttr.set(dom.byId("search_wrapper"), "class", "search_wrapper searchFix");
			
		} else {
			domAttr.set(dom.byId("search_wrapper"), "class", "search_wrapper");
			
		}
		
      }
      	
     on(locateButton, "click", function(){
     	
     	
     	
     		//slideIt(300, 0, slideTarget,0);
     		domAttr.set(slideTarget, "class", "showx");
     		fx.fadeIn({node: slideTarget, duration: 225}).play();
     		
     		openClose = true;
     	
     	
     });
      
      
      
      
       on(bufferButton, "click", function(){
     	
     	/*
     	if(openClose){
     		//slideIt(300, 0, slideTarget,0);
     		fx.fadeOut({node: slideTarget, duration: 225}).play();
     		setTimeout(function(){domAttr.set(slideTarget, "class", "hide");}, 250);
     		openClose = false;
     	} */
     	dom.byId("tableContent").innerHTML = "";
     	
     	
     	
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