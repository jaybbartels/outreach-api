import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const channel = searchParams.get('channel') || undefined

    let query = supabase.from('channel_metrics').select('*')

    if (channel) {
      query = query.eq('channel', channel)
    }

    const { data: metrics, error } = await query

    if (error) throw error

    return NextResponse.json({
      success: true,
      data: { 
        metrics: metrics || [],
        count: metrics?.length || 0
      }
    })
  } catch (error) {
    console.error('GET /analytics/channels error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch channel analytics'
        }
      },
      { status: 500 }
    )
  }
}
