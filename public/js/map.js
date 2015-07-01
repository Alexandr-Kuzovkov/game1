/**
* создание объекта карты и слоев с тайлами
* используя библиотеку leaflet http://leafletjs.com/
**/
var Map = {};

Map.center = [56.605, 47.9]; /*центр карты*/
Map.zoom = 13;                  /*масштаб*/
Map.maxZoom = 14;               /*максимальный масштаб*/
Map.minZoom = 12                /*минимальный масштаб*/
Map.id = 'examples.map-zr0njcqy'; /*ключ*/
Map.map = null;
Map.lib = null;
Map.baseLayers = null;

Map.init = function(lib){
    Map.lib = lib;
    Map.map = Map.lib.map('map').setView( Map.center, Map.zoom );
    /*создаем tile-слой*/ 
	var mapbox = Map.lib.tileLayer('https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png', {
		maxZoom: Map.maxZoom,
        minZoom: Map.minZoom,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: Map.id
	});
	/*создаем tile-слой*/ 
    var Thunderforest_Landscape = Map.lib.tileLayer('http://{s}.tile.thunderforest.com/landscape/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.opencyclemap.org">OpenCycleMap</a>, &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
   
   /*создаем tile-слои Google*/ 
   var ggl = new Map.lib.Google('SATELLITE',{maxZoom: Map.maxZoom, minZoom: Map.minZoom});
   var ggl2 = new Map.lib.Google('TERRAIN',{maxZoom: Map.maxZoom, minZoom: Map.minZoom});
    
	/*создаем другие базовые слои от других провайдеров*/     
	var osmde = Map.lib.tileLayer.provider('OpenStreetMap.DE',{maxZoom: Map.maxZoom, minZoom: Map.minZoom});
	var osmBW = Map.lib.tileLayer.provider('OpenStreetMap.BlackAndWhite',{maxZoom: Map.maxZoom, minZoom: Map.minZoom});
	var ersiwi = Map.lib.tileLayer.provider('Esri.WorldImagery',{maxZoom: Map.maxZoom, minZoom: Map.minZoom});
	Map.map.addLayer(ggl2);
    /*создаем контрол для переключения слоев*/
	Map.baseLayers = 	{
							"OpenStreetMap": osmde,
                            "Mapbox": mapbox,
							"OpenStreetMap Black and White": osmBW,
                            "Thunderforest.Landscape": Thunderforest_Landscape,
							"Esri WorldImagery": ersiwi,
                            "Google Satellite": ggl,
                            "Google Terrain": ggl2
						};

	Map.lib.control.layers(Map.baseLayers).addTo(Map.map);
};

Map.setView = function(center, zoom){
    Map.map.setView(center, zoom);
};

Map.setBoundary = function(SW_lat, SW_lng, NE_lat, NE_lng){
    Map.map.setMaxBounds(Map.lib.latLngBounds(Map.lib.latLng(SW_lat, SW_lng),Map.lib.latLng(NE_lat, NE_lng)));
};


Map.marker = function(latlng, iconUrl){
    this.icon = Map.lib.icon({  iconUrl: iconUrl,
                                iconSize: [24, 24], 
                                iconAnchor: [12, 12], 
                                shadowAnchor: [4, 23], 
                                popupAnchor: [-3, -23]});
    this.latLng = Map.lib.latLng(latlng[0], latlng[1]);
    this.marker = Map.lib.marker(this.latLng, {icon: this.icon}).addTo(Map.map);
    
    this.setIcon = function(iconUrl){
        this.icon = Map.lib.icon({  iconUrl: iconUrl,
                                iconSize: [24, 24], 
                                iconAnchor: [12, 12], 
                                shadowAnchor: [4, 23], 
                                popupAnchor: [-3, -23]});
        this.marker.setIcon(this.icon);
    };
    
    this.setLatLng = function(latlng){
        this.latLng = Map.lib.latLng(latlng[0], latlng[1]);
        this.marker.setLatLng(this.latLng);   
    };
    
    this.destroy = function(){
         Map.map.removeLayer(this.marker); 
    };
    
    this.setOpacity = function(opacity){
        this.marker.setOpacity(opacity);
    };
    
    this.addEventHandler = function(event, handler, context){
        this.marker.on(event, handler, context);   
    };
};

Map.popup = function(){
    this.popup = Map.lib.popup();
    this.show = function(latlng, content){
        this.popup.setLatLng(Map.lib.latLng(latlng[0], latlng[1])).setContent(content).openOn(Map.map);
    };    
};

Map.polyline = function(dots, color){
    this.polyline = Map.lib.polyline(dots,{color:color}).addTo(Map.map);
    this.setDots = function(dots){
        var latlngs = [];
		for ( var i = 0, len = dots.length; i < len; i++ ) latlngs.push(Map.lib.latLng(dots[i][0],dots[i][1]));
        this.polyline.setLatLngs(latlngs);
    };    
};

Map.icon = function(iconUrl){
    this.icon = Map.lib.icon({  iconUrl: iconUrl,
                                iconSize: [24, 24], 
                                iconAnchor: [12, 12], 
                                shadowAnchor: [4, 23], 
                                popupAnchor: [-3, -23]});
};

Map.createMarker = function(latlng, iconUrl){
    return new Map.marker(latlng, iconUrl);
};

Map.createPopup = function(){
    return new Map.popup();
};

Map.createPolyline = function(dots, color){
    return new Map.polyline(dots,color);
};

Map.createIcon = function(iconUrl){
    return new Map.icon(iconUrl);
};





