/**
* конструктор объекта игрового юнита (полка)
* param latlng координаты [lat,lng]
* param id идентификатор
**/
function RegimentBase( latlng, id, userId )
{
    /*Свойства*/
	this.userId = userId; /*id игрока*/
    this.id = id;   /*идентификатор*/
	
    this.latlng = L.latLng(latlng[0], latlng[1]);
    this.status = 
    {
        kind: 'march', /*статус юнита; может быть march, attack, defense*/
        defense_coff: 0.5, /*степень ослабления ударов неприятеля в состоянии обороны*/
        attack_coff: 0.5, /*степень ослабления ударной мощи на марше*/
        speed_coff: 0.5  /*степень замедления скорости в атаке*/
    };
    this.popup = L.popup(); /*объект всплывающего окна из leaflet http://leafletjs.com/*/
	this.path = L.polyline([],{color:this.colorPath}).addTo(map); /*объект полилинии пути движения*/
	this.country =   /*объект иконки страны принадлежности*/
	{ 
		icon: 	L.icon({ iconUrl: '/img/default.png',
		iconSize: [24, 24], 
		iconAnchor: [12, 12], 
		shadowAnchor: [4, 23], 
		popupAnchor: [-3, -23]})
	};
	this.type =  /*объект иконки типа юнита*/     
	{
		icon: L.icon({ iconUrl: '/img/default.png',
		iconSize: [24, 24], 
		iconAnchor: [12, 12], 
		shadowAnchor: [4, 23], 
		popupAnchor: [-3, -23]})
	};
    
    /*объект иконки выделенного юнита*/ 
	 this.iconSelected = L.icon({ iconUrl: '/img/unselected.png',
					iconSize: [50, 50], 
					iconAnchor: [25, 25], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
    
    /*объект иконки невыделенного юнита*/
    this.iconUnselected = L.icon({ iconUrl: '/img/unselected.png',
					iconSize: [50, 50], 
					iconAnchor: [25, 25], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
	
    /*объект иконки изображения боя*/
    this.iconBattle = L.icon({ iconUrl: '/img/battle.gif',
					iconSize: [60, 60], 
					iconAnchor: [30, 30], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
                    
    /*объект иконки изображения взрыва*/
    this.iconExplosion = L.icon({ iconUrl: '/img/explosion.gif',
					iconSize: [50, 60], 
					iconAnchor: [25, 30], 
					shadowAnchor: [4, 23], 
					popupAnchor: [-3, -23]});
    
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
    
    /*Обработчики событий*/
	
    this.marker.selected.on('click', function(){Handler.click(this)},this);
	this.marker.selected.on('contextmenu',function(){Handler.contextmenu(this)},this);
    this.marker.selected.on('mouseover', function(){Handler.mouseover(this)},this);
    this.marker.selected.on('mouseout', function(){Handler.mouseout(this)},this);
	
}

RegimentBase.prototype = new Unit([0,0],0,0);

