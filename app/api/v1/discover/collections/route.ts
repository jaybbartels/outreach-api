import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'
import { supabase } from '@/lib/supabase'

const service = new DiscoveryService()

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = searchParams.get('user_id')

    const collections = await service.getCollections(userId || undefined)

    return NextResponse.json({
      success: true,
      data: { collections },
      meta: { timestamp: new Date().toISOString() }
    })
  } catch (error) {
    console.error('GET /discover/collections error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch collections'
        }
      },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate
    if (!body.name || !body.description) {
      return NextResponse.json(
        { success: false, error: { message: 'Name and description required' } },
        { status: 400 }
      )
    }

    // Create collection
    const { data: collection, error } = await supabase
      .from('collections')
      .insert([
        {
          name: body.name,
          description: body.description,
          user_id: body.user_id || 'demo-user-001'
        }
      ])
      .select()
      .single()

    if (error || !collection) throw new Error('Failed to create collection')

    // Create health record
    await supabase
      .from('collection_health')
      .insert([{ collection_id: collection.id }])

    return NextResponse.json({
      success: true,
      data: collection
    })
  } catch (error) {
    console.error('POST /discover/collections error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create collection'
        }
      },
      { status: 500 }
    )
  }
}
