import { NextRequest, NextResponse } from 'next/server'
import { StrategyService } from '@/lib/services/StrategyService'

const service = new StrategyService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')

    const profiles = await service.getProfiles(userId || undefined)

    return NextResponse.json({
      success: true,
      data: { profiles }
    })
  } catch (error) {
    console.error('GET /strategy/profiles error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch profiles'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const profile = await service.createProfile(body)

    return NextResponse.json({
      success: true,
      data: profile
    })
  } catch (error) {
    console.error('POST /strategy/profiles error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create profile'
        }
      },
      { status: 500 }
    )
  }
}
