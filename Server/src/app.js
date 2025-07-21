// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(cors());

const server = http.createServer(app);
const roomIds = new Map();
const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('createroom', ({ room, roomId }) => {
        roomIds.set(roomId, room);
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
        socket.emit('roomJcreated', { room, roomId });
    });

    socket.on('joinroom', ({ roomId }) => {
        const roomExists = roomIds.has(roomId);
        if (!roomExists) {
            socket.emit('roomnotfound', { msg: "Room not found" });
            return;
        }
        const room = roomIds.get(roomId);
        socket.join(room);
        console.log(`Client ${socket.id} joined room: ${room}`);
        socket.emit('roomjoined', { room, roomId });
    });


    socket.on('sendmsg', ({ room, roomid, msg, image }) => {

        socket.to(room).emit('recivedmsg', { msg, image });
    })

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
    });
});

console.log(process.env.DOMAIN)
server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
