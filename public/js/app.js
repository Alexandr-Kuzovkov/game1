var App = {};



App.init = function(){
    App.user = null;
    App.game = null; /*переменная для хранения клиентского объекта game*/
    App.interval = null; /*интервал обновления клиента и сервера*/
    App.lib = L;
    App.socket = Socket;
    App.map = Map;
    App.io = io;
    App.user = new User(Helper.getCookie('user_id'),'noname');/*клиентский объект user*/      
    App.map.init(App.lib);
    App.socket.init(App);
    UnitFactory.init(App.map, Unit, UnitTypes, Countries);
    
};