import { BaseService, QueryOptions } from './BaseService'

export class AnalyticsService extends BaseService {
  // Get campaign metrics
  async getCampaignMetrics(campaignId: string) {
    const options: QueryOptions = {
      filters: { campaign_id: campaignId }
    }

    return this.query('channel_metrics', options)
  }

  // Get channel performance
  async getChannelPerformance(channel?: string) {
    const options: QueryOptions = {
      order: { by: 'created_at', ascending: false }
    }

    if (channel) {
      options.filters = { channel }
    }

    return this.query('channel_metrics', options)
  }

  // Get collection performance
  async getCollectionPerformance() {
    return this.query('collections', {
      order: { by: 'created_at', ascending: false }
    })
  }

  // Get campaign responses
  async getCampaignResponses(campaignId: string) {
    return this.query('campaign_responses', {
      filters: { campaign_id: campaignId }
    })
  }

  // Calculate campaign stats
  async calculateCampaignStats(campaignId: string) {
    const campaign = await this.query('campaigns', {
      filters: { id: campaignId }
    })

    if (!campaign.length) return null

    const messages = await this.query('campaign_messages', {
      filters: { campaign_id: campaignId }
    })

    const responses = await this.query('campaign_responses', {
      filters: { campaign_id: campaignId }
    })

    const totalSent = messages.length
    const totalOpened = messages.filter((m: any) => m.opened_at).length
    const totalClicked = messages.filter((m: any) => m.clicked_at).length
    const totalReplied = responses.length

    return {
      campaign_id: campaignId,
      total_sent: totalSent,
      total_opened: totalOpened,
      total_clicked: totalClicked,
      total_replied: totalReplied,
      open_rate: totalSent > 0 ? (totalOpened / totalSent) : 0,
      click_rate: totalSent > 0 ? (totalClicked / totalSent) : 0,
      reply_rate: totalSent > 0 ? (totalReplied / totalSent) : 0
    }
  }
}
