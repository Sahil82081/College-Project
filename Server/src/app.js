const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const route = require('../routes/apiroutes')
dotenv.config();

const app = express();

app.use(cors());

app.use('/api', route)

const server = http.createServer(app);
const roomIds = new Map();
const All_Users = new Map();
const onlineUsers = new Map();
const roomhadles = new Map();


const io = new Server(server, {
    cors: {
        origin: process.env.DOMAIN,
        methods: ['GET', 'POST'],
    },
});

io.on('connection', (socket) => {
    console.log('New client connected:', socket.id);

    socket.on('createroom', async ({ room, roomId, name }) => {
        // const user = await db.User({ name }).save()

        // All_Users.set(user._id, name);
        roomIds.set(roomId, room);
        onlineUsers.set(socket.id, name)
        roomhadles.set(socket.id, room)

        socket.join(room);
        const roomMembers = io.sockets.adapter.rooms.get(room);
        const SocketIds = Array.from(roomMembers);
        const namesInRoom = SocketIds.map(id => ({ name: onlineUsers.get(id), id }));

        console.log(`Client ${socket.id} joined room: ${room}`);
        setTimeout(() => {
            io.to(room).emit('connectedUser', namesInRoom);
        }, 100);
        socket.emit('roomcreated', { room, roomId, name });
    });


    socket.on('joinroom', async ({ roomId, name }) => {
        const roomExists = roomIds.has(roomId);
        console.log(name)
        if (!roomExists) {
            socket.emit('roomnotfound', { msg: "Room not found" });
            return;
        }
        const user = await db.User({ name }).save()

        All_Users.set(user._id, name);
        const room = roomIds.get(roomId)
        onlineUsers.set(socket.id, name)
        roomhadles.set(socket.id, room)

        socket.join(room);
        const roomMembers = io.sockets.adapter.rooms.get(room);
        const SocketIds = Array.from(roomMembers);
        const namesInRoom = SocketIds.map(id => ({ name: onlineUsers.get(id), id }));

        socket.to(room).emit("newUser", name)
        console.log(`Client ${socket.id} joined room: ${room}`);
        socket.emit('roomjoined', { room, roomId, name });

        setTimeout(() => {
            io.to(room).emit('connectedUser', namesInRoom);
        }, 100);
    });



    socket.on('sendmsg', ({ room, msg, image }) => {
        console.log("Recived sent");
        socket.to(room).emit('recivedmsg', { msg, image });
        console.log("Send sent");
    })

    socket.on('userLeave', () => {
        const room = roomhadles.get(socket.id);
        if (!room) return;
        const userName = onlineUsers.get(socket.id);
        if (userName) {
            socket.to(room).emit('userleft', userName);
        }
        socket.leave(room)
        onlineUsers.delete(socket.id);
        roomhadles.delete(socket.id);
        const roomMembers = io.sockets.adapter.rooms.get(room);
        if (!roomMembers) return
        const SocketIds = Array.from(roomMembers);
        const namesInRoom = SocketIds.map(id => ({ name: onlineUsers.get(id), id }));
        io.to(room).emit('connectedUser', namesInRoom);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
        const room = roomhadles.get(socket.id);
        if (!room) return;
        const userName = onlineUsers.get(socket.id);
        if (userName) {
            socket.to(room).emit('userleft', userName);
        }
        onlineUsers.delete(socket.id);
        roomhadles.delete(socket.id);
        const roomMembers = io.sockets.adapter.rooms.get(room);
        if (!roomMembers) return
        const SocketIds = Array.from(roomMembers);
        const namesInRoom = SocketIds.map(id => ({ name: onlineUsers.get(id), id }));
        io.to(room).emit('connectedUser', namesInRoom);
    });

});

server.listen(8000, () => {
    console.log('Server is running on http://localhost:8000');
});
