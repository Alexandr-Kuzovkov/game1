var time = require('./time');

var array = [];
for(var i = 0; i < 50000000; i++){
    array.push(i);
}

time.start();
foo1();
console.log('Time execution: ' + time.stop());


function foo1(callback){ 
    var x = 0;
    for(var i = array.length; --i; ){
        if (array[i] > 100) x = 125;
    }   	    
}

