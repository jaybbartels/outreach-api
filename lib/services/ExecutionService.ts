import { BaseService, QueryOptions } from './BaseService'

export class ExecutionService extends BaseService {
  // Get campaigns
  async getCampaigns(status?: string) {
    const options: QueryOptions = {
      order: { by: 'created_at', ascending: false }
    }

    if (status) {
      options.filters = { status }
    }

    return this.query('campaigns', options)
  }

  // Get campaign detail
  async getCampaignDetail(campaignId: string) {
    const campaigns = await this.query('campaigns', {
      filters: { id: campaignId }
    })

    return campaigns[0] || null
  }

  // Create campaign
  async createCampaign(campaign: any) {
    return this.insert('campaigns', {
      ...campaign,
      status: 'draft',
      created_at: new Date().toISOString()
    })
  }

  // Bulk create prepared messages, plus tracked links for each one
  async bulkCreateMessages(rows: any[]) {
    const insertRows = rows.map(({ learn_more_token, response_token, ...rest }) => rest)

    const { data: inserted, error } = await this.client
      .from('campaign_messages')
      .insert(insertRows)
      .select()
    if (error) throw error

    // Create tracked link rows for each message (learn_more + request_response)
    const linkRows: any[] = []
    inserted?.forEach((msg: any, idx: number) => {
      const original = rows[idx]
      if (original.learn_more_token) {
        linkRows.push({
          campaign_message_id: msg.id,
          link_type: 'learn_more',
          token: original.learn_more_token
        })
      }
      if (original.response_token) {
        linkRows.push({
          campaign_message_id: msg.id,
          link_type: 'request_response',
          token: original.response_token
        })
      }
    })

    if (linkRows.length > 0) {
      const { error: linkError } = await this.client
        .from('message_links')
        .insert(linkRows)
      if (linkError) throw linkError
    }

    return inserted
  }

  // Look up a tracked link by token, log the click, return context for redirect
  async resolveTrackedLink(token: string, userAgent?: string, ipAddress?: string) {
    const { data: link, error: linkError } = await this.client
      .from('message_links')
      .select('*, campaign_messages(*)')
      .eq('token', token)
      .single()


    await this.client.from('link_clicks').insert([
      { message_link_id: link.id, user_agent: userAgent || null, ip_address: ipAddress || null }
    ])

    // A click on the 'request_response' link counts as an inbound response signal
    if (link.link_type === 'request_response') {
      await this.client.from('campaign_responses').insert([
        {
          campaign_id: link.campaign_messages?.campaign_id,
          executive_id: link.campaign_messages?.executive_id,
          inbound_channel: 'link_click',
          message_body: 'Recipient clicked 'request more information / contact me' link',
          received_at: new Date().toISOString(),
          classification: 'interested_click',
          status: 'new'
        }
      ])
    }

    return {
      linkType: link.link_type,
      recipientName: link.campaign_messages?.executive_name || ''
    }
  }


  // Update campaign
  async updateCampaign(campaignId: string, data: any) {
    return this.update('campaigns', campaignId, data)
  }

  // Get sequences for campaign
  async getSequences(campaignId: string) {
    return this.query('campaign_sequences', {
      filters: { campaign_id: campaignId }
    })
  }

  // Get responses
  async getResponses(campaignId?: string) {
    const options: QueryOptions = {
      order: { by: 'created_at', ascending: false }
    }

    if (campaignId) {
      options.filters = { campaign_id: campaignId }
    }

    return this.query('campaign_responses', options)
  }

  // Get activity log
  async getActivity(campaignId: string) {
    return this.query('campaign_activity_log', {
      filters: { campaign_id: campaignId },
      order: { by: 'created_at', ascending: false }
    })
  }

  // Log activity
  async logActivity(activityData: any) {
    return this.insert('campaign_activity_log', {
      ...activityData,
      created_at: new Date().toISOString()
    })
  }

  // Get followups
  async getFollowups(campaignId?: string) {
    const options: QueryOptions = {
      order: { by: 'scheduled_for', ascending: true }
    }

    if (campaignId) {
      options.filters = { campaign_id: campaignId }
    }

    return this.query('campaign_followups', options)
  }

  // Create followup
  async createFollowup(followup: any) {
    return this.insert('campaign_followups', {
      ...followup,
      status: 'scheduled',
      created_at: new Date().toISOString()
    })
  }
}
