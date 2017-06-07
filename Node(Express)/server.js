var express = require('express');
var app = express();
var server =require('http').createServer(app);
var io = require('socket.io').listen(server);
users = [];
connections = [];
chathistory = [];

server.listen(3000);
console.log('Server running ...');
app.get('/',function(request, response){
	response.sendFile(__dirname +'/index.html')
});

io.sockets.on('connection', function(socket){
	connections.push(socket);
	console.log('Connected: %s sockets connected', connections.length );

	//Disconnect
   socket.on('disconnect',function(data){
   	//if(!socket.username) return;
   	users.splice(users.indexOf(socket.username),1);
   	updateUsernames();
    connections.splice(connections.indexOf(socket), 1);
	console.log('Disconnected: %s sockets connected', connections.length);
   });

   //send messages
    socket.on('send message',function(data){
    	//console.log(data);
     
      if(chathistory.length > 10)
      {
        chathistory.splice(0,1);
      }
      else
      {
         chathistory.push(socket.username+": "+data);
      }
    	io.sockets.emit('new message',{msg: data,user: socket.username});
    });
   //New User
   socket.on('new user', function(data,callback){
   	callback(true);
   	socket.username = data;
   	users.push(socket.username);
   	updateUsernames();
    socket.emit('history', chathistory);
   });

   function updateUsernames()
   {
   	io.sockets.emit('get users',{Usr:users});
   }

});