const express = require('express');
const dotenv = require('dotenv');
const { getAllStations } = require('./stationUtils');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Logger middleware
function logger(req, res, next) {
  console.log(req.method + ' ' + req.url);
  next();
}

app.use(logger);

// GET /stations - return all stations
app.get('/stations', (req, res) => {
  const stations = getAllStations();
  res.json({ count: stations.length, stations: stations });
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
  console.log('Monorail EG server running on http://localhost:' + PORT);
});
