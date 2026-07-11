import { BaseService, QueryOptions } from './BaseService'

export class DiscoveryService extends BaseService {
  // Get all collections
  async getCollections(userId?: string) {
    const options: QueryOptions = {
      order: { by: 'created_at', ascending: false }
    }

    if (userId) {
      options.filters = { user_id: userId }
    }

    const collections = await this.query('collections', options)

    // Enrich with health data
    const enriched = await Promise.all(
      collections.map(async (c: any) => {
        const health = await this.getCollectionHealth(c.id)
        return { ...c, health }
      })
    )

    return enriched
  }

  // Get collection detail
  async getCollectionDetail(collectionId: string) {
    const collections = await this.query('collections', {
      filters: { id: collectionId }
    })

    if (!collections.length) throw new Error('Collection not found')

    const col = collections[0] as any

    // Get executives in collection
    const { data: executives } = await this.client
      .from('collection_executives')
      .select('executives(*)')
      .eq('collection_id', collectionId)

    // Get companies
    const companies = await this.query('companies')

    // Get health
    const health = await this.getCollectionHealth(collectionId)

    return {
      ...col,
      executives: executives?.map((e: any) => e.executives) || [],
      companies,
      health,
      stats: {
        total_executives: executives?.length || 0,
        total_companies: companies.length
      }
    }
  }

  // Get executives
  async getExecutives(collectionId?: string, limit = 50, offset = 0) {
    let query = this.client.from('executives').select('*')

    if (collectionId) {
      const { data: collectionExecs } = await this.client
        .from('collection_executives')
        .select('executive_id')
        .eq('collection_id', collectionId)

      const execIds = collectionExecs?.map((e: any) => e.executive_id) || []
      if (execIds.length > 0) {
        query = query.in('id', execIds)
      }
    }

    const { data, error } = await query
      .range(offset, offset + limit - 1)
      .order('created_at', { ascending: false })

    if (error) throw error

    return { data: data || [], total: data?.length || 0 }
  }

  // Get collection health
  async getCollectionHealth(collectionId: string) {
    const health = await this.query('collection_health', {
      filters: { collection_id: collectionId }
    })

    if (!health.length) {
      return await this.insert('collection_health', {
        collection_id: collectionId,
        total_executives: 0,
        executives_with_email: 0,
        data_quality_score: 0,
        monitoring_status: 'inactive'
      })
    }

    return health[0]
  }

  // Monitor collection
  async monitorCollection(
    collectionId: string,
    frequency: string,
    enabled: boolean
  ) {
    const health = await this.query('collection_health', {
      filters: { collection_id: collectionId }
    })

    if (!health.length) {
      return await this.insert('collection_health', {
        collection_id: collectionId,
        refresh_frequency: frequency,
        monitored: enabled,
        monitoring_status: enabled ? 'active' : 'inactive',
        next_refresh_date: this.calculateNextRefresh(frequency)
      })
    }

    const healthRecord = health[0] as any
    return await this.update('collection_health', healthRecord.id, {
      refresh_frequency: frequency,
      monitored: enabled,
      monitoring_status: enabled ? 'active' : 'inactive',
      next_refresh_date: this.calculateNextRefresh(frequency)
    })
  }

  private calculateNextRefresh(frequency: string) {
    const now = new Date()
    const daysMap: Record<string, number> = {
      daily: 1,
      weekly: 7,
      monthly: 30
    }
    const days = daysMap[frequency] || 7
    return new Date(now.getTime() + days * 24 * 60 * 60 * 1000)
  }
}
