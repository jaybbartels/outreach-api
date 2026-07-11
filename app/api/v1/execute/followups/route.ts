import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get('campaign_id') || undefined

    const followups = await service.getFollowups(campaignId)

    return NextResponse.json({
      success: true,
      data: { followups }
    })
  } catch (error) {
    console.error('GET /execute/followups error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch followups'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const followup = await service.createFollowup(body)

    return NextResponse.json({
      success: true,
      data: followup
    })
  } catch (error) {
    console.error('POST /execute/followups error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create followup'
        }
      },
      { status: 500 }
    )
  }
}
