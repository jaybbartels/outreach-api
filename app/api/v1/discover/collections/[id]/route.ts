import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'

const service = new DiscoveryService()

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const detail = await service.getCollectionDetail(id)
    return NextResponse.json({
      success: true,
      data: detail
    })
  } catch (error) {
    console.error(`GET /discover/collections error:`, error)
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
