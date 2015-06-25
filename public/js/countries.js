/**
* объекты описывающие страны, за которые можно играть
**/
var Countries = {};

Countries.Russia = {
	name:	'Российская Федерация', /*имя*/
	id:	    'Russia',               /*идентификатор*/
					
	icon: 	L.icon({ iconUrl: '/img/country/Russia.png',  /*объект иконки*/
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
    toString: function(){                             /*метод для преобразования в строку*/
        return {name: this.name, id: this.id};
    }	

};

Countries.Ukraine = {
	name:	'Украина',
	id:	    'Ukraine',
	
	icon:	L.icon({ iconUrl: '/img/country/Ukraine.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),	

    toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.USA = {
	name:	'США',
	id:	    'USA',
					
	icon: 	L.icon({ iconUrl: '/img/country/United-States.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.UK = {
	name:	'Великобритания',
	id:	    'UK',
					
	icon: 	L.icon({ iconUrl: '/img/country/United-Kingdom.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.Germany = {
	name:	'Германия',
	id:	    'Germany',
					
	icon: 	L.icon({ iconUrl: '/img/country/Germany.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.Iraq = {
	name:	'Ирак',
	id:	    'Iraq',
					
	icon: 	L.icon({ iconUrl: '/img/country/Iraq.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.NorthKorea = {
	name:	'Северная Корея',
	id:	    'NorthKorea',
					
	icon: 	L.icon({ iconUrl: '/img/country/North-Korea.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.USSR = {
	name:	'СССР',
	id:	    'USSR',
					
	icon: 	L.icon({ iconUrl: '/img/country/Ussr.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Syria = {
	name:	'Сирия',
	id:	    'Syria',
					
	icon: 	L.icon({ iconUrl: '/img/country/Syria.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Tajikistan = {
	name:	'Таджикистан',
	id:	    'Tajikistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Tajikistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Vietnam = {
	name:	'Вьетнам',
	id:	    'Vietnam',
					
	icon: 	L.icon({ iconUrl: '/img/country/Vietnam.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Azerbaijan = {
	name:	'Азербайджан',
	id:	    'Azerbaijan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Azerbaijan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Israel = {
	name:	'Израиль',
	id:	    'Israel',
					
	icon: 	L.icon({ iconUrl: '/img/country/Israel.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Palestine = {
	name:	'Палестина',
	id:	    'Palestine',
					
	icon: 	L.icon({ iconUrl: '/img/country/Palestine.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Mongolia = {
	name:	'Монголия',
	id:	    'Mongolia',
					
	icon: 	L.icon({ iconUrl: '/img/country/Mongolia.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Pakistan = {
	name:	'Пакистан',
	id:	    'Pakistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Pakistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Turkmenistan = {
	name:	'Туркменистан',
	id:	    'Turkmenistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Turkmenistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Uzbekistan = {
	name:	'Узбекистан',
	id:	    'Uzbekistan',
					
	icon: 	L.icon({ iconUrl: '/img/country/Uzbekistan.png',
			iconSize: [24, 24], 
			iconAnchor: [12, 36], 
			shadowAnchor: [4, 23], 
			popupAnchor: [-3, -23]}),
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};
