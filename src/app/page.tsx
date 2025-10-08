'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'

interface ServerStatus {
  velocity?: {
    running: boolean
    pid?: number
  }
  neoforge?: {
    running: boolean
    pid?: number
  }
  lastStartTime?: string
  error?: string
}

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null)
  const [loading, setLoading] = useState(false)
  const [startingServers, setStartingServers] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (status === 'loading') return
    if (!session) {
      router.push('/auth/signin')
      return
    }
    
    // Load initial server status
    fetchServerStatus()
  }, [session, status, router])

  const fetchServerStatus = async () => {
    setLoading(true)
    setError('')
    
    try {
      const response = await fetch('/api/server')
      const data = await response.json()
      
      if (response.ok) {
        setServerStatus(data.data)
      } else {
        setError(data.error || 'Failed to fetch server status')
      }
    } catch {
      setError('Error connecting to server')
    } finally {
      setLoading(false)
    }
  }

  const startServers = async () => {
    console.log('🚀 Starting servers...')
    setStartingServers(true)
    setError('')
    setMessage('')
    
    try {
      console.log('📡 Making API call to /api/server')
      const response = await fetch('/api/server', {
        method: 'POST'
      })
      console.log('📥 Response status:', response.status)
      const data = await response.json()
      console.log('📦 Response data:', data)
      
      if (response.ok) {
        setMessage('Servers started successfully!')
        console.log('✅ Servers started successfully!')
        // Refresh status after starting
        setTimeout(() => {
          fetchServerStatus()
        }, 2000)
      } else {
        console.error('❌ Error response:', data)
        setError(data.error || 'Failed to start servers')
      }
    } catch (err) {
      console.error('❌ Fetch error:', err)
      setError('Error starting servers')
    } finally {
      setStartingServers(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Milind&rsquo;s Minecraft Server
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-700">
                <div>Welcome, {session.user?.username}</div>
                <div className="text-xs text-gray-500">
                  Authenticated via Discord
                </div>
              </div>
              <button
                onClick={() => signOut()}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-8">
                Server Control Panel
              </h2>

              {/* Server Status */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Server Status
                </h3>
                <div className="bg-white shadow rounded-lg p-6">
                  {loading ? (
                    <div className="text-gray-500">Loading server status...</div>
                  ) : serverStatus ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-center">
                        <h4 className="font-medium text-gray-900">Velocity Proxy</h4>
                        <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          serverStatus.velocity?.running 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {serverStatus.velocity?.running ? 'Running' : 'Stopped'}
                        </div>
                        {serverStatus.velocity?.pid && (
                          <div className="text-sm text-gray-500 mt-1">
                            PID: {serverStatus.velocity.pid}
                          </div>
                        )}
                      </div>
                      <div className="text-center">
                        <h4 className="font-medium text-gray-900">NeoForge Server</h4>
                        <div className={`mt-2 inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                          serverStatus.neoforge?.running 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {serverStatus.neoforge?.running ? 'Running' : 'Stopped'}
                        </div>
                        {serverStatus.neoforge?.pid && (
                          <div className="text-sm text-gray-500 mt-1">
                            PID: {serverStatus.neoforge.pid}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : error ? (
                    <div className="text-red-600">{error}</div>
                  ) : (
                    <div className="text-gray-500">No status data available</div>
                  )}
                  <button
                    onClick={fetchServerStatus}
                    disabled={loading}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
                  >
                    {loading ? 'Refreshing...' : 'Refresh Status'}
                  </button>
                </div>
              </div>

              {/* Start Server Button */}
              <div className="mb-8">
                <button
                  onClick={startServers}
                  disabled={startingServers}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {startingServers ? 'Starting Servers...' : 'Start Minecraft Servers'}
                </button>
              </div>

              {/* Messages */}
              {message && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-md">
                  {message}
                </div>
              )}

              {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
                  {error}
                </div>
              )}

              {/* Instructions */}
              <div className="mt-8 text-left bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-blue-900 mb-4">
                  Setup Instructions
                </h3>
                <ol className="list-decimal list-inside space-y-2 text-blue-800">
                  <li>Ensure the Windows agent is running on your PC</li>
                  <li>Verify the agent URL and secret are configured correctly</li>
                  <li>Make sure your .bat file is accessible at the specified path</li>
                  <li>Click &quot;Start Minecraft Servers&quot; to trigger the server startup</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
