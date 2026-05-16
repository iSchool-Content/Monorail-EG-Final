import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const BASE_FARE = 5;
const PER_ZONE = 3;

let _stations = null;
let _schedules = null;

async function loadData() {
  if (_stations !== null && _schedules !== null) {
    return { stations: _stations, schedules: _schedules };
  }

  const stationsRaw = await readFile(join(__dirname, 'data', 'stations.json'), 'utf-8');
  const schedulesRaw = await readFile(join(__dirname, 'data', 'schedules.json'), 'utf-8');

  _stations = JSON.parse(stationsRaw);
  _schedules = JSON.parse(schedulesRaw);

  return { stations: _stations, schedules: _schedules };
}

export async function getAllStations() {
  const data = await loadData();
  return data.stations;
}

export async function getStationsByLine(lineName) {
  const data = await loadData();
  const result = [];

  for (const station of data.stations) {
    if (station.line.toLowerCase() === lineName.toLowerCase()) {
      result.push(station);
    }
  }

  return result;
}

export async function getNextDeparture(stationName) {
  const data = await loadData();
  const schedule = data.schedules[stationName];

  if (schedule === undefined) {
    return null;
  }

  const now = new Date();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  const isMorningPeak = currentMinutes >= 420 && currentMinutes <= 540;
  const isEveningPeak = currentMinutes >= 1020 && currentMinutes <= 1140;
  const isPeak = isMorningPeak || isEveningPeak;

  let times;
  if (isPeak) {
    times = schedule.peak;
  } else {
    times = schedule.offPeak;
  }

  let nextTime = null;
  for (const time of times) {
    const parts = time.split(':');
    const hours = Number(parts[0]);
    const minutes = Number(parts[1]);
    if (hours * 60 + minutes > currentMinutes) {
      nextTime = time;
      break;
    }
  }

  if (nextTime === null) {
    nextTime = times[0];
  }

  return { station: stationName, next: nextTime, isPeak: isPeak };
}

export async function calculateFare(fromName, toName) {
  const data = await loadData();

  let fromStation = null;
  let toStation = null;

  for (const station of data.stations) {
    if (station.name.toLowerCase() === fromName.toLowerCase()) {
      fromStation = station;
    }
    if (station.name.toLowerCase() === toName.toLowerCase()) {
      toStation = station;
    }
  }

  if (fromStation === null) {
    return { error: `Station "${fromName}" not found` };
  }

  if (toStation === null) {
    return { error: `Station "${toName}" not found` };
  }

  if (fromStation.line !== toStation.line) {
    return { error: 'Stations are on different lines — no direct trip available' };
  }

  const fare = BASE_FARE + Math.abs(fromStation.zone - toStation.zone) * PER_ZONE;

  return {
    from: fromStation.name,
    to: toStation.name,
    line: fromStation.line,
    fare: fare,
    currency: 'EGP',
  };
}
