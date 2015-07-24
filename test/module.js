var exec = require("child_process").exec;

function foo1(callback){
   
    var max = 200000000;
    var x = 0;
    for(var i = 0; i < max; i++){
        x = Math.cos(i);
    }
    callback('foo1');
    	    
}


function foo2(callback){
    var max = 200000000;
    var x = 0;
    for(var i = 0; i < max; i++){
        x = Math.cos(i);
    }
    callback('foo2');   
}

function index(callback){
    callback('index');   
}

function find(callback){
   exec("find /",
    { timeout: 10000, maxBuffer: 20000*1024 },
    function (error, stdout, stderr){
        callback(stdout);
    });
}

exports.foo1 = foo1;
exports.foo2 = foo2;
exports.index = index;
exports.find = find;