import express from 'express';
import { createServer } from 'http';
import {Server as socketIO} from 'socket.io';
import cors from 'cors';

const app = express();
app.use(cors()); 

app.get('/',(req,res)=>{
  res.send('SERVER RUNNING.......');
})
const server = createServer(app);
const io = new socketIO(server,{
  cors: {
    origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
    methods: ["GET", "POST"]
  }
});

// Enable CORS for all routes

const userTimers = {}; // Store individual timers for each user

io.on('connection', (socket) => {
  console.log('A user connected');

  const userId = socket.handshake.query.userId;

  // Send the initial timer value to the newly connected client
  if (!userTimers[userId]) {
    userTimers[userId] = 0;
  }
  socket.emit('timer', userTimers[userId]);

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });

  socket.on('endTest', () => {

    userTimers[userId] = 0;

    io.emit('timer', userTimers[userId]);
  });
});

const PORT = 3002;
server.listen(PORT, () => {
  console.log(`Socket server is running on http://localhost:${PORT}`);
});
