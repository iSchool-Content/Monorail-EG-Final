import { getAllStations, getStationsByLine, calculateFare } from './stationUtils.js';

const args = process.argv.slice(2);
const cmd = args[0];

if (!cmd) {
  console.log('Monorail EG - Cairo Monorail CLI');
  console.log('');
  console.log('Commands:');
  console.log('  node monorail.js stations              List all stations');
  console.log('  node monorail.js line <name>           Stations on a line');
  console.log('  node monorail.js fare <from> <to>      Calculate fare');
  process.exit(0);
}

if (cmd === 'stations') {
  const stations = getAllStations();
  console.log('All stations (' + stations.length + ' total):');
  console.log('');

  for (const station of stations) {
    console.log('  ' + station.name + ' | Line: ' + station.line + ' | Zone: ' + station.zone);
  }
}

else if (cmd === 'line') {
  const lineName = args[1];

  if (!lineName) {
    console.log('Please provide a line name.');
    console.log('Example: node monorail.js line NAC');
    process.exit(1);
  }

  const stations = getStationsByLine(lineName);

  if (stations.length === 0) {
    console.log('No stations found for line: ' + lineName);
    process.exit(1);
  }

  console.log(lineName + ' line - ' + stations.length + ' stations:');
  console.log('');

  for (const station of stations) {
    console.log('  ' + station.name + ' | Zone: ' + station.zone);
  }
}

else if (cmd === 'fare') {
  const fromName = args[1];
  const toName = args[2];

  if (!fromName || !toName) {
    console.log('Please provide both station names.');
    console.log('Example: node monorail.js fare Heliopolis "NAC Central"');
    process.exit(1);
  }

  const result = calculateFare(fromName, toName);

  if (result.error) {
    console.log('Error: ' + result.error);
    process.exit(1);
  }

  console.log('Fare estimate:');
  console.log('  From : ' + result.from);
  console.log('  To   : ' + result.to);
  console.log('  Line : ' + result.line);
  console.log('  Fare : ' + result.fare + ' ' + result.currency);
}

else {
  console.log('Unknown command: ' + cmd);
  console.log('Run node monorail.js to see available commands.');
  process.exit(1);
}
