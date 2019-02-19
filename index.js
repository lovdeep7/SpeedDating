var app = require('express')();
var http = require('http').Server(app);
var PORT = process.env.PORT || 8080;
var ChatEngineCore = require('chat-engine');
ChatEngine = ChatEngineCore.create({
    subscribeKey: 'subKey',
    publishKey: 'pubKey'
});

app.get('/',function(req,res){
	res.sendFile(__dirname + '/home.html');
});

let meUser = ChatEngine.connect('Me');

ChatEngine.on('$.ready', (data) => {
    let me = data.me;
    let chatRoom = new ChatEngine.Chat("room 1");
	var room = 'room 1';
	chatRoom.on('message',function(msg){
		chatRoom.emit('message',msg,'');
	});

	chatRoom.on('$.offline.*',function(){
		console.log("User disconnected",'');
	});
	ChatEngine.on('change channel',function(newChannel){
		chatRoom.leave();
		let newChatRoom = new ChatEngine.Chat(newChannel);
		newChatRoom.connect();
		room = newChannel;
		newChatRoom.emit('change channel',newChannel);
	});
});

http.listen(PORT,function(){
	console.log('Listening on port: ',PORT);
});