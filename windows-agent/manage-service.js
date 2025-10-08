const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'Minecraft Server Agent',
  script: path.join(__dirname, 'server.js')
});

const command = process.argv[2];

switch (command) {
  case 'start':
    console.log('🚀 Starting Minecraft Server Agent service...');
    svc.start();
    svc.on('start', () => {
      console.log('✅ Service started successfully!');
    });
    break;

  case 'stop':
    console.log('🛑 Stopping Minecraft Server Agent service...');
    svc.stop();
    svc.on('stop', () => {
      console.log('✅ Service stopped successfully!');
    });
    break;

  case 'restart':
    console.log('🔄 Restarting Minecraft Server Agent service...');
    svc.restart();
    svc.on('restart', () => {
      console.log('✅ Service restarted successfully!');
    });
    break;

  case 'status':
    console.log('📊 Checking service status...');
    // This is a simple check - node-windows doesn't have built-in status check
    const { exec } = require('child_process');
    exec('sc query "minecraftserveragent.exe"', (error, stdout, stderr) => {
      if (error) {
        console.log('❌ Service not found or not installed');
        return;
      }
      console.log(stdout);
    });
    break;

  default:
    console.log('🔧 Minecraft Server Agent Service Manager');
    console.log('');
    console.log('Usage: node manage-service.js <command>');
    console.log('');
    console.log('Commands:');
    console.log('  start    - Start the service');
    console.log('  stop     - Stop the service');
    console.log('  restart  - Restart the service');
    console.log('  status   - Check service status');
    console.log('');
    console.log('Examples:');
    console.log('  node manage-service.js start');
    console.log('  node manage-service.js stop');
    console.log('  node manage-service.js status');
}

svc.on('error', (err) => {
  console.error('❌ Service error:', err);
});
