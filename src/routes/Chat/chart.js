// routes/chat.js
import express from 'express';
import { Server } from 'socket.io';

const chatRouter = express.Router();

const setupSocketConnection = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected');

    // Handle chat events
    socket.on('message', (data) => {
      console.log('Message received:', data);
      io.emit('message', data); // Broadcast the message to all connected clients
    });

    socket.on('disconnect', () => {
      console.log('User disconnected');
    });
  });
};

chatRouter.use((req, res, next) => {
  // Set up Socket.IO connection
  const io = req.app.get('io');
  setupSocketConnection(io);

  next();
});

chatRouter.get('/', (req, res) => {
  res.send('Chat route is working!');
});

export default chatRouter;
