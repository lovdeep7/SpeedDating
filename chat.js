var ChatEngineCore = require('chat-engine');

ChatEngine = ChatEngineCore.create({
	subscribeKey: 'subKey',
	publishKey: 'pubKey'
});

var el = document.getElementById('server-time');
	
ChatEngine.on('time', function (timeString) {
	el.innerHTML = 'Server time: ' +timeString;
});

var errorMsg;
var name;
var age;
var gender;
var login = '<div id="error-container" ></div><div style="text-align:center"><ul style="list-style-type: none;" ><li><input id="name" type="text" name="name" value="" placeholder="Enter your Name!" ></li><li><input id="age" type="text" name="age" value="" placeholder="Enter your Age!" ></li><li><input id="gender" type="text" name="gender" value="" placeholder="Enter your Gender!" ></li></ul><button type="button" name="button" onclick="setUser()">Start chating!</button></div>'


function setUser(){	// set username event listener 
	name = document.getElementById('name').value;
	age = document.getElementById('age').value;
	gender = document.getElementById('gender').value;
	ChatEngine.emit('setUser', {name:name , age:age, gender:gender});
};
function disconnect(){
	ChatEngine.emit('leftRoom', {name: name, room: room});	
	reset();			
}
var user;
var room;

ChatEngine.on('userExists', function(data){// if server says user name exists
	errorMsg = 'Error: ' + data;
    document.getElementById('error-container').innerHTML = errorMsg;		
});

ChatEngine.on('userSet', function(data){

    name = data.name; /*set user to data.user name*/
	room = data.room;
	
    document.body.innerHTML = '<input type="text" id="message">\
    <button type="button" name="button" onclick="sendMessage()">Send</button><button type="button" name="disconnect" onclick="disconnect()">Disconnect</button>\
    <div id="message-container"></div>';	// replace with input tag
	document.getElementById('message-container').innerHTML += '<div> Your room is ' + room + '</div>';
	sendJoinedMessage();
});

function sendMessage(){
    var msg = document.getElementById('message').value;
    if(msg){
        ChatEngine.emit('msg', {message: msg, name: name, room: room});
    }
	document.getElementById('message').value = '';
}

function sendJoinedMessage(){
	var msg = 'joined';
	ChatEngine.emit('msg', {message: msg, name: name, room: room});	
}

ChatEngine.on('newmsg', function(data){
	if(data.message === "disconnected"){
		document.getElementById('message-container').innerHTML += '<div><b>' + data.name + '</b>: ' + data.message + '</div>';
		
	}
    else if(name){
		// add new line for new message
        document.getElementById('message-container').innerHTML += '<div><b>' + data.name + '</b>: ' + data.message + '</div>';
    }
})
function reset(){
	document.body.innerHTML = login;
}}