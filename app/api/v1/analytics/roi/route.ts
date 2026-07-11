import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Get all campaigns with their stats
    const { data: campaigns, error } = await supabase
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Calculate ROI for each campaign
    const roiData = await Promise.all(
      (campaigns || []).map(async (campaign: any) => {
        const { data: messages } = await supabase
          .from('campaign_messages')
          .select('*')
          .eq('campaign_id', campaign.id)

        const { data: responses } = await supabase
          .from('campaign_responses')
          .select('*')
          .eq('campaign_id', campaign.id)

        const totalSent = messages?.length || 0
        const totalResponses = responses?.length || 0
        const responseRate = totalSent > 0 ? (totalResponses / totalSent) * 100 : 0

        return {
          campaign_id: campaign.id,
          campaign_name: campaign.name,
          total_sent: totalSent,
          total_responses: totalResponses,
          response_rate: responseRate,
          estimated_value: totalResponses * 500 // Assume $500 per response
        }
      })
    )

    return NextResponse.json({
      success: true,
      data: {
        campaigns: roiData,
        summary: {
          total_campaigns: roiData.length,
          total_sent: roiData.reduce((sum: number, c: any) => sum + c.total_sent, 0),
          total_responses: roiData.reduce((sum: number, c: any) => sum + c.total_responses, 0),
          avg_response_rate: roiData.length > 0 
            ? roiData.reduce((sum: number, c: any) => sum + c.response_rate, 0) / roiData.length 
            : 0,
          total_estimated_value: roiData.reduce((sum: number, c: any) => sum + c.estimated_value, 0)
        }
      }
    })
  } catch (error) {
    console.error('GET /analytics/roi error:', error)
    return NextResponse.json(
      {
        success: false,
        error: {
          message: error instanceof Error ? error.message : 'Failed to calculate ROI'
        }
      },
      { status: 500 }
    )
  }
}
