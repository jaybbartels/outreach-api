import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get('campaign_id')

    if (!campaignId) {
      return NextResponse.json(
        { success: false, error: { message: 'campaign_id required' } },
        { status: 400 }
      )
    }

    const activity = await service.getActivity(campaignId)

    return NextResponse.json({
      success: true,
      data: { activity }
    })
  } catch (error) {
    console.error('GET /execute/activity error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch activity'
        }
      },
      { status: 500 }
    )
  }
}
