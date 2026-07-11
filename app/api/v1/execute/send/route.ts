import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaign_id, executive_id, channel, message_content } = body

    if (!campaign_id || !executive_id || !channel) {
      return NextResponse.json(
        { success: false, error: { message: 'Missing required fields' } },
        { status: 400 }
      )
    }

    // Log activity
    await service.logActivity({
      campaign_id,
      executive_id,
      activity_type: 'message_sent',
      activity_data: { channel, message_content }
    })

    return NextResponse.json({
      success: true,
      data: { message_id: 'msg_' + Date.now(), status: 'sent' }
    })
  } catch (error) {
    console.error('POST /execute/send error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to send message'
        }
      },
      { status: 500 }
    )
  }
}
