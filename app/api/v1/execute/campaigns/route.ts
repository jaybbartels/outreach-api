import { NextRequest, NextResponse } from 'next/server'
import { ExecutionService } from '@/lib/services/ExecutionService'

const service = new ExecutionService()

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  })
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || undefined

    const campaigns = await service.getCampaigns(status)

    const response = NextResponse.json({
      success: true,
      data: { campaigns }
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error) {
    console.error('GET /execute/campaigns error:', error)
    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch campaigns'
        }
      },
      { status: 500 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Creating campaign with data:', body)

    const campaign = await service.createCampaign(body)

    const response = NextResponse.json({
      success: true,
      data: campaign
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error: any) {
    console.error('POST /execute/campaigns FULL ERROR:', JSON.stringify(error, null, 2))
    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || 'Failed to create campaign',
          details: error?.details || null,
          hint: error?.hint || null,
          code: error?.code || null
        }
      },
      { status: 500 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}
