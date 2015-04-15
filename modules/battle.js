/**
* ������ ��������� �������������� ������
**/

/**
* ��������� ��� ����� �������
* @param game ������ ����
**/
function perform(game){
    /*��� �����*/
    var battle = false;
    for ( var i = 0; i < game.regiments.length; i++ ){
        battle = false;
        var enemyCount = 0;
        /*� ������*/
        for ( var j = 0; j < game.regiments.length; j++ ){
            if ( i != j && game.regiments[i].country.id != game.regiments[j].country.id ){
                if ( checkContact(game.regiments[i], game.regiments[j]) ){
                    battle = true;
                    enemyCount++;
                    /*����������� ���������� ��� ��� ������*/
                    var powerBattle = getPowerBattle(game.regiments[i], game.regiments[j]);
                    var enemyPower = getPower(game.regiments[j], powerBattle);
                    makeDamage(game.regiments[i], enemyPower);
                    ammoGoOut(game.regiments[i], powerBattle);
                    addExperience(game.regiments[i], powerBattle);  
                }
                    
            }
        }
        /*� �����*/
        for ( var j = 0; j < game.bases.length; j++ ){
            if ( game.regiments[i].country.id != game.bases[j].country.id ){
                if ( checkContact(game.regiments[i], game.bases[j]) ){
                    battle = true;
                    enemyCount++;
                    /*����������� ���������� ��� ��� ����� ������*/
                    var powerBattle = getPowerBattle(game.regiments[i], game.bases[j]);
                    var enemyPower = getPower(game.bases[j], powerBattle);
                    makeDamage(game.regiments[i], enemyPower);
                    ammoGoOut(game.regiments[i], powerBattle);
                    addExperience(game.regiments[i], powerBattle); 
                }     
            }
        }
        /*�������� �������� ���������*/
        if ( battle != game.regiments[i].battle ){
            if ( battle ){
                 game.addGameMessage(game.gameMsgText('beginBattle',game.regiments[i]));
            } else{
                game.addGameMessage(game.gameMsgText('endBattle',game.regiments[i]));
            }
        }
            
        game.regiments[i].battle = battle;
        game.regiments[i].enemyCount = enemyCount; /*��������� ���������� ����������� � �����*/
        /*��������� ���������� � ������ ��������*/
        
        resourcesOutGo(game.regiments[i]);
        resourcesInGo(game.regiments[i]);
        
    }
    
    /*��� ����*/
    for ( var i = 0; i < game.bases.length; i++ ){
        battle = false;
        var enemyCount = 0;
        var country = game.bases[i].country;
        /*� �����*/
        for ( var j = 0; j < game.bases.length; j++ ){
            if ( i != j && game.bases[i].country.id != game.bases[j].country.id ){
                if ( checkContact(game.bases[i], game.bases[j]) ){
                    battle = true;
                    enemyCount++;
                    /*����������� ���������� ��� ��� ������*/
                    var powerBattle = getPowerBattle(game.bases[i], game.bases[j]);
                    var enemyPower = getPower(game.bases[j], powerBattle);
                    makeDamage(game.bases[i], enemyPower);
                    ammoGoOut(game.bases[i], powerBattle);  
                }     
            }
        }
        /*� ������*/
        for ( var j = 0; j < game.regiments.length; j++ ){
            if ( game.bases[i].country.id != game.regiments[j].country.id ){
                if ( checkContact(game.bases[i], game.regiments[j]) ){
                    battle = true;
                    enemyCount++;
                    /*����������� ���������� ��� ���  ������*/
                    var powerBattle = getPowerBattle(game.bases[i], game.regiments[j]);
                    var enemyPower = getPower(game.regiments[j], powerBattle);
                    makeDamage(game.bases[i], enemyPower);
                    ammoGoOut(game.bases[i], powerBattle);
                    country = game.regiments[j].country;
                }
            }
        }
        /*�������� �������� ���������*/
        if ( battle != game.bases[i].battle ){
            
            if ( battle ){
                game.addGameMessage(game.gameMsgText('beginBattle',game.bases[i]));
            } else{
                game.addGameMessage(game.gameMsgText('endBattle',game.bases[i]));
            }
        }
        game.bases[i].battle = battle;
        game.bases[i].enemyCount = enemyCount; /*��������� ���������� ����������� � �����*/
        /*��������� ���������� � ������ ��������*/
        
        resourcesOutGo(game.bases[i]);
        resourcesInGo(game.bases[i]);
    }
};

/**
* ���������� ������������� ��� ����� ����� �������
* � ����������� �� ���������
* @param unit1, unit2 ������� ������
* @return ����� 0-1 ������������� ���
**/
function getPowerBattle(unit1,unit2){
    var dot1 = unit1.latlng;
    var dot2 = unit2.latlng;
    var r1 = unit1.type.radius;
    var r2 = unit2.type.radius;
    var R = rastGrad(dot1,dot2);
    if ( R >= r1+r2 ) return 0;
    if ( R <= Math.min(r1,r2) ) return 1;
    return  1 - ( R - Math.min(r1,r2)) / (r1 + r2 - Math.min(r1,r2));
};


/**
* �������� ��� 2 ����� ���������� �� ���������� ��������
* @param unit1, unit2 ������� ������
* @return true/false ���/�� ���
**/
function checkContact(unit1,unit2){
    var dot1 = unit1.latlng;
    var dot2 = unit2.latlng;
    var r1 = unit1.type.radius;
    var r2 = unit2.type.radius;
    var R = rastGrad(dot1,dot2);
    return ( R < ( r1 + r2 ) )? true : false;
};

/**
* ������ ������ ���� (���� ��������� ���������� �� 1 ����)
* @param unit ������ �����
* @param powerBattle ������������� ���
**/
function getPower(unit, powerBattle){
    var enemyCountCoff = (unit.enemyCount == 0)? 1 : unit.enemyCount;
    var res = unit.type.resources;
    var power =  (1/enemyCountCoff) * powerBattle * unit.type.power * res.men/100 * res.ammo/100 * res.food/100;
    if ( res.discipline != undefined && res.experience != undefined ){
        power = power * ( 0.8 + 0.2 * res.discipline) * ( 0.8 + 0.2 * res.experience);
    }
     
    return ( unit.status.kind == 'march' )? power * unit.status.attack_coff : power; 
};

/**
* ��������� ���� ����� ��������� ����������� 
* @param unit ������ �����
* @param power ���� ����� ����������
**/
function makeDamage(unit, power){
    var damage = ( unit.status.kind == 'defense' )? power * unit.status.defense_coff : power;
    unit.type.resources.men -= damage;
    unit.type.resources.food -= damage;
};

/**
* ��������� ������ ����������� ����� �� 1 ���� �� ������ ����������
* @param unit ������ �����
* @param powerBattle ������������� ���
**/
function ammoGoOut(unit, powerBattle){
     var enemyCountCoff = (unit.enemyCount == 0)? 1 : unit.enemyCount;
    if ( unit.battle ){
        unit.type.resources.ammo -= unit.type.cycle.ammoOutGo * powerBattle / enemyCountCoff;
    }
    if ( unit.type.resources.ammo < 0 ) unit.type.resources.ammo = 0;
};

/**
* ��������� ���������� �������� ����� �� 1 ����
* @param unit ������ �����
**/
function resourcesInGo(unit){
    if ( !unit.around ){
        if ( unit.type.resources.ammo < 100 ){
            unit.type.resources.ammo += unit.type.cycle.ammoInGo;
            unit.type.resources.ammo = (unit.type.resources.ammo < 100)? unit.type.resources.ammo : 100;
        }
        
        if ( unit.type.resources.food < 100 ){
            unit.type.resources.food += unit.type.cycle.foodInGo;
            unit.type.resources.food = (unit.type.resources.food < 100)? unit.type.resources.food : 100;
        }
        
        if ( unit.type.resources.men < 100 ){
            unit.type.resources.men += unit.type.cycle.menInGo;
            unit.type.resources.men = (unit.type.resources.men < 100)? unit.type.resources.men : 100;
        }
    } 
};

/**
* ��������� ������ �������� ����� �� 1 ����
* @param unit ������ �����
**/
function resourcesOutGo(unit){
    if ( unit.type.resources.food > 0 ){
        unit.type.resources.food -= unit.type.cycle.foodOutGo;
        unit.type.resources.food = (unit.type.resources.food >= 0)? unit.type.resources.food : 0;
    }
};

/**
* ��������� ���� ������� ����� ����� �� 1 ����
* @param unit ������ �����
* @param powerBattle ������������� ��� 
**/
function addExperience(unit, powerBattle){
    if ( unit.type.resources.experience < 1 ){
        unit.type.resources.experience += powerBattle * 0.005;
        unit.type.resources.experience = (unit.type.resources.experience <= 1)? unit.type.resources.experience : 1;
    }
};


/**
* ���������� ���������� �� �����
* @param do1,dot2 �����, �������� ��������� ���������� [lat,lng]
**/
function rast(dot1,dot2){
/**pi - ����� pi, rad - ������ ����� (�����)**/
    var rad = 6372795;

	/**���������� ���� �����**/
	var llat1 = dot1[0];
	var llong1 = dot1[1];

	var llat2 = dot2[0];
	var llong2 = dot2[1];

	/**� ��������**/
	var lat1 = llat1*Math.PI/180;
	var lat2 = llat2*Math.PI/180;
	var long1 = llong1*Math.PI/180;
	var long2 = llong2*Math.PI/180;

	/**�������� � ������ ����� � ������� ������**/
	var cl1 = Math.cos(lat1)
	var cl2 = Math.cos(lat2)
	var sl1 = Math.sin(lat1)
	var sl2 = Math.sin(lat2)
	var delta = long2 - long1
	var cdelta = Math.cos(delta)
	var sdelta = Math.sin(delta)

	/**���������� ����� �������� �����**/
	var y = Math.sqrt(Math.pow(cl2*sdelta,2)+Math.pow(cl1*sl2-sl1*cl2*cdelta,2))
	var x = sl1*sl2+cl1*cl2*cdelta
	var ad = Math.atan2(y,x)
	var dist = ad*rad
	return dist;
}

/**
* ���������� ���������� �� �����  � ��������
* @param do1,dot2 �����, �������� ��������� ���������� [lat,lng]
**/
function rastGrad(dot1,dot2){
/**pi - ����� pi, rad - ������ ����� (�����)**/
    var rad = 6372795

	/**���������� ���� �����**/
	var llat1 = dot1[0];
	var llong1 = dot1[1];

	var llat2 = dot2[0];
	var llong2 = dot2[1];

	/**� ��������**/
	var lat1 = llat1*Math.PI/180;
	var lat2 = llat2*Math.PI/180;
	var long1 = llong1*Math.PI/180;
	var long2 = llong2*Math.PI/180;

	/**�������� � ������ ����� � ������� ������**/
	var cl1 = Math.cos(lat1)
	var cl2 = Math.cos(lat2)
	var sl1 = Math.sin(lat1)
	var sl2 = Math.sin(lat2)
	var delta = long2 - long1
	var cdelta = Math.cos(delta)
	var sdelta = Math.sin(delta)

	/**���������� ����� �������� �����**/
	var y = Math.sqrt(Math.pow(cl2*sdelta,2)+Math.pow(cl1*sl2-sl1*cl2*cdelta,2))
	var x = sl1*sl2+cl1*cl2*cdelta
	var ad = Math.atan2(y,x)
	var dist = ad*180/Math.PI;
	return dist;
}

exports.perform = perform;