/*объект для получения маршрута*/
var Route =
{
	service: 'google', /*возможные варианты: 'osrm','google','spatialite'*/
    
    OSRM_PORT: 8003,
    SPATIALITE_PORT: 8001,
    app: null, /*объект приложения*/
    callbackQueue: [], /*очередь обратных вызовов*/
    
    /*объект directionsService*/
    directionsService: new google.maps.DirectionsService(),
	
    init: function(app){
        Route.app = app;    
    },
    
    /**получение маршрута с какого-либо сервиса маршрутов
    * @param latlng объект точки куда двигаться {lat:lat,lng:lng}
    * @param source объект точки откуда двигаться {lat:lat,lng:lng}
    * @param callback объект в который передается маршрут в виде массива точек
    **/
    getRoute: function(latlng,source,callback){
        if ( Route.service == 'google' ){
            Route.getRouteGoogle(latlng,source,callback);
        }else if ( Route.service == 'spatialite'  ){
            Route.getRouteSpatialite(latlng,source,callback);
        }else if ( Route.service == 'osrm' ){
            Route.getRouteOSRM(latlng,source,callback);
        }else{
            Route.getRouteGoogle(latlng,source,callback);
        }
    },
    
    /**получение маршрута с сервиса маршрутов Google через JS API
    * @param latlng объект точки куда двигаться {lat:lat,lng:lng}
    * @param source объект точки откуда двигаться {lat:lat,lng:lng}
    * @param callback объект в который передается маршрут в виде массива точек
    **/
	getRouteGoogle: function(latlng,source,callback){
		var start = new google.maps.LatLng(source.lat, source.lng);
		var end = new google.maps.LatLng(latlng.lat, latlng.lng);
		var request = {
					  origin: start,
					  destination: end,
					  //задание путевой точки
					  //waypoints: [{location: new google.maps.LatLng(56.64,47.82 ), stopover: false}],
					  travelMode: google.maps.TravelMode.DRIVING
					};
		Route.directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				var points = response.routes[0].overview_path;
                var liters = [];
                for ( var key in points[0]){
                    liters.push(key);
                    if (liters.length >1 ) break;  
                }
                var route = [];
    			for ( var i = 0; i < points.length; i++ ){
    				route.push([points[i][liters[0]],points[i][liters[1]]]);
    			}
                callback(route);
			}
		});
	},
    
    
    /**
    * получение маршрута от модуля Spatialite
    * @param latlng объект точки куда двигаться {lat:lat,lng:lng}
    * @param source source объект точки откуда двигаться {lat:lat,lng:lng}
    * @param callback функция обратного вызова в которую передается маршрут
    **/
    
    getRouteSpatialite: function(latlng,source,callback){
		var start = [source.lat, source.lng];
		var end = [latlng.lat, latlng.lng];
        Route.callbackQueue.push(callback);
        Route.app.socket.send('getroute', {start:start, end:end, location:Route.app.game.location.id});
	},
    
    /**
    * получение маршрута от модуля OSRM
    * @param latlng объект точки куда двигаться {lat:lat,lng:lng}
    * @param source source объект точки откуда двигаться {lat:lat,lng:lng}
    * @param callback функция обратного вызова в которую передается маршрут
    **/
    
    getRouteOSRM: function(latlng,source,callback){
        var start = [source.lat, source.lng];
		var end = [latlng.lat, latlng.lng];
		var params = 'data=' + JSON.stringify([start,end]);
        Ajax.sendRequest('GET', 'http://' + hostname + ':' + Route.OSRM_PORT + '/routeosrm', params, function(route) {	
            callback(route);
		});   
	}
    
}