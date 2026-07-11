import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { campaign_id, messages } = body

    if (!campaign_id || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { success: false, error: { message: 'campaign_id and messages[] are required' } },
        { status: 400 }
      )
    }

    const rows = messages.map((m: any) => ({
      campaign_id,
      executive_id: m.executive_id,
      executive_name: m.executive_name,
      executive_email: m.executive_email,
      subject: m.subject || null,
      message_content: m.message_content,
      channel: m.channel,
      scheduled_at: m.scheduled_at || null,
      status: 'draft'
    }))

    const inserted = await service.bulkCreateMessages(rows)

    const response = NextResponse.json({ success: true, data: { messages: inserted } })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error: any) {
    console.error('POST /execute/messages error:', error)
    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || 'Failed to save messages',
          details: error?.details || null,
          hint: error?.hint || null
        }
      },
      { status: 500 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}
