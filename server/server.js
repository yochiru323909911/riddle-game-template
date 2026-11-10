import express from 'express';
import riddlesRouter from './routes/riddles.js';
import playersRouter from './routes/players.js';

const app = express();

app.use(express.json());
app.use('/api/riddles', riddlesRouter);
app.use('/api/players', playersRouter);

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const server = app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});

// prompt-sync blocks the client while the player types. Keep the socket open
// so the next request is not reset after that pause.
server.keepAliveTimeout = 60 * 60 * 1000;
server.headersTimeout = 60 * 60 * 1000 + 1000;
