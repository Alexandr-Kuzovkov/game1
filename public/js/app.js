var App = {};

App.init = function(){
    App.interval = null; /*�������� ���������� ������� � �������*/
    App.maplib = L;
    App.socket = Socket;
    App.socket.init(App);
    App.map = Map;
    App.map.init(App);
    App.io = io;
    App.unit = Unit;
    App.unitTypes = UnitTypes;
    App.countries = Countries;
    App.user = new User(Helper.getCookie('user_id'),'noname');/*���������� ������ user*/      
    App.game = new Game(App.user);/*���������� ��� �������� ����������� ������� game*/  
    App.iface = Interface;
    App.iface.init(App);
    App.unitFactory = UnitFactory;
    app.unitFactory.init(App);
    App.unitEvent = UnitEvent;
    App.unitEvent.init(App);
    App.joinUser = JoinUser;
    if (App.joinUser) App.joinUser.init(App);
    App.route = Route;
    App.route.init(App);
    
};