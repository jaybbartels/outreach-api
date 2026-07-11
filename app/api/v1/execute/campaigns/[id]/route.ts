import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const campaign = await service.getCampaignDetail(id)

    if (!campaign) {
      return NextResponse.json(
        { success: false, error: { message: 'Campaign not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error) {
    console.error(`GET /execute/campaigns error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch campaign'
        }
      },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const campaign = await service.updateCampaign(id, body)

    return NextResponse.json({
      success: true,
      data: campaign
    })
  } catch (error) {
    console.error(`PATCH /execute/campaigns error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to update campaign'
        }
      },
      { status: 500 }
    )
  }
}
