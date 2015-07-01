/**
* конструктор объекта игрового юнита
* param latlng координаты [lat,lng]
* param id идентификатор
**/
function Unit( latlng, id, userId, map )
{
	/*Свойства*/
	this.userId = userId; /*id игрока*/
    this.id = id;   /*идентификатор*/
	this.MOVE = false;/*флаг находится ли юнит в движении*/
    this.STOP = false; /*флаг сигнала на остановку*/
    this.OWN = false; /*флаг свой ли юнит*/
	this.selected = false; /*флаг что юнит выбран*/
    this.around = false; /*флаг что юнит окружен*/
    this.lastelevation = 0; /*предыдущая высота*/
    this.elevation = 0; /*высота точки нахождения юнита*/
	this.colorPath = 'red'; /*цвет траектории пути*/
	this.battle = false; /*флаг боя*/
    this.lastbattle = false; /*предыдущее значение флага боя*/
    this.enemyCount = 0; /*количество противников*/
    this.weather = null; /*погодные данные*/
    //this.latlng = L.latLng(latlng[0], latlng[1]);
    this.status = 
    {
        kind: 'march', /*статус юнита; может быть march, attack, defense*/
        defense_coff: 0.5, /*степень ослабления ударов неприятеля в состоянии обороны*/
        attack_coff: 0.5, /*степень ослабления ударной мощи на марше*/
        speed_coff: 0.5  /*степень замедления скорости в атаке*/
    };
    this.popup = map.createPopup(); /*объект всплывающего окна из leaflet http://leafletjs.com/*/
	this.path = map.createPolyline([],this.colorPath); /*объект полилинии пути движения*/
	this.country =  map.createIcon('/img/default.png'); /*объект иконки страны принадлежности*/
	this.type =  map.createIcon('/img/default.png'); /*объект иконки типа юнита*/     
    
    /*объект иконки выделенного юнита*/ 
	 this.iconSelected = map.createIcon('/img/unselected.png');
    
    /*объект иконки невыделенного юнита*/
    this.iconUnselected = map.createIcon('/img/unselected.png');
	
    /*объект иконки изображения боя*/
    this.iconBattle = map.createIcon('/img/battle.gif');
                    
    /*объект иконки изображения взрыва*/
    this.iconExplosion = map.createIcon('/img/explosion.gif');
    
    /*объект маркера юнита, с помощью которого он отображается на карте */
	this.marker = 
	{
		area: L.circle(this.latlng, 1, {color: '#f03', fillColor: '#f03', opacity: 0.1,fillOpacity:0.1 }).addTo(map),
        battle: L.marker(this.latlng,{icon:this.iconUnselected}).addTo(map),
        type: L.marker(this.latlng,{icon:this.type.icon}).addTo(map),
		country: L.marker(this.latlng,{icon:this.country.icon}).addTo(map),
		explosion: L.marker(this.latlng,{icon:this.iconUnselected}).addTo(map),
        selected: L.marker(this.latlng,{icon:this.iconUnselected}).addTo(map)
    };
    
    /**
    * перемещение юнита в указанную точку
    * @param latlng координаты точки [lat, lng]
    **/
	this.replace = function(latlng){
	   Move.replaceMarker( latlng, this );
	};
    
    
    /**
    * возвращает величину DELTA - смещение юнита за один такт (от этого зависит скорость)
    **/
    this.getVelocity = function(){
        /*зависимость скорости от рельефа*/
        var k = 0.1;
        if ( this.elevation == 0 || this.lastelevation == 0 ){
            var elevationCoff = 1;
        }else{
            var elevationCoff = ( 1 + k * ( (this.lastelevation - this.elevation) / this.elevation )) ;
        }
        
        /*понижение скорости в атаке*/
        var coff = ( this.status.kind == 'attack' )? this.status.speed_coff : 1;
        return this.type.VELOCITY * elevationCoff * coff;
    };
    
    /**
    * перемещение юнита в точку события по прямой с анимацией
    * @param latlng объект {lat:lat,lng:lng}
    **/
    this.goTo = function(latlng){
		Move.moveMarkerLineAnimation( latlng, this, function(){} );
	};
	
    /**
    * перемещение юнита в точку события по маршруту с анимацией
    * @param latlng объект {lat:lat,lng:lng}
    **/
	this.goRoute = function(latlng){
        var object = this;
        var source = {lat: this.marker.type.getLatLng().lat, lng: this.marker.type.getLatLng().lng};
        Route.getRoute(latlng,source,function(route){    
            Move.moveMarkerRouteAnimation( object, route );
		});	
	};
	
	/**
    * выделение юнита
    **/
    this.select = function(){
		this.selected = true;
		this.marker.selected.setIcon(this.iconSelected);
	};
	
	/**
    * отмена выделения юнита
    **/
    this.unselect = function(){
		this.selected = false;
		this.marker.selected.setIcon(this.iconUnselected);
        map.off('dblclick',null,this);	
	};
    
    /**
    * установка анимации для обозначения состояния боя
    * @param battle устанавливаемый флаг боя
    **/
    this.checkBattle = function(){
        if ( this.battle == this.lastbattle ) return;
        if ( this.battle ){
            this.lastbattle = this.battle;
            this.marker.battle.setIcon(this.iconBattle);
            
        }else{
            this.lastbattle = this.battle;
            this.marker.battle.setIcon(this.iconUnselected);
           
        } 
    };
    
    /**
    * Установка статуса юнита
    * @param status вид статуса
    **/
    this.setStatus = function(status){
        if ( this.status.kind == status ) return false;
        if ( status != 'march' && status != 'attack' && status != 'defense' ){
            return false;
        }
        this.status.kind = status; 
    };
    
    /**
    * инициализация объекта юнита
    **/
    this.init = function(){
		this.marker.type.setIcon(this.type.icon);
		this.marker.country.setIcon(this.country.icon);
        iconSelectedUrl = ( this.OWN )? '/img/selected.png' : '/img/enemy.selected.png';
        this.iconSelected = L.icon({ iconUrl: iconSelectedUrl,
					iconSize: [50, 50], 
					iconAnchor: [25, 25], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
        this.marker.area.setRadius(this.type.radius * 111300);
	};
	
	
    /**
    * здесь может быть реализовано обновление состояния юнита
    **/
	this.update = function(){
		/*гибель юнита если нет ресурсов или людей*/
        this.checkBattle();
        if ( this.type.resources.food <= 0 || this.type.resources.men <= 0 ){
            this.marker.explosion.setIcon(this.iconExplosion);
            var self = this;
            setTimeout( function(){game.deleteUnit(self.id);}, 3000);
		} 
	};
    
	/**
    * уничтожение объекта юнита
    **/
    this.destroy = function(){
		map.removeLayer(this.path);
		delete this.type;
		this.marker.selected.clearAllEventListeners();
		if ( this.selected ) UnitEvent.removeDblclick(this);
		for ( marker in this.marker ) map.removeLayer(this.marker[marker]);
	};
    
    /*преобразование в строку*/
    this.toString = function(){
        var unit = {};
        unit.country = this.country.toString();
        unit.type = this.type.toString();
        unit.id = this.id;
        unit.userId = this.userId;
        unit.MOVE = this.MOVE;
        unit.OWN = this.OWN;
        unit.latlng = [this.marker.selected.getLatLng().lat, this.marker.selected.getLatLng().lng];
        unit.selected = this.selected;
        unit.colorPath = this.colorPath;
        unit.around = this.around;
        unit.elevation = this.elevation;
        unit.lastelevation = this.lastelevation;
        unit.battle = this.battle;
        unit.status = this.status;
        unit.weather = this.weather;
        unit.enemyCount = this.enemyCount; 
        return unit;  
    };
	
	/*Обработчики событий*/
	
    this.marker.selected.on('click', function(){UnitEvent.click(this)},this);
	this.marker.selected.on('contextmenu',function(){UnitEvent.contextmenu(this)},this);
    this.marker.selected.on('mouseover', function(){UnitEvent.mouseover(this)},this);
    this.marker.selected.on('mouseout', function(){UnitEvent.mouseout(this)},this);
	
}//end func
