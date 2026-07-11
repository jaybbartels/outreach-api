import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'

const service = new DiscoveryService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ collectionId: string }> }
) {
  try {
    const { collectionId } = await params
    const health = await service.getCollectionHealth(collectionId)
    return NextResponse.json({
      success: true,
      data: health
    })
  } catch (error) {
    console.error(`GET /discover/health error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch health'
        }
      },
      { status: 500 }
    )
  }
}
