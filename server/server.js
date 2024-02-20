const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors());
const server = http.createServer(app);
const io = new Server(server, {
	cors: {
		origin: '*',
		methods: ['GET', 'POST'],
	},
});

io.on('connection', (socket) => {
	console.log('A user connected', socket.id);
	socket.on('register', (data) => {
		console.log(`User registerd: ${data.userId}`);
		socket.userId = data.userId;
	});
	socket.on('progress', (data) => {
		console.log(`User ${data.userId} progress: ${data.progress}`);

		socket.broadcast.emit('progress', data);
	});
	socket.on('disconnect', () => {
		console.log('disconnected: ', socket.id);
	});
});

server.listen(3000, () => {
	console.log('Listening on *: 3000');
});
