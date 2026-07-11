import { NextRequest, NextResponse } from 'next/server'
import { StrategyService } from '@/lib/services/StrategyService'

const service = new StrategyService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const channel = searchParams.get('channel') || undefined

    const templates = await service.getTemplates(channel)

    return NextResponse.json({
      success: true,
      data: { templates }
    })
  } catch (error) {
    console.error('GET /strategy/templates error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch templates'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const template = await service.saveTemplate(body)

    return NextResponse.json({
      success: true,
      data: template
    })
  } catch (error) {
    console.error('POST /strategy/templates error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to save template'
        }
      },
      { status: 500 }
    )
  }
}
