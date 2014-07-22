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
var zoomLevel;
var idMode = "parc";

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
    "esri/layers/OpenStreetMapLayer","esri/layers/WebTiledLayer", "dojo/promise/all", 
    "esri/geometry/Circle", "esri/geometry/Extent",

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
    Point, SpatialReference, ProjectParameters, behavior, request, PopupMobile, OpenStreetMapLayer, WebTiledLayer, all,
    Circle, Extent

) {

    parser.parse();

$('#idParcel').click(function(){
    idMode = "parc";
});
$('#idAddress').click(function(){
    idMode = "addr";
});
$('#idRoad').click(function(){
    idMode = "road";
});
$('.pcUp').click(function(){
        var current = $('.pcUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.pcDown').click(function(){
  var current = $('.pcUD');
  current.next().after(current);
  layerSorter();
});

$('.parcUp').click(function(){
        var current = $('.parcelUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.parcDown').click(function(){
  var current = $('.parcelUD');
  current.next().after(current);
  layerSorter();
});

$('.addrUp').click(function(){
        var current = $('.addrUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.addrDown').click(function(){
  var current = $('.addrUD');
  current.next().after(current);
  layerSorter();
});
$('.roadUp').click(function(){
        var current = $('.roadUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.roadDown').click(function(){
  var current = $('.roadUD');
  current.next().after(current);
  layerSorter();
});
$('.railUp').click(function(){
        var current = $('.railUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.railDown').click(function(){
  var current = $('.railUD');
  current.next().after(current);
  layerSorter();
});
$('.boundUp').click(function(){
        var current = $('.boundUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.boundDown').click(function(){
  var current = $('.boundUD');
  current.next().after(current);
  layerSorter();
});
$('.esriBoundUp').click(function(){
        var current = $('.esriBoundUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.esriBoundDown').click(function(){
  var current = $('.esriBoundUD');
  current.next().after(current);
  layerSorter();
});

$('.floodUp').click(function(){
        var current = $('.floodUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.floodDown').click(function(){
  var current = $('.floodUD');
  current.next().after(current);
  layerSorter();
});


$('.zoneUp').click(function(){
        var current = $('.zoneUD');
        current.prev().before(current);
        layerSorter();
  });
  $('.zoneDown').click(function(){
  var current = $('.zoneUD');
  current.next().after(current);
  layerSorter();
});


   function layerSorter(){
          
           setDataLayerOrder($('.sortableData li input').get());
   }
   
   function setDataLayerOrder(order){
       
       try{map.removeLayer(parcelInfoLayer);}catch(e){}
       try{map.removeLayer(puebloParcelLayer);}catch(e){}
       try{map.removeLayer(puebloPointsLayer);}catch(e){}
       try{map.removeLayer(puebloRoadLayer);}catch(e){}
       try{map.removeLayer(puebloRailroadLayer);}catch(e){}
       try{map.removeLayer(puebloBoundaryLayer);}catch(e){}
       try{map.removeLayer(esriLabelLayer);}catch(e){}
       try{map.removeLayer(floodLayer);}catch(e){}
       try{map.removeLayer(zoneLayer);}catch(e){}
     
       
       for(i=(order.length - 1);i>=0;i--){
  
           if(dom.byId(order[i].id).checked){
              switch(order[i].id){
                  case 'togglePuebloCounty':
         
                   map.addLayer(parcelInfoLayer);
                    break;
                  case 'toggleParcels':
                    map.addLayer(puebloParcelLayer);
                   
                    break;
                  case 'togglePoints':
                    map.addLayer(puebloPointsLayer);
                    break;
                  case 'toggleRoads':
                    map.addLayer(puebloRoadLayer);
                    break;
                  case 'toggleRailroads':
                    map.addLayer(puebloRailroadLayer);
                    break;
                  case 'toggleTowns':
                
                    break;
                  case 'toggleBoundaries':
                    map.addLayer(puebloBoundaryLayer);
                    break;
                  case 'toggleEsriLabels':
                    map.addLayer(esriLabelLayer);
                    break;
                  case 'toggleFlood':
                    map.addLayer(floodLayer);
                    break;
                  case 'toggleZoning':
                    map.addLayer(zoneLayer);
                    break;
                    
              }
           }
           
       }
       
  
            
   }
   
   function setBasemapLayerOrder(){
       
       
                try{map.removeLayer(aerial2013);}catch(e){}
                try{map.removeLayer(natGeoLayer);}catch(e){}
                try{map.removeLayer(streetLayer);}catch(e){}
                try{map.removeLayer(topoLayer);}catch(e){}
                try{map.removeLayer(googleLayer);}catch(e){}
                try{map.removeLayer(googleLayerStreet);}catch(e){}
                try{map.removeLayer(osmLayer);}catch(e){}
                try{map.removeLayer(basemap);}catch(e){}
                try{map.removeLayer(stamenTerrainLayer);}catch(e){}
                try{map.removeLayer(mapBoxTerrainLayer);}catch(e){}
                try{map.removeLayer(mapQuestLayer);}catch(e){}
                try{map.removeLayer(cloudmadePaleLayer);}catch(e){}
                try{map.removeLayer(cloudmadeNightLayer);}catch(e){}
                try{map.removeLayer(waterColorLayer);}catch(e){}
                try{map.removeLayer(stamenTonerLayer);}catch(e){}
       
        try{
            
            if(dom.byId("toggleSat").checked){
               map.addLayer(basemap); 
               map.reorderLayer(basemap,0);
            }else if(dom.byId("toggle2013").checked){
               map.addLayer(aerial2013); 
                map.reorderLayer(aerial2013,0);
            } else if(dom.byId("toggleStreet").checked){
               map.addLayer(streetLayer); 
                map.reorderLayer(streetLayer,0);
            }else if(dom.byId("toggleTopo").checked){
               map.addLayer(topoLayer); 
                map.reorderLayer(topoLayer,0);
            }else if(dom.byId("toggleNat").checked){
               map.addLayer(natGeoLayer); 
                map.reorderLayer(natGeoLayer,0);
            }else if(dom.byId("toggleOpenStreet").checked){
               map.addLayer(osmLayer); 
                map.reorderLayer(osmLayer,0);
            }else if(dom.byId("toggleSTerrain").checked){
               map.addLayer(stamenTerrainLayer); 
                map.reorderLayer(stamenTerrainLayer,0);
            }else if(dom.byId("toggleMapbox").checked){
               map.addLayer(mapBoxTerrainLayer); 
                map.reorderLayer(mapBoxTerrainLayer,0);
            }else if(dom.byId("toggleMapquest").checked){
               map.addLayer(mapQuestLayer); 
                map.reorderLayer(mapQuestLayer,0);
            }else if(dom.byId("toggleCPale").checked){
               map.addLayer(cloudmadePaleLayer); 
                map.reorderLayer(cloudmadePaleLayer,0);
            }else if(dom.byId("toggleCNight").checked){
               map.addLayer(cloudmadeNightLayer); 
                map.reorderLayer(cloudmadeNightLayer,0);
            }else if(dom.byId("toggleToner").checked){
               map.addLayer(stamenTonerLayer); 
                map.reorderLayer(stamenTonerLayer,0);
            }else if(dom.byId("toggleWColor").checked){
               map.addLayer(waterColorLayer); 
                map.reorderLayer(waterColorLayer,0);
            }
            
            
            
            
            
            
            
            
            
            
            
        }catch(e){console.log(e);}
       
   }
   
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
    
                
     //for layer opacity
      
      var sliderPC = new HorizontalSlider({
        name: "sliderPC",
        value: 1,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
              try{ parcelInfoLayer.setOpacity(value);} catch(e){console.log(e);}
          
         
        }
    }, "sliderPC");
      
      var sliderParc = new HorizontalSlider({
        name: "sliderParc",
        value: 1,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
         	  try{ puebloParcelLayer.setOpacity(value);} catch(e){console.log(e);}
          
         
        }
    }, "sliderParc");
    
       var sliderAddr = new HorizontalSlider({
        name: "sliderAddr",
        value: 1,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
              try{ puebloPointsLayer.setOpacity(value);} catch(e){console.log(e);}
          
         
        }
    }, "sliderAddr");
    
       var sliderRoad = new HorizontalSlider({
        name: "sliderRoad",
        value: 1,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
              try{ puebloRoadLayer.setOpacity(value);} catch(e){console.log(e);}
         
         
        }
    }, "sliderRoad");

       var sliderRail = new HorizontalSlider({
        name: "sliderRail",
        value: 1,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
              try{ puebloRailroadLayer.setOpacity(value);} catch(e){console.log(e);}
        
         
        }
    }, "sliderRail");

       var sliderBounds = new HorizontalSlider({
        name: "sliderBounds",
        value: 1,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
              try{ puebloBoundaryLayer.setOpacity(value);} catch(e){console.log(e);}
        
         
        }
    }, "sliderBounds");

       var sliderWorld = new HorizontalSlider({
        name: "sliderWorld",
        value: 1,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
              try{ esriLabelLayer.setOpacity(value);} catch(e){console.log(e);}
         
         
        }
    }, "sliderWorld");


       var sliderFlood = new HorizontalSlider({
        name: "sliderFlood",
        value: 0.65,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
              try{ floodLayer.setOpacity(value);} catch(e){console.log(e);}
     
         
        }
    }, "sliderFlood");


       var sliderZone = new HorizontalSlider({
        name: "sliderZone",
        value: 0.65,
        minimum: 0,
        maximum: 1,
        intermediateChanges: true,
        style: "width:200px;",
        onChange: function(value){
             
          try{ zoneLayer.setOpacity(value);} catch(e){console.log(e);}
         
        }
    }, "sliderZone");



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

  
    var popup;
    var mobile;
    if (window.innerWidth > 778) {
        popup = new Popup({
            fillSymbol: sfs
        }, domConstruct.create("div"));
        mobile = false;
    } else {
       popup = new Popup({
            fillSymbol: sfs
        }, domConstruct.create("div"));
        mobile = true;

    }



    //Map constructor
    map = new Map("map", {
        infoWindow: popup,
        isZoomSlider: true,
        center: [-104.595337, 38.255706],
        spatialReference: 102100,
        maxZoom: 19,
        minZoom: 10,
        zoom: 11
       

    });

    navToolbar = new Navigation(map);
	var rBZoom = new Draw(map, {
		showTooltips: false});
    var overviewLayer = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer");
    var mapLimit;
    map.on("load", function () {
      
        domAttr.remove(dom.byId("measurementDiv"), "style");
		rubberBandZoomMode(true);
		legendDijit = new Legend({
    map: map
   
  },"legendDiv");
  
      setTimeout(function(){getLayerFromUrl(document.location.href);},1000);
        var addressid = getAddressFromUrl(document.location.href);
            var roadid = getRoadFromUrl(document.location.href);
            var parcelid = getParcelFromUrl(document.location.href);
            var locality = getLocalityFromUrl(document.location.href);
        
        
          
            
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
            
            if(locality){
               zoomToLocality(locality.toLowerCase());
            }
	
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
    	//console.log(map.getZoom());
    	finishedLoading = true;
       
        domAttr.set("body", "class", "claro buttonMode");
        zoomLevel = map.getZoom();
         
       
    });

    map.on("zoom-end", function () {
        if (!mobile) {
            popup.reposition();
        }
    });


//control map through keyboard 
$(document).keydown(function(e){
     console.log(e);
    if(keyListen){
     switch(e.keyCode){
         
         case 38:
         //pan up - up arrow
            map.panUp();
            break;
          case 40:
          //pan down - down arrow
            map.panDown();
            break;
          case  37:
          //pan left - left arrow
          map.panLeft();
            break;
          case 39:
            //pan right - right arrow
            map.panRight();
            break;
         case 189:
            //zoom out - minus/dash key
            
             zoomLevel -= 1;
           map.setZoom(zoomLevel);
            break;
        case 187:
            //zoom in - +/= key
             zoomLevel += 1;
           map.setZoom(zoomLevel);
            break;
        
        //toggle floodplain layer
        case 70:
            if(e.shiftKey){
              $("#toggleFlood").trigger("click"); 
           }
        break;
        
        //toggle esri labels
         case 87:
            if(e.shiftKey){
              $("#toggleEsriLabels").trigger("click"); 
           }
        break;
        
        case 90:
            //rubber band zoom  mode or zone layer - z key
           
           if(e.shiftKey){
              $("#toggleZoning").trigger("click"); 
           }else{
            on.emit(dom.byId("zoom"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
            break;
        case 80:
           //print - shift + p key
            if(e.shiftKey){
                $("#printMenu").toggle();
                 $("#printMenu").position({
                   my: "center",
                  at: "center",
                  of: "#map"
                 });
                setTimeout(function(){$("#printTitleInput").focus();},50);
            } else {
                on.emit(dom.byId("pan"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
            break;
        case 83:
            //selection - s key
            
             if(e.shiftKey){
              $("#toggleRoads").trigger("click"); 
           }else{
            
            on.emit(dom.byId("selection"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
            break;
            
          case 82:
            //toggle railroad layer - shift + r key
            
             if(e.shiftKey){
              $("#toggleRailroads").trigger("click");     
            } 
            break;
       case 67:
            //clear - c key
            
             if(e.shiftKey){
            //  $("#togglePuebloCounty").trigger("click");     
            } else {
            
            on.emit(dom.byId("clear"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
            break;
     
     case 65:
     //toggle addr point layer - a key
        if(e.shiftKey){
              $("#togglePoints").trigger("click");     
            }
        break;
     
     case 89:
        //toggle parcel layer - y key
         if(e.shiftKey){
              $("#toggleParcels").trigger("click");     
            }
        break;
     
      case 77:
            on.emit(dom.byId("draw"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            
            break; 
     case 66:
            //buffer - b key
            
             if(e.shiftKey){
              $("#toggleBoundaries").trigger("click"); 
           } else {
            on.emit(dom.byId("bufferMode"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
            break;
            
      case 79:
            //overview window toggle  - o key
            on.emit(dom.byId("overviewToggle"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            break;          
            
     case 32:
     
     map.centerAndZoom(new Point([-104.595337, 38.255706]), 11);
     queryClear();
        break;
            
     case 73:
            //identify mode - i key
            on.emit(dom.byId("identify"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            break;
     case 84:
            //selected feature window toggle = t key
            on.emit(dom.byId("toggleOutput"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            break;
      case 76:
            //layer window toggle  - l key
            on.emit(dom.byId("toggleLayerMenu"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            break;      
      
        case 88:
            //legend window toggle - x key
            on.emit(dom.byId("legendToggle"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            break;   
        case 72:
            //help window toggle - h key
            on.emit(dom.byId("helpButton"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            break;   
        case 81:
           
            setTimeout(function(){
               $("#address").focus();
               $("#address").val("");
               },50); 
            break;   
       
       //secondary button for zoom out
        case 188:
           zoomLevel -= 1;
           map.setZoom(zoomLevel);
            break;  
            //secondary button for zoom in 
         case 190:
           zoomLevel += 1;
          map.setZoom(zoomLevel);
            break;                   
     }
    
    }
       switch(e.keyCode){
         
         
        case 27:     
            $("#address").blur();
            $("#printTitleInput").blur();
            on.emit(dom.byId("addrCancel"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            
            setTimeout(function(){$("#printMenu").hide();},50);
            break;
        case 33:    
            if(ownParSearch || ownParSearch == null){
                on.emit(dom.byId("addressSwitch"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            } else if(addrSearch){
                on.emit(dom.byId("roadSwitch"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            } else if(rdSearch){
                on.emit(dom.byId("ownerParcelSwitch"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
           
           setTimeout(function(){
               $("#address").focus();
               $("#address").val("");
               },50); 
               
            break;
            
        case 34:     
              if(ownParSearch || ownParSearch == null){
                on.emit(dom.byId("roadSwitch"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            } else if(addrSearch){
                on.emit(dom.byId("ownerParcelSwitch"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            } else if(rdSearch){
                on.emit(dom.byId("addressSwitch"), "click", {
                    bubbles: true,
                    cancelable: true
                });
            }
             
            setTimeout(function(){
               $("#address").focus();
               $("#address").val("");
               },50); 
            break;
     }
     
     
     
     
     
       
 });
 
//To prevent key events while typing inside input boxes
var keyListen = true;
$("#address").focus(function(e){
   keyListen = false;
});
$("#address").focusout(function(e){
  keyListen = true;
});
$("#printTitleInput").focus(function(e){
   keyListen = false;
});
$("#printTitleInput").focusout(function(e){
  keyListen = true;
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

  

    dojo.connect(dom.byId("pan"), "click", function () {
    	rubberBandZoomMode(false);
        navToolbar.activate(Navigation.PAN);
        domAttr.set(tools, "class" ,"panActive");
        try{
           
        selectionTF = false;
        drawHelper = false;
        draw = false;
        drawx.deactivate();
        mDraw.deactivate();
            
        }catch(e){console.log(e);}
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
    	
        map.graphics.clear();
        
        var geo_options = {
  enableHighAccuracy: true, 
  maximumAge        : 5000, 
  timeout           : 27000
};

		if(!gpsIO){
			domAttr.set(dom.byId("gpsButton"),"class", "gpsOn");
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
     on.emit(dom.byId("pan"), "click", {
            bubbles: true,
            cancelable: true
        });
      	
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
	
	
	var idMode = false;
	$("#identify").click(function(){
	    if(!idMode){
	        idMode = true;
	    } else {
	        idMode = false;
	    }
	    
	});
	  
	
	//begin layer toggle menu
	  dojo.connect(dom.byId("toggleFlood"), "click", function () {
			console.log(dom.byId("toggleFlood").checked);
			if(dom.byId("toggleFlood").checked){
				layerSorter();
			} else {
				map.removeLayer(floodLayer);
			}
    });
	
	dojo.connect(dom.byId("toggleZoning"), "click", function () {
			if(dom.byId("toggleZoning").checked){
				layerSorter();
			} else{
				map.removeLayer(zoneLayer);
			}
    });

    
     dojo.connect(dom.byId("togglePuebloCounty"), "click", function () {
            if(dom.byId("togglePuebloCounty").checked){
               layerSorter();
            } else{
                map.removeLayer(parcelInfoLayer);
            }
    });

    
    dojo.connect(dom.byId("toggleEsriLabels"), "click", function () {
            if(dom.byId("toggleEsriLabels").checked){
               layerSorter();
            } else{
                map.removeLayer(esriLabelLayer);
            }
    });


dojo.connect(dom.byId("toggleParcels"), "click", function () {
            if(dom.byId("toggleParcels").checked){
              layerSorter();
            } else{
                map.removeLayer(puebloParcelLayer);
            }
    });

dojo.connect(dom.byId("togglePoints"), "click", function () {
            if(dom.byId("togglePoints").checked){
               layerSorter();
            } else{
                map.removeLayer(puebloPointsLayer);
            }
    });
dojo.connect(dom.byId("toggleRoads"), "click", function () {
            if(dom.byId("toggleRoads").checked){
               layerSorter();
            } else{
                map.removeLayer(puebloRoadLayer);
            }
    });
    dojo.connect(dom.byId("toggleRailroads"), "click", function () {
            if(dom.byId("toggleRailroads").checked){
             layerSorter();
            } else{
                map.removeLayer(puebloRailroadLayer);
            }
    });
    
    dojo.connect(dom.byId("toggleBoundaries"), "click", function () {
            if(dom.byId("toggleBoundaries").checked){
             layerSorter();
            } else{
                map.removeLayer(puebloBoundaryLayer);
            }
    });


$("#toggle2013").click(function(){
  setBasemapLayerOrder();
    
    
});



	dojo.connect(dom.byId("toggleSat"), "click", function () {
			setBasemapLayerOrder();
    });
	dojo.connect(dom.byId("toggleStreet"), "click", function () {
			setBasemapLayerOrder();
    });
    
    dojo.connect(dom.byId("toggleTopo"), "click", function () {
			setBasemapLayerOrder();
    });
    dojo.connect(dom.byId("toggleNat"), "click", function () {
		setBasemapLayerOrder();
    });
    
      dojo.connect(dom.byId("toggleOpenStreet"), "click", function () {
			setBasemapLayerOrder();
    });
    
      dojo.connect(dom.byId("toggleSTerrain"), "click", function () {
			setBasemapLayerOrder();
    });  
    
     dojo.connect(dom.byId("toggleMapbox"), "click", function () {
			setBasemapLayerOrder();
    });  
      dojo.connect(dom.byId("toggleMapquest"), "click", function () {
			setBasemapLayerOrder();
    });  
    
        dojo.connect(dom.byId("toggleCPale"), "click", function () {
			setBasemapLayerOrder();
    });  
    
    
      dojo.connect(dom.byId("toggleCNight"), "click", function () {
			setBasemapLayerOrder();
    });  
    
      dojo.connect(dom.byId("toggleToner"), "click", function () {
			setBasemapLayerOrder();
    });  
    
     dojo.connect(dom.byId("toggleWColor"), "click", function () {
			setBasemapLayerOrder();
    });  
    
    
    
    
    
      dojo.connect(dom.byId("toggleGSat"), "click", function () {
			setBasemapLayerOrder();
    });
      dojo.connect(dom.byId("toggleGStreet"), "click", function () {
			setBasemapLayerOrder();
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
       
        draw = true;
    }

    function addToMap(evt) {

        var graphic = new Graphic(evt.geometry, sfs);
 
        console.log(evt);
        console.log(graphic);
        selectByShape(evt.geometry);
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
               
                for (i = 0; i < c.length; i++) {
                   gLayer.add(c[i]);
                    infoArray2.push(results[i]);
                }
				
            }, function (error) {

            });
            map.addLayers([gLayer]);
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
                
                 
                for (i = 0; i < c.length; i++) {
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
				
				for(i=0;i < results.length;i++){
					infoArray2.push(results[i]);
				}
            }, function (error) {

            });

        }
		domAttr.set(tools, "class", "panActive");
    }

    //Buffer Function
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


        //add the parcels layer to the map as a feature layer in selection mode we'll use this layer to query and display the selected parcels in buffer area
        parcels1 = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_parcels_bld_footprints/MapServer/2", {
            outFields: ["*"],
            objectIdField: "PAR_NUM",
     
            mode: FeatureLayer.MODE_SELECTION
        });

        parcels1.setSelectionSymbol(sfs1);
		
		points1 = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_address_points/MapServer/0", {
        outFields: ["*"],
        objectIdField: "FULLADDR",

        mode: FeatureLayer.MODE_SELECTION
    });

    points1.setSelectionSymbol(sfs5);

        road1 = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_roads/MapServer/2", {
        outFields: ["*"],
        objectIdField: "OBJECTID",

        mode: FeatureLayer.MODE_SELECTION,
        spatialRelationship: FeatureLayer.SPATIAL_REL_CROSSES
    });

    road1.setSelectionSymbol(sfs4);
		
        var zzz = false;
        gsvc.on("buffer-complete", function (result) {
		

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

				}
            }, function (error) {

            });


        }
            
			domAttr.set("body", "class", "claro buttonMode");
            domAttr.set("bufferMode", "class", "bufferModeOn");
        });

    }

    //end test for parcel buffer

    //Buffer Function

	gsvc = new GeometryService("http://maps.co.pueblo.co.us/outside/rest/services/Utilities/Geometry/GeometryServer");
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
      var puebloRoadLayer = new ArcGISDynamicMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_roads/MapServer", {maxScale: 20});
      var puebloBoundaryLayer = new ArcGISDynamicMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_counties/MapServer", {maxScale: 20});
      var puebloRailroadLayer = new ArcGISDynamicMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_railroads/MapServer", {maxScale: 20});
      var aerial2013 = new ArcGISTiledMapServiceLayer("http://maps.co.pueblo.co.us/outside/rest/services/aerial_photos/imagery2013/ImageServer", {maxScale: 20});
      
      var basemap = new ArcGISTiledMapServiceLayer("http://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer",{
          displayLevels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,12,13,14,15,16,17,18,19,20]
      });
  
    map.addLayer(basemap);
    map.addLayer(puebloParcelLayer);
    map.addLayer(puebloRoadLayer);
    map.addLayer(esriLabelLayer);
    //BEGIN functions for print dijit
   var printUrl = "http://maps.co.pueblo.co.us/outside/rest/services/ExportWebMap/GPServer/Export%20Web%20Map";

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
                "titleText": "",
                "scalebarUnit": "Miles"
            };
            plate.preserveScale = true;
            return plate;
        });

        // create the print dijit
        printer = new Print({
            "map": map,
            "templates": templates,
            url: printUrl
           
        }, dom.byId("print_button"));
       
        printer.startup();
        printer.printoutText = "Click here to download map";
        printer.on("print-start", function () {
            domAttr.set("print_button", "class", "processing");
            domAttr.set("body", "class", "claro buttonMode calculating");
        });

        printer.on("print-complete", function () {

            domAttr.set("print_button", "class", "dormant");
            domAttr.set("body", "class", "claro buttonMode");
            setTimeout(function(){$(".esriPrintout").text("Click here");},50);

        });
        
        $("#printFormat").change(function(){
            console.log($("#printFormat").get()[0].value);
            console.dir(printer);
            for(i=0;i<printer.templates.length;i++){
                console.log(printer.templates[i]);
                printer.templates[i].label = $("#printFormat").get()[0].value;
                printer.templates[i].layout = $("#printFormat").get()[0].value;
            }
     
        });
         $("#printTitleInput").change(function(){
           
            for(i=0;i<printer.templates.length;i++){
                printer.templates[i].layoutOptions.titleText = $("#printTitleInput").get()[0].value;
            }
     
        });
        
         $("#printScalebar").change(function(){
           
            for(i=0;i<printer.templates.length;i++){
                
               
                printer.templates[i].layoutOptions.scalebarUnit = $("#printScalebar").get()[0].value;
            }
     
        });
        $("#printClose").click(function(){
            $("#printMenu").toggle();
        });
         $("#printWindow").click(function(){
            $("#printMenu").toggle();
              $("#printMenu").position({
            my: "center",
            at: "center",
            of: "#map"
        });
        });
    }

    function handleError(err) {
        console.log("Something broke: ", err);
    }
    //END print dijit functions

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
    parcels = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_parcels_bld_footprints/MapServer/2", {
        outFields: ["*"],
		objectIdField: "PAR_NUM",
        infoTemplate: popupTemplate,
        mode: FeatureLayer.MODE_SELECTION
    });

    parcels.setSelectionSymbol(sfs);

    var points = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_address_points/MapServer/0", {
        outFields: ["*"],
        objectIdField: "FULLADDR",
        mode: FeatureLayer.MODE_SELECTION
    });

    points.setSelectionSymbol(sfs3);

    var road = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_roads/MapServer/2", {
        outFields: ["*"],
        objectIdField: "OBJECTID",
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



    //add the road layer in selection mode
    roads = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_roads/MapServer/2", {
        objectIdField: "OBJECTID",
        outFields: ["*"],
        mode: FeatureLayer.MODE_SELECTION
      

    });
    roads.setSelectionSymbol(sfs);

function queryClear(){
    try{infoArray2.length = 0;} catch(e){}
    try{map.graphics.clear();}catch(e){};
    try{gLayer.clear();} catch(e){}
    try{ infoArray.length = 0;}catch(e){}
}

    //when users click on the map select the parcel
    // using the map point and update the url parameter
    map.on("click", function (e) {
		

        if ((draw == false || draw == null) && idMode) {
            queryClear();
            var query = new Query();
            domAttr.set(dojo.byId("body"),"class","claro buttonMode calculating");

           

            
            
           if(idMode == "addr" || idMode == "road"){ 
            
            var centerPoint = new Point(e.mapPoint.x, e.mapPoint.y, map.spatialReference);
            console.log(centerPoint);
            var mapWidth = map.extent.getWidth() / 10;
           
            var pixelWidth = mapWidth/map.width;
            var tolerance = (10 * pixelWidth) + 3;
             var circ = new Circle({
                center: e.mapPoint,
                geodesic: false,
                radius: tolerance
            });
            console.log(circ);
            console.log(mapWidth);
            console.log(pixelWidth);
            console.log(tolerance);
           query.geometry = circ;
            var deferredP =  points.selectFeatures(query, FeatureLayer.SELECTION_NEW,function(p){
               
                console.log(p);
                
              
                 domAttr.set(dojo.byId("body"),"class","claro buttonMode");
               
           
              if(p.length > 0){
                  queryClear();
              infoArray2.push(p[0]);
               displayResults(p,"address");
               zoomToPoint(p[0], false);
               }
               
            });
            
            
            
            
            var deferredRoad = road.selectFeatures(query, FeatureLayer.SELECTION_NEW,function(p){
                console.log(p);
  
               
              if(p.length > 0){
                   domAttr.set(dojo.byId("body"),"class","claro buttonMode");
                  queryClear();
              infoArray2.push(p[0]);
              var temp = Array();
              temp.push(p[0]); // so that only one feature is displayed in result window
               displayResults(temp,"road");
               zoomToRoad(p[0]);
               }
               
            });
            
            } else { 
            query.geometry = e.mapPoint;
            try{gLayer.clear();}catch(e){}
             try{infoArray2.length = 0;}catch(e){}
             try{map.graphics.clear();}catch(e){}
            var deferredParc = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
                console.debug(selection);
               queryClear();
                try{
                    map.infoWindow.setFeatures(selection);
                    infoArray = selection[0];
                } catch(e){}
                //update the url param if a parcel was located
                if (selection.length > 0) {
                    var parcelid = selection[0].attributes["PAR_NUM"];
                    infoArray = selection[0];
                    selectParcel(parcelid);
                    //Refresh the URL with the currently selected parcel
                    if (typeof history.pushState !== "undefined") {
                        infoArray = selection[0];
                        console.log(infoArray);
                        infoArray2.push(selection[0]);
                    }
                }
                try{gLayer.add(map.infoWindow.getSelectedFeature());}catch(e){console.log(e);}
            
            }, function (error) {
                alert(error);
            }); //end of defferred variable declaration
            
          }
         
            map.infoWindow.show(e.mapPoint);
            
            try {
                infoArray = selection[0];
            } catch (e) {}
        }

    });



function clickPoints(e){
     
            //begin clickable points
           
            if($("#togglePoints")[0].checked){
            var centerPoint = new Point(e.mapPoint.x, e.mapPoint.y, map.spatialReference);
            console.log(centerPoint);
            var mapWidth = map.extent.getWidth();
            var pixelWidth = mapWidth/map.width;
            var tolerance = (10 * pixelWidth) + 6;
            console.log(mapWidth);
            console.log(pixelWidth);
            console.log(tolerance);
            var queryExtent = new esri.geometry.Extent(1,1,tolerance,tolerance,e.mapPoint.spatialReference);    
            query.geometry = queryExtent.centerAt(centerPoint);
            
            var deferred =  points.selectFeatures(query, FeatureLayer.SELECTION_NEW,function(p){
               
                console.log(p);
               var t = points.getSelectedFeatures();
               console.log(t);
             
              if(p.length > 0){
                  queryClear();
              infoArray2.push(p[0]);
               displayResults(p,"address");
               zoomToPoint(p[0], false);
               }
            });
            }
           deferred.then(function(result){
               console.log(result.length);
               if(result.length == 0){
                clickParcels(e);
            }
           }); 
            //end clickable points
}

function clickParcels(e) {
    
            //begin clickable parcels
            
              if($("#toggleParcels")[0].checked){
             
            query.geometry = e.mapPoint;
           try{gLayer.clear();}catch(e){}
             try{infoArray2.length = 0;}catch(e){}
             try{map.graphics.clear();}catch(e){}
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
                console.debug(selection);
               queryClear();
                try{
                    map.infoWindow.setFeatures(selection);
                    infoArray = selection[0];
                } catch(e){}
                //update the url param if a parcel was located
                if (selection.length > 0) {
                    var parcelid = selection[0].attributes["PAR_NUM"];
                    infoArray = selection[0];
                    selectParcel(parcelid);
              
                    if (typeof history.pushState !== "undefined") {
                        infoArray = selection[0];
                        console.log(infoArray);
                        infoArray2.push(selection[0]);
                    }
                }
                try{gLayer.add(map.infoWindow.getSelectedFeature());}catch(e){console.log(e);}
            
            }, function (error) {
                alert(error);
            }); //end of defferred variable declaration
            
            }
        //end clickable parcels
        
}

function clickRoads(e){
    
          //begin clickable roads
           if($("#toggleRoads")[0].checked){
            var centerPoint = new Point(e.mapPoint.x, e.mapPoint.y, map.spatialReference);
            console.log(centerPoint);
            var mapWidth = map.extent.getWidth();
            var pixelWidth = mapWidth/map.width;
            var tolerance = (10 * pixelWidth) + 6;
            console.log(mapWidth);
            console.log(pixelWidth);
            console.log(tolerance);
            var queryExtent = new esri.geometry.Extent(1,1,tolerance,tolerance,e.mapPoint.spatialReference);    
            query.geometry = queryExtent.centerAt(centerPoint);
            
            road.selectFeatures(query, FeatureLayer.SELECTION_NEW,function(p){
                console.log(p);
  
             
              if(p.length > 0){
                  queryClear();
              infoArray2.push(p[0]);
              var temp = Array();
              temp.push(p[0]); // so that only one feature is displayed in result window
               displayResults(temp,"road");
               zoomToRoad(p[0]);
               }
            });
            }
          
          //end clickable roads
}



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

        } catch (e) {}
        try {

        } catch (e) {}
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
                
                 
                for (i = 0; i < c.length; i++) {
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
            "innerHTML": "&middot; View in Selected Features Window",
            "href": "javascript:void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        var emailLink2 = domConstruct.create("a", {
            "class": "action2",
            "innerHTML": "&middot; How are taxes on this parcel spent?",
            "href": "javascript:void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        // Register a function to be called when the user clicks on
        // the above link
        on(emailLink, "click", function (evt) {
        	console.log(infoArray);
            info();
           
        });
		
		on(emailLink2,"click", function(evt){
			levyUrl();
		});
        //When users navigate through the history using the browser back/forward buttons select appropriate parcel  
        //https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history
       

        //if a parcelid is specified in url param select that feature 
        
        	//var layerid = (document.location.href);
          
      

    });

    map.addLayers([parcels]);

    //extract the parcel id from the url
    function getParcelFromUrl(url) {
        var urlObject = urlUtils.urlToObject(url);
        if (urlObject.query && urlObject.query.parcelid) {
            selectParcel(urlObject.query.parcelid);
            return urlObject.query.parcelid;
        } else {
            return null;
        }
    }
    
    //extract the layer id from the url
    function getLayerFromUrl(url) {
        var urlObject = urlUtils.urlToObject(url);
        if (urlObject.query && urlObject.query.basemap) {
            
           var layerid2 = urlObject.query.basemap;
             if(layerid2){
                console.log(layerid2);
                switch(layerid2){
                    
                    case 'floodplain':
                          $('#toggleFlood').click();
                          break;
                    case 'floodplains':
                          $('#toggleFlood').click();
                          break;      
                    case 'Floodplain':
                          $('#toggleFlood').click();
                          break;
                    case 'Floodplains':
                          $('#toggleFlood').click();
                          break;      
                    case 'zoning':
                         
                          $('#toggleZoning').click();
                          break;
                    case 'Zoning':
                          
                          $('#toggleZoning').click();
                          break;      
                
                    
                    
                    
                    case 'streets':
                        $('#toggleStreet').click();
                        break;
                    case 'Streets':
                        $('#toggleStreet').click();
                        break;
                    
                        
                    case 'topo':
                        $('#toggleTopo').click();
                        break;
                    
                    
                    case 'Topo':
                        $('#toggleTopo').click();
                        break;
                    
                    
                    case 'natgeo':
                        $('#toggleNat').click();
                        break;
                    
                    
                    case 'NatGeo':
                        $('#toggleNat').click();
                        break;
                    
                }
            }
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
    
  
 
     //extract the locality from the url
    function getLocalityFromUrl(url) {
        var urlObject = urlUtils.urlToObject(url);
        if (urlObject.query && urlObject.query.locality) {
            return urlObject.query.locality;
        } else {
            return null;
        }
    }

    function zoomToLocality(locality){
        var p;
        switch(locality){
            
            case 'pueblo reservoir':
                p = new Point(-104.763479,38.263625);
                map.centerAndZoom(p,14);
                break;
          
            case 'fort carson':
                p = new Point(-104.8440805,38.7038392);
                map.centerAndZoom(p,14);
                break;
            case 'st charles mesa':
                p = new Point(-104.489409,38.230707);
                map.centerAndZoom(p,14);
                break;    
                
            default:
                 var boundaryService = new FeatureLayer("http://maps.co.pueblo.co.us/outside/rest/services/pueblo_county_counties/MapServer/0", {
                    outFields: ["*"],
                    objectIdField: "OBJECTID",
                    mode: FeatureLayer.MODE_ONDEMAND
                });
                var bQuery = new Query();
        
                bQuery.where = "City_Name = '" + locality + "'";
                var bGeom;
                boundaryService.queryFeatures(bQuery, function(results){
                    if(results.features.length > 0){
                        bGeom = results.features[0].geometry.getExtent();
                        console.log(bGeom);
                        console.log(map.extent);
                        map.setExtent(bGeom);
                    }
            
            
                }, function(err){console.log(err);});
         }
        
        
        
        
       
    
    }


    //BEGIN Location Dijit

    var locator = new Locator("http://maps.co.pueblo.co.us/outside/rest/services/Web_Geocoding/Web_EDGIS_Locator/GeocodeServer");
    locator.on("address-to-locations-complete", showResults);

    //prepare address query string for Geocoder
    function locate() {
		
        var address = {

            "Street": dom.byId("address").value
        };
       
        locator.outSpatialReference = new SpatialReference(102100);
        var options = {
            address: address,
            outFields: ["Loc_name"]
        };
      
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
      
                gLayer.add(new Graphic(geom, textSymbol));
                map.addLayer(gLayer);
                return false; //break out of loop after one candidate with score greater  than 80 is found.
            }
        });


        geom.spatialReference.wkid = 102100;
	
        map.centerAndZoom(geom, 18);
        
        domAttr.set("locate", "class", "dormant");
        domAttr.set("body", "class", "claro buttonMode");
    }
    //END Location Dijit

    function selectByPoint(geoPoint) {
        var query = new Query();
        query.geometry = geoPoint.location;
        var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
            console.debug(selection);

            //update the url param if a parcel was located
            if (selection.length > 0) {
                var parcelid = selection[0].attributes["PAR_NUM"];
                selectParcel(parcelid);
                infoArray = selection[0];
           
                //Refresh the URL with the currently selected parcel
                if (typeof history.pushState !== "undefined") {
                    infoArray = selection[0];
                    infoArray2.push(selection[0]);
                }
            }

            map.addLayer(parcels);

        }, function (error) {
            alert(error);
        }); 

    }

    var infoArray3 = new Array();
	var bufferTypeMem;
    function bufferIt() {
    	

    		map.graphics.clear();
  
   
    	
        domAttr.set("bufferMode", "class", "bufferModeOn processing");
        domAttr.set("body", "class", "claro buttonMode calculating");
    
      
        try {
        	infoArray3.length = 0;
        } catch (e) {}
		

        if (infoArray2.length > 1) {
            for (i = 0; i < infoArray2.length; i++) {
                infoArray3.push(infoArray2[i].geometry);
            }
            temp = gsvc.union(infoArray3);

            temp.then(function (results) {
                
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
            ieAlert.set("title","Nothing To Buffer");
       		ieAlert.set("content", "<p>Sorry, no features have been selected for buffering.</p><p>Please select at least one feature before buffering.</p>");
			ieAlert.show();
        }
        try {
            parcels1.clearSelection();
        } catch (e) {}
       
       try{infoArray3.length = 0;} catch(e){}
    }

    function safeClear() {
        map.removeAllLayers();
        map.addLayer(basemap);
        map.addLayer(parcelInfoLayer);
        stripe = null;
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
        
        map.removeAllLayers();
        setBasemapLayerOrder();
        
          try{
            
            layerSorter();
             } catch(e){console.log(e);}
        try{gLayer.clear();
            map.addLayer(gLayer);} catch(e){console.log(e);}

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
                     "PropertyTax": resultsArray[i].attributes.PropertyTax ,
                     "TaxExempt": resultsArray[i].attributes.TaxExempt,
                     "MobileHomePresent":resultsArray[i].attributes.MobileHomePresent ,
                     "SeniorExemption": resultsArray[i].attributes.SeniorExemption ,
                     "CSEPP": resultsArray[i].attributes.CSEPP
                    // "LevyURL": encodeURI(resultsArray[i].attributes.LevyURL)
                    
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
          	         "AltName": resultsArray[i].attributes.RD_LABEL,
          	         "City": resultsArray[i].attributes.CITY
          	       	         
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

    }

    function makeJson(tempArray) {


    }

    function ownerResults(infoArray4) {
        console.log(infoArray4);
        
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
        } else if (buff == null) {
            buff = true;
            domAttr.set("bufferMode", "class", "bufferModeOn");
            domAttr.set(tools, "class" ,"bufferActive");
            map.infoWindow.hide();

        }

    }

    function drawMode() {
		rubberBandZoomMode(false);
    	navToolbar.activate(Navigation.PAN);

        if (buff) {
            buff = true;
            bufferMode();

        }
        if (!draw) {
            draw = true;
            domAttr.set("draw", "class", "drawOn");
            domAttr.set(tools, "class" ,"drawActive");
           
            domAttr.set("dijit_form_DropDownButton_0", "style", "-webkit-user-select: none;");
            map.infoWindow.hide();
        } else if (draw) {
            draw = false;
            domAttr.set("draw", "class", "drawOff");
            domAttr.set(tools, "class" ,"clear");
           try{ measurement.setTool("area", false);}catch(e){}
           try{ measurement.setTool("distance", false);}catch(e){}
           try{ measurement.setTool("location", false);}catch(e){}
           map.graphics.clear();

            domAttr.set("dijit_form_DropDownButton_0", "style", "-webkit-user-select: none;visibility: hidden;");
        } else if (draw == null) {
            draw = true;
            domAttr.set("draw", "class", "drawOn");
            domAttr.set(tools, "class" ,"drawActive");

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
          query.where = makeWordArray(owner, "owner");
           		console.log(query.where);
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function (selection) {
            	z.push(selection[0]);
                 center = graphicsUtils.graphicsExtent(z).getCenter();
                selectionX = selection;
           
                   map.infoWindow.setFeatures(selection);
                  
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
						owner[i] = owner[i].replace(/\s/g, ' ');
					} catch(e){}
					q += "(RD_LABEL like '%" + owner[i] + "%') and";
				} else {
					try{
						owner[i] = owner[i].replace(/\s/g, '');
					} catch(e){}
					q += " (RD_LABEL like '%" + owner[i] + "%')";
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

	var graphic = new Graphic(result[0], symbolx);
                //add a graphic to the map at the geocoded location
              console.log(result);  
                try{
                gLayer.add(graphic);
           map.addLayer(gLayer);

                } catch(e){
                	console.log(e);
                }
           
}, function(e){console.log(e);});



}


function zoomToPoint(evt, zoomTF){
    console.log("zoomtopoint called");
	var geom = evt.geometry;
	
	map.graphics.clear();
	try{gLayer.clear();}catch(e){}

	var graphic = new Graphic(geom, sfs3);
                //add a graphic to the map at the geocoded location
        
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
         
             
               gLayer.add(new Graphic(geom,textSymbol));
               map.addLayer(gLayer);
               if(zoomTF == true || zoomTF == undefined){
                map.centerAndZoom(geom, 18);
                }
}


function zoomToGeoPoint(evt){
    console.log("zoomtogeopoint called");
    evt.geometry.spatialReference.wkid = 3857;
	var geom = evt.location;
	map.graphics.clear();
	try{gLayer.clear();}catch(e){}

	var graphic = new Graphic(geom, sfs3);
                //add a graphic to the map at the geocoded location
             
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
    		
    		contentType = infoMode;
    	} 
    	if(contentType != infoMode){
    	
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
                    "<td class=\"parNum\"><span class=\"resultsLabel\" >Road:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.RD_LABEL + "</span></td>" + 
                    "</tr></table></td>";
				
				var sWide =  "<td class=\"parNum sWide\"><span class=\"resultsLabel\" >Road:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.RD_LABEL + "</span></td>"
               
                var temp = domConstruct.create("tr", {
                    "innerHTML": "<td><a class=\"goToParcel\" title=\"View Road Segment\" id=\"test" + (i + l) + "\" >" + "</a></td>" + sWide,

                    "class": stripe2
                }, "tableContent");
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML": "<td><a class=\"goToParcel\" title=\"View Road Segment\" id=\"test" + (i + l + 10000) + "\" >" + "</a></td>" + s,
  
                    "class": stripe2
                }, "tableTallContent");
                
                
                var zz = dom.byId("test" + (i + l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    try {
                      
						
                       zoomToRoad(resultsArray[n]);
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                
                  var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    try {
           

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
                   
                    "class": stripe2
                }, "tableContent");
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML": "<td><a class=\"goToParcel\" title=\"View Address Point\" id=\"test" + (i + l + 10000) + "\" ></a><td>" +  s,
                   
                    "class": stripe2
                }, "tableTallContent");
                var zz = dom.byId("test" + (i + l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    console.log(t);
                    
                    try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    try {
						zoomToPoint(resultsArray[n]);
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                
                 var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    try {

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
  					//"<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5[i].attributes.ZoningURL + "\" target=\"blank\">" + infoArray5[i].attributes.Zoning + "</a></span></td>" +                     
                    "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.Zoning + "</span></td>" +                     
                    "<td class=\"taxexempt\"><span class=\"resultsLabel\" >Tax Exempt:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.TaxExempt + "</span></td>" +                
                    "<td class=\"mobilehomepresent\"><span class=\"resultsLabel\" >Mobile Home Present:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.MobileHomePresent + "</span></td>" +  
                    "<td class=\"seniorexemption\"><span class=\"resultsLabel\" >Senior Exemption:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.SeniorExemption + "</span></td>" +     
                    "<td class=\"csepp\"><span class=\"resultsLabel\" >CSEPP Zone:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.CSEPP + "</span></td>" +                                         
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
  					//"<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5[i].attributes.ZoningURL + "\" target=\"blank\">" + infoArray5[i].attributes.Zoning + "</a></span></td>" +                     
                    "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.Zoning + "</span></td>" +                     
                    "<td class=\"taxexempt\"><span class=\"resultsLabel\" >Tax Exempt:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.TaxExempt + "</span></td>" +                     
                    "<td class=\"mobilehomepresent\"><span class=\"resultsLabel\" >Mobile Home Present::</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.MobileHomePresent + "</span></td>" +                     
                    "<td class=\"seniorexemption\"><span class=\"resultsLabel\" >Senior Exemption:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.SeniorExemption + "</span></td>" +                     
                    "<td class=\"csepp\"><span class=\"resultsLabel\" >CSEPP Zone:</span> <span class=\"resultsText\" >" + infoArray5[i].attributes.CSEPP + "</span></td>" +                     
                    
                    "";
		
			

                var temp = domConstruct.create("tr", {
                    "innerHTML":"<td><div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5[i].attributes.PAR_TXT + "\" id=\"test" + (i + l) + "\" >" + "</a></td>" + sWide  + "</div>",

                    "class": stripe2
                }, "tableContent");
                
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML":"<div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5[i].attributes.PAR_TXT + "\" id=\"test" + (i + l + 10000) + "\" >" + "</a>" + s + "</div>",
       
                    "class": stripe2
                }, "tableTallContent");
                
                
                
                var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    
                    console.log(t);
                    try {

                        selectParcel(resultsArray[n - 10000].attributes.PAR_NUM);
                        map.infoWindow.show(resultsArray[n - 10000].geometry.getPoint(0, 0));
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                
                var zz = dom.byId("test" + (i + l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    console.log(t);
                     try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    try {

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
                   // "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5.attributes.ZoningURL + "\" target=\"blank\">" + infoArray5.attributes.Zoning + "</a></span></td>" + 
                        "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" >" + infoArray5.attributes.Zoning + "</span></td>" + 
                     "<td class=\"taxexempt\"><span class=\"resultsLabel\" >Tax Exempt:</span> <span class=\"resultsText\" >" + infoArray5.attributes.TaxExempt + "</span></td>" +                
                    "<td class=\"mobilehomepresent\"><span class=\"resultsLabel\" >Mobile Home Present:</span> <span class=\"resultsText\" >" + infoArray5.attributes.MobileHomePresent + "</span></td>" +  
                    "<td class=\"seniorexemption\"><span class=\"resultsLabel\" >Senior Exemption:</span> <span class=\"resultsText\" >" + infoArray5.attributes.SeniorExemption + "</span></td>" +     
                    "<td class=\"csepp\"><span class=\"resultsLabel\" >CSEPP Zone:</span> <span class=\"resultsText\" >" + infoArray5.attributes.CSEPP + "</span></td>" +    
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
                   // "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" ><a href=\"" + infoArray5.attributes.ZoningURL + "\" target=\"blank\">" + infoArray5.attributes.Zoning + "</a></span></td>" +                     
                    "<td class=\"zoning\"><span class=\"resultsLabel\" >Zoning:</span> <span class=\"resultsText\" >" + infoArray5.attributes.Zoning + "</span></td>" +                     
                    "<td class=\"taxexempt\"><span class=\"resultsLabel\" >Tax Exempt:</span> <span class=\"resultsText\" >" + infoArray5.attributes.TaxExempt + "</span></td>" +                     
                    "<td class=\"mobilehomepresent\"><span class=\"resultsLabel\" >Mobile Home Present::</span> <span class=\"resultsText\" >" + infoArray5.attributes.MobileHomePresent + "</span></td>" +                     
                    "<td class=\"seniorexemption\"><span class=\"resultsLabel\" >Senior Exemption:</span> <span class=\"resultsText\" >" + infoArray5.attributes.SeniorExemption + "</span></td>" +                     
                    "<td class=\"csepp\"><span class=\"resultsLabel\" >CSEPP Zone:</span> <span class=\"resultsText\" >" + infoArray5.attributes.CSEPP + "</span></td>" +                     
                    
                    "";

             
                
                  var temp = domConstruct.create("tr", {
                    "innerHTML":"<td><div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5.attributes.PAR_TXT + "\" id=\"test" + (l) + "\" >" + "</a></td>" + sWide  + "</div>",
     
                    "class": stripe2
                }, "tableContent");
                
                
                 var temp2 = domConstruct.create("tr", {
                    "innerHTML":"<div class=\"sTallFix\"><a class=\"goToParcel fit\" title=\"Zoom to parcel # " +  infoArray5.attributes.PAR_TXT + "\" id=\"test" + (l + 10000) + "\" >" + "</a>" + s + "</div>",

                    "class": stripe2
                }, "tableTallContent");
                
                
                
                var zz = dom.byId("test" + (l));

                //event handlers for search results
                dojo.connect(zz, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n);
                    console.log(resultsArray[n]);
                    var t = resultsArray[n];
                    try{setInfoArray2(resultsArray[n]);} catch(e){console.log(e);}
                    console.log(t);
                    try {

                        selectParcel(resultsArray[n].attributes.PAR_NUM);
                        map.infoWindow.show(resultsArray[n].geometry.getPoint(0, 0));
                    } catch (error) {
                        console.log(error);
                    }

                });
                
                  var zz2 = dom.byId("test" + ( l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000]);} catch(e){console.log(e);}
                    try {
                    

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
   
					console.log(resultsArray[n]);
                 
                   zoomToGeoPoint(resultsArray[n]);
                 
                } catch (error) {
                    console.log(error);
                }

            });
            
            
             
                var zz2 = dom.byId("test" + (i + l + 10000));

                //event handlers for search results
                dojo.connect(zz2, "onclick", function (node) {

                    var n = node.target.id;
                    n = n.toString();
                    n = n.replace("test", "");
                    console.log(n - 10000);
                    console.log(resultsArray[n - 10000]);
                    var t = resultsArray[n - 10000];
                    console.log(t);
                    try{setInfoArray2(resultsArray[n - 10000], true);} catch(e){console.log(e);}
                    try {
     

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
       

    
		searchTimeout = true;
    }

    //detect when popup selection is changed
    popup.on("selection-change", function () {
        if (change) {
            try {
                map.infoWindow.restore();
      

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

                new Color([255, 0, 0]),
                5);

            var bufferGeometry = results;

            var graphic2 = new Graphic(bufferGeometry, symbol);
  
				
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
   
            var graphic2 = new Graphic(bufferGeometry, symbol);
   
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
        

          var outSR = new SpatialReference(102100);
          
     

          gsvc.project(tempArray, outSR, function(projectedPoints) {
          	console.log(projectedPoints);
          
		
        var tempVar = gsvc.union(projectedPoints);

        tempVar.then(function (results) {
        
            var symbol = new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([13, 255, 0]),
                5);

            var bufferGeometry = results;
           
            var graphic2 = new Graphic(bufferGeometry, symbol);
 
				
    
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

			 var outSR = new SpatialReference(102100);

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

				);
				
			}catch(e){console.log(e);}
		}
		




    //select parcel from the feature layer by creating a query to look for the input parcel id 
    function selectParcel(parcelid, project) {
    	var z = new Array();
    	 var graphic;
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
                    
                  
                  searchTimeout = true;
                   
                });
              gLayer.add( new Graphic(selection[0].geometry, sfs));
               
                try{ map.centerAndZoom(center, 18);}catch(e){console.log(e);}
           
                 domAttr.set("locate", "class", "dormant");
                domAttr.set("body", "class", "claro buttonMode");
             });
            });
        }
        
    
    console.log(gLayer);
    map.addLayers([gLayer]);
    }

});

