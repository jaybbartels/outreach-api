import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined

    const campaigns = await service.getCampaigns(status)

    return NextResponse.json({
      success: true,
      data: { campaigns }
    })
  } catch (error) {
    console.error('GET /execute/campaigns error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch campaigns'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const campaign = await service.createCampaign(body)

    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error) {
    console.error('POST /execute/campaigns error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create campaign'
        }
      },
      { status: 500 }
    )
  }
}
