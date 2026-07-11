import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'
import { supabase } from '@/lib/supabase'

const service = new DiscoveryService()

// Handle CORS preflight
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
    const userId = searchParams.get('user_id')

    const collections = await service.getCollections(userId || undefined)

    const response = NextResponse.json({
      success: true,
      data: { collections },
      meta: { timestamp: new Date().toISOString() }
    })
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  } catch (error) {
    console.error('GET /discover/collections error:', error)
    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to fetch collections'
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

    if (!body.name || !body.description) {
      return NextResponse.json(
        { success: false, error: { message: 'Name and description required' } },
        { status: 400 }
      )
    }

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

    await supabase
      .from('collection_health')
      .insert([{ collection_id: collection.id }])

    const response = NextResponse.json({
      success: true,
      data: collection
    })
    
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type')
    
    return response
  } catch (error) {
    console.error('POST /discover/collections error:', error)
    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to create collection'
        }
      },
      { status: 500 }
    )
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  }
}
