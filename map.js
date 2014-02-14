var inputSearchBox = dojo.byId("address");
var change = false;
var map;
var parcels;
var roads;
var infoArray;
var infoArray2 = new Array();
var draw = null;
var buff = null;
var navToolbar;
var overviewMapDijit;
var mDraw;
var legendDijit;
var legendStartup = false;
var gsvc, p, paramx, sp;
var selectionTF = false;

// var gsvc, tb;
require([
    "esri/map", "esri/layers/FeatureLayer", "esri/dijit/OverviewMap", "esri/tasks/locator", "esri/dijit/LocateButton", "esri/layers/ArcGISImageServiceLayer", "esri/layers/ArcGISDynamicMapServiceLayer", "esri/dijit/Legend",
    "esri/layers/ArcGISTiledMapServiceLayer", "esri/tasks/query","dijit/form/HorizontalSlider",
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol",
    "esri/graphic", "esri/dijit/Popup", "esri/dijit/PopupTemplate",
    "esri/urlUtils", "esri/graphicsUtils", "esri/layers/GraphicsLayer",
    "dojo/_base/Color", "esri/tasks/DistanceParameters",
    "dojo/on", "dojo/query", "dojo/parser", "dojo/dom-construct", "dojo/keys", "dijit/registry", "dojo/dom",
    "esri/dijit/Print", "esri/tasks/PrintTemplate", "esri/request", "esri/config", "dojo/_base/array",
    "esri/dijit/BasemapGallery", "esri/arcgis/utils", "esri/dijit/BasemapLayer", "esri/dijit/Basemap",
    "esri/dijit/Scalebar", "esri/dijit/Measurement",  "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/Font", "esri/symbols/TextSymbol", "dojo/number", "esri/geometry/webMercatorUtils", "esri/InfoTemplate",
    "dojo/dom-attr", "esri/sniff", "esri/SnappingManager", "esri/renderers/SimpleRenderer",
    "esri/tasks/GeometryService", "esri/tasks/BufferParameters", "esri/toolbars/draw", "esri/toolbars/navigation", "esri/tasks/QueryTask", //"dojo/_base/connect",
    "esri/geometry/Point", "esri/SpatialReference", "esri/tasks/ProjectParameters", "dojo/behavior", "dojo/request", "esri/dijit/PopupMobile", 
    "esri/layers/OpenStreetMapLayer","esri/layers/WebTiledLayer",

    "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!", "dijit/form/Button"
], function (
    Map, FeatureLayer, OverviewMap,Locator, LocateButton,  ArcGISImageServiceLayer, ArcGISDynamicMapServiceLayer, Legend,
    ArcGISTiledMapServiceLayer, Query,HorizontalSlider,
    SimpleFillSymbol, SimpleLineSymbol,
    Graphic, Popup, PopupTemplate,
    urlUtils, graphicsUtils, GraphicsLayer,
    Color, DistanceParameters,
    on, query, parser, domConstruct, keys, registry, dom,
    Print, PrintTemplate, esriRequest, esriConfig, arrayUtils,
    BasemapGallery, arcgisUtils, BasemapLayer, Basemap, Scalebar, Measurement,
     SimpleMarkerSymbol, Font, TextSymbol, number, webMercatorUtils, InfoTemplate,
    domAttr, has, SnappingManager, SimpleRenderer, GeometryService, BufferParameters, Draw, Navigation, QueryTask,
    Point, SpatialReference, ProjectParameters, behavior, request, PopupMobile, OpenStreetMapLayer, WebTiledLayer

) {

    parser.parse();
   
   
   
   
    $('.sortable').sortable().bind('sortupdate',function(e){
           // console.log($('.sortable li input').get());
           
           setLayerOrder($('.sortable li input').get());
           
           
           
           
           
        });
   
   
   function setLayerOrder(order){
       
       try{map.removeLayer(floodLayer);}catch(e){}
       try{map.removeLayer(zoneLayer);}catch(e){}
       
       
       for(i=(order.length - 1);i>=0;i--){
           console.log(order[i].id);
           if(dom.byId(order[i].id).checked){
              switch(order[i].id){
                  case 'toggleFlood':
                    map.addLayer(floodLayer);
                    break;
                  case 'toggleZoning':
                    map.addLayer(zoneLayer);
                    break;
              }
           }
           
       }
       
       console.log(order);  
            
   }
    
    
    var googleLayer,googleLayerStreet,osmLayer,stamenTerrainLayer,mapBoxTerrainLayer,mapQuestLayer,cloudmadePaleLayer,cloudmadeNightLayer,waterColorLayer,stamenTonerLayer;
    
setTimeout(function(){
//declare google map layers
 /*
  googleLayer = new agsjs.layers.GoogleMapsLayer({
                //id: 'google', // optional. esri layer id.
                // apiOptions: { // load google API should be loaded.
                // v: '3.6' // API version. use a specific version is recommended for production system. 
                // client: gme-myclientID // for enterprise accounts;
                // },
                mapOptions: {  // options passed to google.maps.Map contrustor
                // streetViewControl: false // whether to display street view control. Default is true.
                
                }
              });
           
           
  googleLayerStreet = new agsjs.layers.GoogleMapsLayer({
                //id: 'google', // optional. esri layer id.
                // apiOptions: { // load google API should be loaded.
                // v: '3.6' // API version. use a specific version is recommended for production system. 
                // client: gme-myclientID // for enterprise accounts;
                // },
                mapOptions: {  // options passed to google.maps.Map contrustor
                // streetViewControl: false // whether to display street view control. Default is true.
                
                }
              });   
        */      
  //declare Open Street Map Layer
 osmLayer = new OpenStreetMapLayer({displayLevels:[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]});
     
    //declare web tiled layers 
 stamenTerrainLayer = new WebTiledLayer("http://${subDomain}.tile.stamen.com/terrain/${level}/${col}/${row}.jpg", { "id": "Stamen Terrain", "visible": true, "subDomains":  ["a", "b", "c", "d"], "copyright": "Stamen Watercolor" });  
 mapBoxTerrainLayer = new WebTiledLayer("http://${subDomain}.tiles.mapbox.com/v3/mapbox.mapbox-warden/${level}/${col}/${row}.png", { "id": "Mapbox", "visible": true, "subDomains":  ["a", "b", "c", "d"], "copyright": "Stamen Watercolor" });  
 mapQuestLayer = new WebTiledLayer("http://${subDomain}.mqcdn.com/tiles/1.0.0/vx/map/${level}/${col}/${row}.jpg", { "id": "Mapquest", "visible": true, "subDomains": ["mtile01", "mtile02", "mtile03", "mtile04"], "copyright": "Stamen Watercolor" });  
cloudmadePaleLayer = new WebTiledLayer("http://${subDomain}.tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/998/256/${level}/${col}/${row}.png", { "id": "Cloudmade Pale", "visible": true, "subDomains":  ["a", "b", "c"], "copyright": "Stamen Watercolor" });  
 cloudmadeNightLayer = new WebTiledLayer("http://tile.cloudmade.com/1a1b06b230af4efdbb989ea99e9841af/999/256/${level}/${col}/${row}.png", { "id": "Cloudmade Midnight", "visible": true,  "copyright": "Stamen Watercolor" });  
  waterColorLayer = new WebTiledLayer("http://${subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg", { "id": "Stamen Watercolor", "visible": true, "subDomains":  ["a", "b", "c", "d"], "copyright": "Stamen Watercolor" });  
  stamenTonerLayer = new WebTiledLayer("http://${subDomain}.tile.stamen.com/toner/${level}/${col}/${row}.png", { "id": "Stamen Toner", "visible": true, "subDomains":  ["a", "b", "c", "d"], "copyright": "Stamen Watercolor" });  

    
  },3000);
    
     
  //    "options": { "id": "Stamen Watercolor", "visible": false, "subDomains": mapLayers.abcd, "copyright": "Stamen Watercolor" },
 // "url": "http://${subDomain}.tile.stamen.com/watercolor/${level}/${col}/${row}.jpg"
                    
     //for layer opacity
      var slider = new HorizontalSlider({
        name: "slider",
        value: 0.65,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
         	  try{ floodLayer.setOpacity(value);} catch(e){console.log(e);}
          try{ zoneLayer.setOpacity(value);} catch(e){console.log(e);}
         
        }
    }, "slider");


    //apply a selection symbol that determines the symbology for selected features 
    var sfs = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([111, 0, 255]),
            2),
        new Color([111, 0, 255, 0.40]));

    var sfs1 = new SimpleFillSymbol(
        SimpleFillSymbol.STYLE_SOLID,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0]),
            2),
        new Color([255, 0, 0, 0.25]));

    var sfs2 = new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID, 10,
        new Color([111, 0, 255]),

        2);

    var sfs3 = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_DIAMOND, 15,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([13, 255, 0]),
            2),
        new Color([13, 255, 0, 0.5]),
        2);

var sfs5 = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_DIAMOND, 15,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([255, 0, 0]),
            2),
        new Color([255, 0, 0, 0.5]),
        2);


	 var sfs4 = new SimpleLineSymbol(
        SimpleLineSymbol.STYLE_SOLID, 10,
        new Color([255, 0, 0]),

        2);


var gLayer = new GraphicsLayer();

    var  tb;

    /*  var popup = new Popup({
        fillSymbol: sfs
    }, domConstruct.create("div"));

  var  popup2 = new esri.dijit.PopupMobile(null, dojo.create("div"));
*/
    var popup;
    var mobile;
    if (window.innerWidth > 778) {
        popup = new Popup({
            fillSymbol: sfs
        }, domConstruct.create("div"));
        mobile = false;
    } else {
      //  popup = new esri.dijit.PopupMobile(null, dojo.create("div"));
       popup = new Popup({
            fillSymbol: sfs
        }, domConstruct.create("div"));
        mobile = true;

    }

    //Map constructor
    map = new Map("map", {
      //  basemap: "hybrid",
        infoWindow: popup,
        isZoomSlider: true,
        center: [-104.595337, 38.255706],
        //  sliderOrientation: "vertical",
        spatialReference: 102100,
        //  sliderPosition: "bottom-right",
        //   sliderStyle: "large",
        maxZoom: 19,
        zoom: 11

    });

    navToolbar = new Navigation(map);
	var rBZoom = new Draw(map, {
		showTooltips: false});
    var overviewLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");

    map.on("load", function () {
        //	map.setZoom(2);
        map.setZoom(11);
        //on.emit(dom.byId("toggleOutput"), "click", {
          //  bubbles: true,
           // cancelable: true
       // });
        domAttr.remove(dom.byId("measurementDiv"), "style");
		rubberBandZoomMode(true);
       // navToolbar.activate(Navigation.ZOOM_IN);
		//console.dir(measurement);
		legendDijit = new Legend({
    map: map
   
  },"legendDiv");
  //console.dir(legendDijit);
  
//console.log(navigator.geolocation.getCurrentPosition());
	
    });

	
	
	var finishedLoading = false;
    //Indicate map loading
    map.on("update-start", function () {
        finishedLoading = false;
        domAttr.set("body", "class", "claro buttonMode calculating");
        setTimeout(function(){
        	if(!finishedLoading){
        		domAttr.set("body", "class", "claro buttonMode");
        	}
        }, 20000);
		
    });

    map.on("update-end", function () {
    	console.log(map.getZoom());
    	finishedLoading = true;
       
        domAttr.set("body", "class", "claro buttonMode");

    });

    map.on("zoom-end", function () {
        if (!mobile) {
            popup.reposition();
        }
    });

    dojo.connect(inputSearchBox, "onkeypress", function (e) {

        if (e.keyCode == 13) {

            if (dom.byId("address").value != "Search name or parcel #" && dom.byId("address").value != "Search address" && dom.byId("address").value != "Search road") {
                // startSearch();
                on.emit(dom.byId("locate"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
        }

    });
	var tools = dom.byId("tools");
    //Listen for button clicks in text mode
    dojo.connect(dom.byId("zoom"), "click", function () {
        navToolbar.deactivate();
        rubberBandZoomMode(true);
        domAttr.set(tools, "class", "zoomActive");
    });

    /*  dojo.connect(dom.byId("zoom_out"), "click", function(){
    	map.setZoom(map.getZoom() - 1);
    });*/

    dojo.connect(dom.byId("pan"), "click", function () {
    	rubberBandZoomMode(false);
        navToolbar.activate(Navigation.PAN);
        domAttr.set(tools, "class" ,"panActive");
    });

    var overView = false;
    var overViewStartUp = false;
    dojo.connect(dom.byId("overviewToggle"), "click", function () {
    	
        if (!overViewStartUp) {
            overviewMapDijit = new OverviewMap({
                map: map,
                visible: true,
                baseLayer: overviewLayer,
                expandFactor: 4
            });
            overviewMapDijit.startup();
            overViewStartUp = true;
            overView = true;
        } else if (!overView) {
            overviewMapDijit.show();
            overView = true;
        } else {
            overviewMapDijit.hide();
            overView = false;
        }

    });
	var firstSelectionClick = true;
	 selectionTF = false;

	var shapeTypeMem = "rect";
    dojo.connect(dom.byId("selection"), "click", function () {
    	console.log(shapeTypeMem);
    	console.log(selectionMode);
    	if(!selectionTF){
    	domAttr.set(tools, "class" ,"selectActive");
    	rubberBandZoomMode(false);
        startDrawSelect();
        selectionTF = true;
        
        
        if(firstSelectionClick){
        	firstSelectionClick = false;
        	dom.byId("bufferParcs").checked = true;
        }
        
        switch(selectionMode){
        	
        	case 'parcs':
        		
       			
        		dom.byId("parcs").checked = true;
        		
        		break;
        	case 'addr':
        		dom.byId("addr").checked = true;
        		break;
        	case 'roads':
        		dom.byId("roads").checked = true;
        		break;
        }
        
        switch(shapeTypeMem){
        	
        	case 'rect':
        		dom.byId("rect").checked = true;
        		drawx.activate(Draw.RECTANGLE);
				mDraw.activate(Draw.LINE);
        		break;
        	case 'circ':
        		dom.byId("circ").checked = true;
        		drawx.activate(Draw.CIRCLE);
				mDraw.activate(Draw.LINE);
        		break;
        	case 'fpoly':
        		dom.byId("fpoly").checked = true;
        		drawx.activate(Draw.FREEHAND_POLYGON);
				mDraw.activate(Draw.LINE);
        		break;
        	case 'poly':
        		dom.byId("poly").checked = true;
        		drawx.activate(Draw.POLYGON);
				mDraw.activate(Draw.LINE);
        		break;
        	case 'triangle':
        		dom.byId("triangle").checked = true;
        		drawx.activate(Draw.TRIANGLE);
				mDraw.activate(Draw.LINE);
        		break;
        	case 'pt':
        		dom.byId("pt").checked = true;
        		drawx.activate(Draw.POINT);
				mDraw.activate(Draw.LINE);
        		break;
        	case 'line':
        		dom.byId("line").checked = true;
        		drawx.activate(Draw.LINE);
				mDraw.activate(Draw.LINE);
        		break;
        	case 'polyline':
        		dom.byId("polyline").checked = true;
        		drawx.activate(Draw.POLYLINE);
				mDraw.activate(Draw.LINE);
        		break;
        	
        	
        }
        
        
        
        
      } else {
      	domAttr.set(tools, "class" ,"panActive");
      	selectionTF = false;
      	drawHelper = false;
      	draw = false;
      	drawx.deactivate();
      	mDraw.deactivate();
      }
    });

    dojo.connect(dom.byId("selectHelp"), "click", function () {
        //Helper Listener - Do not remove
    });

	 
	dojo.connect(dom.byId("exportResults"), "click", function () {
		exportSearchResults();
    });

    dojo.connect(dom.byId("textPrint"), "click", function () {

    });

    dojo.connect(dom.byId("textShowSelection"), "click", function () {

    });
	dojo.connect(dom.byId("legendToggle"), "click", function(){
		if(!legendStartup){
		legendDijit.startup();
		legendStartup = true;
		}
		
	});
	
    dojo.connect(dom.byId("textLegend"), "click", function () {
        on.emit(dom.byId("legendToggle"), "click", {
            bubbles: true,
            cancelable: true
        });
    });
	
	var gpsIO = false;
	var gpsID;
    dojo.connect(dom.byId("gpsButton"), "click", function () {
    	
        //	on.emit(dom.byId("helpButton"), "click", {bubbles: true, cancelable: true});
        map.graphics.clear();
        
        var geo_options = {
  enableHighAccuracy: true, 
  maximumAge        : 5000, 
  timeout           : 27000
};

		if(!gpsIO){
			domAttr.set(dom.byId("gpsButton"),"class", "gpsOn");
		//	navigator.geolocation.getCurrentPosition(showPosition, function(err){},geo_options);
		gpsID = navigator.geolocation.watchPosition(showPosition, function(err){},geo_options);
			gpsIO = true;
		} else {
			domAttr.set(dom.byId("gpsButton"),"class", "gpsOff");
			gpsIO = false;
			navigator.geolocation.clearWatch(gpsID);
			zoomOnce = true;
		}
        		

    });

    dojo.connect(dom.byId("fpoly"), "click", function () {
        drawx.activate(Draw.FREEHAND_POLYGON);
		mDraw.activate(Draw.LINE);
		shapeTypeMem = "fpoly";
    });

    dojo.connect(dom.byId("poly"), "click", function () {
        drawx.activate(Draw.POLYGON);
        mDraw.activate(Draw.LINE);
        shapeTypeMem = "poly";
    });

    dojo.connect(dom.byId("rect"), "click", function () {
        drawx.activate(Draw.RECTANGLE);
        mDraw.activate(Draw.LINE);
        shapeTypeMem = "rect";
    });

    dojo.connect(dom.byId("triangle"), "click", function () {
        drawx.activate(Draw.TRIANGLE);
        mDraw.activate(Draw.LINE);
        shapeTypeMem = "triangle";
    });

    dojo.connect(dom.byId("circ"), "click", function () {
        drawx.activate(Draw.CIRCLE);
        mDraw.activate(Draw.LINE);
        shapeTypeMem = "circ";
    });

    dojo.connect(dom.byId("pt"), "click", function () {
        drawx.activate(Draw.POINT);
        mDraw.activate(Draw.LINE);
        shapeTypeMem = "pt";
    });

    dojo.connect(dom.byId("line"), "click", function () {
        drawx.activate(Draw.LINE);
        mDraw.activate(Draw.LINE);
        shapeTypeMem = "line";
    });

    dojo.connect(dom.byId("polyline"), "click", function () {
        drawx.activate(Draw.POLYLINE);
        mDraw.activate(Draw.LINE);
        shapeTypeMem = "polyline";
    });

    var selectionMode = 'parcs';
    dojo.connect(dom.byId("parcs"), "click", function () {
        selectionMode = "parcs";
        dom.byId("bufferParcs").checked = true;
        console.log(selectionMode);
    });


	dojo.connect(dom.byId("bufferParcs"), "click", function () {
        selectionMode = "parcs";
        console.log(selectionMode);
    });

    dojo.connect(dom.byId("addr"), "click", function () {
        selectionMode = "addr";
        dom.byId("bufferAddr").checked = true;
        console.log(selectionMode);
    });

	dojo.connect(dom.byId("bufferAddr"), "click", function () {
        selectionMode = "addr";
        console.log(selectionMode);
    });

    dojo.connect(dom.byId("roads"), "click", function () {
        selectionMode = "roads";
        dom.byId("bufferRoad").checked = true;
        console.log(selectionMode);
    });
    
    dojo.connect(dom.byId("bufferRoad"), "click", function () {
        selectionMode = "roads";
        console.log(selectionMode);
    });

	 dojo.connect(dom.byId("identify"), "click", function () {
      popup.hide();
      	console.log(map.getLayersVisibleAtScale());
    });
    
    var addrSearchMode = "geo"; //default option is geocode the address
    
     dojo.connect(dom.byId("geo"), "click", function () {
      	addrSearchMode = "geo";
    });
    
    dojo.connect(dom.byId("raw"), "click", function () {
      	addrSearchMode = "raw";
    });
    
     dojo.connect(dom.byId("addrCancel"), "click", function () {
      	domAttr.set("addrSearchBox","class","hide");
    });
	
	
	
	
	  
	
	//begin layer toggle menu
	  dojo.connect(dom.byId("toggleFlood"), "click", function () {
			console.log(dom.byId("toggleFlood").checked);
			if(dom.byId("toggleFlood").checked){
				//map.addLayer(floodLayer);
				setLayerOrder($('.sortable li input').get());
			} else{
				map.removeLayer(floodLayer);
			}
    });
	
	dojo.connect(dom.byId("toggleZoning"), "click", function () {
			if(dom.byId("toggleZoning").checked){
				
			//	map.addLayer(zoneLayer);
				setLayerOrder($('.sortable li input').get());
			} else{
				map.removeLayer(zoneLayer);
			}
    });
    
   
    
  
    
    
	dojo.connect(dom.byId("toggleParcs"), "click", function () {
			if(dom.byId("toggleParcs").checked){
				map.addLayer(parcelInfoLayer);
			} else{
				map.removeLayer(parcelInfoLayer);
			}
    });
    
    
    
    
    
    dojo.connect(dom.byId("toggleEsriLabels"), "click", function () {
            if(dom.byId("toggleEsriLabels").checked){
                map.addLayer(esriLabelLayer);
            } else{
                map.removeLayer(esriLabelLayer);
            }
    });


dojo.connect(dom.byId("toggleParcels"), "click", function () {
            if(dom.byId("toggleParcels").checked){
                map.addLayer(puebloParcelLayer);
            } else{
                map.removeLayer(puebloParcelLayer);
            }
    });

dojo.connect(dom.byId("togglePoints"), "click", function () {
            if(dom.byId("togglePoints").checked){
                map.addLayer(puebloPointsLayer);
            } else{
                map.removeLayer(puebloPointsLayer);
            }
    });



	dojo.connect(dom.byId("toggleSat"), "click", function () {
			if(dom.byId("toggleSat").checked){
				try{map.removeLayer(natGeoLayer);}catch(e){}
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				try{map.removeLayer(osmLayer);}catch(e){}
				
				try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
				
			
				map.addLayer(basemap);
				map.reorderLayer(basemap,0);
			} else{
				map.removeLayer(basemap);
			}
    });
	dojo.connect(dom.byId("toggleStreet"), "click", function () {
			if(dom.byId("toggleStreet").checked){
				try{map.removeLayer(natGeoLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				try{map.removeLayer(osmLayer);}catch(e){}
				
				
				try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
				
				map.addLayer(streetLayer);
				map.reorderLayer(streetLayer,0);
			} else{
				map.removeLayer(streetLayer);
			}
    });
    
    dojo.connect(dom.byId("toggleTopo"), "click", function () {
			if(dom.byId("toggleTopo").checked){
				try{map.removeLayer(natGeoLayer);}catch(e){}
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				try{map.removeLayer(osmLayer);}catch(e){}
				
				try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
				
				
				dom.byId("toggleStreet").checked = false;
				dom.byId("toggleNat").checked = false;
				dom.byId("toggleSat").checked = false;
				map.addLayer(topoLayer);
				map.reorderLayer(topoLayer,0);
			} else{
				map.removeLayer(topoLayer);
			}
    });
    dojo.connect(dom.byId("toggleNat"), "click", function () {
			if(dom.byId("toggleNat").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				try{map.removeLayer(osmLayer);}catch(e){}
				

				try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
				
				map.addLayer(natGeoLayer);
				map.reorderLayer(natGeoLayer,0);
				if(map.getZoom() > 16){
				map.setZoom(16);
				}
				
			} else{
				map.removeLayer(natGeoLayer);
			}
    });
    
      dojo.connect(dom.byId("toggleOpenStreet"), "click", function () {
			if(dom.byId("toggleOpenStreet").checked){
				try{map.removeLayer(natGeoLayer);}catch(e){}
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
			
				
				try{map.removeLayer(osmLayer);}catch(e){}
				try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
				
				
				map.addLayer(osmLayer);
			
			
			//map.addLayer(stamenTerrainLayer);
			//map.addLayer(stamenTonerLayer);
			
				map.reorderLayer(osmLayer,0);
				if(map.getZoom() > 17){
				map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(osmLayer);}catch(e){}
			}
    });
    
      dojo.connect(dom.byId("toggleSTerrain"), "click", function () {
			if(dom.byId("toggleSTerrain").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				dom.byId("toggleTopo").checked = false;
				dom.byId("toggleStreet").checked = false;
				dom.byId("toggleSat").checked = false;
				try{map.removeLayer(osmLayer);}catch(e){}
		try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
				try{map.removeLayer(natGeoLayer);}catch(e){}
			
	
			map.addLayer(stamenTerrainLayer);
			
				map.reorderLayer(stamenTerrainLayer,0);
				if(map.getZoom() > 17){
				//map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(stamenTerrainLayer);}catch(e){}
			}
    });  
    
     dojo.connect(dom.byId("toggleMapbox"), "click", function () {
			if(dom.byId("toggleMapbox").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				dom.byId("toggleTopo").checked = false;
				dom.byId("toggleStreet").checked = false;
				dom.byId("toggleSat").checked = false;
				try{map.removeLayer(osmLayer);}catch(e){}
		try{map.removeLayer(natGeoLayer);}catch(e){}
			try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
			
	
			map.addLayer(mapBoxTerrainLayer);
			
				map.reorderLayer(mapBoxTerrainLayer,0);
				if(map.getZoom() > 17){
				//map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
			}
    });  
      dojo.connect(dom.byId("toggleMapquest"), "click", function () {
			if(dom.byId("toggleMapquest").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				dom.byId("toggleTopo").checked = false;
				dom.byId("toggleStreet").checked = false;
				dom.byId("toggleSat").checked = false;
				try{map.removeLayer(osmLayer);}catch(e){}
		try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
			try{map.removeLayer(natGeoLayer);}catch(e){}
			
	
			map.addLayer(mapQuestLayer);
			
				map.reorderLayer(mapQuestLayer,0);
				if(map.getZoom() > 17){
				//map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(mapQuestLayer);}catch(e){}
			}
    });  
    
        dojo.connect(dom.byId("toggleCPale"), "click", function () {
			if(dom.byId("toggleCPale").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				dom.byId("toggleTopo").checked = false;
				dom.byId("toggleStreet").checked = false;
				dom.byId("toggleSat").checked = false;
				try{map.removeLayer(osmLayer);}catch(e){}
			try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
			try{map.removeLayer(natGeoLayer);}catch(e){}
			
	
			map.addLayer(cloudmadePaleLayer);
			
				map.reorderLayer(cloudmadePaleLayer,0);
				if(map.getZoom() > 17){
				//map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
			}
    });  
    
    
      dojo.connect(dom.byId("toggleCNight"), "click", function () {
			if(dom.byId("toggleCNight").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				dom.byId("toggleTopo").checked = false;
				dom.byId("toggleStreet").checked = false;
				dom.byId("toggleSat").checked = false;
				try{map.removeLayer(osmLayer);}catch(e){}
		try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
			try{map.removeLayer(natGeoLayer);}catch(e){}
			
	
			map.addLayer(cloudmadeNightLayer);
			
				map.reorderLayer(cloudmadeNightLayer,0);
				if(map.getZoom() > 17){
				//map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
			}
    });  
    
      dojo.connect(dom.byId("toggleToner"), "click", function () {
			if(dom.byId("toggleToner").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				dom.byId("toggleTopo").checked = false;
				dom.byId("toggleStreet").checked = false;
				dom.byId("toggleSat").checked = false;
				try{map.removeLayer(osmLayer);}catch(e){}
		try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
			try{map.removeLayer(natGeoLayer);}catch(e){}
			
	
			map.addLayer(stamenTonerLayer);
			
				map.reorderLayer(stamenTonerLayer,0);
				if(map.getZoom() > 17){
				//map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
			}
    });  
    
     dojo.connect(dom.byId("toggleWColor"), "click", function () {
			if(dom.byId("toggleWColor").checked){
				try{map.removeLayer(streetLayer);}catch(e){}
				try{map.removeLayer(topoLayer);}catch(e){}
				try{map.removeLayer(basemap);}catch(e){}
				try{map.removeLayer(googleLayer);}catch(e){}
				try{map.removeLayer(googleLayerStreet);}catch(e){}
				try{map.removeLayer(osmLayer);}catch(e){}
				try{map.removeLayer(natGeoLayer);}catch(e){}
				
				try{map.removeLayer(stamenTerrainLayer);}catch(e){}
				try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
				try{map.removeLayer(mapQuestLayer);}catch(e){}
				try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
				try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
				try{map.removeLayer(waterColorLayer);}catch(e){}
				try{map.removeLayer(stamenTonerLayer);}catch(e){}
			
	
			map.addLayer(waterColorLayer);
			
				map.reorderLayer(waterColorLayer,0);
				if(map.getZoom() > 17){
				//map.setZoom(17);
				}
				
			} else{
				try{map.removeLayer(waterColorLayer);}catch(e){}
			}
    });  
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
      dojo.connect(dom.byId("toggleGSat"), "click", function () {
			if(dom.byId("toggleGSat").checked){
				try{map.removeLayer(googleLayerStreet);}catch(e){}

				googleLayer.setMapTypeId(agsjs.layers.GoogleMapsLayer.MAP_TYPE_SATELLITE);
				
				map.addLayer(googleLayer);
				map.reorderLayer(googleLayer,1);
			} else{
				map.removeLayer(googleLayer);
			}
    });
      dojo.connect(dom.byId("toggleGStreet"), "click", function () {
			if(dom.byId("toggleGStreet").checked){
				try{map.removeLayer(googleLayer);}catch(e){}
				
				

			

				googleLayerStreet.setMapTypeId(agsjs.layers.GoogleMapsLayer.MAP_TYPE_ROADMAP);
					map.addLayer(googleLayerStreet);	
				
				
				map.reorderLayer(googleLayerStreet,1);
			} else{
				map.removeLayer(googleLayerStreet);
			}
    });
   
    
    
    
    
    
	//end layer toggle menu
	
	var distParams = new DistanceParameters();
	distParams.distanceUnit = GeometryService.UNIT_FOOT;
	
	
	
	map.on("mouse-drag-start", function(evt){
		
		if(drawHelper){
		
		
		domAttr.set(dom.byId("junk"), "style", "");
		console.log(evt.mapPoint);
		distParams.geometry1 = evt.mapPoint;
		}
	});
	
	
	map.on("mouse-drag-end", function(evt){
		if(drawHelper){
		console.log(evt.mapPoint);
		domAttr.set(dom.byId("junk"), "style", "display:none;");
		setTimeout(function(){dom.byId("junk").innerHTML = "";}, 100);
		setTimeout(function(){dom.byId("junk").innerHTML = "";}, 200);
		setTimeout(function(){dom.byId("junk").innerHTML = "";}, 300);
		setTimeout(function(){dom.byId("junk").innerHTML = "";}, 500);
		}
		
	});
	var eff = 3;
	map.on("mouse-drag", function(evt){
		if(drawHelper){
		domAttr.set(dom.byId("junk"), "style", "left: " + (evt.x + 15) + "px; top: " + (evt.y + 15) + "px;");
		
		if(eff % 3 == 0){
		distParams.geometry2 = evt.mapPoint;
		gsvc.distance(distParams, function(distance) {
			var xxx = parseFloat(distance);
			console.log(xxx.toFixed(1));
			dom.byId("junk").innerHTML = xxx.toFixed(1) + " ft.";
			
 
  		
		});
		eff++;
		 } else {
  	eff++;}
  			
		}
                
	});
	
	
	
	
	function rubberBandZoomMode(rbTF){
		if(rbTF){
		rBZoom.activate(Draw.RECTANGLE);
		rBZoom.on("draw-end", function(evt){
		var graphic = new Graphic(evt.geometry, sfs);
        
       
        var ar = new Array();
        ar.push(graphic);

        map.setExtent(graphicsUtils.graphicsExtent(ar));
        
		});
		
		} else {rBZoom.deactivate();}
	}

	var drawHelper;
    var drawx;
    //Select by shape function
    function startDrawSelect() {
    	drawHelper = true;
        navToolbar.activate(Navigation.PAN);
        drawx = new Draw(map, {
            showTooltips: true
        });
        mDraw = new Draw(map, {showTooltips: false});
		
        drawx.on("draw-end", addToMap);
        // draw.activate(Draw.CIRCLE);
        draw = true;
    }

    function addToMap(evt) {

        var graphic = new Graphic(evt.geometry, sfs);
        // map.graphics.add(graphic);
        console.log(evt);
        console.log(graphic);
       /* var ar = new Array();
        ar.push(graphic);
        console.log(graphicsUtils.graphicsExtent(ar));
        map.setExtent(graphicsUtils.graphicsExtent(ar));
 */       selectByShape(evt.geometry);
		mDraw.deactivate();
        drawx.deactivate();
        draw = false;
        drawHelper = false;
        on.emit(dom.byId("selectHelp"), "click", {
            bubbles: true,
            cancelable: true
        });
        
    }

    function selectByShape(evt) {
    	try{
		infoArray2.length = 0;
		map.graphics.clear();
		} catch(e){}
		try{gLayer.clear();} catch(e){}
        var zzz = false;
        // map.graphics.clear();

        //Select features within the buffered polygon. To do so we'll create a query to use the buffer graphic
        //as the selection geometry.

        var query2 = new Query();
        query2.geometry = evt;

          if (selectionMode == "parcs") {
        	try{road.clearSelection();} catch(e){}
        	try{points.clearSelection();} catch(e){}
            parcels.selectFeatures(query2, FeatureLayer.SELECTION_NEW, function (results) { //This returns all parcel data within buffer.
                console.log(results);
                setTimeout(function () {
                    if (!zzz) {
                        displayResults(results, "parcel");
                        zzz = true;
                    }
                }, 1000);

                var c = parcels.getSelectedFeatures();
                console.log(c);
               // map.addLayer(parcels);
               
                for (i = 0; i < c.length; i++) {
                   // map.graphics.add(c[i]);
                   gLayer.add(c[i]);
                    infoArray2.push(results[i]);
                }
				
            }, function (error) {

            });
        } else if (selectionMode == "addr") {
        	try{parcels.clearSelection();} catch(e){}
        	try{road.clearSelection();} catch(e){}
            var graphic2;

            points.selectFeatures(query2, FeatureLayer.SELECTION_NEW, function (results) { //This returns all parcel data within buffer.

                console.log(query2);
                console.log(results);
                console.log(results[0]);
                setTimeout(function () {
                    if (!zzz) {
                        displayResults(results, "address");
                        zzz = true;
                    }
                }, 1000);
                var temp = new Array();

                var c = points.getSelectedFeatures();
                console.log(c);
                
                // map.addLayer(points);
                 
                for (i = 0; i < c.length; i++) {
//                    map.graphics.add(c[i]);
						gLayer.add(c[i]);
                    infoArray2.push(results[i]);
                }
				map.addLayer(gLayer);
            }, function (error) {

            });
           
            
        } else if (selectionMode == "roads") {
            var graphic2;
			try{parcels.clearSelection();} catch(e){}
        	try{points.clearSelection();} catch(e){}
            road.selectFeatures(query2, FeatureLayer.SELECTION_NEW, function (results) { //This returns all parcel data within buffer.

                console.log(query2);
                console.log(results);
                console.log(results[0]);
                setTimeout(function () {
                    if (!zzz) {
                        displayResults(results, "road");
                        zzz = true;
                    }
                }, 1000);
                var temp = new Array();
                makeGeomArray3(results);
              //  map.addLayer(road);
				
				for(i=0;i < results.length;i++){
					infoArray2.push(results[i]);
				}
			//	map.addLayer(gLayer);
            }, function (error) {

            });

            // map.addLayer(road);
        }
		domAttr.set(tools, "class", "panActive");
    }

    //Buffer Function
    //	 map.on("load", initToolbar);

  //  gsvc = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
   gsvc = new GeometryService("http://maps.co.pueblo.co.us/outside/rest/services/Utilities/Geometry/GeometryServer");
    //add proxy functions for all modules
    esriConfig.defaults.io.proxyUrl = "proxy.php";
    esriConfig.defaults.io.alwaysUseProxy = false;

    function initToolbar(evtObj) {
        app.tb = new Draw(evtObj.map);
        app.tb.on("draw-end", doBuffer);
    }

    var parcels1;
	var road1, points1;
    function doBuffer3(evt) {
        //console.debug(evt);

       // map.graphics.clear();
        //   map.removeLayer(parcels1);

        var params = new BufferParameters();
        params.geometries = [evt];

        //buffer in linear units such as meters, km, miles etc.

        params.distances = [dom.byId("distance").value];
        params.bufferSpatialReference = new esri.SpatialReference({
            wkid: dom.byId("bufferSpatialReference").value
        });
        params.outSpatialReference = map.spatialReference;
        params.unit = GeometryService[dom.byId("unit").value];

        gsvc.buffer(params);
        //      gsvc.buffer(params);

        //add the parcels layer to the map as a feature layer in selection mode we'll use this layer to query and display the selected parcels in buffer area
        parcels1 = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer/13", {
            outFields: ["*"],
            objectIdField: "PAR_NUM",
            //infoTemplate: popupTemplate,
            mode: FeatureLayer.MODE_SELECTION
        });

        parcels1.setSelectionSymbol(sfs1);
		
		points1 = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer/0", {
        outFields: ["*"],
        objectIdField: "FULLADDR",
        //infoTemplate: popupTemplate,
        mode: FeatureLayer.MODE_SELECTION
    });

    points1.setSelectionSymbol(sfs5);

        road1 = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer/3", {
        outFields: ["*"],
        objectIdField: "OBJECTID",
        //  infoTemplate: popupTemplate,
        mode: FeatureLayer.MODE_SELECTION,
        spatialRelationship: FeatureLayer.SPATIAL_REL_CROSSES
    });

    road1.setSelectionSymbol(sfs4);
		
        var zzz = false;
        gsvc.on("buffer-complete", function (result) {
		
          //  map.graphics.clear();
            // draw the buffer geometry on the map as a map graphic
            var symbol = new SimpleFillSymbol(
                SimpleFillSymbol.STYLE_NULL,
                new SimpleLineSymbol(
                    SimpleLineSymbol.STYLE_SOLID,
                    new Color([13, 255, 0]),
                    2
                ), new Color([255, 255, 0, 0.25])
            );
            var bufferGeometry = result.geometries[0];
            var graphic2 = new Graphic(bufferGeometry, symbol);

            map.graphics.add(graphic2);

            //Select features within the buffered polygon. To do so we'll create a query to use the buffer graphic
            //as the selection geometry.
            var query2 = new Query();
            query2.geometry = bufferGeometry;
			
			
			if(selectionMode == "parcs"){
			
            parcels1.selectFeatures(query2, FeatureLayer.SELECTION_NEW, function (results) { //This returns all parcel data within buffer.

                setTimeout(function () {
                    if (!zzz) {
                        displayResults(results,"parcel");
                        zzz = true;
                    }
                }, 1000);

                var c = parcels1.getSelectedFeatures();
               // console.log(c);
                
                for (i = 0; i < c.length; i++) {
                    map.graphics.add(c[i]);
                   
                }
                

            }, function (error) {
                console.log(error);
            });
            
            }
            else if (selectionMode == "addr") {
            var graphic2;

            points1.selectFeatures(query2, FeatureLayer.SELECTION_NEW, function (results) { //This returns all parcel data within buffer.

                console.log(query2);
                console.log(results);
                console.log(results[0]);
                setTimeout(function () {
                    if (!zzz) {
                        displayResults(results, "address");
                        zzz = true;
                    }
                }, 1000);
                var temp = new Array();

                var c = points1.getSelectedFeatures();
                console.log(c);
                for (i = 0; i < c.length; i++) {
                    map.graphics.add(c[i]);
                    //infoArray2.push(results[i]); 
                }

            }, function (error) {

            });
        } else if (selectionMode == "roads") {
            var graphic2;

            road1.selectFeatures(query2, FeatureLayer.SELECTION_NEW, function (results) { //This returns all parcel data within buffer.

                console.log(query2);
                console.log(results);
                console.log(results[0]);
                setTimeout(function () {
                    if (!zzz) {
                        displayResults(results, "road");
                        zzz = true;
                    }
                }, 1000);
                var temp = new Array();
                makeGeomArray(results);
				for(i=0;i < results.length;i++){
					//infoArray2.push(results[i]);
				}
            }, function (error) {

            });

            // map.addLayer(road);
        }
            
			domAttr.set("body", "class", "claro buttonMode");
            domAttr.set("bufferMode", "class", "bufferModeOn");
        });

    }

    //end test for parcel buffer

    //Buffer Function
    // map.on("load", initToolbar);
	gsvc = new GeometryService("http://maps.co.pueblo.co.us/outside/rest/services/Utilities/Geometry/GeometryServer");
   // gsvc = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
    //add proxy functions for all modules
    esriConfig.defaults.io.proxyUrl = "proxy.php";
    esriConfig.defaults.io.alwaysUseProxy = false;

    function initToolbar(evtObj) {
        app.tb = new Draw(evtObj.map);
        app.tb.on("draw-end", doBuffer);
    }

    function showBuffer(bufferedGeometries) {
        var symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_SOLID,
            new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([255, 0, 0, 0.65]), 2
            ),
            new Color([255, 0, 0, 0.35])
        );

        arrayUtils.forEach(bufferedGeometries, function (geometry) {
            var graphic = new Graphic(geometry, symbol);
            app.map.graphics.add(graphic);
        });
        app.tb.deactivate();
        app.map.showZoomSlider();
    }

    app = {
        map: map,
        tb: tb,
        gsvc: gsvc
    };




  	  var floodLayer = new ArcGISDynamicMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/thematic/floodplains/MapServer", {maxScale: 20, opacity: 0.65});
	  var zoneLayer = new ArcGISDynamicMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/thematic/zoning/MapServer", {maxScale: 20, opacity: 0.65});
	  var streetLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer", {maxScale: 20});
	  var topoLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer", {maxScale: 20});
	  var natGeoLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer", {maxScale: 20});
	  var esriLabelLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer", {maxScale: 20});
      var puebloPointsLayer = new ArcGISDynamicMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_address_points/MapServer", {maxScale: 20});
      var puebloParcelLayer = new ArcGISDynamicMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_parcels_bld_footprints/MapServer", {maxScale: 20});

	 
	  var parcelInfoLayer = new ArcGISTiledMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer", {maxScale: 20});
      
      var basemap = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");
  
    map.addLayer(basemap);
   // map.addLayer(esriLabelLayer);
   // setTimeout(function(){try{googleLayer.setMapTypeId(agsjs.layers.GoogleMapsLayer.MAP_TYPE_SATELLITE);
   // 	 map.addLayer(googleLayer);}catch(e){console.log(e);}},9000); 

	//map.addLayer(parcelInfoLayer);

    //BEGIN functions for print dijit
    //var printUrl = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
	var printUrl = "http://maps.co.pueblo.co.us/outside/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";
    // get print templates from the export web map task
    var printInfo = esriRequest({
        "url": printUrl,
        "content": {
            "f": "json"
        }
    });
    printInfo.then(handlePrintInfo, handleError);
    var printer;

    function handlePrintInfo(resp) {
        var layoutTemplate, templateNames, mapOnlyIndex, templates;

        layoutTemplate = arrayUtils.filter(resp.parameters, function (param, idx) {
            return param.name === "Layout_Template";
        });

        if (layoutTemplate.length == 0) {
            console.log("print service parameters name for templates must be \"Layout_Template\"");
            return;
        }
        templateNames = layoutTemplate[0].choiceList;

        // remove the MAP_ONLY template then add it to the end of the list of templates 
        mapOnlyIndex = arrayUtils.indexOf(templateNames, "MAP_ONLY");
        if (mapOnlyIndex > -1) {
            var mapOnly = templateNames.splice(mapOnlyIndex, mapOnlyIndex + 1)[0];
            templateNames.push(mapOnly);
        }

        // create a print template for each choice
        templates = arrayUtils.map(templateNames, function (ch) {
            var plate = new PrintTemplate();
            plate.layout = plate.label = ch;
            plate.format = "PDF";
            plate.layoutOptions = {
                "authorText": "Provided by: Pueblo County EDGIS",
                "copyrightText": "Copyright 2014",
                "legendLayers": [],
                "titleText": "Pueblo County",
                "scalebarUnit": "Miles"
            };
            return plate;
        });

        // create the print dijit
        printer = new Print({
            "map": map,
            "templates": templates,
            url: printUrl
        }, dom.byId("print_button"));
        printer.startup();

        printer.on("print-start", function () {
            domAttr.set("print_button", "class", "processing");
            domAttr.set("body", "class", "claro buttonMode calculating");
        });

        printer.on("print-complete", function () {

            domAttr.set("print_button", "class", "dormant");
            domAttr.set("body", "class", "claro buttonMode");

        });

        printer2 = new Print({
            "map": map,
            "templates": templates,
            url: printUrl
        }, dom.byId("textPrint"));
        printer2.startup();

        printer2.on("print-start", function () {
            domAttr.set("print_button", "class", "processing");
        });

        printer2.on("print-complete", function () {

            domAttr.set("print_button", "class", "dormant");

        });

    }

    function handleError(err) {
        console.log("Something broke: ", err);
    }
    //END print dijit functions

    //BEGIN Basemap Toggle
  /*  var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: false,
        map: map
    }, "basemapGallery");
*/
   // basemapGallery.startup();
/*
    basemapGallery.add(countyBasemap);
    basemapGallery.add(zoningBasemap);
    basemapGallery.add(imagery2005Basemap);
    basemapGallery.add(imagery2004Basemap);
    

    basemapGallery.on("error", function (msg) {
        console.log("basemap gallery error:  ", msg);
    });

    basemapGallery.on("selection-change", function () {
        //	alert("test");
        //basemapGallery.startup();
       // map.removeAllLayers();
       
        map.removeLayer(parcelInfoLayer);
        map.addLayer(parcelInfoLayer);
        if(legendStartup){
		legendDijit.refresh();
		}
        //    console.dir(basemapGallery.getSelected());
    });
*/
    //End Basemap Toggle

    //BEGIN scalebar Dijit

    var scalebar = new Scalebar({
        map: map,
        // "dual" displays both miles and kilmometers
        // "english" is the default, which displays miles
        // use "metric" for kilometers
        scalebarUnit: "english"
    });

    //END scalebar Dijit

    //BEGIN measurement Dijit
esriConfig.defaults.geometryService = new GeometryService("http://maps.co.pueblo.co.us/outside/rest/services/Utilities/Geometry/GeometryServer");
   // esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");

    var measurement = new esri.dijit.Measurement({
        map: map
    }, dojo.byId('measurementDiv'));
    measurement.startup();
    domAttr.set("measurementDiv", "style", "visibility: hidden"); //hide the widget initially

    //END measurement Dijit

    //apply a popup template to the parcels layer to format popup info 
    var popupTemplate = new PopupTemplate({
        title: "Parcel Number: {PAR_NUM}",
        fieldInfos: [{
            fieldName: "Owner",
            label: "Owner:",
            visible: true
        }, {
            fieldName: "OwnerOverflow",
            label: "Owner Overflow:",
            visible: true
        }, {
            fieldName: "OwnerStreetAddress",
            label: "Owner Address:",
            visible: true
        }, {
            fieldName: "OwnerCity",
            label: "Owner City:",
            visible: true
        }, {
            fieldName: "OwnerState",
            label: "Owner State:",
            visible: true
        }, {
            fieldName: "OwnerZip",
            label: "Owner Zip Code:",
            visible: true
        }]
    });

    //add the parcels layer to the map as a feature layer in selection mode we'll use this layer to query and display the selected parcels
    parcels = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer/13", {
        outFields: ["*"],
		objectIdField: "PAR_NUM",
        infoTemplate: popupTemplate,
        mode: FeatureLayer.MODE_SELECTION
    });

    parcels.setSelectionSymbol(sfs);

    var points = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer/0", {
        outFields: ["*"],
        objectIdField: "FULLADDR",
        //infoTemplate: popupTemplate,
        mode: FeatureLayer.MODE_SELECTION
    });

    points.setSelectionSymbol(sfs3);

    var road = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer/3", {
        outFields: ["*"],
        objectIdField: "OBJECTID",
        //  infoTemplate: popupTemplate,
        mode: FeatureLayer.MODE_SELECTION,
        spatialRelationship: FeatureLayer.SPATIAL_REL_CROSSES
    });

    road.setSelectionSymbol(sfs2);

    //add popup template for roads
    var popupRoadTemplate = new PopupTemplate({
        title: "Road Label: {RD_LABEL}",
        fieldInfos: [{
            fieldName: "CITY",
            label: "City:",
            visible: true
        }, {
            fieldName: "ALTNAME1",
            label: "Alternate Name:",
            visible: true
        }]
    });

    //BEGIN Legend Dijit


	

    /*
         
         //if (layerInfo.length > 0) {
           var legendDijit = new Legend({
             map: map,
             layerInfos: [{ 
                 layer: parcelInfoLayer, 
                 title: ""
               }]
           }, "legendDiv");
          // legendDijit.startup();
         //}
 	console.log(legendDijit);
         */
    //END Legend Dijit 

    //add the road layer in selection mode
    roads = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county/MapServer/3", {
        objectIdField: "OBJECTID",
        outFields: ["*"],
        // infoTemplate: popupRoadTemplate,
        mode: FeatureLayer.MODE_SELECTION
      

    });
    roads.setSelectionSymbol(sfs);

    //when users click on the map select the parcel using the map point and update the url parameter
    map.on("click", function (e) {
		
        console.log(e.mapPoint);

        if (draw == false || draw == null) {
            var query = new Query();
            query.geometry = e.mapPoint;
            // console.log(e);
            // map.centerAndZoom(e.mapPoint, 10);
            //FeatureLayer.SELECTION_ADD for multiple or FeatureLayer.SELECTION_NEW for single parcel
             try{gLayer.clear();}catch(e){}
             try{infoArray2.length = 0;}catch(e){}
             try{map.graphics.clear();}catch(e){}
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
                console.debug(selection);
               
				try{
					map.infoWindow.setFeatures(selection);
					infoArray = selection[0];
				} catch(e){}
                //update the url param if a parcel was located
                if (selection.length > 0) {
                    var parcelid = selection[0].attributes["PAR_NUM"];
                    infoArray = selection[0];
                    // infoArray2 += selection[0];
                    //Refresh the URL with the currently selected parcel
                    if (typeof history.pushState !== "undefined") {
                        //  window.history.pushState(null, null, "?parcelid=" + selection[0].attributes.PAR_NUM);
                        infoArray = selection[0];
                        console.log(infoArray);
                        infoArray2.push(selection[0]);
                    }
                }
				try{gLayer.add(map.infoWindow.getSelectedFeature());}catch(e){console.log(e);}
              //  map.addLayer(parcels);
			
            }, function (error) {
                alert(error);
            }); //end of defferred variable declaration
			
           // map.infoWindow.setFeatures([deferred]);
            map.infoWindow.show(e.mapPoint);
            console.log(popup);
            //  selectedParcel = selection[0];
            try {
                infoArray = selection[0];
            } catch (e) {}
        }

        //doBuffer3(selectedParcel);
    });

    //   map.on("click", doBuffer3);

    //LISTEN FOR BUTTON CLICKS
    on(dom.byId("clear"), "click", clearx);
    on(dom.byId("draw"), "click", drawMode);
    on(dom.byId("bufferMode"), "click", bufferMode);
    on(dom.byId("locate"), "click", startSearch);
    on(dom.byId("buffer"), "click", bufferIt);
    on(dom.byId("ownerParcelSwitch"), "click", ownerParcelMode);
    on(dom.byId("addressSwitch"), "click", addressMode);
    on(dom.byId("roadSwitch"), "click", roadMode);
    on(dom.byId("address"), "click", function () {
        domAttr.set("address", "value", "");
    });

    // on(dom.byId("toggleOutput"), "click", function(){
    // var panel = dom.byId("output");
    // fx.fadeOut({node: panel}).play();
    // console.log(fx);
    //  });

    var ownParSearch = true;
    var addrSearch = false;
    var rdSearch = false;

    function ownerParcelMode() {
        ownParSearch = true;
        addrSearch = false;
        rdSearch = false;

        domAttr.set("address", "value", "Search name or parcel #");
        domAttr.set("ownerParcelSwitch", "class", "selected");
        domAttr.set("addressSwitch", "class", "deselected");
        domAttr.set("roadSwitch", "class", "deselected");
        domAttr.set("addrSearchBox","class","hide");
    }

    function addressMode() {
        ownParSearch = false;
        addrSearch = true;
        rdSearch = false;

        domAttr.set("address", "value", "Search address");
        domAttr.set("ownerParcelSwitch", "class", "deselected");
        domAttr.set("addressSwitch", "class", "selected");
        domAttr.set("roadSwitch", "class", "deselected");
        domAttr.set("addrSearchBox","class","nada");
    }

    function roadMode() {
        ownParSearch = false;
        addrSearch = false;
        rdSearch = true;
        popup.clearFeatures();

        domAttr.set("address", "value", "Search road");
        domAttr.set("ownerParcelSwitch", "class", "deselected");
        domAttr.set("addressSwitch", "class", "deselected");
        domAttr.set("roadSwitch", "class", "selected");
        domAttr.set("addrSearchBox","class","hide");
    }
	
	
	var searchTimeout = false;
	
    function startSearch() {
    	try{document.getElementById("address").blur();}catch(e){console.log(e);}
    	try{
    		var hideKeyboard = function() {
    document.activeElement.blur();
    $("input").blur();
    console.log("input");
};
    		
    	}catch(e){console.log(e);}
    	
    	try{infoArray2.length = 0;} catch(e){console.log(e);}
    	try{domAttr.set("addrSearchBox","class","hide");} catch(e){console.log(e);}
    	searchTimeout = false;
        domAttr.set("locate", "class", "processing");
       domAttr.set("body", "class", "claro buttonMode calculating");
       setTimeout(function(){
       		if(!searchTimeout){
       			domAttr.set("locate", "class", "dormant");
       			domAttr.set("body", "class", "claro buttonMode");
       			ieAlert.set("title","No Results");
       			ieAlert.set("content", "<p>Sorry, your search did not return any results.</p><p>Please try again.</p>");
				ieAlert.show();
       			
       		}
       	
       },15000);
        try {
           // resultsArray.length = 0; //Testing to see how array behaves not being cleared after search.

        } catch (e) {}
        try {

           // dom.byId("resultsContent").innerHTML = ""; //Testing to see how array behaves not being cleared after search.
        } catch (e) {}
        //	clearx();
        map.graphics.clear();
        if (ownParSearch) {
            findOwnerOrParcel();
        } else if (addrSearch) {
        	
        	if(addrSearchMode == "geo"){
            locate();
          } else if(addrSearchMode == "raw"){
          	addrTxtSearch();
          }
        } else if (rdSearch) {
        	
            findRoad();
        }

    }


function addrTxtSearch(){
	var zzz = false;
	var str1 = dom.byId("address").value;
	var query3 = new Query();
	query3.where = makeWordArray(str1, "address");
	console.log(query3.where);
       try{parcels.clearSelection();} catch(e){}
        	try{road.clearSelection();} catch(e){}
            var graphic2;

            points.selectFeatures(query3, FeatureLayer.SELECTION_NEW, function (results) { //This returns all parcel data within buffer.

                console.log(query3);
                console.log(results);
                console.log(results[0]);
                setTimeout(function () {
                    if (!zzz) {
                        displayResults(results, "address");
                        zzz = true;
                    }
                }, 1000);
                var temp = new Array();

                var c = points.getSelectedFeatures();
                console.log(c);
                
                // map.addLayer(points);
                 
                for (i = 0; i < c.length; i++) {
//                    map.graphics.add(c[i]);
						gLayer.add(c[i]);
                    infoArray2.push(results[i]);
                }
				map.addLayer(gLayer);
				try{
					zoomToPoint(infoArray2[0]);
					domAttr.set(dom.byId("locate"),"class","dormant");
					}catch(e){console.log(e);}
            }, function (error) {
				console.log(error);
            });
   
}

function levyUrl(){
	
	console.log(infoArray);
	window.open(infoArray.attributes.LevyURL);
}

    map.on("layers-add-result", function (result) {
        // Add a link into the InfoWindow Actions panel       
        var emailLink = domConstruct.create("a", {
            "class": "action",
            "innerHTML": "Add Parcel Info",
            "href": "javascript:void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        var emailLink2 = domConstruct.create("a", {
            "class": "action2",
            "innerHTML": "How are taxes on this parcel spent?",
            "href": "javascript:void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        // Register a function to be called when the user clicks on
        // the above link
        on(emailLink, "click", function (evt) {
        	console.log(infoArray);
            info();
            /* var feature = map.infoWindow.getSelectedFeature();
             var url = window.location;
             var emailLink = "mailto:?subject=Parcel Map of :" + 
               feature.attributes.PAR_NUM + "&body=Check out this map: %0D%0A " + 
               window.location;
             window.location.href = emailLink; */
        });
		
		on(emailLink2,"click", function(evt){
			levyUrl();
		});
        //When users navigate through the history using the browser back/forward buttons select appropriate parcel  
        //https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history
        window.onpopstate = function (event) {
            var parcelid = getParcelFromUrl(document.location.href);
           
            if (parcelid) {
               // selectParcel(parcelid);  //bring back-----------------
				console.log(parcelid);
            } else {
                parcels.clearSelection();
                map.infoWindow.hide();
            }
            
         
            
            
        };

        //if a parcelid is specified in url param select that feature 
        
        	var layerid = getLayerFromUrl(document.location.href);
            var addressid = getAddressFromUrl(document.location.href);
            var roadid = getRoadFromUrl(document.location.href);
        
        
        
        
           if(layerid){
            	console.log(layerid);
            	switch(layerid){
            		
            		case 'satellite':
            			var qMap = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");

  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
  						
  						case 'Satellite':
            			var qMap = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer");

  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
            		
            		case 'streets':
            			var qMap = new ArcGISDynamicMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
            		
            		case 'Streets':
            			var qMap = new ArcGISDynamicMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
  						
  					case 'topo':
            			var qMap = new ArcGISDynamicMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
            		
            		
            		case 'Topo':
            			var qMap = new ArcGISDynamicMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer");
  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
            		
            		
            		case 'natgeo':
            			var qMap = new ArcGISDynamicMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer");
  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
            		
            		
            		case 'NatGeo':
            			var qMap = new ArcGISDynamicMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer");
  						map.removeAllLayers();
  						map.addLayer(qMap);
  					    map.addLayer(parcelInfoLayer);
  						break;
            		
            	}
            }
            
            if(addressid){
            	addressMode();
            	dom.byId("address").value = addressid;
            	addrSearchMode ="raw";
            	domAttr.set("addrSearchBox","class","hide");
            	dom.byId("raw").checked = true;
            	startSearch();
            }
            
            if(roadid){
            	console.log(roadid);
            	roadMode();
            	dom.byId("address").value = roadid;
            	startSearch();
            }
            
            
          //  var parcelid = getParcelFromUrl(document.location.href);
        	//selectParcel(parcelid);

    });

    map.addLayers([parcels]);

    //extract the parcel id from the url
    function getParcelFromUrl(url) {
        var urlObject = urlUtils.urlToObject(url);
        if (urlObject.query && urlObject.query.parcelid) {
            return urlObject.query.parcelid;
        } else {
            return null;
        }
    }
    
    //extract the layer id from the url
    function getLayerFromUrl(url) {
        var urlObject = urlUtils.urlToObject(url);
        if (urlObject.query && urlObject.query.basemap) {
            return urlObject.query.basemap;
        } else {
            return null;
        }
    }
    
    //extract the address from the url
    function getAddressFromUrl(url) {
        var urlObject = urlUtils.urlToObject(url);
        if (urlObject.query && urlObject.query.address) {
            return urlObject.query.address;
        } else {
            return null;
        }
    }
    
    //extract the road from the url
    function getRoadFromUrl(url) {
        var urlObject = urlUtils.urlToObject(url);
        if (urlObject.query && urlObject.query.road) {
            return urlObject.query.road;
        } else {
            return null;
        }
    }

    //BEGIN Location Dijit

    var locator = new Locator("http://maps.co.pueblo.co.us/outside/rest/services/Web_Geocoding/Web_EDGIS_Locator/GeocodeServer");
    // var  locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    locator.on("address-to-locations-complete", showResults);
 //locator.on("address-to-locations-complete", function(res){
 //	console.log(res);
 //});
    //prepare address query string for Geocoder
    function locate() {
		
        //  domAttr.set("locate", "class", "processing");
        // map.graphics.clear();
        //clearx();
        var address = {

            "Street": dom.byId("address").value
        };
       // console.log(address);
        locator.outSpatialReference = new SpatialReference(102100);
        var options = {
            address: address,
            outFields: ["Loc_name"]
        };
        // console.log(locator.addressToLocations(options));
        locator.addressToLocations(options, function(x){console.log(x);},function(e){console.log(e);});
        
    }

    function showResults(evt) {
    	console.log(evt);
        displayGeoCoderResults(evt);
        try{gLayer.clear();}catch(e){}
        var candidate;
        var symbol = new SimpleMarkerSymbol();
        var infoTemplate = new InfoTemplate(
            "Location",
            "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}");
        symbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        symbol.setColor(new Color([35, 186, 199, 0.75]));

        var geom;
        arrayUtils.every(evt.addresses, function (candidate) {
            console.log(candidate.score);
            if (candidate.score > 10) {
                console.log(candidate.location);
                var attributes = {
                    address: candidate.address,
                    score: candidate.score,
                    locatorName: candidate.attributes.Loc_name
                };
                geom = candidate.location;
                var graphic = new Graphic(geom, sfs3, attributes, infoTemplate);
                //add a graphic to the map at the geocoded location
                
               // map.graphics.add(graphic);
               gLayer.add(graphic);
               
                //add a text symbol to the map listing the location of the matched address.
                var displayText = candidate.address;
                var font = new Font(
                    "16pt",
                    Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL,
                    Font.WEIGHT_BOLD,
                    "Helvetica");

                var textSymbol = new TextSymbol(
                    displayText,
                    font,
                    new Color("#ff0000"));
                textSymbol.setOffset(0, 8);
                //map.graphics.add(new Graphic(geom, textSymbol));
                gLayer.add(new Graphic(geom, textSymbol));
                map.addLayer(gLayer);
                return false; //break out of loop after one candidate with score greater  than 80 is found.
            }
        });
        //  geom.spatialReference.wkid = "2233";

        geom.spatialReference.wkid = 102100;
		//console.log(geom);
        map.centerAndZoom(geom, 18);
        
        domAttr.set("locate", "class", "dormant");
        domAttr.set("body", "class", "claro buttonMode");
    }
    //END Location Dijit

    function selectByPoint(geoPoint) {
        var query = new Query();
        query.geometry = geoPoint.location;
        // console.log(e);
        // map.centerAndZoom(e.mapPoint, 10);
        //FeatureLayer.SELECTION_ADD for multiple or FeatureLayer.SELECTION_NEW for single parcel
        var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
            console.debug(selection);

            //update the url param if a parcel was located
            if (selection.length > 0) {
                var parcelid = selection[0].attributes["PAR_NUM"];
                selectParcel(parcelid);
                infoArray = selection[0];
                // infoArray2 += selection[0];
                //Refresh the URL with the currently selected parcel
                if (typeof history.pushState !== "undefined") {
                    //  window.history.pushState(null, null, "?parcelid=" + selection[0].attributes.PAR_NUM);
                    infoArray = selection[0];
                    infoArray2.push(selection[0]);
                }
            }

            map.addLayer(parcels);
            // map.infoWindow.show(selection[0]);

        }, function (error) {
            alert(error);
        }); //end of defferred variable declaration

    }

    var infoArray3 = new Array();
	var bufferTypeMem;
    function bufferIt() {
    	
    	//if(bufferTypeMem != selectionMode){
    		map.graphics.clear();
    		//bufferTypeMem = selectionMode;
    	//}
    	
        domAttr.set("bufferMode", "class", "bufferModeOn processing");
        domAttr.set("body", "class", "claro buttonMode calculating");
    //  map.graphics.clear();
      
        try {
        	infoArray3.length = 0;
         //   parcels1.clearSelection();
        } catch (e) {}
		 /* try {
            points.clearSelection();
        } catch (e) {}

		 try {
            road1.clearSelection();
        } catch (e) {}
		*/

        if (infoArray2.length > 1) {
            for (i = 0; i < infoArray2.length; i++) {
                infoArray3.push(infoArray2[i].geometry);
            }
            temp = gsvc.union(infoArray3);

            temp.then(function (results) {
                //console.debug(results);
			try {

            	dom.byId("tableContent").innerHTML = "";
            	dom.byId("tableTallContent").innerHTML = "";
            	
        		} catch (e) {
        		document.getElementById('tableContent').innerText="";
        		document.getElementById('tableTallContent').innerText="";
        		}
        		dom.byId("filler").innerHTML = "";
                doBuffer3(results);
            });
        } else if (infoArray2.length == 1) {
			 try {

          		  dom.byId("tableContent").innerHTML = "";
          		  dom.byId("tableTallContent").innerHTML = "";
        			} catch (e) {
        				document.getElementById('tableContent').innerText="";
       			 		document.getElementById('tableTallContent').innerText="";
       			 }
       			 dom.byId("filler").innerHTML = "";
            doBuffer3(infoArray2[0].geometry);
        } else {
            domAttr.set("bufferMode", "class", "bufferModeOn");
            domAttr.set("body", "class", "claro buttonMode");
           // alert("No parcel selected!");
            ieAlert.set("title","Nothing To Buffer");
       		ieAlert.set("content", "<p>Sorry, no features have been selected for buffering.</p><p>Please select at least one feature before buffering.</p>");
			ieAlert.show();
        }
        try {
            	//parcels.clearSelection();
            parcels1.clearSelection();
        } catch (e) {}
       
       try{infoArray3.length = 0;} catch(e){}
      // try{infoArray2.length = 0;} catch(e){}
    }

    function safeClear() {
        map.removeAllLayers();
        map.addLayer(basemap);
        map.addLayer(parcelInfoLayer);
        stripe = null;
        // empty();
        map.graphics.clear();
        map.infoWindow.hide();
        try {
            infoArray.length = 0;
            infoArray2.length = 0;
            infoArray3.length = 0;

            if (parcels !== 'undefined') {
                parcels.clearSelection();
            }
            if (parcels1 !== 'undefined') {
                parcels1.clearSelection();
            }
        } catch (e) {}
    }

    function clearx() {
    	console.log(map.layerIds);
		var  n;
		  try{gLayer.clear();}catch(e){}
    	domAttr.set(tools, "class" ,"clear");
        map.removeAllLayers();
      /*
      //  map.addLayer(basemap);
        try{
         n = basemapGallery.getSelected().id;
  		console.log(n);
  		} catch(e){}
  		var bmap;
  	
  		
  		 */
  		
  		try{
  		    
  		    if(dom.byId("toggleSat").checked){
  		       map.addLayer(basemap); 
  		    } else if(dom.byId("toggleStreet").checked){
               map.addLayer(streetLayer); 
            }else if(dom.byId("toggleTopo").checked){
               map.addLayer(topoLayer); 
            }else if(dom.byId("toggleNat").checked){
               map.addLayer(natGeoLayer); 
            }else if(dom.byId("toggleOpenStreet").checked){
               map.addLayer(osmLayer); 
            }else if(dom.byId("toggleSTerrain").checked){
               map.addLayer(stamenTerrainLayer); 
            }else if(dom.byId("toggleMapbox").checked){
               map.addLayer(mapBoxTerrainLayer); 
            }else if(dom.byId("toggleMapquest").checked){
               map.addLayer(mapQuestLayer); 
            }else if(dom.byId("toggleCPale").checked){
               map.addLayer(cloudmadePaleLayer); 
            }else if(dom.byId("toggleCNight").checked){
               map.addLayer(cloudmadeNightLayer); 
            }else if(dom.byId("toggleToner").checked){
               map.addLayer(stamenTonerLayer); 
            }else if(dom.byId("toggleWColor").checked){
               map.addLayer(waterColorLayer); 
            }
  		    
  		    
  		    
  		    
  		    
  		    
  		    
  		    
  		    
  		    
  		    
  		}catch(e){console.log(e);}

  		
  		 try{
  		     if(dom.byId("toggleParcs").checked){
  		         map.addLayer(parcelInfoLayer);
  		     }
             if(dom.byId("toggleZoning").checked){
                 map.addLayer(zoneLayer);
             }
  		      if(dom.byId("toggleFlood").checked){
                 map.addLayer(floodLayer);
             }
              if(dom.byId("toggleEsriLabels").checked){
                 map.addLayer(esriLabelLayer);
             }
  		     } catch(e){console.log(e);}
        try{map.addLayer(gLayer);} catch(e){console.log(e);}
      //  map.addLayer(parcelInfoLayer);
       
        stripe = null;
        empty();
        map.graphics.clear();
        map.infoWindow.hide();
        dom.byId("filler").innerHTML = "";
        count = 0;
        tf = false;
        
        try {
            resultsArray.length = 0;
        } catch (e) {}
        
         try {
           infoArray3.length = 0;
        } catch (e) {}
        
        
         try {
            infoArray.length = 0;
        } catch (e) {}
        
         try {
            infoArray2.length = 0;
        } catch (e) {}
        
        try {
            parcels.clearSelection();
        } catch (e) {}
 
        try {
            parcels1.clearSelection();
        } catch (e) {}
		 try {
            points.clearSelection();
        } catch (e) {}

		 try {
            road.clearSelection();
        } catch (e) {}
		 try {
            roads.clearSelection();
        } catch (e) {}
        try {
            popup.clearFeatures();
        } catch (e) {}
        try{
        	dom.byId("tableContent").innerHTML = "";
        	dom.byId("tableTallContent").innerHTML = "";
        	} catch(e){
    
				document.getElementById('tableContent').innerText="";
				document.getElementById('tableTallContent').innerText="";
				
			}

    }
    
    
    function exportSearchResults(){
    	console.log(resultsArray);
    	
    	for(i=0;i<resultsArray.length;i++){
    		
    		console.log(resultsArray[i]);
    		//If row is a parcel
    		if(resultsArray[i].geometry != undefined && resultsArray[i].geometry.type == "polygon"){
    			console.log("polygon " + i);
    			 exportArray = {
          	         "parcelNum": resultsArray[i].attributes.PAR_NUM.toString(),
        	         "Fips": resultsArray[i].attributes.Fips.toString(),
        	         "Owner": resultsArray[i].attributes.Owner,
 	                 "OwnerOverflow": resultsArray[i].attributes.OwnerOverflow,
 	                 "OwnerStreetAddress": resultsArray[i].attributes.OwnerStreetAddress,
  	                 "OwnerCity": resultsArray[i].attributes.OwnerCity,
                     "OwnerState": resultsArray[i].attributes.OwnerState,
                     "OwnerZip": resultsArray[i].attributes.OwnerZip.toString(),
                     "OwnerCountry": resultsArray[i].attributes.OwnerCountry,
                     "TaxDistrict": resultsArray[i].attributes.TaxDistrict,
                     "Subdivision": resultsArray[i].attributes.Subdivision,
                     "Zoning": resultsArray[i].attributes.Zoning,
                     "LegalDescription": resultsArray[i].attributes.LegalDescription,
                     "LandAssessedValue": resultsArray[i].attributes.LandAssessedValue.toString(),
                     "LandActualValue": resultsArray[i].attributes.LandActualValue.toString(),
                     "ImprovementsAssessedValue": resultsArray[i].attributes.ImprovementsAssessedValue.toString(),
                     "ImprovementsActualValue": resultsArray[i].attributes.ImprovementsActualValue.toString(),
                     "Fire": resultsArray[i].attributes.Fire,
                     "PropertyTax": resultsArray[i].attributes.PropertyTax 
                    
                 };
                 
                 var str = dom.byId("filler").innerHTML;

       				 if (str.search("}") > -1) {
          				  tf = true;
       				}

      				  if (tf) {
          				  dom.byId("filler").innerHTML += ',{"' + count + '": ' + dojo.toJson(exportArray) + '}';
       				 } else {
           				 dom.byId("filler").innerHTML += '{"' + count + '": ' + dojo.toJson(exportArray) + '}';
      				  }
        			 console.log(dom.byId("filler").innerHTML);
       				 console.log(tf);
       				 count++;
        	//If row is an address point
    		} else if (resultsArray[i].geometry != undefined && resultsArray[i].geometry.type == "point" && resultsArray[i].location == undefined){
    			console.log("point " + i);
    			
    			exportArray = {
          	         "AddressNumber": resultsArray[i].attributes.ADDRNUM.toString(),
        	         "FacilityName": resultsArray[i].attributes.FACILITYNAME,
        	         "FullAddress": resultsArray[i].attributes.FULLADDR
                 };
                 
                 var str = dom.byId("filler").innerHTML;

       				 if (str.search("}") > -1) {
          				  tf = true;
       				}

      				  if (tf) {
          				  dom.byId("filler").innerHTML += ',{"' + count + '": ' + dojo.toJson(exportArray) + '}';
       				 } else {
           				 dom.byId("filler").innerHTML += '{"' + count + '": ' + dojo.toJson(exportArray) + '}';
      				  }
        			 console.log(dom.byId("filler").innerHTML);
       				 console.log(tf);
       				 count++;
    			
    			//If row is a geocoded address
    		} else if (resultsArray[i].location != undefined && resultsArray[i].address != undefined){
    			console.log("address point " + i);
    			
    			exportArray = {
          	         "Address": resultsArray[i].address,
          	         "Score": resultsArray[i].score.toString()        	         
                 };
                 
                 var str = dom.byId("filler").innerHTML;

       				 if (str.search("}") > -1) {
          				  tf = true;
       				}

      				  if (tf) {
          				  dom.byId("filler").innerHTML += ',{"' + count + '": ' + dojo.toJson(exportArray) + '}';
       				 } else {
           				 dom.byId("filler").innerHTML += '{"' + count + '": ' + dojo.toJson(exportArray) + '}';
      				  }
        			 console.log(dom.byId("filler").innerHTML);
       				 console.log(tf);
       				 count++;
    			
    			//If row is a road segment
    		} else if (resultsArray[i].geometry != undefined && resultsArray[i].geometry.type == "polyline"){
    			console.log("polyline " + i);
    			
    			exportArray = {
          	         "AltName": resultsArray[i].attributes.ALTNAME1,
          	         "City": resultsArray[i].attributes.CITY
          	        // "RdLabel": resultsArray[i].attributes.RD_LABEL        	         
                 };
                 
                 var str = dom.byId("filler").innerHTML;

       				 if (str.search("}") > -1) {
          				  tf = true;
       				}

      				  if (tf) {
          				  dom.byId("filler").innerHTML += ',{"' + count + '": ' + dojo.toJson(exportArray) + '}';
       				 } else {
           				 dom.byId("filler").innerHTML += '{"' + count + '": ' + dojo.toJson(exportArray) + '}';
      				  }
        			 console.log(dom.byId("filler").innerHTML);
       				 console.log(tf);
       				 count++;
    			
    		} 
    		
    		
    	}
    }
    
    
    var stripe = null;
    var exportArray = new Array();
    var tf = false;
    var count = 0;

    function info() { 
		displayResults(infoArray,"single");
        console.log(infoArray);
/*
        console.log(infoArray.attributes.LevyURL);
        //infoArray.attributes.LevyURL = "x";
        // exportArray.push(infoArray.attributes);
        exportArray = {
            "parcelNum": infoArray.attributes.PAR_NUM.toString(),
            "Fips": infoArray.attributes.Fips.toString(),
            "Owner": infoArray.attributes.Owner,
            "OwnerOverflow": infoArray.attributes.OwnerOverflow,
            "OwnerStreetAddress": infoArray.attributes.OwnerStreetAddress,
            "OwnerCity": infoArray.attributes.OwnerCity,
            "OwnerState": infoArray.attributes.OwnerState,
            "OwnerZip": infoArray.attributes.OwnerZip.toString()
        };

        console.log(dojo.toJson(exportArray));

        if (stripe == null || stripe == "odd") {
            stripe = "even";
        } else {
            stripe = "odd";
        }

     //   domAttr.set("output", "class", "xxhide");
     //   domAttr.set("output", "style", "opacity: 1;");
      //  domAttr.set("toggleOutput", "class", "open");
        var s = "<tr class=\"" + stripe + " centerCell\">" +
            "<td class=\"parNum\">" + infoArray.attributes.PAR_NUM + "</td>" +
            "<td class=\"assessorLink\"><a href=\"http://www.co.pueblo.co.us/cgi-bin/webatrbroker.wsc/propertyinfo.p?par=" + infoArray.attributes.PAR_TXT + "\" target=\"_blank\" >" + infoArray.attributes.PAR_TXT + "</a></td>" +
            "<td class=\"fips\">" + infoArray.attributes.Fips + "</td>" +
            "<td class=\"ownName\">" + infoArray.attributes.Owner + "</td>" +
            "<td class=\"ownOverflow\">" + infoArray.attributes.OwnerOverflow + "</td>" +
            "<td class=\"ownAddress\">" + infoArray.attributes.OwnerStreetAddress + "</td>" +
            "<td class=\"ownCity\">" + infoArray.attributes.OwnerCity + "</td>" +
            "<td class=\"ownState\">" + infoArray.attributes.OwnerState + "</td>" +
            "<td class=\"ownZip\">" + infoArray.attributes.OwnerZip + "</td>" +
            "</tr>";

        dom.byId("outTable").innerHTML += s;

        var str = dom.byId("filler").innerHTML;

        if (str.search("}") > -1) {
            tf = true;
        }

        if (tf) {
            dom.byId("filler").innerHTML += ',{"' + count + '": ' + dojo.toJson(exportArray) + '}';
        } else {
            dom.byId("filler").innerHTML += '{"' + count + '": ' + dojo.toJson(exportArray) + '}';
        }
        console.log(dom.byId("filler").innerHTML);
        console.log(tf);
        count++;
        //  console.log(exportArray);
        //console.log(dojo.toJson(exportArray));
        //domAttr.set(dom.byId("exportButton"), "href", "test.php?content=" + encodeURIComponent(dojo.toJson(exportArray))); 
		*/
        /*
   var xhrArgs = ({
        url:"test.php",
        postData: "this is a test",
        handleAs: "text",    
        
        load: function(data){

            console.log(data);

        },
        error: function(error) {
			console.log(error);
                        }           

    });

 	
 	var deferred = dojo.rawXhrPost(xhrArgs);
 	 */
    }

    function makeJson(tempArray) {

        //"{\"PAR_NUM\":\"" + infoArray.attributes.PAR_NUM + "\" }";

        /* infoArray.attributes.PAR_NUM 
        infoArray.attributes.PAR_TXT 
        infoArray.attributes.PAR_TXT
        infoArray.attributes.Fips 
        infoArray.attributes.Owner
        infoArray.attributes.OwnerOverflow 
        infoArray.attributes.OwnerStreetAddress 
        infoArray.attributes.OwnerCity 
        infoArray.attributes.OwnerState 
        infoArray.attributes.OwnerZip
    	*/

    }

    function ownerResults(infoArray4) {
        console.log(infoArray4);
        /*
        	 alert("ownerResults started");
        	var s;
        	for(i=0; i<infoArray4.length; i++) {
                s += "<tr>" +
                "<td>" + infoArray4[i].attributes.PAR_NUM + "</td>" +
                "<td><a id=\"highlight\" onclick= >" + infoArray.attributes.PAR_TXT + "</a></td>" +
                "<td>" + infoArray4[i].attributes.Fips + "</td>" +
                "<td>" + infoArray4[i].attributes.Owner + "</td>" +
                "<td>" + infoArray4[i].attributes.OwnerOverflow + "</td>" +
                "<td>" + infoArray4[i].attributes.OwnerStreetAddress + "</td>" +
                "<td>" + infoArray4[i].attributes.OwnerCity + "</td>" +
                "<td>" + infoArray4[i].attributes.OwnerState + "</td>" +
                "<td>" + infoArray4[i].attributes.OwnerZip + "</td>" +
                "</tr>";
                console.log(s);
        	}

            dom.byId("output").innerHTML = "<table>" + s + "</table>";
			*/
    }

    function empty() {

        var x = "<tr class=\"labels\"><td id=\"parNum\">Parcel Num.</td><td id=\"assesorLink\">Assessor Link</td><td id=\"fips\">FIPS</td><td id=\"ownName\">Own. Name</td><td id=\"ownOverflow\">Own. Overflow</td><td id=\"ownAddress\">Own. Address</td><td id=\"ownCity\">Own. City</td><td id=\"ownState\">Own. State</td><td id=\"ownZip\">Own. Zip</td></tr>";
		try{
        dom.byId("outTable").innerHTML = x;
		}catch(e){}
        domAttr.set("output", "class", "hide");
        domAttr.set("toggleOutput", "class", "closed");
    }

    function bufferMode() {
    	rubberBandZoomMode(false);
    	navToolbar.activate(Navigation.PAN);
        if (draw) {
            draw = true;
            drawMode();

        }

        if (!buff) {
            buff = true;
            domAttr.set("bufferMode", "class", "bufferModeOn");
            domAttr.set(tools, "class" ,"bufferActive");
            domAttr.set("buffer-params", "style", "visibility: visible");
            map.infoWindow.hide();
        } else if (buff) {
            buff = false;
            domAttr.set("bufferMode", "class", "bufferModeOff");
            domAttr.set(tools, "class" ,"clear");
            // domAttr.set("buffer-params", "style", "visibility: hidden");
        } else if (buff == null) {
            buff = true;
            domAttr.set("bufferMode", "class", "bufferModeOn");
            domAttr.set(tools, "class" ,"bufferActive");
            // domAttr.set("buffer-params", "style", "visibility: visible");
            map.infoWindow.hide();

        }

    }

    function drawMode() {
		rubberBandZoomMode(false);
    	navToolbar.activate(Navigation.PAN);
        //measurement.show();
        if (buff) {
            buff = true;
            bufferMode();

        }
        if (!draw) {
            draw = true;
            domAttr.set("draw", "class", "drawOn");
            domAttr.set(tools, "class" ,"drawActive");
            // domAttr.set("measurementDiv", "style", "visibility: visible !important;;");

            domAttr.set("dijit_form_DropDownButton_0", "style", "-webkit-user-select: none;");
            map.infoWindow.hide();
        } else if (draw) {
            draw = false;
            domAttr.set("draw", "class", "drawOff");
            domAttr.set(tools, "class" ,"clear");
            //  domAttr.set("measurementDiv", "style", "visibility: hidden !important;");

            domAttr.set("dijit_form_DropDownButton_0", "style", "-webkit-user-select: none;visibility: hidden;");
        } else if (draw == null) {
            draw = true;
            domAttr.set("draw", "class", "drawOn");
            domAttr.set(tools, "class" ,"drawActive");
            //  domAttr.set("measurementDiv", "style", "visibility: visible !important;");

            domAttr.set("dijit_form_DropDownButton_0", "style", "-webkit-user-select: none;");
            map.infoWindow.hide();

        }

    }

    //Check if input is parcel or name
    function isNumber(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    }

    //Find parcel by entering parcel number into searchbox
    function findParcel() {

        selectParcel(dom.byId("address").value);

    }

    function findOwnerOrParcel() {
        change = false;
        map.graphics.clear();

        if (isNumber(dom.byId("address").value)) {
            selectParcel(dom.byId("address").value);
        } else {
            selectOwner(dom.byId("address").value);
        }
        map.infoWindow.hide();

    }
    var center;
    var selectionX;
    //find all owners matching query 
    function selectOwner(owner) {
        popup.clearFeatures();
		var z = new Array();
        if (owner) {
        	try{gLayer.clear();}catch(e){}
             try{infoArray2.length = 0;}catch(e){}
             try{map.graphics.clear();}catch(e){}
            var query = new Query();
            query.outFields = ["*"];
           // query.text = owner;
           		//query.where = "(Owner like '%" + owner + "%' or OwnerOverflow like '%" + owner + "%')";
           	//	query.where = "(Owner like '%dylan %' or OwnerOverflow like '%dylan %') and (Owner like '%addington%' or OwnerOverflow like '%addington%') ";
           		query.where = makeWordArray(owner, "owner");
           		console.log(query.where);
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
            	z.push(selection[0]);
                //center = graphicsUtils.graphicsExtent(selection).getCenter();
                 center = graphicsUtils.graphicsExtent(z).getCenter();
                selectionX = selection;
             /*   var extHandler = map.on("extent-change", function () {
                    extHandler.remove();
                    //zoom to the center then display the popup 
                    map.infoWindow.setFeatures(selection);
                    //   map.infoWindow.show(center);
                    //  ownerResults(selection);
                    //   alert("ownerResults complete");
                    console.log(selection);
                    displayResults(selection,"parcel");
                     infoArray2.push(selection[0]);
                });
                // console.log(center);
                */
                   map.infoWindow.setFeatures(selection);
                    //   map.infoWindow.show(center);
                    //  ownerResults(selection);
                    //   alert("ownerResults complete");
                    console.log(selection);
                    displayResults(selection,"parcel");
                     infoArray2.push(selection[0]);
                
                
                domAttr.set("locate", "class", "dormant");
                domAttr.set("body", "class", "claro buttonMode");
                map.centerAndZoom(center, 18);
                change = true;
                
				try{gLayer.add(map.infoWindow.getSelectedFeature());}catch(e){console.log(e);}

            });
            

        }
    }	


//var searchRefine = new Array("and","&","or",);

function makeWordArray(owner, qMode){
		var q = "";
		console.log(owner);
		console.log(qMode);
		var temp;
		
		owner = owner.match(/\S+\s*/g);
		console.log(owner);
		
		
		
		if(qMode == "owner"){
		
		
			for(i=0;i<=owner.length;i++){
				if(i + 1 != owner.length){
					try{
						owner[i] = owner[i].replace(/\s/g, '');
					} catch(e){}
					q += "(Owner like '%" + owner[i] + "%' or OwnerOverflow like '%" + owner[i] + "%') and";
				} else {
					try{
						owner[i] = owner[i].replace(/\s/g, '');
					} catch(e){}
					q += " (Owner like '%" + owner[i] + "%' or OwnerOverflow like '%" + owner[i] + "%')";
					console.log(q);
					return q;
				}
			}
		} else if(qMode == "address"){
			for(i=0;i<=owner.length;i++){
				if(i + 1 != owner.length){
					try{
						owner[i] = owner[i].replace(/\s/g, '');
					} catch(e){}
					q += "(FULLADDR like '%" + owner[i] + "%') and";
				} else {
					try{
						owner[i] = owner[i].replace(/\s/g, '');
					} catch(e){}
					q += " (FULLADDR like '%" + owner[i] + "%')";
					console.log(q);
					return q;
				}
			}			
		}
		
		 else if(qMode == "road"){
			for(i=0;i<=owner.length;i++){
				if(i + 1 != owner.length){
					try{
						owner[i] = owner[i].replace(/\s/g, '');
					} catch(e){}
					q += "(ALTNAME1 like '%" + owner[i] + "%') and";
				} else {
					try{
						owner[i] = owner[i].replace(/\s/g, '');
					} catch(e){}
					q += " (ALTNAME1 like '%" + owner[i] + "%')";
					console.log(q);
					return q;
				}
			}			
		}
	
	return 0;
	
}



 var symbolx = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([13, 255, 0]),
                5);


function zoomToRoad(evt){
	var geom = evt.geometry;
	console.log(evt);
	console.log(geom);
	
	map.graphics.clear();
	try{gLayer.clear();}catch(e){}
	var outSR = new SpatialReference(102100);
	 gsvc.project([ geom ], outSR, function(result) {
	//var symbol = new SimpleMarkerSymbol();
	var graphic = new Graphic(result[0], symbolx);
                //add a graphic to the map at the geocoded location
              console.log(result);  
                try{
                //map.graphics.add(graphic);
                gLayer.add(graphic);
           map.addLayer(gLayer);
         // map.graphics.add(graphic);
                } catch(e){
                	console.log(e);
                }
               // console.log(graphic);
                //add a text symbol to the map listing the location of the matched address.
           //  map.centerAndZoom(geom,2)
}, function(e){console.log(e);});



}


function zoomToPoint(evt){
	var geom = evt.geometry;
	map.graphics.clear();
	try{gLayer.clear();}catch(e){}
	//var symbol = new SimpleMarkerSymbol();
	var graphic = new Graphic(geom, sfs3);
                //add a graphic to the map at the geocoded location
                //map.graphics.add(graphic);
                gLayer.add(graphic);
                //add a text symbol to the map listing the location of the matched address.
                var displayText = evt.attributes.FULLADDR;
                var font = new Font(
                    "16pt",
                    Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL,
                    Font.WEIGHT_BOLD,
                    "Helvetica");

                var textSymbol = new TextSymbol(
                    displayText,
                    font,
                    new Color("#ff0000"));
                textSymbol.setOffset(0, 8);
               // map.graphics.add(new Graphic(geom, textSymbol));
             
               gLayer.add(new Graphic(geom,textSymbol));
               map.addLayer(gLayer);
                map.centerAndZoom(geom, 18);
}


function zoomToGeoPoint(evt){
	var geom = evt.location;
	map.graphics.clear();
	try{gLayer.clear();}catch(e){}
	//var symbol = new SimpleMarkerSymbol();
	var graphic = new Graphic(geom, sfs3);
                //add a graphic to the map at the geocoded location
                //map.graphics.add(graphic);
                gLayer.add(graphic);
                //add a text symbol to the map listing the location of the matched address.
                var displayText = evt.address;
                var font = new Font(
                    "16pt",
                    Font.STYLE_NORMAL,
                    Font.VARIANT_NORMAL,
                    Font.WEIGHT_BOLD,
                    "Helvetica");

                var textSymbol = new TextSymbol(
                    displayText,
                    font,
                    new Color("#ff0000"));
                textSymbol.setOffset(0, 8);
               // map.graphics.add(new Graphic(geom, textSymbol));
             
               gLayer.add(new Graphic(geom,textSymbol));
               map.addLayer(gLayer);
                map.centerAndZoom(geom, 18);
}



function setInfoArray2(geom, gCode){
	console.log(infoArray2);
	try{infoArray2.length = 0;} catch(e){}
	try{gLayer.clear();}catch(e){}
	try{popup.clearFeatures();} catch(e){}
	try{parcels.clearSelection();} catch(e){}

	
	
	try{
	if(gCode){
		geom.geometry = geom.location;
	}
	} catch(e){console.log(e);}
	
	try{infoArray2.push(geom);} catch(e){}
	
		
          
             try{map.graphics.clear();}catch(e){}
		try{gLayer.add(geom.geometry);} catch(e){console.log(e);}
		console.log(infoArray2);
	
}




    var stripe2 = null;
    var resultsArray = new Array();
	var contentType;
	var displayHelp = dom.byId("displayHelp");
       function displayResults(infoArray5, infoMode) {
    	count = 0;
    	tf = false;
    	console.log(contentType);
    	on.emit(displayHelp, "click", {bubbles: true, cancelable: true});
    	if(contentType == undefined){
    		//console.log(infoMode);
    		contentType = infoMode;
    	} 
    	if(contentType != infoMode){
    	/*	try{resultsArray.length = 0;}catch(e){}
    		try{
    		dom.byId("tableContent").innerHTML = "";
    		dom.byId("tableTallContent").innerHTML = "";
    		} catch(e){
    		document.getElementById('tableContent').innerText="";
    		document.getElementById('tableTallContent').innerText="";
    		}
    		dom.byId("filler").innerHTML = "";
    		*/
    		contentType = infoMode;
    		
    	}
    	
    	 try{resultsArray.length = 0;}catch(e){}
        try{
        dom.byId("tableContent").innerHTML = "";
        dom.byId("tableTallContent").innerHTML = "";
        } catch(e){
        	document.getElementById('tableContent').innerText="";
    		document.getElementById('tableTallContent').innerText="";
        }
    	try{	dom.byId("filler").innerHTML = "";} catch(e){}
    	
        console.log(infoArray5);
		domAttr.set(dom.byId("searchResults"),"class","showx");
        if (stripe2 == null) {
            stripe2 = "even";
        }
        
        var l = resultsArray.length;
        
        
        if(infoMode == "road"){
        	for (i = 0; i < infoArray5.length; i++) {
                resultsArray.push(infoArray5[i]);
                var s = "<td class=\"sTall\" ><table cellspacing=\"0\"><tr class=\"" + " leftCell\">" +
                    "<td class=\"parNum\"><span class=\"resultsLabel\" >Road:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.ALTNAME1 + "</span></td>" + 
                    "</tr></table></td>";
				
				var sWide =  "<td class=\"parNum sWide\"><span class=\"resultsLabel\" >Road:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.ALTNAME1 + "</span></td>"
               
                var temp = domConstruct.create("tr", {
                    "innerHTML": "<td><a class=\"goToParcel\" title=\"View Road Segment\" id=\"test" + (i + l) + "\" >" + "</a></td>" + sWide,
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableContent");
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML": "<td><a class=\"goToParcel\" title=\"View Road Segment\" id=\"test" + (i + l + 10000) + "\" >" + "</a></td>" + s,
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableTallContent");
                
                
                var zz = dom.byId("test" + (i + l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    try {
                      
						//map.centerAndZoom(resultsArray[n].geometry, 8);
                       zoomToRoad(resultsArray[n]);
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                
                  var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    try {
                        //  safeClear();

                        zoomToRoad(resultsArray[n - 10000]);
                       
                    } catch (error) {
                        console.log(error);
                    }

                });

                if (stripe2 == "odd") {
                    stripe2 = "even";
                } else if (stripe2 == "even")
                    stripe2 = "odd";
            }
        }
        
        if(infoMode == "address"){
        	for (i = 0; i < infoArray5.length; i++) {
                resultsArray.push(infoArray5[i]);
                var s = "<td class=\"sTall\" ><table cellspacing=\"0\"><tr class=\"" + " leftCell\">" +
                    "<td class=\"parNum\"><span class=\"resultsLabel\" >Address:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.FULLADDR + "</span></td>" + 
                    "</tr></table></td>";
				
				var sWide =  "<td class=\"addrNum sWide\"><span class=\"resultsLabel\" >Address:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.FULLADDR + "</span></td>"
				
                var temp = domConstruct.create("tr", {
                    "innerHTML": "<td><a class=\"goToParcel\" title=\"View Address Point\" id=\"test" + (i + l) + "\" ></a></td>" + sWide,
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableContent");
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML": "<td><a class=\"goToParcel\" title=\"View Address Point\" id=\"test" + (i + l + 10000) + "\" ></a><td>" +  s,
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableTallContent");
                var zz = dom.byId("test" + (i + l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    console.log(t);
                    
                    try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    try {
                        //  safeClear();
						zoomToPoint(resultsArray[n]);
                        //selectParcel(resultsArray[n].attributes.PAR_NUM);
                        //map.infoWindow.show(resultsArray[n].geometry.getPoint(0, 0));
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                
                 var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    try {
                        //  safeClear();

                        zoomToPoint(resultsArray[n - 10000]);
                      
                    } catch (error) {
                        console.log(error);
                    }

                });
                

                if (stripe2 == "odd") {
                    stripe2 = "even";
                } else if (stripe2 == "even")
                    stripe2 = "odd";
            }
        }
        
        
        
        if (infoMode == "parcel" || infoMode == undefined) {
            for (i = 0; i < infoArray5.length; i++) {
                resultsArray.push(infoArray5[i]);
              //  console.log(resultsArray);
               var s = "<td class=\"sTall\" ><table cellspacing=\"0\"><tr class=\"" + " leftCell tall\">" +
                    "<td class=\"parNum\"><span class=\"resultsLabel\" >Parcel Number:</span><span class=\"resultsText\" >" + infoArray5[i].attributes.PAR_NUM + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"assessorLink\"><span class=\"resultsLabel\" >Assessor Link:</span><span class=\"resultsText\" > <a href=\"http://www.co.pueblo.co.us/cgi-bin/webatrbroker.wsc/propertyinfo.p?par=" + infoArray5[i].attributes.PAR_TXT + "\" target=\"_blank\" >" + infoArray5[i].attributes.PAR_TXT + "</a></span></td>" + "</tr>" +
                    "<tr class=\"" + " leftCell\">" + "<td class=\"fips\"><span class=\"resultsLabel\" >FIPS:</span><span class=\"resultsText\" > " + infoArray5[i].attributes.Fips + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownName\"><span class=\"resultsLabel\" >Own. Name:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.Owner + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownOverflow\"><span class=\"resultsLabel\" >Own. Overflow:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerOverflow + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownAddress\"><span class=\"resultsLabel\" >Own. Address:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerStreetAddress + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownCity\"><span class=\"resultsLabel\" >Own. City:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerCity + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownState\"><span class=\"resultsLabel\" >Own. State:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerState + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownZip\"><span class=\"resultsLabel\" >Own Zip:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerZip + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    
                    "<td class=\"impActVal\"><span class=\"resultsLabel\" >Improvement Act. Val.:</span> <span class=\"resultsText\" >$" + infoArray5[i].attributes.ImprovementsActualValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"impAssVal\"><span class=\"resultsLabel\" >Improvement Ass. Val.:</span> <span class=\"resultsText\" >$" + infoArray5[i].attributes.ImprovementsAssessedValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"landActVal\"><span class=\"resultsLabel\" >Land Act. Val.:</span> <span class=\"resultsText\" >$" + infoArray5[i].attributes.LandActualValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"landAssVal\"><span class=\"resultsLabel\" >Land Ass. Val.:</span> <span class=\"resultsText\" >$" + infoArray5[i].attributes.LandAssessedValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"legalDesc\"><span class=\"resultsLabel\" >Legal Desc.:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.LegalDescription + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"propTax\"><span class=\"resultsLabel\" >Property Tax:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.PropertyTax + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"subdivision\"><span class=\"resultsLabel\" >Subdivision:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.Subdivision + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"taxDist\"><span class=\"resultsLabel\" >Tax District:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.TaxDistrict+ "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
  					"<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5[i].attributes.ZoningURL + "\" target=\"blank\">" + infoArray5[i].attributes.Zoning + "</a></span></td>" +                     
                    
                    "</tr></table></td>";
		
					
					 var sWide = "" +
                    "<td class=\"parNum sWide\"><table><tr><td><span class=\"resultsLabel\" >Parcel Number:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5[i].attributes.PAR_NUM + "</span></td></tr></table></td>" + 
               		  "<td class=\"assessorLink sWide\"><table><tr><td><span class=\"resultsLabel\" >Assessor Link:</span></td></tr><tr><td><span class=\"resultsText\" > <a href=\"http://www.co.pueblo.co.us/cgi-bin/webatrbroker.wsc/propertyinfo.p?par=" + 
               		  infoArray5[i].attributes.PAR_TXT + 
               		  "\" target=\"_blank\" >" + infoArray5[i].attributes.PAR_TXT + "</a></span></td></tr></table></td>" + 
                   "<td class=\"fips sWide\"><table><tr><td><span class=\"resultsLabel\" >FIPS:</span></td></tr><tr><td><span class=\"resultsText\" > " + infoArray5[i].attributes.Fips + "</span></td></tr></table></td>" + 
                    "<td class=\"ownName sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. Name:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5[i].attributes.Owner + "</span></td></tr></table></td>" + 
                    "<td class=\"ownOverflow sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. Overflow:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerOverflow + "</span></td></tr></table></td>" + 
                    "<td class=\"ownAddress sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. Address:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerStreetAddress + "</span></td></tr></table></td>" + 
                    "<td class=\"ownCity sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. City:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerCity + "</span></td></tr></table></td>" + 
                    "<td class=\"ownState sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. State:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerState + "</span></td></tr></table></td>" + 
                    "<td class=\"ownZip sWide\"><table><tr><td><span class=\"resultsLabel\" >Own Zip:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5[i].attributes.OwnerZip + "</span></td></tr></table></td>" +
                    "<td class=\"impActVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Improvement Act. Val.:</span> </td></tr><tr><td><span class=\"resultsText\" >$" + infoArray5[i].attributes.ImprovementsActualValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"impAssVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Improvement Ass. Val.:</span> </td></tr><tr><td><span class=\"resultsText\" >$" + infoArray5[i].attributes.ImprovementsAssessedValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"landActVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Land Act. Val.:</span></td></tr><tr><td> <span class=\"resultsText\" >$" + infoArray5[i].attributes.LandActualValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"landAssVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Land Ass. Val.:</span> </td></tr><tr><td><span class=\"resultsText\" >$" + infoArray5[i].attributes.LandAssessedValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"legalDesc sWide\"><table><tr><td><span class=\"resultsLabel\" >Legal Desc.:</span></td></tr><tr><td><span class=\"resultsText\" >" + infoArray5[i].attributes.LegalDescription + "</span></td></tr></table></td>" +
                    "<td class=\"propTax sWide\"><table><tr><td><span class=\"resultsLabel\" >Property Tax:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5[i].attributes.PropertyTax + "</span></td></tr></table></td>" +
                    "<td class=\"subdivision sWide\"><table><tr><td><span class=\"resultsLabel\" >Subdivision:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5[i].attributes.Subdivision + "</span></td></tr></table></td>" +
                    "<td class=\"taxDist sWide\"><table><tr><td><span class=\"resultsLabel\" >Tax District:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5[i].attributes.TaxDistrict+ "</span></td></tr></table></td>" +
  					"<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5[i].attributes.ZoningURL + "\" target=\"blank\">" + infoArray5[i].attributes.Zoning + "</a></span></td>" +                     
                    
                    "";
		
			

                var temp = domConstruct.create("tr", {
                    "innerHTML":"<td><div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5[i].attributes.PAR_TXT + "\" id=\"test" + (i + l) + "\" >" + "</a></td>" + sWide  + "</div>",
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableContent");
                
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML":"<div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5[i].attributes.PAR_TXT + "\" id=\"test" + (i + l + 10000) + "\" >" + "</a>" + s + "</div>",
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableTallContent");
                
                
                
                var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    
                    console.log(t);
                    try {
                        //  safeClear();

                        selectParcel(resultsArray[n - 10000].attributes.PAR_NUM);
                        map.infoWindow.show(resultsArray[n - 10000].geometry.getPoint(0, 0));
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                
                var zz = dom.byId("test" + (i + l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    console.log(t);
                     try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    try {
                        //  safeClear();

                        selectParcel(resultsArray[n].attributes.PAR_NUM);
                        map.infoWindow.show(resultsArray[n].geometry.getPoint(0, 0));
                    } catch (error) {
                        console.log(error);
                    }

                });

                if (stripe2 == "odd") {
                    stripe2 = "even";
                } else if (stripe2 == "even"){
                    stripe2 = "odd";
                   }
            }
        }
        
        if(infoMode == "single"){
        	
        	 resultsArray.push(infoArray5);
                console.log(resultsArray);
              /*  var s = "<td class=\"sTall\"><table cellspacing=\"0\"><tr class=\"" + " leftCell\">" +
                    "<td class=\"parNum\"><span class=\"resultsLabel\" >Parcel Number:</span> <span class=\"resultsText\" >" + infoArray5.attributes.PAR_NUM + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"assessorLink\"><span class=\"resultsLabel\" >Assessor Link:</span><span class=\"resultsText\" > <a href=\"http://www.co.pueblo.co.us/cgi-bin/webatrbroker.wsc/propertyinfo.p?par=" + infoArray5.attributes.PAR_TXT + "\" target=\"_blank\" >" + infoArray5.attributes.PAR_TXT + "</a></span></td>" + "</tr>" +
                    "<tr class=\"" + " leftCell\">" + "<td class=\"fips\"><span class=\"resultsLabel\" >FIPS:</span><span class=\"resultsText\" > " + infoArray5.attributes.Fips + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownName\"><span class=\"resultsLabel\" >Own. Name:</span> <span class=\"resultsText\" >" + infoArray5.attributes.Owner + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownOverflow\"><span class=\"resultsLabel\" >Own. Overflow:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerOverflow + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownAddress\"><span class=\"resultsLabel\" >Own. Address:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerStreetAddress + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownCity\"><span class=\"resultsLabel\" >Own. City:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerCity + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownState\"><span class=\"resultsLabel\" >Own. State:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerState + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownZip\"><span class=\"resultsLabel\" >Own Zip:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerZip + "</span></td>" +
                    "</tr></table></td>";
*/
				
				var s = "<td class=\"sTall\" ><table cellspacing=\"0\"><tr class=\"" + " leftCell tall\">" +
                    "<td class=\"parNum\"><span class=\"resultsLabel\" >Parcel Number:</span> <span class=\"resultsText\" >" + infoArray5.attributes.PAR_NUM + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"assessorLink\"><span class=\"resultsLabel\" >Assessor Link:</span><span class=\"resultsText\" > <a href=\"http://www.co.pueblo.co.us/cgi-bin/webatrbroker.wsc/propertyinfo.p?par=" + infoArray5.attributes.PAR_TXT + "\" target=\"_blank\" >" + infoArray5.attributes.PAR_TXT + "</a></span></td>" + "</tr>" +
                    "<tr class=\"" + " leftCell\">" + "<td class=\"fips\"><span class=\"resultsLabel\" >FIPS:</span><span class=\"resultsText\" > " + infoArray5.attributes.Fips + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownName\"><span class=\"resultsLabel\" >Own. Name:</span> <span class=\"resultsText\" >" + infoArray5.attributes.Owner + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownOverflow\"><span class=\"resultsLabel\" >Own. Overflow:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerOverflow + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownAddress\"><span class=\"resultsLabel\" >Own. Address:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerStreetAddress + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownCity\"><span class=\"resultsLabel\" >Own. City:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerCity + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownState\"><span class=\"resultsLabel\" >Own. State:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerState + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"ownZip\"><span class=\"resultsLabel\" >Own Zip:</span> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerZip + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    
                    "<td class=\"impActVal\"><span class=\"resultsLabel\" >Improvement Act. Val.:</span> <span class=\"resultsText\" >$" + infoArray5.attributes.ImprovementsActualValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"impAssVal\"><span class=\"resultsLabel\" >Improvement Ass. Val.:</span> <span class=\"resultsText\" >$" + infoArray5.attributes.ImprovementsAssessedValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"landActVal\"><span class=\"resultsLabel\" >Land Act. Val.:</span> <span class=\"resultsText\" >$" + infoArray5.attributes.LandActualValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"landAssVal\"><span class=\"resultsLabel\" >Land Ass. Val.:</span> <span class=\"resultsText\" >$" + infoArray5.attributes.LandAssessedValue + ".00</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"legalDesc\"><span class=\"resultsLabel\" >Legal Desc.:</span> <span class=\"resultsText\" >" + infoArray5.attributes.LegalDescription + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"propTax\"><span class=\"resultsLabel\" >Property Tax:</span> <span class=\"resultsText\" >" + infoArray5.attributes.PropertyTax + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"subdivision\"><span class=\"resultsLabel\" >Subdivision:</span> <span class=\"resultsText\" >" + infoArray5.attributes.Subdivision + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"taxDist\"><span class=\"resultsLabel\" >Tax District:</span> <span class=\"resultsText\" >" + infoArray5.attributes.TaxDistrict+ "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                    "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5.attributes.ZoningURL + "\" target=\"blank\">" + infoArray5.attributes.Zoning + "</a></span></td>" + 
                    
                    "</tr></table></td>";
		
					
					 var sWide = "" +
                    "<td class=\"parNum sWide\"><table><tr><td><span class=\"resultsLabel\" >Parcel Number:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5.attributes.PAR_NUM + "</span></td></tr></table></td>" + 
               		  "<td class=\"assessorLink sWide\"><table><tr><td><span class=\"resultsLabel\" >Assessor Link:</span></td></tr><tr><td><span class=\"resultsText\" > <a href=\"http://www.co.pueblo.co.us/cgi-bin/webatrbroker.wsc/propertyinfo.p?par=" + 
               		  infoArray5.attributes.PAR_TXT + 
               		  "\" target=\"_blank\" >" + infoArray5.attributes.PAR_TXT + "</a></span></td></tr></table></td>" + 
                   "<td class=\"fips sWide\"><table><tr><td><span class=\"resultsLabel\" >FIPS:</span></td></tr><tr><td><span class=\"resultsText\" > " + infoArray5.attributes.Fips + "</span></td></tr></table></td>" + 
                    "<td class=\"ownName sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. Name:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5.attributes.Owner + "</span></td></tr></table></td>" + 
                    "<td class=\"ownOverflow sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. Overflow:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerOverflow + "</span></td></tr></table></td>" + 
                    "<td class=\"ownAddress sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. Address:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5.attributes.OwnerStreetAddress + "</span></td></tr></table></td>" + 
                    "<td class=\"ownCity sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. City:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5.attributes.OwnerCity + "</span></td></tr></table></td>" + 
                    "<td class=\"ownState sWide\"><table><tr><td><span class=\"resultsLabel\" >Own. State:</span></td></tr><tr><td> <span class=\"resultsText\" >" + infoArray5.attributes.OwnerState + "</span></td></tr></table></td>" + 
                    "<td class=\"ownZip sWide\"><table><tr><td><span class=\"resultsLabel\" >Own Zip:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5.attributes.OwnerZip + "</span></td></tr></table></td>" +
                    "<td class=\"impActVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Improvement Act. Val.:</span> </td></tr><tr><td><span class=\"resultsText\" >$" + infoArray5.attributes.ImprovementsActualValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"impAssVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Improvement Ass. Val.:</span> </td></tr><tr><td><span class=\"resultsText\" >$" + infoArray5.attributes.ImprovementsAssessedValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"landActVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Land Act. Val.:</span></td></tr><tr><td> <span class=\"resultsText\" >$" + infoArray5.attributes.LandActualValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"landAssVal sWide\"><table><tr><td><span class=\"resultsLabel\" >Land Ass. Val.:</span> </td></tr><tr><td><span class=\"resultsText\" >$" + infoArray5.attributes.LandAssessedValue + ".00</span></td></tr></table></td>" +
                    "<td class=\"legalDesc sWide\"><table><tr><td><span class=\"resultsLabel\" >Legal Desc.:</span></td></tr><tr><td><span class=\"resultsText\" >" + infoArray5.attributes.LegalDescription + "</span></td></tr></table></td>" +
                    "<td class=\"propTax sWide\"><table><tr><td><span class=\"resultsLabel\" >Property Tax:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5.attributes.PropertyTax + "</span></td></tr></table></td>" +
                    "<td class=\"subdivision sWide\"><table><tr><td><span class=\"resultsLabel\" >Subdivision:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5.attributes.Subdivision + "</span></td></tr></table></td>" +
                    "<td class=\"taxDist sWide\"><table><tr><td><span class=\"resultsLabel\" >Tax District:</span> </td></tr><tr><td><span class=\"resultsText\" >" + infoArray5.attributes.TaxDistrict+ "</span></td></tr></table></td>" +
  "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5.attributes.ZoningURL + "\" target=\"blank\">" + infoArray5.attributes.Zoning + "</a></span></td>" +                     
                    "";

             
                
                  var temp = domConstruct.create("tr", {
                    "innerHTML":"<td><div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5.attributes.PAR_TXT + "\" id=\"test" + (l) + "\" >" + "</a></td>" + sWide  + "</div>",
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableContent");
                
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML":"<div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5.attributes.PAR_TXT + "\" id=\"test" + (l + 10000) + "\" >" + "</a>" + s + "</div>",
                    //	"id": "test" + i,
                    "class": stripe2
                }, "tableTallContent");
                
                
                
                var zz = dom.byId("test" + (l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    console.log(t);
                    try {
                        //  safeClear();

                        selectParcel(resultsArray[n].attributes.PAR_NUM);
                        map.infoWindow.show(resultsArray[n].geometry.getPoint(0, 0));
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                  var zz2 = dom.byId("test" + ( l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    try {
                        //  safeClear();

                        selectParcel(resultsArray[n - 10000].attributes.PAR_NUM);
                        map.infoWindow.show(resultsArray[n - 10000].geometry.getPoint(0, 0));
                    } catch (error) {
                        console.log(error);
                    }

                });

                if (stripe2 == "odd") {
                    stripe2 = "even";
                } else if (stripe2 == "even"){
                    stripe2 = "odd";
                   }
        	
        	
        }
        
        
        setTimeout(function () {
			
         //   on.emit(dom.byId("openClose"), "click", {
         //       bubbles: true,
           //     cancelable: true
          //  });
            //on.emit(dom.byId("toggleOutput"), "click", {bubbles: true, cancelable: true});
        }, 1000);

        //connect.subscribe("")
		searchTimeout = true;
    }


    function displayGeoCoderResults(infoArray5) {
    	count = 0;
    	tf = false;
    	setInfoArray2(infoArray5.addresses[0], true); // so user can buffer first result
    	contentType = "geoCoder"; //ensures results clear when user searches for different data type
        console.log(infoArray5);
        try{resultsArray.length = 0;}catch(e){}
        try{
        dom.byId("tableContent").innerHTML = "";
        dom.byId("tableTallContent").innerHTML = "";
        } catch(e){
        	document.getElementById('tableContent').innerText="";
    		document.getElementById('tableTallContent').innerText="";
        }
    		dom.byId("filler").innerHTML = "";
		var l = resultsArray.length;
        if (stripe2 == null) {
            stripe2 = "even";
        }

        for (i = 0; i < infoArray5.addresses.length; i++) {
        	//console.log(infoArray5);
        	console.log(infoArray5.addresses[0].address);
            infoArray5.addresses[i].location.spatialReference.wkid = 2233;
            resultsArray.push(infoArray5.addresses[i]);
            var s = "<td class=\"sTall\" ><table cellspacing=\"0\"><tr class=\"" + " leftCell\">" +
                "<td class=\"parNum\"><span class=\"resultsLabel\" >Address:</span> <span class=\"resultsText\" >" + infoArray5.addresses[i].address + "</span></td>" + "</tr>" + "<tr class=\"" + " leftCell\">" +
                "<td class=\"assessorLink\"><span class=\"resultsLabel\" >Address Matching Score: </span><span class=\"resultsText\" ><em>" + infoArray5.addresses[i].score + "</em></span></td>" + "</tr>" +
                "</table></td>";
			
			var sWide =  "<td class=\"parNum sWide\"><span class=\"resultsLabel\" >Address:</span> <span class=\"resultsText\" >" + infoArray5.addresses[i].address + "</span></td>" +
                "<td class=\"assessorLink sWide\"><span class=\"resultsLabel\" >Address Matching Score: </span><span class=\"resultsText\" ><em>" + infoArray5.addresses[i].score + "</em></span></td>";
			
			
            var temp = domConstruct.create("tr", {
                "innerHTML": "<td><a class=\"goToParcel\" id=\"test" + (i + l) + "\" >" + "</a></td>" + sWide,

                "class": stripe2 + " selection" + i
            }, "tableContent");
            
            var temp2 = domConstruct.create("tr", {
                "innerHTML": "<td><a class=\"goToParcel\" id=\"test" + (i + l + 10000) + "\" >" + "</a></td>" + s,

                "class": stripe2 + " selection" + i
            }, "tableTallContent");
            
            var zz = dom.byId("test" + (i + l));

            //event handlers for search results
            dojo.connect(zz, "onclick", function (node) {
                console.log(node);
                map.graphics.clear();
                var n = node.target.id;
                n = n.toString();
                n = n.replace("test", "");
                console.log(n);
                console.log(resultsArray[n]);
                var t = resultsArray[n];
                console.log(t);
                try{setInfoArray2(resultsArray[n], true);} catch(e){console.log(e);}
                try {
                    //  safeClear();
					console.log(resultsArray[n]);
                   // selectByPoint(resultsArray[n]);
                   zoomToGeoPoint(resultsArray[n]);
                    //map.infoWindow.show(resultsArray[n].location);
                } catch (error) {
                    console.log(error);
                }

            });
            
            
             
                var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    //var n = node.target.parentNode.parentNode.parentNode.parentNode.id;
                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000], true);} catch(e){console.log(e);}
                    try {
                        //  safeClear();

                      zoomToGeoPoint(resultsArray[n - 10000]);
                    } catch (error) {
                        console.log(error);
                    }

                });

            if (stripe2 == "odd") {
                stripe2 = "even";
            } else if (stripe2 == "even")
                stripe2 = "odd";
        }
        setTimeout(function () {
        //    on.emit(dom.byId("openClose"), "click", {
        //        bubbles: true,
        //        cancelable: true
        //    });
            //on.emit(dom.byId("toggleOutput"), "click", {bubbles: true, cancelable: true});
        }, 1000);

        //connect.subscribe("")
		searchTimeout = true;
    }

    //detect when popup selection is changed
    popup.on("selection-change", function () {
        if (change) {
            try {
                map.infoWindow.restore();
                // console.log(popup.getSelectedFeature());

                infoArray = selectionX[popup.selectedIndex];

                map.centerAndZoom(popup.features[popup.selectedIndex].geometry.getPoint(0, 0), 18);

                map.infoWindow.show(popup.features[popup.selectedIndex].geometry.getPoint(0, 0));
            } catch (e) {}
        }

    });

    // combine all results' geometries into an array and create a single geometry to display on the map
    function makeGeomArray(selection) {
		searchTimeout = true;
        var tempArray = new Array();

        for (i = 0; i < selection.length; i++) {
            tempArray.push(selection[i].geometry);
        }

        var tempVar = gsvc.union(tempArray);

        tempVar.then(function (results) {

            var symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
               // new Color([13, 255, 0]),
                new Color([255, 0, 0]),
                5);

            var bufferGeometry = results;
            //console.log(bufferGeometry);
            var graphic2 = new Graphic(bufferGeometry, symbol);
            // console.log(graphic2.geometry.getExtent());
				
            map.graphics.add(graphic2);
            map.setExtent(graphic2.geometry.getExtent());
            
            domAttr.set("locate", "class", "dormant");
            domAttr.set("body", "class", "claro buttonMode");
        });

    }
function makeGeomArray2(selection) {
		searchTimeout = true;
        var tempArray = new Array();

        for (i = 0; i < selection.length; i++) {
            tempArray.push(selection[i].geometry);
        }

        var tempVar = gsvc.union(tempArray);

        tempVar.then(function (results) {

            var symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([13, 255, 0]),
                5);

            var bufferGeometry = results;
            //console.log(bufferGeometry);
            var graphic2 = new Graphic(bufferGeometry, symbol);
            // console.log(graphic2.geometry.getExtent());
				gLayer.add(graphic2);
            map.graphics.add(graphic2);
            map.setExtent(graphic2.geometry.getExtent());
            
            domAttr.set("locate", "class", "dormant");
            domAttr.set("body", "class", "claro buttonMode");
        });

    }
    
    
    function makeGeomArray3(selection) {
    	console.log(selection);
    	try{infoArray2.length = 0;} catch(e){console.log(e);}
		searchTimeout = true;
        var tempArray = new Array();

        for (i = 0; i < selection.length; i++) {
            tempArray.push(selection[i].geometry);
        }
        

		 
       //   var symbol = new SimpleMarkerSymbol().setStyle("diamond");
         // var graphic = new Graphic(point, symbol);
          var outSR = new SpatialReference(102100);
          
        //  map.graphics.add(graphic);

          gsvc.project(tempArray, outSR, function(projectedPoints) {
          	console.log(projectedPoints);
          
		
        var tempVar = gsvc.union(projectedPoints);

        tempVar.then(function (results) {
        	//selection[0].geometry = results;
			//try{infoArray2.push(selection[0]);} catch(e){console.log(e);}
            var symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([13, 255, 0]),
                5);

            var bufferGeometry = results;
            //console.log(bufferGeometry);
            var graphic2 = new Graphic(bufferGeometry, symbol);
            // console.log(graphic2.geometry.getExtent());
				
           // map.graphics.add(graphic2);
           gLayer.add(graphic2);
            map.setExtent(graphic2.geometry.getExtent());
            map.addLayer(gLayer);
            domAttr.set("locate", "class", "dormant");
            domAttr.set("body", "class", "claro buttonMode");
        });
	},function(e){console.log(e);});
    }
    
    function findRoad() {
        popup.clearFeatures();
        change = false;
        map.graphics.clear();
        gLayer.clear();
        map.infoWindow.hide();
        var query = new Query();
        query.where = query.where = makeWordArray(dom.byId("address").value, "road");
        console.log(query);
        var deferred = roads.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {

            selectionX = selection;
              console.log(selection);
              displayResults(selection, "road");
            var extHandler = map.on("extent-change", function () {
                extHandler.remove();
                //zoom to the center then display the popup 
                map.infoWindow.setFeatures(selection);

            });
            
            
        
            // map.setZoom(3);
            //  map.setZoom(1);
            change = false;
            makeGeomArray3(selection);

        });
    }





		var zoomOnce = true;
		function showPosition(position){
			map.graphics.clear();
			var x, y;
			console.log(position);
			x = position.coords.longitude;
			y = position.coords.latitude;
			console.log(x);
			console.log(y);
			var p = new Point(x, y);
			console.log(p);
			var params = new ProjectParameters();
			//params.geometries = [p];
			 var outSR = new SpatialReference(102100);
			//params.transformation = {"wkid": 2233};
			console.log(params);
			try{
				gsvc.project([ p ], outSR, function(result){
					console.log(result);
				
					
				
    					
    					var sfs6 = new SimpleMarkerSymbol(
        SimpleMarkerSymbol.STYLE_CIRCLE, 15,
        new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID,
            new Color([13, 255, 0]),
            2),
        new Color([13, 255, 0, 0.5]),
        2);
        
					var loc = new Graphic(result[0],sfs6);
					console.log(loc);
					map.graphics.add(loc);
					if(zoomOnce){
					map.centerAndZoom(result[0], 17);
					zoomOnce = false;
					}
				}
				//,function(e){console.log(e);}
				);
				
			}catch(e){console.log(e);}
		}
		




    //select parcel from the feature layer by creating a query to look for the input parcel id 
    function selectParcel(parcelid) {
    	var z = new Array();
    	try{
		infoArray2.length = 0;
		
		} catch(e){}
        popup.clearFeatures();
        if (parcelid) {
            var query = new Query();
            query.where = "PAR_NUM = '" + parcelid + "'";
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
            	console.log(selection);
            	var outSR = new SpatialReference(102100);
	 			gsvc.project([ selection[0].geometry ], outSR, function(result) {
	 			console.log(result);
	 			selection[0].geometry = result[0];
	 			console.log(selection);
	 			z.push(selection[0]);
	 			console.log(z);
               try{ var center = graphicsUtils.graphicsExtent(z).getCenter();} catch(e){console.log(e);}
                console.log(center);
                var extHandler = map.on("extent-change", function () {
                    extHandler.remove();
                    //zoom to the center then display the popup 
                    map.infoWindow.setFeatures(selection);
                    map.infoWindow.show(center);
                    infoArray = selection[0];
                    try{infoArray2.push(selection[0]);}catch(e){console.log(e);}
                    try{displayResults(selection[0],"single");}catch(e){console.log(e);}
                  // info();
                  searchTimeout = true;
                   
                });
               
                try{ map.centerAndZoom(center, 18);}catch(e){console.log(e);}
            //  map.setExtent(graphicsUtils.graphicsExtent(z));
             //  map.centerAt(center);
             //  map.setZoom(18);
                 domAttr.set("locate", "class", "dormant");
                domAttr.set("body", "class", "claro buttonMode");
             });
            });
        }
    }

});