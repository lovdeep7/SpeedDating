var express = require('express');

var app = express();
var http = require('http').Server(app);
var ChatEngineCore = require('chat-engine');

ChatEngine = ChatEngineCore.create({
    subscribeKey: 'subKey',
    publishKey: 'pubKey'
});

var PORT = process.env.PORT || 8080;

users = [];
client = [];
var timer;
var roomNum ;

app.use(express.static(__dirname));


app.get('/',function(req,res){
	res.sendFile(__dirname + '/main_page.html');
});

app.get('/create', function(req,res){
	res.redirect('/client.html');
});


// ChatEngine implementation

let meUser = ChatEngine.connect('Me');

ChatEngine.on('$.ready', (payload) => {
	let me = payload.me;
		chat.on('$.offline.*', (payload) => {
		console.log('User left the room:', payload.user);
	})
	if(users.indexOf(payload.user) > -1) {
		chat.emit('userExists', payload.name + ' username is taken! Try some other username.');
	}
	else {
		// choose based on age
		if (payload.age < 18) {
			if(payload.gender == "Male") {
				roomNum = Math.floor((Math.random() * 3) +1);
			}
			else {
				roomNum = 2;
			}
		}
		else {
			if (payload.gender == "Male") {
				roomNum - Math.floor((Math.random() *10) + 4);
			}
			else if (payload.gender == "Female") {
				roomNum = Math.floor((Math.random() *5)+1)*2;
			}
		}
		while (ChatEngine.chats["room-"+roomNum] && ChatEngine.chats["room-"+roomNum].length == 2){
			if  (payload.age < 18 ){
				if(payload.gender == "Male") {
					roomNum = Math.floor((Math.random() * 2))+1;
				}
				else{
					roomNum = 2;
				}
			}
			else {
				if (payload.gender == "Male"){
					roomNum = Math.floor((Math.random() * 10) + 4);
				}
				else if(payload.gender == "Female"){
					roomNum = Math.floor((Math.random() * 5)+2)*2;
				}
			}
		}
		payload.room = roomNum; 
		let chatRoom = new ChatEngine.Chat("room-"+roomNum);
		chatRoom.connect();
		users.push(payload);	// push to Array
		client.push(chatRoom);
		
		chatRoom.emit('userSet', users[users.length-1]);
			
		if (ChatEngine.chats["room-"+roomNum].length == 2 ){
			console.log("Timer started");
			for (var i in client){
				if (users[i].room == roomNum){
					console.log(users[i]);
					client[i].emit('timer', users[i] );
						
				}
			}

		}
	}
	chatRoom.on('msg', function(data){ // %.join
      //Send message to everyone in room
      chatRoom.emit('newmsg', data);
	  console.log(users);
	});
	
	chatRoom.on('$.offline.leave',function(data){
		var index;
		for (var i in client){
			if (users[i].room == data.room){
				clearTimeout(client[i].timer);
			}
		}
		chatRoom.emit('newmsg', {message: " disconnected", name: data.name});
		
		// delete user
		index = users.indexOf(data.name);
		users.splice(index,1);
		client.splice(index,1);
		chatRoom.emit('reset','');
		chatRoom.leave();
		


	});
	chatRoom.on('timeout', function(data){
		var index;
		timer = setTimeout(function(){
			index = users.indexOf(data.name);
			users.splice(index,1);
			client.splice(index,1);
			chatRoom.emit('reset','');
			chatRoom.leave();
		},7000)	// wait 7 seconds
	});
})



http.listen(PORT,function(){
	console.log('Listening on port: ',PORT);
});

