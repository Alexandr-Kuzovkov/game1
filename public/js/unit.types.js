/**
* конструкторы объектов разного типа юнитов
**/

var UnitTypes = {};

UnitTypes.Tank = function(){
	this.name =	Lang.get('tank_regiment'); /*наименование*/
	this.id = 'tank';            /*идентификатор*/
    this.VELOCITY = 40;         /*скорость движения юнита в км/ч*/
    this.radius = 0.01;          /*радиус области действия полка в градусах*/
	this.power = 50;              /*боевая мощь*/
    this.outGo = 
    {
        ammo: 3,           /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        food: 1,           /*расход обеспечения за 1 цикл игры*/
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
                    
     this.toString = function(){                 /*преобразование объекта в вид который может быть преобразован в строку*/  
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, outGo: this.outGo};
     };

};

UnitTypes.Foot = function(){
	this.name =	Lang.get('motorized_rifle_regiment');
	this.id = 'foot';
    this.VELOCITY = 40;
	this.radius = 0.01;
    this.power = 30;              /*боевая мощь*/
    this.outGo = 
    {
        ammo: 3,          /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        food: 1,           /*расход обеспечения за 1 цикл игры*/
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
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, outGo: this.outGo}; 
        
     };
};

UnitTypes.Convoy = function(){
	this.name =	Lang.get('convoy');
	this.id = 'convoy';
    this.VELOCITY = 40;
	this.radius = 0.005;
    this.power = 10;              /*боевая мощь*/
    this.outGo = 
    {
        ammo: 3,          /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        food: 1,           /*расход обеспечения за 1 цикл игры*/
    };
	this.icon =	{   url: '/img/type/convoy24.png',
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
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, outGo: this.outGo}; 
       
     };
};

UnitTypes.Base = function(){
	this.name =	Lang.get('depot');
	this.id = 'base';
    this.VELOCITY = 20;
	this.radius = 0.01;
    this.power = 10;              /*боевая мощь*/
    this.child = []; /*массив id дочерних юнитов*/
    this.MAX_CHILD = 3; /*максимальное количество дочерних юнитов*/
	this.outGo = 
    {
        ammo: 3,           /*расход боеприпасов за 1 цикл игры при интенсивности боя 1*/
        food: 1,           /*расход обеспечения за 1 цикл игры*/
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
        return {name: this.name, id: this.id, DELTA: this.DELTA, DELTA_TIME: this.DELTA_TIME,resources: this.resources, radius:this.radius, power: this.power, outGo: this.outGo, child: this.child }; 
       
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
        case 'convoy': return new UnitTypes.Convoy(); break;
        default: return null;
    }
};


UnitTypes.names = {
    tank: Lang.get('tank_regiment'),
    foot: Lang.get('motorized_rifle_regiment'),
    base: Lang.get('depot'),
    convoy: Lang.get('convoy')  
};

