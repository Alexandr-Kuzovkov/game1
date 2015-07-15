function begin(x,y){
   foo1(x,y, function(){
       setTimeout(begin, 1000, x,y); 
   });     
}

function foo1(x,y,callback){
    for (var i = 0; i < 1000000000; i++){var m = i*2;}
    console.log(x+y);
    callback();
}

var x=3;
var y= 5;
begin(x,y);