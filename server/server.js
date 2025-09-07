const http = require('http');
const socketio = require('socket.io');
const app = require('./src/routes/app');
const connectDB = require('./src/config/db');
const { port, mongoUri } = require('./src/config/env');
require('./src/jobs/priceSync');

const server = http.createServer(app);
const io = socketio(server, {
  cors: { origin: '*' }
});

// 🔌 WebSocket connection logic
io.on('connection', socket => {
  const { userId, role } = socket.handshake.query;

  if (role === 'admin') socket.join('admin');
  if (role === 'seller') socket.join(`seller:${userId}`);

  console.log(`🟢 ${role} connected: ${socket.id}`);

  socket.on('disconnect', () => {
    console.log(`🔴 Disconnected: ${socket.id}`);
  });
});

// 🧠 Attach io to global scope or export for use in controllers
global.io = io;

(async () => {
  try {
    await connectDB(mongoUri);
    server.listen(port, () => {
      console.log(`🚀 API + WebSocket running on http://localhost:${port}`);
    });
  } catch (err) {
    console.error('❌ Server startup failed:', err.message);
  }
})();

