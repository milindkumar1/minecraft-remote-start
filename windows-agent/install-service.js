const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'Minecraft Server Agent',
  description: 'Remote management agent for Minecraft servers - allows secure remote control of server startup via web interface',
  script: path.join(__dirname, 'server.js'),
  nodeOptions: [
    '--harmony',
    '--max_old_space_size=4096'
  ],
  env: [
    {
      name: "NODE_ENV",
      value: "production"
    }
  ],
  // Service will restart automatically on failure
  restart: {
    delay: 5000, // 5 seconds
    count: 3     // Max 3 restarts within the delay period
  }
});

// Listen for the "install" event, which indicates the process is available as a service.
svc.on('install', () => {
  console.log('✅ Minecraft Server Agent service installed successfully!');
  console.log('🚀 Starting service...');
  svc.start();
});

svc.on('start', () => {
  console.log('✅ Service started successfully!');
  console.log('🎯 The agent will now run automatically on system startup');
  console.log('📍 Service Name: Minecraft Server Agent');
  console.log('🌐 Agent will be available at: http://localhost:8080');
  console.log('');
  console.log('📋 To manage the service:');
  console.log('   • View in Services: services.msc');
  console.log('   • Uninstall: node uninstall-service.js');
  console.log('   • Check logs: Event Viewer > Windows Logs > Application');
});

svc.on('error', (err) => {
  console.error('❌ Service error:', err);
});

console.log('📦 Installing Minecraft Server Agent as Windows Service...');
console.log('⚠️  This requires Administrator privileges!');
console.log('');

svc.install();
