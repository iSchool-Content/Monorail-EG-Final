import { readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_FARE = 5;
const PER_ZONE = 3;

export function getAllStations() {
  return JSON.parse(readFileSync(join(__dirname, 'data', 'stations.json'), 'utf8'));
}

export function getStationsByLine(lineName) {
  return getAllStations().filter(s => s.line.toLowerCase() === lineName.toLowerCase());
}

export function calculateFare(fromName, toName) {
  const stations = getAllStations();

  const fromStation = stations.find(s => s.name.toLowerCase() === fromName.toLowerCase());
  const toStation   = stations.find(s => s.name.toLowerCase() === toName.toLowerCase());

  if (!fromStation) return { error: `Station "${fromName}" not found` };
  if (!toStation)   return { error: `Station "${toName}" not found` };
  if (fromStation.line !== toStation.line) return { error: 'These stations are on different lines' };

  const fare = BASE_FARE + Math.abs(fromStation.zone - toStation.zone) * PER_ZONE;

  return {
    from: fromStation.name,
    to: toStation.name,
    line: fromStation.line,
    fare,
    currency: 'EGP',
  };
}
