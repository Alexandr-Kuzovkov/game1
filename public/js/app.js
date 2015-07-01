var App = {};



App.init = function(){
    App.user = null;
    App.game = null; /*���������� ��� �������� ����������� ������� game*/
    App.interval = null; /*�������� ���������� ������� � �������*/
    App.lib = L;
    App.socket = Socket;
    App.map = Map;
    App.io = io;
    App.user = new User(Helper.getCookie('user_id'),'noname');/*���������� ������ user*/      
    App.game = new Game(App.user);
    App.map.init(App.lib);
    App.socket.init(App);
    App.iface = Interface;
    App.iface.init();
    UnitFactory.init(App.map, Unit, UnitTypes, Countries);
    
};