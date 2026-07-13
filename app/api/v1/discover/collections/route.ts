import { NextRequest, NextResponse } from 'next/server'
import { DiscoveryService } from '@/lib/services/DiscoveryService'
import { supabase } from '@/lib/supabase'

const service = new DiscoveryService()

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
    console.log('Creating collection with data:', body)

    if (!body.name) {
      return NextResponse.json(
        { success: false, error: { message: 'Name is required' } },
        { status: 400 }
      )
    }

    const { data: collection, error } = await supabase
      .from('collections')
      .insert([
        {
          name: body.name,
          description: body.description || null,
          icon: body.icon || '📂',
          user_id: body.user_id || 'demo-user-001'
        }
      ])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error (collections):', JSON.stringify(error, null, 2))
      throw error
    }
    if (!collection) throw new Error('No collection returned after insert')

    // Create health record (non-fatal if it fails)
    const { error: healthError } = await supabase
      .from('collection_health')
      .insert([{ collection_id: collection.id }])

    if (healthError) {
      console.error('Collection created but health record failed:', JSON.stringify(healthError, null, 2))
    }

    const response = NextResponse.json({
      success: true,
      data: collection
    })
    response.headers.set('Access-Control-Allow-Origin', '*')
    return response
  } catch (error: any) {
    console.error('POST /discover/collections FULL ERROR:', JSON.stringify(error, null, 2))
    const response = NextResponse.json(
      {
        success: false,
        error: {
          message: error?.message || 'Failed to create collection',
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
