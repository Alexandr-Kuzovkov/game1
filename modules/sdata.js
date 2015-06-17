/*модуль для хранения серверных объектов game и user*/
var Game = require('./game').Game; 
var User = require('./user').User;
var parameters = require('./parameters').parameters;

var games = {}; /*объект для хранения объектов game*/
var users = {}; /*объект для хранения объектов user*/


exports.games = games;
exports.users = users;
exports.Game = Game;
exports.User = User;