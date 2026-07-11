import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/lib/services/AnalyticsService'

const service = new AnalyticsService()

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

    const stats = await service.calculateCampaignStats(campaignId)

    if (!stats) {
      return NextResponse.json(
        { success: false, error: { message: 'Campaign not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: stats
    })
  } catch (error) {
    console.error('GET /analytics/campaigns error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch campaign analytics'
        }
      },
      { status: 500 }
    )
  }
}
