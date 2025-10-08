const express = require('express')
const cors = require('cors')
const { exec, spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const app = express()
const PORT = process.env.PORT || 8080

// Configuration
const CONFIG = {
  BAT_FILE_PATH: process.env.BAT_FILE_PATH || 'C:\\Users\\Milind Kumar\\Desktop\\start_servers.bat',
  AUTH_SECRET: process.env.WINDOWS_AGENT_SECRET || 'shared-secret-between-web-app-and-agent',
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ['http://localhost:3000', 'https://mcserver.milindkumar.dev']
}

// Middleware
app.use(cors({
  origin: CONFIG.ALLOWED_ORIGINS,
  credentials: true
}))
app.use(express.json())

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' })
  }

  const token = authHeader.substring(7)
  if (token !== CONFIG.AUTH_SECRET) {
    return res.status(401).json({ error: 'Invalid authentication token' })
  }

  next()
}

// Utility function to check if a process is running
const isProcessRunning = (processName) => {
  return new Promise((resolve) => {
    exec(`tasklist /FI "IMAGENAME eq ${processName}" /FO CSV /NH`, (error, stdout) => {
      if (error) {
        resolve({ running: false })
        return
      }
      
      const lines = stdout.trim().split('\n')
      const runningProcesses = lines.filter(line => 
        line.includes(processName) && !line.includes('INFO: No tasks')
      )
      
      if (runningProcesses.length > 0) {
        // Extract PID from the first match
        const processInfo = runningProcesses[0].split('","')
        const pid = processInfo[1] ? parseInt(processInfo[1].replace(/"/g, '')) : null
        resolve({ running: true, pid })
      } else {
        resolve({ running: false })
      }
    })
  })
}

// Check server status
const getServerStatus = async () => {
  try {
    const [velocityStatus, neoforgeStatus] = await Promise.all([
      isProcessRunning('java.exe'), // This is a simplified check
      isProcessRunning('java.exe')  // You might want to be more specific
    ])

    // For better detection, you could check for specific JVM arguments or ports
    // This is a basic implementation
    return {
      velocity: velocityStatus.running ? { running: true, pid: velocityStatus.pid } : { running: false },
      neoforge: neoforgeStatus.running ? { running: true, pid: neoforgeStatus.pid } : { running: false },
      timestamp: new Date().toISOString()
    }
  } catch (error) {
    console.error('Error checking server status:', error)
    return {
      velocity: { running: false },
      neoforge: { running: false },
      error: 'Failed to check server status'
    }
  }
}

// Routes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    agent: 'minecraft-server-agent',
    version: '1.0.0'
  })
})

// Get server status
app.get('/status', authenticate, async (req, res) => {
  try {
    const status = await getServerStatus()
    res.json(status)
  } catch (error) {
    console.error('Error getting status:', error)
    res.status(500).json({ error: 'Failed to get server status' })
  }
})

// Start servers
app.post('/start-servers', authenticate, async (req, res) => {
  try {
    // Check if .bat file exists
    if (!fs.existsSync(CONFIG.BAT_FILE_PATH)) {
      return res.status(400).json({ 
        error: `Batch file not found: ${CONFIG.BAT_FILE_PATH}` 
      })
    }

    console.log(`Starting servers using: ${CONFIG.BAT_FILE_PATH}`)

    // Execute the batch file
    const child = spawn('cmd.exe', ['/c', CONFIG.BAT_FILE_PATH], {
      cwd: path.dirname(CONFIG.BAT_FILE_PATH),
      stdio: ['ignore', 'pipe', 'pipe']
    })

    let output = ''
    let errorOutput = ''

    child.stdout.on('data', (data) => {
      const text = data.toString()
      output += text
      console.log('STDOUT:', text)
    })

    child.stderr.on('data', (data) => {
      const text = data.toString()
      errorOutput += text
      console.log('STDERR:', text)
    })

    child.on('close', (code) => {
      console.log(`Batch file execution completed with code: ${code}`)
    })

    child.on('error', (error) => {
      console.error('Error executing batch file:', error)
    })

    // Don't wait for the process to complete, return immediately
    res.json({
      success: true,
      message: 'Server start command executed',
      timestamp: new Date().toISOString(),
      batFile: CONFIG.BAT_FILE_PATH
    })

  } catch (error) {
    console.error('Error starting servers:', error)
    res.status(500).json({ 
      error: 'Failed to start servers',
      details: error.message
    })
  }
})

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Unhandled error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Minecraft Server Agent running on port ${PORT}`)
  console.log(`📁 Batch file path: ${CONFIG.BAT_FILE_PATH}`)
  console.log(`🔐 Authentication required for protected endpoints`)
  console.log(`🌐 Allowed origins: ${CONFIG.ALLOWED_ORIGINS.join(', ')}`)
  
  // Verify batch file exists
  if (fs.existsSync(CONFIG.BAT_FILE_PATH)) {
    console.log('✅ Batch file found and accessible')
  } else {
    console.log('❌ Warning: Batch file not found!')
  }
})

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down gracefully...')
  process.exit(0)
})

process.on('SIGTERM', () => {
  console.log('\n🛑 Received SIGTERM, shutting down gracefully...')
  process.exit(0)
})
