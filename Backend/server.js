import http from 'http';
import app from './src/app.js';
import { config } from 'dotenv';
import connectDB from './src/db/db.js';

config();

const PORT = process.env.PORT || 3000;

async function start() {
  await connectDB();
  const server = http.createServer(app);
  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start().catch(err => {
  console.error('Startup failed:', err);
  process.exit(1);
});