const Service = require('node-windows').Service;
const path = require('path');

// Create a new service object
const svc = new Service({
  name: 'Minecraft Server Agent',
  script: path.join(__dirname, 'server.js')
});

// Listen for the "uninstall" event
svc.on('uninstall', () => {
  console.log('✅ Minecraft Server Agent service uninstalled successfully!');
  console.log('🔄 The service will no longer start automatically on system boot');
  console.log('💡 You can reinstall it anytime by running: node install-service.js');
});

svc.on('error', (err) => {
  console.error('❌ Uninstall error:', err);
});

console.log('🗑️  Uninstalling Minecraft Server Agent service...');
console.log('⚠️  This requires Administrator privileges!');
console.log('');

svc.uninstall();
