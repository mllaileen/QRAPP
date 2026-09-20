const os = require('os');
const path = require('path');
const { spawn } = require('child_process');

function getLanIPv4() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name] || []) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return null;
}

const host = getLanIPv4();

if (host && host !== '127.0.0.1') {
  process.env.REACT_NATIVE_PACKAGER_HOSTNAME = host;
  console.log(`Using LAN host: ${host} (phone must be on the same Wi-Fi)`);
} else {
  console.warn(
    'Could not detect a LAN IP. If the phone cannot connect, run with `--tunnel`.'
  );
}

const args = process.argv.slice(2);
const expoCli = path.join(__dirname, '..', 'node_modules', 'expo', 'bin', 'cli');

const child = spawn(process.execPath, [expoCli, 'start', ...args], {
  stdio: 'inherit',
});

child.on('exit', (code, signal) => {
  process.exit(signal ? 1 : (code ?? 0));
});