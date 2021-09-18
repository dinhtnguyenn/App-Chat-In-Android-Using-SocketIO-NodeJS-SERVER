const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
server.listen(3000);

var listUser = {};

//mở kết nối phía server nodeJS
io.sockets.on('connection', function (socket) {
	
    console.log("user connect");

    //tạo socketID cho người gửi tin nhắn
    socket.on('login', function (data) {
      listUser[data] = socket.id;
      console.log("sender: " + socket.id);
    });

    //gửi message đến người nhận
    socket.on('send_message', function(message){
        var info = JSON.parse(message);
        var receiverId = listUser[info.Receiver];
        var messageData = info.Content;

        socket.broadcast.to(receiverId).emit('receiver_message', {user: info.Receiver, content: messageData});

        console.log("message: " + info.Receiver + " - " + messageData);
    });
    
});
  