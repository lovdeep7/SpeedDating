var express = require('express');

var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var PORT = process.env.PORT || 8080;
var PubNub = require('pubnub');
var ChatEngineCore = require('chat-engine');

pubnub = new PubNub({
    publishKey : 'pub-c-aa2fae1a-62d7-4876-a246-0bc97371ebb7',
    subscribeKey : 'sub-c-9661615a-281b-11e9-9ee5-ae9cce607226'
})

ChatEngine = ChatEngineCore.create({
    subscribeKey: 'pub-c-aa2fae1a-62d7-4876-a246-0bc97371ebb7',
    publishKey: 'sub-c-9661615a-281b-11e9-9ee5-ae9cce607226'
});

let meUser = ChatEngine.connect('Me');

users = [];
client = [];
var timer;
var roomNum ;

app.use(express.static(__dirname));


app.get('/',function(req,res){
	res.sendFile(__dirname + '/home.html');
});

app.get('/create', function(req,res){
	res.redirect('/client.html');
});

io.on('connection', function(socket){

	socket.on('disconnect',function(){
		
	});
	socket.on('setUser', function(data){
		if(users.indexOf(data.name) > -1){	// name user cannot be found
			socket.emit('userExists', data.name + ' username is taken! Try some other username.');
		}
		else{
			// age-based selection
			if  (data.age < 18 ){
				if(data.gender == "Male") {
					roomNum = Math.floor((Math.random() * 3)+1);
				}
				else{
					roomNum = 2;
				}
			}
			else {
				if (data.gender == "Male"){
					roomNum = Math.floor((Math.random() * 10) + 4);
				}
				else if(data.gender == "Female"){
					roomNum = Math.floor((Math.random() * 5)+2)*2;
				}
			}
			while (io.nsps['/'].adapter.rooms["room-"+roomNum] && io.nsps['/'].adapter.rooms["room-"+roomNum].length == 2){
				if  (data.age < 18 ){
					if(data.gender == "Male") {
						roomNum = Math.floor((Math.random() * 2))+1;
					}
					else{
						roomNum = 2;
					}
				}
				else {
					if (data.gender == "Male"){
						roomNum = Math.floor((Math.random() * 10) + 4);
					}
					else if(data.gender == "Female"){
						roomNum = Math.floor((Math.random() * 5)+2)*2;
					}
				}
			}
			data.room = roomNum; 
			socket.join("room-"+roomNum);
			users.push(data);	// push to Array
			client.push(socket);
			
			socket.emit('userSet', users[users.length-1]);	// send message to room
			
			if (io.nsps['/'].adapter.rooms["room-"+roomNum].length == 2 ){
				console.log("Timer started");
				for (var i in client){
					if (users[i].room == roomNum){
						client[i].emit('timer' , users[i] );
						
					}
				}

			}
			
			
		}
	});
	socket.on('msg', function(data){
      //Send message to everyone in room
      io.sockets.in("room-"+data.room).emit('newmsg', data);
	});
	
	socket.on('leftRoom',function(data){
		
		var index;
		for (var i in client){
			if (users[i].room == data.room){
				clearTimeout(client[i].timer);
				
			}
		}
		
		io.sockets.in("room-"+data.room).emit('newmsg', {message: " disconnected" , name : data.name});
		
		// delete user
		index = users.indexOf(data.name);
		users.splice(index,1);
		client.splice(index,1);
		socket.emit('reset','');
		socket.leave("room-"+data.room);
		


	});
	socket.on('timeout',function(data){
		var index;
		// delete user after timer ended
		timer = setTimeout(function(){
			index = users.indexOf(data.name);
			users.splice(index,1);
			client.splice(index,1);
			socket.emit('reset','');
			socket.leave("room-"+data.room);
		},7000)	// wait 7 seconds
	});

});

http.listen(PORT,function(){
	console.log('Listening on port: ',PORT);
});