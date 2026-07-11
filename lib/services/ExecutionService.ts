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

  // Bulk create prepared messages (for export + downstream send tool)
  async bulkCreateMessages(rows: any[]) {
    const { data, error } = await this.client
      .from('campaign_messages')
      .insert(rows)
      .select()
    if (error) throw error
    return data
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
