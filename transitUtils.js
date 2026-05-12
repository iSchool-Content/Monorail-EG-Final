import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

let _stations = null;
let _schedules = null;

const loadData = async () => {
  if (_stations && _schedules) return { stations: _stations, schedules: _schedules };
  const [stationsRaw, schedulesRaw] = await Promise.all([
    readFile(join(__dirname, 'data', 'stations.json'), 'utf-8'),
    readFile(join(__dirname, 'data', 'schedules.json'), 'utf-8'),
  ]);
  _stations = JSON.parse(stationsRaw);
  _schedules = JSON.parse(schedulesRaw);
  return { stations: _stations, schedules: _schedules };
};

export const getAllStations = async () => {
  const { stations } = await loadData();
  return stations;
};

export const getStationsByLine = async (line) => {
  const { stations } = await loadData();
  return stations.filter(({ line: l }) => l.toLowerCase() === line.toLowerCase());
};

export const getNextDeparture = async (stationName) => {
  const { schedules } = await loadData();
  const schedule = schedules[stationName];
  if (!schedule) return null;
  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isPeak = (currentMinutes >= 420 && currentMinutes <= 540) ||
                 (currentMinutes >= 1020 && currentMinutes <= 1140);
  const times = isPeak ? schedule.peak : schedule.offPeak;
  const next = times.find((t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m > currentMinutes;
  });
  return { station: stationName, next: next ?? times[0], isPeak };
};

export const calculateFare = async (fromName, toName) => {
  const { stations } = await loadData();
  const from = stations.find(({ name }) => name.toLowerCase() === fromName.toLowerCase());
  const to   = stations.find(({ name }) => name.toLowerCase() === toName.toLowerCase());
  if (!from) return { error: `Station "${fromName}" not found` };
  if (!to)   return { error: `Station "${toName}" not found` };
  if (from.line !== to.line) return { error: 'Stations are on different lines — no direct trip available' };
  const fare = 5 + Math.abs(from.zone - to.zone) * 3;
  return { from: from.name, to: to.name, line: from.line, fare, currency: 'EGP' };
};
