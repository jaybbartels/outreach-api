import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'

const service = new DiscoveryService()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const detail = await service.getCollectionDetail(params.id)
    return NextResponse.json({
      success: true,
      data: detail
    })
  } catch (error) {
    console.error(`GET /discover/collections/${params.id} error:`, error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch collection'
        }
      },
      { status: 500 }
    )
  }
}
