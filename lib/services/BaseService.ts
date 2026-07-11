import { supabase } from '@/lib/supabase'

export interface QueryOptions {
  filters?: Record<string, any>
  limit?: number
  offset?: number
  order?: { by: string; ascending?: boolean }
  select?: string
}

export class BaseService {
  protected client = supabase

  protected async query(table: string, options: QueryOptions = {}) {
    try {
      let query = this.client
        .from(table)
        .select(options.select || '*')

      // Apply filters
      if (options.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          if (value !== null && value !== undefined) {
            query = query.eq(key, value)
          }
        }
      }

      // Apply ordering
      if (options.order) {
        query = query.order(options.order.by, {
          ascending: options.order.ascending !== false
        })
      }

      // Apply pagination
      if (options.limit) {
        const offset = options.offset || 0
        query = query.range(offset, offset + options.limit - 1)
      }

      const { data, error } = await query

      if (error) {
        console.error(`Error querying ${table}:`, error)
        throw error
      }

      return data || []
    } catch (error) {
      console.error(`BaseService.query error:`, error)
      throw error
    }
  }

  protected async insert(table: string, data: any) {
    try {
      const { data: inserted, error } = await this.client
        .from(table)
        .insert([data])
        .select()

      if (error) throw error
      return inserted?.[0] || null
    } catch (error) {
      console.error(`BaseService.insert error:`, error)
      throw error
    }
  }

  protected async update(table: string, id: string, data: any) {
    try {
      const { data: updated, error } = await this.client
        .from(table)
        .update(data)
        .eq('id', id)
        .select()

      if (error) throw error
      return updated?.[0] || null
    } catch (error) {
      console.error(`BaseService.update error:`, error)
      throw error
    }
  }

  protected async delete(table: string, id: string) {
    try {
      const { error } = await this.client
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error(`BaseService.delete error:`, error)
      throw error
    }
  }
}
