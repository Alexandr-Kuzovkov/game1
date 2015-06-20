function MyObj(){
	this.prop1 = 5;
	this.prop2 = 'string1';
	this.foo1 = function(){
		console.log('called foo1');
	};
	this.foo2 = function(x){
		console.log('called foo2');
	};
	
	/*
	this.setProp1 = function(x){
		this.prop1 = x;
	};
	
	this.getProp1 = function(){
		return this.prop1;
	};
	*/
}


function ShObj(){
	this.x = 100;
	this.y = 200;
	this.getSumm = function(){
		return this.x + this.y;
	};
	
	this.setX = function(x){ this.x = x };
	this.setY = function(y){ this.y = y };
	this.getX = function(){ return this.x };
	this.getY = function(){ return this.y };
}

MyObj.prototype.setProp1 = function(x){
								this.prop1 = x;
							};
							
MyObj.prototype.getProp1 = function(){
		return this.prop1;
};							

MyObj.prototype = new ShObj();

var obj1 = new MyObj();
var obj2 = new MyObj();

console.log(obj1.prop1);
console.log(obj1.prop2);
obj1.foo1();
obj1.foo2();

//obj1.setProp1(10);
//console.log(obj1.getProp1());
//console.log(obj2.getProp1());

console.log(obj1.getSumm());
obj1.setX(120);
obj2.setY(800);

console.log(obj1.getY());
console.log(obj2.getX());
console.log(obj1.getSumm());
console.log(obj2.getSumm());

