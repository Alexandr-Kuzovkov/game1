/**
* объекты описывающие страны, за которые можно играть
**/
var Countries = {};

Countries.Russia = {
	name:	'Российская Федерация', /*имя*/
	id:	    'Russia',               /*идентификатор*/
	/*картинка иконки*/				
	icon: 	{   url: '/img/country/Russia.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    },  
			
					
    toString: function(){                             /*метод для преобразования в строку*/
        return {name: this.name, id: this.id};
    }	

};

Countries.Ukraine = {
	name:	'Украина',
	id:	    'Ukraine',
	
    icon: 	{   url: '/img/country/Ukraine.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 	

    toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.USA = {
	name:	'США',
	id:	    'USA',
					
    icon: 	{   url: '/img/country/United-States.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.UK = {
	name:	'Великобритания',
	id:	    'UK',
					
    icon: 	{   url: '/img/country/United-Kingdom.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.Germany = {
	name:	'Германия',
	id:	    'Germany',
					
    icon: 	{   url: '/img/country/Germany.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.Iraq = {
	name:	'Ирак',
	id:	    'Iraq',
					
    icon: 	{   url: '/img/country/Iraq.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
					
	toString: function(){
        return {name: this.name, id: this.id};
    }

};

Countries.NorthKorea = {
	name:	'Северная Корея',
	id:	    'NorthKorea',
					
    icon: 	{   url: '/img/country/North-Korea.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
			
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.USSR = {
	name:	'СССР',
	id:	    'USSR',
					
    icon: 	{   url: '/img/country/Ussr.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Syria = {
	name:	'Сирия',
	id:	    'Syria',
					
    icon: 	{   url: '/img/country/Syria.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Tajikistan = {
	name:	'Таджикистан',
	id:	    'Tajikistan',
					
    icon: 	{   url: '/img/country/Tajikistan.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Vietnam = {
	name:	'Вьетнам',
	id:	    'Vietnam',
					
    icon: 	{   url: '/img/country/Vietnam.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Azerbaijan = {
	name:	'Азербайджан',
	id:	    'Azerbaijan',
					
    icon: 	{   url: '/img/country/Azerbaijan.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Israel = {
	name:	'Израиль',
	id:	    'Israel',
					
    icon: 	{   url: '/img/country/Israel.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
			
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Palestine = {
	name:	'Палестина',
	id:	    'Palestine',
					
    icon: 	{   url: '/img/country/Palestine.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
			
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Mongolia = {
	name:	'Монголия',
	id:	    'Mongolia',
					
    icon: 	{   url: '/img/country/Mongolia.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Pakistan = {
	name:	'Пакистан',
	id:	    'Pakistan',
					
    icon: 	{   url: '/img/country/Pakistan.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Turkmenistan = {
	name:	'Туркменистан',
	id:	    'Turkmenistan',
					
    icon: 	{   url: '/img/country/Turkmenistan.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
		
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};

Countries.Uzbekistan = {
	name:	'Узбекистан',
	id:	    'Uzbekistan',
					
    icon: 	{   url: '/img/country/Uzbekistan.png',
                size: [24,24],
                anchor: [12,36],
                shadowanchor: [4,23],
                popupanchor: [-3,-23]
    
    }, 
			
					
	toString: function(){
        return {name: this.name, id: this.id};
    }
};
