import { NextRequest, NextResponse } from 'next/server'
import { StrategyService } from '@/lib/services/StrategyService'

const service = new StrategyService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const isTemplate = searchParams.get('is_template') === 'true'

    const sequences = await service.getSequences(isTemplate)

    return NextResponse.json({
      success: true,
      data: { sequences }
    })
  } catch (error) {
    console.error('GET /strategy/sequences error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch sequences'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const sequence = await service.createSequence(body)

    return NextResponse.json({
      success: true,
      data: sequence
    })
  } catch (error) {
    console.error('POST /strategy/sequences error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create sequence'
        }
      },
      { status: 500 }
    )
  }
}
