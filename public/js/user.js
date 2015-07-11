/**
* конструктор объекта User
* @param id игрока
* @param name имя игрока 
**/
function User(id,name){
    /*свойства*/
    this.id = id;
    this.name = name; /*имя*/
    this.gameId = 0; /* id игры*/
    this.lastTime = 0; /*время поступления сигнала от аользователя*/
    
    /**
    * преобразование в объект, который можно преобразовать в строку
    **/
    this.toString = function(){
        return { id: this.id, name: this.name, gameId: this.gameId, lastTime: this.lastTime };  
    };
    
}