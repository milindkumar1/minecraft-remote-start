import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import axios from 'axios'

export async function POST() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get environment variables
    const agentUrl = process.env.WINDOWS_AGENT_URL
    const agentSecret = process.env.WINDOWS_AGENT_SECRET

    if (!agentUrl || !agentSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Send request to Windows agent
    const response = await axios.post(
      `${agentUrl}/start-servers`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${agentSecret}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000 // 30 second timeout
      }
    )

    return NextResponse.json({
      success: true,
      message: 'Server start command sent successfully',
      data: response.data
    })

  } catch (error) {
    console.error('Error starting servers:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Could not connect to Windows agent. Is it running?' },
          { status: 503 }
        )
      }
      
      if (error.response) {
        return NextResponse.json(
          { error: `Agent error: ${error.response.data?.error || 'Unknown error'}` },
          { status: error.response.status }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get environment variables
    const agentUrl = process.env.WINDOWS_AGENT_URL
    const agentSecret = process.env.WINDOWS_AGENT_SECRET

    if (!agentUrl || !agentSecret) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      )
    }

    // Get server status from Windows agent
    const response = await axios.get(
      `${agentUrl}/status`,
      {
        headers: {
          'Authorization': `Bearer ${agentSecret}`
        },
        timeout: 10000 // 10 second timeout
      }
    )

    return NextResponse.json({
      success: true,
      data: response.data
    })

  } catch (error) {
    console.error('Error getting server status:', error)
    
    if (axios.isAxiosError(error)) {
      if (error.code === 'ECONNREFUSED') {
        return NextResponse.json(
          { error: 'Could not connect to Windows agent' },
          { status: 503 }
        )
      }
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
