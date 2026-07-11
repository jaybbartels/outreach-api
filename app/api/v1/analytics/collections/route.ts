import { NextRequest, NextResponse } from 'next/server'
import { AnalyticsService } from '@/lib/services/AnalyticsService'

const service = new AnalyticsService()

export async function GET(request: NextRequest) {
  try {
    const collections = await service.getCollectionPerformance()

    return NextResponse.json({
      success: true,
      data: { collections }
    })
  } catch (error) {
    console.error('GET /analytics/collections error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch collection analytics'
        }
      },
      { status: 500 }
    )
  }
}
