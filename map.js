
var inputSearchBox = dojo.byId("address");
var change = false;
var map;
var parcels;
var roads;
var infoArray;
var infoArray2 = new Array();
var draw = null;
var buff = null;
// var gsvc, tb;
require([
    "esri/map", "esri/layers/FeatureLayer", 
    "esri/layers/ArcGISTiledMapServiceLayer", "esri/tasks/query", 
    "esri/symbols/SimpleFillSymbol", "esri/symbols/SimpleLineSymbol", 
    "esri/graphic", "esri/dijit/Popup", "esri/dijit/PopupTemplate", 
    "esri/urlUtils", "esri/graphicsUtils", 
    "dojo/_base/Color", 
    "dojo/on", "dojo/query", "dojo/parser", "dojo/dom-construct", "dojo/keys", "dijit/registry", "dojo/dom", 
    "esri/dijit/Print", "esri/tasks/PrintTemplate", "esri/request", "esri/config", "dojo/_base/array", 
    "esri/dijit/BasemapGallery", "esri/arcgis/utils", "esri/dijit/BasemapLayer", "esri/dijit/Basemap", 
    "esri/dijit/Scalebar", "esri/dijit/Measurement", "esri/tasks/locator", "esri/symbols/SimpleMarkerSymbol", 
    "esri/symbols/Font", "esri/symbols/TextSymbol", "dojo/number", "esri/geometry/webMercatorUtils", "esri/InfoTemplate", 
    "dojo/dom-attr", "esri/sniff", "esri/SnappingManager", "esri/renderers/SimpleRenderer", 
    "esri/tasks/GeometryService", "esri/tasks/BufferParameters", "esri/toolbars/draw", "esri/tasks/QueryTask", "dojo/_base/connect", 
    "esri/geometry/Point", "esri/SpatialReference", "esri/tasks/ProjectParameters", "esri/dijit/Legend", 
    
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane", "dojo/domReady!", "dijit/form/Button"], function(
Map, FeatureLayer, 
ArcGISTiledMapServiceLayer, Query, 
SimpleFillSymbol, SimpleLineSymbol, 
Graphic, Popup, PopupTemplate, 
urlUtils, graphicsUtils, 
Color, 
on, query, parser, domConstruct, keys, registry, dom, 
Print, PrintTemplate, esriRequest, esriConfig, arrayUtils, 
BasemapGallery, arcgisUtils, BasemapLayer, Basemap, Scalebar, Measurement, 
Locator, SimpleMarkerSymbol, Font, TextSymbol, number, webMercatorUtils, InfoTemplate, 
domAttr, has, SnappingManager, SimpleRenderer, GeometryService, BufferParameters, Draw, QueryTask, 
Point, SpatialReference, ProjectParameters, Legend

) {
    
    parser.parse();

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
    
    
    
    
    var gsvc, tb;
    
    var popup = new Popup({
        fillSymbol: sfs
    }, domConstruct.create("div"));

    //Create basemaps
    var countyLayer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/Pueblo_photos/MapServer"
    });
    
    var countyBasemap = new Basemap({
        layers: [countyLayer],
        title: "County Basemap (Fast)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    var zoningLayer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/zoning/MapServer"
    });
    
    var zoningBasemap = new Basemap({
        layers: [zoningLayer],
        title: "Zoning Basemap (Fast)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    var imagery2005Layer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/2005_1meter_imagery/MapServer"
    });
    
    var imagery2005Basemap = new Basemap({
        layers: [imagery2005Layer],
        title: "2005 Imagery (Slow)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    
    var imagery2004Layer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/2004_1ft_Imagery/MapServer"
    });
    
    var imagery2004Basemap = new Basemap({
        layers: [imagery2004Layer],
        title: "2004 Imagery (Slow)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    var imagery2001Layer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/2001_6in_imagery/MapServer"
    });
    
    var imagery2001Basemap = new Basemap({
        layers: [imagery2001Layer],
        title: "2001 Imagery (Slow)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    var imagery1991Layer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/1991_Imagery/MapServer"
    });
    
    var imagery1991Basemap = new Basemap({
        layers: [imagery1991Layer],
        title: "1991 Imagery (Slow)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    var floodplainsLayer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/floodplains/MapServer"
    });
    
    var floodplainsBasemap = new Basemap({
        layers: [floodplainsLayer],
        title: "Floodplains (Slow)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    var taxSaleLayer = new BasemapLayer({
        url: "http://maps.co.pueblo.co.us/ArcGIS/rest/services/tax_sale/MapServer"
    });
    
    var taxSaleBasemap = new Basemap({
        layers: [taxSaleLayer],
        title: "Tax Sale (Fast)"
    //  thumbnailUrl:"images/waterThumb.png"
    });
    
    
    var harnLayer = new BasemapLayer({
        url: ""
    });
    
    var harnBasemap = new Basemap({
        layers: [harnLayer],
        title: "No Basemap"
    //  thumbnailUrl:"images/waterThumb.png"
    });

    //Map constructor
    map = new Map("map", {
        //basemap: "County Basemap",
        infoWindow: popup,
        slider: true,
        sliderOrientation: "horizontal",
        spatialReference: 2233,
        //  sliderPosition: "bottom-right",
        zoom: 3
    
    
    });
    
    
    
    map.on("load", function() {
        //	map.setZoom(2);
        map.setZoom(1);
    	on.emit(dom.byId("toggleOutput"), "click", {bubbles: true, cancelable: true});

    	
    });
    
    
    map.on("update-start", function() {
        domAttr.set("gallery", "class", "processing");
    
    });
    
    map.on("update-end", function() {
        domAttr.set("gallery", "class", "dormant");
    
    });
    
    
    
    dojo.connect(inputSearchBox, "onkeypress", function(e) {
        
        if (e.keyCode == 13) {
            
            if (dom.byId("address").value != "Search name or parcel #" && dom.byId("address").value != "Search address" && dom.byId("address").value != "Search road") {
                startSearch();
            }
        }
    
    });


    //Buffer Function
    //	 map.on("load", initToolbar);
    
    gsvc = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
    //add proxy functions for all modules
    esriConfig.defaults.io.proxyUrl = "proxy.php";
    esriConfig.defaults.io.alwaysUseProxy = false;
    
    function initToolbar(evtObj) {
        app.tb = new Draw(evtObj.map);
        app.tb.on("draw-end", doBuffer);
    }



    function doBuffer3(evt) {
        //console.debug(evt);
        
        map.graphics.clear();
        //   map.removeLayer(parcels1);
        
        
        
        var params = new BufferParameters();
        params.geometries = [evt];

        //buffer in linear units such as meters, km, miles etc.
        
        params.distances = [dom.byId("distance").value];
        params.bufferSpatialReference = new esri.SpatialReference({wkid: dom.byId("bufferSpatialReference").value});
        params.outSpatialReference = map.spatialReference;
        params.unit = GeometryService[dom.byId("unit").value];
        
        gsvc.buffer(params);
        //      gsvc.buffer(params);


        //add the parcels layer to the map as a feature layer in selection mode we'll use this layer to query and display the selected parcels in buffer area
        parcels1 = new FeatureLayer("http://maps.co.pueblo.co.us/ArcGIS/rest/services/pueblocounty/MapServer/13", {
            outFields: ["*"],
            //infoTemplate: popupTemplate,
            mode: FeatureLayer.MODE_SELECTION
        });
        
        parcels1.setSelectionSymbol(sfs1);
        
        
        gsvc.on("buffer-complete", function(result) {
            //	alert("xagjio");
            map.graphics.clear();
            // draw the buffer geometry on the map as a map graphic
            var symbol = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL, 
            new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID, 
            new Color([13, 255, 0]), 
            2
            ), new Color([255, 255, 0, 0.25])
            );
            var bufferGeometry = result.geometries[0]
            var graphic2 = new Graphic(bufferGeometry, symbol);
            map.graphics.add(graphic2);
            //alert();
            //Select features within the buffered polygon. To do so we'll create a query to use the buffer graphic
            //as the selection geometry.
            var query2 = new Query();
            query2.geometry = bufferGeometry;
            parcels1.selectFeatures(query2, FeatureLayer.SELECTION_NEW, function(results) { //This returns all parcel data within buffer.
            // console.debug(results);
            }, function(error) {
                alert(error);
            });
            map.addLayers([parcels1]);
            domAttr.set("bufferMode", "class", "bufferModeOn");
        });
    
    
    
    
    
    
    
    
    
    }














    //end test for parcel buffer







    //Buffer Function
    // map.on("load", initToolbar);
    
    gsvc = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
    //add proxy functions for all modules
    esriConfig.defaults.io.proxyUrl = "proxy.php";
    esriConfig.defaults.io.alwaysUseProxy = false;
    
    function initToolbar(evtObj) {
        app.tb = new Draw(evtObj.map);
        app.tb.on("draw-end", doBuffer);
    }



    //begin test for parcel buffer
    /*
      function doBuffer2(evt) {
alert("test")
      map.graphics.clear();
      var params = new BufferParameters();
      params.geometries = [ evt.mapPoint ];

      //buffer in linear units such as meters, km, miles etc.
     
          params.distances = [ dom.byId("distance").value ];
          params.bufferSpatialReference = new esri.SpatialReference({wkid: dom.byId("bufferSpatialReference").value});
          params.outSpatialReference = map.spatialReference;
          params.unit = GeometryService[dom.byId("unit").value];

      gsvc.buffer(params, showBuffer);
    }
      */
    //end test for parcel buffer
    
    
    
    
    
    
    
    
    function doBuffer(evtObj) {
        var geometry = evtObj.geometry, 
        map = app.map, 
        gsvc = app.gsvc;
        switch (geometry.type) {
            case "point":
                var symbol = new SimpleMarkerSymbol(SimpleMarkerSymbol.STYLE_SQUARE, 10, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 0, 0]), 1), new Color([0, 255, 0, 0.25]));
                break;
            case "polyline":
                var symbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color([255, 0, 0]), 1);
                break;
            case "polygon":
                var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NONE, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color([255, 0, 0]), 2), new Color([255, 255, 0, 0.25]));
                break;
        }
        
        var graphic = new Graphic(geometry, symbol);
        map.graphics.add(graphic);

        //setup the buffer parameters
        var params = new BufferParameters();
        params.distances = [dom.byId("distance").value];
        params.bufferSpatialReference = new esri.SpatialReference({wkid: dom.byId("bufferSpatialReference").value});
        params.outSpatialReference = map.spatialReference;
        params.unit = GeometryService[dom.byId("unit").value];
        
        if (geometry.type === "polygon") {
            //if geometry is a polygon then simplify polygon.  This will make the user drawn polygon topologically correct.
            gsvc.simplify([geometry], function(geometries) {
                params.geometries = geometries;
                gsvc.buffer(params, showBuffer);
            });
        } else {
            params.geometries = [geometry];
            gsvc.buffer(params, showBuffer);
        }
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
        
        arrayUtils.forEach(bufferedGeometries, function(geometry) {
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
    
    
    var basemap = new ArcGISTiledMapServiceLayer("http://maps.co.pueblo.co.us/ArcGIS/rest/services/Pueblo_photos/MapServer");
    //  var basemap = new ArcGISTiledMapServiceLayer("http://maps.co.pueblo.co.us/ArcGIS/rest/services/tax_sale/MapServer");
    var parcelInfoLayer = new ArcGISTiledMapServiceLayer("http://maps.co.pueblo.co.us/ArcGIS/rest/services/pueblocounty/MapServer");
    map.addLayer(basemap);
    map.addLayer(parcelInfoLayer);


    //BEGIN functions for print dijit
    var printUrl = "http://sampleserver6.arcgisonline.com/arcgis/rest/services/Utilities/PrintingTools/GPServer/Export%20Web%20Map%20Task";



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
        
        layoutTemplate = arrayUtils.filter(resp.parameters, function(param, idx) {
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
        templates = arrayUtils.map(templateNames, function(ch) {
            var plate = new PrintTemplate();
            plate.layout = plate.label = ch;
            plate.format = "PDF";
            plate.layoutOptions = {
                "authorText": "Made by:  Esri's JS API Team",
                "copyrightText": "<copyright info here>",
                "legendLayers": [],
                "titleText": "Pueblo County GIS",
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
        
        printer.on("print-start", function() {
            domAttr.set("print_button", "class", "processing");
        });
        
        printer.on("print-complete", function() {
            
            domAttr.set("print_button", "class", "dormant");
        
        });
    
    
    
    }
    
    
    
    function handleError(err) {
        console.log("Something broke: ", err);
    }
    //END print dijit functions


    //BEGIN Basemap Toggle
    var basemapGallery = new BasemapGallery({
        showArcGISBasemaps: false,
        map: map
    }, "basemapGallery");
    
    basemapGallery.startup();
    
    basemapGallery.add(countyBasemap);
    basemapGallery.add(zoningBasemap);
    basemapGallery.add(imagery2005Basemap);
    basemapGallery.add(imagery2004Basemap);
    basemapGallery.add(imagery2001Basemap);
    basemapGallery.add(imagery1991Basemap);
    basemapGallery.add(floodplainsBasemap);
    // basemapGallery.add(taxSaleBasemap);
    basemapGallery.add(harnBasemap);
    
    
    basemapGallery.on("error", function(msg) {
        console.log("basemap gallery error:  ", msg);
    });
    
    
    basemapGallery.on("selection-change", function() {
        //	alert("test");
        //basemapGallery.startup();
        map.removeLayer(parcelInfoLayer);
        map.addLayer(parcelInfoLayer);

    //    console.dir(basemapGallery.getSelected());
    });




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
    
    esriConfig.defaults.geometryService = new GeometryService("http://tasks.arcgisonline.com/ArcGIS/rest/services/Geometry/GeometryServer");
    
    
    
    
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
    parcels = new FeatureLayer("http://maps.co.pueblo.co.us/ArcGIS/rest/services/pueblocounty/MapServer/13", {
        outFields: ["*"],
        infoTemplate: popupTemplate,
        mode: FeatureLayer.MODE_SELECTION
    });
    
    parcels.setSelectionSymbol(sfs);




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
    roads = new FeatureLayer("http://maps.co.pueblo.co.us/ArcGIS/rest/services/pueblocounty/MapServer/3", {
        objectIdField: "Shape_Length",
        outFields: ["*"],
        infoTemplate: popupRoadTemplate,
        mode: FeatureLayer.MODE_SELECTION
    
    });
    roads.setSelectionSymbol(sfs);



    //when users click on the map select the parcel using the map point and update the url parameter
    map.on("click", function(e) {
        if (draw == false || draw == null) {
            var query = new Query();
            query.geometry = e.mapPoint;
            // console.log(e);
            // map.centerAndZoom(e.mapPoint, 10);
            //FeatureLayer.SELECTION_ADD for multiple or FeatureLayer.SELECTION_NEW for single parcel
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_ADD, function(selection) {
                console.debug(selection);


                //update the url param if a parcel was located
                if (selection.length > 0) {
                    var parcelid = selection[0].attributes["PAR_NUM"];
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
            
            
            }, function(error) {
                alert(error);
            }); //end of defferred variable declaration
            
            
            
            
            
            
            
            
            
            
            
            map.infoWindow.setFeatures([deferred]);
            map.infoWindow.show(e.mapPoint);
            //  selectedParcel = selection[0];
            try{
            	infoArray = selection[0];
        	} catch(e){}
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
    on(dom.byId("address"), "click", function() {
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
    }
    
    function addressMode() {
        ownParSearch = false;
        addrSearch = true;
        rdSearch = false;
        
        domAttr.set("address", "value", "Search address");
        domAttr.set("ownerParcelSwitch", "class", "deselected");
        domAttr.set("addressSwitch", "class", "selected");
        domAttr.set("roadSwitch", "class", "deselected");
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
    }
    
    
    function startSearch() {
        domAttr.set("locate", "class", "processing");
        //	clearx();
        map.graphics.clear();
        if (ownParSearch) {
            findOwnerOrParcel();
        } else if (addrSearch) {
            locate();
        } else if (rdSearch) {
            findRoad();
        }
    
    }
    
    
    
    
    
    map.on("layers-add-result", function(result) {
        // Add a link into the InfoWindow Actions panel       
        var emailLink = domConstruct.create("a", {
            "class": "action",
            "innerHTML": "Add Parcel Info",
            "href": "javascript:void(0);"
        }, query(".actionList", map.infoWindow.domNode)[0]);

        // Register a function to be called when the user clicks on
        // the above link
        on(emailLink, "click", function(evt) {
            info();
        /* var feature = map.infoWindow.getSelectedFeature();
             var url = window.location;
             var emailLink = "mailto:?subject=Parcel Map of :" + 
               feature.attributes.PAR_NUM + "&body=Check out this map: %0D%0A " + 
               window.location;
             window.location.href = emailLink; */
        });



        //When users navigate through the history using the browser back/forward buttons select appropriate parcel  
        //https://developer.mozilla.org/en/DOM/Manipulating_the_browser_history
        window.onpopstate = function(event) {
            var parcelid = getParcelFromUrl(document.location.href);
            if (parcelid) {
                selectParcel(parcelid);
            
            
            } else {
                parcels.clearSelection();
                map.infoWindow.hide();
            }
        };

        //if a parcelid is specified in url param select that feature 
        var parcelid = getParcelFromUrl(document.location.href);
        selectParcel(parcelid);
    
    
    
    
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



    //BEGIN Location Dijit
    
    var locator = new Locator("http://maps.co.pueblo.co.us/ArcGIS/rest/services/PCGIS_Geocoding_Service/GeocodeServer");
    // var  locator = new Locator("http://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer");
    locator.on("address-to-locations-complete", showResults);


    //prepare address query string for Geocoder
    function locate() {

        //  domAttr.set("locate", "class", "processing");
        // map.graphics.clear();
        //clearx();
        var address = {
            
            "Street": dom.byId("address").value
        };
        locator.outSpatialReference = map.spatialReference;
        var options = {
            address: address,
            outFields: ["Loc_name"]
        }
        locator.addressToLocations(options);
    }
    
    function showResults(evt) {
        
        var candidate;
        var symbol = new SimpleMarkerSymbol();
        var infoTemplate = new InfoTemplate(
        "Location", 
        "Address: ${address}<br />Score: ${score}<br />Source locator: ${locatorName}");
        symbol.setStyle(SimpleMarkerSymbol.STYLE_CIRCLE);
        symbol.setColor(new Color([35, 186, 199, 0.75]));
        
        var geom;
        arrayUtils.every(evt.addresses, function(candidate) {
            console.log(candidate.score);
            if (candidate.score > 10) {
                console.log(candidate.location);
                var attributes = {
                    address: candidate.address,
                    score: candidate.score,
                    locatorName: candidate.attributes.Loc_name
                };
                geom = candidate.location;
                var graphic = new Graphic(geom, symbol, attributes, infoTemplate);
                //add a graphic to the map at the geocoded location
                map.graphics.add(graphic);
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
                new Color("#FF0033"));
                textSymbol.setOffset(0, 8);
                map.graphics.add(new Graphic(geom, textSymbol));
                return false; //break out of loop after one candidate with score greater  than 80 is found.
            }
        });
        //  geom.spatialReference.wkid = "2233";
        
        geom.spatialReference.wkid = 2233;
        
        map.centerAndZoom(geom, 8);
        domAttr.set("locate", "class", "dormant");
    }
    //END Location Dijit
    
    
    var infoArray3 = new Array();
    
    function bufferIt() {
        domAttr.set("bufferMode", "class", "bufferModeOn processing");
        if (infoArray2.length > 1) {
            for (i = 0; i < infoArray2.length; i++) {
                infoArray3.push(infoArray2[i].geometry);
            }
            temp = gsvc.union(infoArray3);
            
            temp.then(function(results) {
                //console.debug(results);
                
                doBuffer3(results);
            });
        } else if (infoArray2.length == 1) {
            
            doBuffer3(infoArray2[0].geometry);
        } 
        else {
            domAttr.set("bufferMode", "class", "bufferModeOn");
            alert("No parcel selected!");
        }

        //	parcels.clearSelection();
        parcels1.clearSelection();
    }
    
    
    
    function clearx() {
        
        map.removeAllLayers();
        map.addLayer(basemap);
        map.addLayer(parcelInfoLayer);
        stripe = null;
        empty();
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
        } catch (e) {
        }
    
    
    
    
    
    
    
    }
    var stripe = null;
    function info() {
        
        if(stripe == null || stripe == "odd"){
        	stripe = "even";
        	} else {
        		stripe = "odd";
        	} 
        
        domAttr.set("output", "class", "xxhide");
        domAttr.set("output", "style", "opacity: 1;");
        domAttr.set("toggleOutput", "class", "open");
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
    	
    	var x = "<tr class=\"labels\"><td id=\"parNum\">Parcel Num.</td><td id=\"assesorLink\">Assessor Link</td><td id=\"fips\">FIPS</td><td id=\"ownName\">Own. Name</td><td id=\"ownOverflow\">Own. Overflow</td><td id=\"ownAddress\">Own. Address</td><td id=\"ownCity\">Own. City</td><td id=\"ownState\">Own. State</td><td id=\"ownZip\">Own. Zip</td></tr>"
    	
        dom.byId("outTable").innerHTML = x;
        
        
        
    	domAttr.set("output", "class", "hide");
    	domAttr.set("toggleOutput", "class", "closed");
    }
    
    
    function bufferMode() {
        if (draw) {
            draw = true;
            drawMode();
        
        }
        
        if (!buff) {
            buff = true;
            domAttr.set("bufferMode", "class", "bufferModeOn");
            domAttr.set("buffer-params", "style", "visibility: visible");
            map.infoWindow.hide();
        } else if (buff) {
            buff = false;
            domAttr.set("bufferMode", "class", "bufferModeOff");
            domAttr.set("buffer-params", "style", "visibility: hidden");
        } else if (buff == null) {
            buff = true;
            domAttr.set("bufferMode", "class", "bufferModeOn");
            domAttr.set("buffer-params", "style", "visibility: visible");
            map.infoWindow.hide();
        
        }
    
    
    }
    
    function drawMode() {
        if (buff) {
            buff = true;
            bufferMode();
        
        }
        if (!draw) {
            draw = true;
            domAttr.set("draw", "class", "drawOn");
            domAttr.set("measurementDiv", "style", "visibility: visible !important;width: 240px;");
            
            domAttr.set("dijit_form_DropDownButton_0", "style", "-webkit-user-select: none;");
            map.infoWindow.hide();
        } else if (draw) {
            draw = false;
            domAttr.set("draw", "class", "drawOff");
            domAttr.set("measurementDiv", "style", "visibility: hidden !important;");
            
            domAttr.set("dijit_form_DropDownButton_0", "style", "-webkit-user-select: none;visibility: hidden;");
        } else if (draw == null) {
            draw = true;
            domAttr.set("draw", "class", "drawOn");
            domAttr.set("measurementDiv", "style", "visibility: visible !important;width: 240px;");
            
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
        
        if (owner) {
            var query = new Query();
            query.text = owner;
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(selection) {
                center = graphicsUtils.graphicsExtent(selection).getCenter();
                selectionX = selection;
                var extHandler = map.on("extent-change", function() {
                    extHandler.remove();
                    //zoom to the center then display the popup 
                    map.infoWindow.setFeatures(selection);
                    //   map.infoWindow.show(center);
                    //  ownerResults(selection);
                    //   alert("ownerResults complete");
                   // console.log(selection);
                    displayResults(selection);
                });
                // console.log(center);
                domAttr.set("locate", "class", "dormant");
                map.centerAndZoom(center, 2);
                change = true;
            
            
            
            });
        }
    }
	var stripe2 = null;
	function displayResults(infoArray5){
		//console.log(infoArray5);
	
		if(stripe2 == null){
			stripe2 = "even";
		}
			
		for(i=0;i<infoArray5.length;i++){
			 var s = "<table cellspacing=\"0\"><tr class=\"" + stripe2 + " leftCell\">" + 
        "<td class=\"parNum\">Parcel Number: " + infoArray5[i].attributes.PAR_NUM + "</td>" + "</tr>" + "<tr class=\"" + stripe2 + " leftCell\">" +
        "<td class=\"assessorLink\">Assessor Link: <a href=\"http://www.co.pueblo.co.us/cgi-bin/webatrbroker.wsc/propertyinfo.p?par=" + infoArray5[i].attributes.PAR_TXT + "\" target=\"_blank\" >" + infoArray5[i].attributes.PAR_TXT + "</a></td>" + "</tr>" + 
        "<tr class=\"" + stripe2 + " leftCell\">" +"<td class=\"fips\">FIPS: " + infoArray5[i].attributes.Fips + "</td>" + "</tr>" + "<tr class=\"" + stripe2 + " leftCell\">" +
        "<td class=\"ownName\">Own. Name: " + infoArray5[i].attributes.Owner + "</td>" + "</tr>" + "<tr class=\"" + stripe2 + " leftCell\">" +
        "<td class=\"ownOverflow\">Own. Overflow: " + infoArray5[i].attributes.OwnerOverflow + "</td>" + "</tr>" + "<tr class=\"" + stripe2 + " leftCell\">" +
        "<td class=\"ownAddress\">Own. Address: " + infoArray5[i].attributes.OwnerStreetAddress + "</td>" + "</tr>" + "<tr class=\"" + stripe2 + " leftCell\">" +
        "<td class=\"ownCity\">Own. City: " + infoArray5[i].attributes.OwnerCity + "</td>" + "</tr>" + "<tr class=\"" + stripe2 + " leftCell\">" +
        "<td class=\"ownState\">Own. State: " + infoArray5[i].attributes.OwnerState + "</td>" + "</tr>" + "<tr class=\"" + stripe2 + " leftCell\">" +
        "<td class=\"ownZip\">Own Zip: " + infoArray5[i].attributes.OwnerZip + "</td>" + 
        "</tr></table>";
        
        
        dom.byId("resultsContent").innerHTML += s;
		
		
		if(stripe2 == "odd"){
			stripe2 = "even";
		} else if(stripe2 == "even")
			stripe2 = "odd";
		}
			setTimeout(function(){
				on.emit(dom.byId("openClose"), "click", {bubbles: true, cancelable: true});
				//on.emit(dom.byId("toggleOutput"), "click", {bubbles: true, cancelable: true});
			}, 1000);
			
	}





    //detect when popup selection is changed
    popup.on("selection-change", function() {
        if (change) {
            
            map.infoWindow.restore();
            // console.log(popup.getSelectedFeature());
            
            infoArray = selectionX[popup.selectedIndex];
            
            map.centerAndZoom(popup.features[popup.selectedIndex].geometry.getPoint(0, 0), 8);
            
            map.infoWindow.show(popup.features[popup.selectedIndex].geometry.getPoint(0, 0));
        
        }
    
    });

    // combine all results' geometries into an array and create a single geometry to display on the map
    function makeGeomArray(selection) {
        
        var tempArray = new Array();
        
        for (i = 0; i < selection.length; i++) {
            tempArray.push(selection[i].geometry);
        }
        
        
        var tempVar = gsvc.union(tempArray);
        
        tempVar.then(function(results) {
            
            var symbol = new SimpleLineSymbol(
            SimpleLineSymbol.STYLE_SOLID, 
            new Color([13, 255, 0]), 
            5);
            
            var bufferGeometry = results;
            //console.log(bufferGeometry);
            var graphic2 = new Graphic(bufferGeometry, symbol);
            // console.log(graphic2.geometry.getExtent());
            
            map.graphics.add(graphic2);
            map.setExtent(graphic2.geometry.getExtent());
            domAttr.set("locate", "class", "dormant");
        });
    
    
    
    
    
    }
    
    
    
    function findRoad() {
        popup.clearFeatures();
        change = false;
        map.graphics.clear();
        map.infoWindow.hide();
        var query = new Query();
        query.text = dom.byId("address").value;
        var deferred = roads.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(selection) {
            
            
            selectionX = selection;
            //  console.log(selection);
            var extHandler = map.on("extent-change", function() {
                extHandler.remove();
                //zoom to the center then display the popup 
                map.infoWindow.setFeatures(selection);
            
            });

            // map.setZoom(3);
            //  map.setZoom(1);
            change = false;
            makeGeomArray(selection);
        
        });
    }





    //select parcel from the feature layer by creating a query to look for the input parcel id 
    function selectParcel(parcelid) {
        popup.clearFeatures();
        if (parcelid) {
            var query = new Query();
            query.where = "PAR_NUM = '" + parcelid + "'";
            var deferred = parcels.selectFeatures(query, FeatureLayer.SELECTION_NEW, function(selection) {
                var center = graphicsUtils.graphicsExtent(selection).getCenter();
                var extHandler = map.on("extent-change", function() {
                    extHandler.remove();
                    //zoom to the center then display the popup 
                    map.infoWindow.setFeatures(selection);
                    map.infoWindow.show(center);
                    infoArray = selection[0];
                });
                map.centerAndZoom(center, 7);
            });
        }
    }






});

