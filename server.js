import express from 'express';
import dotenv from 'dotenv';
import { getAllStations } from './stationUtils.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function logger(req, res, next) {
  console.log(`${req.method} ${req.url}`);
  next();
}

app.use(logger);

app.get('/stations', (req, res) => {
  const stations = getAllStations();
  res.json({ count: stations.length, stations });
});

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`Monorail EG server running on http://localhost:${PORT}`);
});
