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
    App.map.init(App.lib);
    App.socket.init(App);
    UnitFactory.init(App.map, Unit, UnitTypes, Countries);
    
};