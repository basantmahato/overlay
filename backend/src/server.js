require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const socketHandler = require('./sockets/socketHandler');


const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// Attach io to app for access in controllers
app.set('socketio', io);

// Setup Socket logic
socketHandler(io);

// Check DB Connection
const prisma = require('./config/prisma');
prisma.$connect()
  .then(() => {
    console.log('✔ Connected to PostgreSQL Database');
  })
  .catch((err) => {
    console.error('✘ Database connection failed:', err.message);
  });

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
