import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const campaignId = searchParams.get('campaign_id') || undefined

    const responses = await service.getResponses(campaignId)

    return NextResponse.json({
      success: true,
      data: { responses }
    })
  } catch (error) {
    console.error('GET /execute/responses error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch responses'
        }
      },
      { status: 500 }
    )
  }
}
