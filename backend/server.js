import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import dotenv from 'dotenv';

import memeRoutes from './routes/memeRoutes.js';
import createBidRouter from './routes/bidRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use((req, res, next) => {
    req.io = io;
    next();
})

app.use(cors());
app.use(express.json());

app.use('/api/memes', memeRoutes);
app.use('/api/memes', createBidRouter(io));

io.on('connection', (socket) => {
  console.log('New user connected:', socket.id);
  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
