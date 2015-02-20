/*������ ����������� ��������� ������*/
var Debug = require('./debug');
var http = require('http');
var ROUTE_SERVICE_HOSTNAME = '127.0.0.1'; /*���� ������� ���������*/
var ROUTE_SERVICE_PORT = 8001; /*���� ������� ������� ���������*/
var unitsPositionsHash = 0; /*��� ������� ������*/

/**
* ��������� ���� �� ������� ������ � ����� ����������� 
* ���� �� �������� ������ ��� ���
* @param game ������ ����
* @return hash ��� �� ��������� ������
**/
function calcUnitsPositionsHash(game){
    var hash = 0;
    for (var i = 0; i < game.regiments.length; i++){
        hash += game.regiments[i].latlng[0] + game.regiments[i].latlng[1];
    }
    for (var i = 0; i < game.bases.length; i++){
        hash += game.bases[i].latlng[0] + game.bases[i].latlng[1];
    }
    return hash;
}

/**
* ������� �������� ������ ��� �������� �� ������ ��� ������� ���������
* @param game ������ ����
* @return regiments ������ �������� ������
**/
function getRegimentsData(game){
    var regiments = [];
    var item = null;
    for ( var i = 0; i < game.regiments.length; i++ ){
        item = game.regiments[i];
        regiments.push({id:item.id, country:item.country.id,lat:item.latlng[0],lng:item.latlng[1],radius:item.type.radius});
    }
    return regiments;
}

/**
* ������� �������� ��� ��� �������� �� ������ ��� ������� ���������
* @param game ������ ����
* @return bases ������ �������� ���
**/
function getBasesData(game){
    var bases = [];
    var item = null;
    for ( var i = 0; i < game.bases.length; i++ ){
        item = game.bases[i];
        bases.push({id:item.id, country:item.country.id,lat:item.latlng[0],lng:item.latlng[1],radius:item.type.radius});
    }
    return bases;
}

/**
* ����������� ��������� ������
* @param game ������ ����
* @param callback ������� ��������� ������, ���������� �� ���������� ������ �������
**/
function setAround(game, callback){
    /*��������� ���� �� ��������� ��������� ������*/
    var hash = calcUnitsPositionsHash(game);
    if ( unitsPositionsHash == hash ){
        callback();
        return;
    }
    unitsPositionsHash = hash;
    
    var regiments = getRegimentsData(game);
    var bases = getBasesData(game);
    sendRequestAround(regiments, bases, function(result){
        //console.log('result: '+JSON.stringify(result));
        if (result){
            for (var i =0; i < game.regiments.length; i++)
                for ( var j = 0; j < result.length; j++ ){
                    if ( game.regiments[i].id == result[j].id ){
                        if ( game.regiments[i].around != result[j].around ){
                            if ( result[j].around ){
                                game.addGameMessage(game.gameMsgText('beginAround',game.regiments[i]));
                            }else{
                                game.addGameMessage(game.gameMsgText('endAround',game.regiments[i]));
                            }
                        }
                        game.regiments[i].around = result[j].around;
                        break;
                    }
                }      

        }
        callback();
    });
}


/**
* �������� ������ �� ��������� ������ � ��������� 
* ������� �� ���������  ����� �������� HTTP POST ������� 
* @param regiments ������ �������� ������ ���� [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param bases ������ �������� ��� ���� [{lat:lat,lng:lng,radius:radius,id:id,country:country}, ...]
* @param callback ������� ��������� ������, � ������� ���������� �������  
* ��������� ������� ��������� ������ � ���� [{id:id, around:true}, {id:id, around:false},...]
**/
function sendRequestAround( regiments, bases, callback ){
    var path = '/around';
    var params = 'regiments=' + JSON.stringify(regiments) + '&';
    params += 'bases=' + JSON.stringify(bases);
    var results = '';
    var options = {
                    hostname: ROUTE_SERVICE_HOSTNAME,
                    port: ROUTE_SERVICE_PORT,
                    path: path,
                    method: 'POST',
                    headers: {'Content-type': 'application/x-www-form-urlencoded'}
                    };
            
    var req = http.request(options, function(res){
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    results += chunk;
                });
                res.on('end',function(){
                   result = JSON.parse(results);
                   callback(result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    callback(false);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('around: problem with request: ' + e.message);
    });
    
    // write data to request body
    req.write(params);
    req.end();
}

/**
* ������������� ������
**/
function init(db_file, callback){
    var path = '/init';
    var params = 'data=' + db_file;
    var results = '';
    var result = null;
    var options = {
                    hostname: ROUTE_SERVICE_HOSTNAME,
                    port: ROUTE_SERVICE_PORT,
                    path: path,
                    headers: {'Content-type': 'application/x-www-form-urlencoded'},
                    method: 'POST'
                    };
            
    var req = http.request(options, function(res){
        if ( res.statusCode === 200 ){
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    results += chunk;
                });
                res.on('end',function(){
                   result = JSON.parse(results);
                   callback(result); 
                });
        }
        else{
                res.setEncoding('utf8');
                res.on('data', function (chunk) {
                    //console.log(chunk);
                    callback(false);
                });      
        }
        
    });
        
    req.on('error', function(e) {
        console.log('around.init: problem with request: ' + e.message);
    });
    req.write(params);
    req.end();
}


exports.setAround = setAround;
exports.init = init;