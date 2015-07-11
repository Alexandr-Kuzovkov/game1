/**
* объект содержащий функции и переменнные обеспечивающие движения юнитов
**/
var Move = 
{
	/*разрешено ли движение*/
    ENABLED: true,
    /*включена ли пауза*/
    PAUSE: false,
    /*длительность такта анимации в мс*/
    DELTA_TIME: 100,
    /*масштаб времени*/
    TIME_SCALE: 20,
	
	/**
    * перемещение юнита по пути с анимацией
    * @param unit объект юнита (полка)
    * @param route путь, представленный в виде массива точек вида [[lat1,lng1],[lat2,lng2],...]
    * @param i номер отрезка пути 
    **/
    moveUnitRouteAnimation:	function (unit,route,i){
        if (!Move.ENABLED) return false;
        if (route.length == 0) return false;
        if ( unit.STOP ){
		    unit.STOP = false;
            unit.MOVE = false;
            unit.path.setDots([]);
            return false;
		}
        if ( unit.status.kind == 'defense' ){
            return false; /*при обороне не можем двигаться*/
        }
		
		if ( i == undefined ) {
			i = 0;
			if ( unit.path.getDots().length == 0 )
				unit.path.setDots(route); //отрисовка пути движения полилинией
		}
		
		Move.moveUnitLineAnimation({lat: route[i][0],lng: route[i][1]}, unit, function(){
			if ( ++i < route.length ){
				Move.moveUnitRouteAnimation(unit,route,i);
			}
			else
			{
				unit.path.setDots([]); //удаление линии пути
			}
		
		});	
	},//end func
							
			
    /**
    * перемещение юнита в заданную точку по прямой с анимацией
    * с учетом сферичности используя решение прямой о обратной геодезических задач 
    * @param latlng точка назначения в виде оъекта {lat:lat,lng:lng} 
    * @param unit объект юнита (полка)
    * @param callback функция обратного вызова вызываемая после завершения движения 
    **/
	moveUnitLineAnimation:	function ( latlng, unit, callback ){
        if ( unit.MOVE ) return false;
		unit.MOVE = true;
		var start = {lat:unit.latlng[0], lng:unit.latlng[1]};
		var end = latlng;
		var ogz = Helper.ogz([start.lat,start.lng], [end.lat, end.lng]);
		var pos = {lat:start.lat, lng:start.lng};
        var newpos = null;
		var interval = setInterval( function(){   
            var rastTact = Move.DELTA_TIME * Move.TIME_SCALE /3600 * unit.getVelocity();
            if ( (Helper.rast([pos.lat,pos.lng],[end.lat,end.lng]) >= rastTact) && Move.ENABLED && !unit.STOP )
			{
                if ( !Move.PAUSE ){
                    unit.replace([pos.lat, pos.lng]);
                    newpos = Helper.pgz([pos.lat,pos.lng], rastTact, ogz.azimut);
                    pos = {lat: newpos[0], lng: newpos[1]};
				}               
			}
			else
			{
				clearInterval( interval );
				unit.MOVE = false;
				callback();
			}
		
		}, Move.DELTA_TIME );
	}//end func
    
    						
}