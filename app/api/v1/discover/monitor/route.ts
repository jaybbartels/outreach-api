import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'

const service = new DiscoveryService()

export async function POST(request: NextRequest) {
  try {
    const { collection_id, refresh_frequency, enabled } = await request.json()

    if (!collection_id) {
      return NextResponse.json(
        { success: false, error: { message: 'collection_id required' } },
        { status: 400 }
      )
    }

    const result = await service.monitorCollection(
      collection_id,
      refresh_frequency || 'weekly',
      enabled !== false
    )

    return NextResponse.json({
      success: true,
      data: result
    })
  } catch (error) {
    console.error('POST /discover/monitor error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to update monitoring'
        }
      },
      { status: 500 }
    )
  }
}
