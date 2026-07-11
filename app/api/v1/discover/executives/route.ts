import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'

const service = new DiscoveryService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collectionId = searchParams.get('collection_id') || undefined
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    const result = await service.getExecutives(collectionId, limit, offset)

    return NextResponse.json({
      success: true,
      data: { executives: result.data },
      pagination: { total: result.total, limit, offset }
    })
  } catch (error) {
    console.error('GET /discover/executives error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch executives'
        }
      },
      { status: 500 }
    )
  }
}
