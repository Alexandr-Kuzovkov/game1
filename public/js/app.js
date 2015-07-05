var App = {};

App.init = function(){
    App.interval = null; /*�������� ���������� ������� � �������*/
    App.maplib = L;
    App.io = io;
    App.socket = Socket;
    App.map = Map;
    App.iface = Interface;
    App.unitTypes = UnitTypes;
    App.countries = Countries;
    App.joinUser = JoinUser;
    App.unit = Unit;
    App.unitFactory = UnitFactory;
    App.unitEvent = UnitEvent;
    App.user = new User(Helper.getCookie('user_id'),'noname');/*���������� ������ user*/      
    App.game = new Game(App.user);/*���������� ��� �������� ����������� ������� game*/
    App.route = Route;
    
    App.map.init(App);  
    App.socket.init(App);
    App.unitFactory.init(App);
    App.unitEvent.init(App);
    if (App.joinUser) App.joinUser.init(App);
    App.iface.init(App);
    App.route.init(App);
};