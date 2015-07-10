/**
* конструкторы объектов разного типа юнитов
**/

var UnitTypes = {};

UnitTypes.Tank = function(){
	this.name =	'Танковый полк'; /*наименование*/
	this.id = 'tank';            /*идентификатор*/
    this.VELOCITY = 40;         /*скорость движения юнита в км/ч*/
    this.radius = 0.01;          /*радиус области действия полка в градусах*/
	this.power = 50;              /*боевая мощь*/
    this.cycle = 
    {
        ammoOutGo: 3,           /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        ammoInGo: 1,           /*пополнение боеприпасов за 1 цикл игры*/
        foodOutGo: 1,           /*расход обеспечения за 1 цикл игры*/
        foodInGo: 2,           /*пополнение обеспечения за 1 цикл игры*/
        menInGo: 1             /*пополнение людьми за 1 цикл игры*/
    };
    /*картинка иконки*/ 
	this.icon =	{   url: '/img/type/tank24.png',
                    size: [24,24],
                    anchor: [12,12],
                    shadowanchor: [4,23],
                    popupanchor: [-3,-23]
    }; 
			
					
	this.resources = {                        /*ресурсы*/
						men: 100, /*личный состав %*/
    					ammo: 100, /*вооружение и боеприпасы %*/
    					food: 100, /*прочее обеспечение %*/
    					discipline: 1, /*организованность 0-1*/
    					experience: 0 /*боевой опыт 0-1*/
					};
                    
     this.toString = function(){                 /*преобразование в строку*/  
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, cycle: this.cycle}; 
     };

};

UnitTypes.Foot = function(){
	this.name =	'Мотострелковый полк';
	this.id = 'foot';
    this.VELOCITY = 40;
	this.radius = 0.01;
    this.power = 30;              /*боевая мощь*/
    this.cycle = 
    {
        ammoOutGo: 3,          /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        ammoInGo: 1,           /*пополнение боеприпасов за 1 цикл игры*/
        foodOutGo: 1,           /*расход обеспечения за 1 цикл игры*/
        foodInGo: 2,           /*пополнение обеспечения за 1 цикл игры*/
        menInGo: 1             /*пополнение людьми за 1 цикл игры*/
    };
	this.icon =	{   url: '/img/type/foot24.png',
                    size: [24,24],
                    anchor: [12,12],
                    shadowanchor: [4,23],
                    popupanchor: [-3,-23]
    }; 
					
	this.resources =	{
					men: 100, /*личный состав %*/
					ammo: 100, /*вооружение и боеприпасы %*/
					food: 100, /*прочее обеспечение %*/
					discipline: 1, /*организованность 0-1*/
					experience: 0 /*боевой опыт 0-1*/
				};
                
    this.toString = function(){
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, cycle: this.cycle}; 
     };
};

UnitTypes.Base = function(){
	this.name =	'База снабжения';
	this.id = 'base';
    this.VELOCITY = 20;
	this.radius = 0.01;
    this.power = 10;              /*боевая мощь*/
	this.cycle = 
    {
        ammoOutGo: 3,           /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        ammoInGo: 1,           /*пополнение боеприпасов за 1 цикл игры*/
        foodOutGo: 1,           /*расход обеспечения за 1 цикл игры*/
        foodInGo: 2,           /*пополнение обеспечения за 1 цикл игры*/
        menInGo: 1             /*пополнение людьми за 1 цикл игры*/
    };
    this.icon =	{   url: '/img/type/base24.png',
                    size: [24,24],
                    anchor: [12,12],
                    shadowanchor: [4,23],
                    popupanchor: [-3,-23]
    }; 
					
	this.resources =	{
					men: 100,
					ammo: 100,
					food: 100
				};
                
    this.toString = function(){
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, cycle: this.cycle}; 
     };
};



/**
* получение объекта заданного типа
* @param type тип нужного объекта
**/
UnitTypes.getType = function(type){
    switch (type){
        case 'tank': return new UnitTypes.Tank(); break;
        case 'foot': return new UnitTypes.Foot(); break;
        case 'base': return new UnitTypes.Base(); break;
        default: return null;
    }
};


UnitTypes.names = {
    tank: 'Танковый полк',
    foot: 'Мотострелковый полк',
    base: 'База снабжения'  
};

