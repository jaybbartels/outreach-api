import { BaseService, QueryOptions } from './BaseService'

export class StrategyService extends BaseService {
  // Get profiles
  async getProfiles(userId?: string) {
    const options: QueryOptions = {
      order: { by: 'created_at', ascending: false }
    }

    if (userId) {
      options.filters = { user_id: userId }
    }

    return this.query('bd_profiles', options)
  }

  // Create profile
  async createProfile(profile: any) {
    return this.insert('bd_profiles', {
      ...profile,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  // Update profile
  async updateProfile(profileId: string, data: any) {
    return this.update('bd_profiles', profileId, {
      ...data,
      updated_at: new Date().toISOString()
    })
  }

  // Get sequences
  async getSequences(isTemplate = false) {
    return this.query('strategy_sequences', {
      filters: { is_template: isTemplate },
      order: { by: 'created_at', ascending: false }
    })
  }

  // Create sequence
  async createSequence(sequence: any) {
    return this.insert('strategy_sequences', {
      ...sequence,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  // Update sequence
  async updateSequence(sequenceId: string, data: any) {
    return this.update('strategy_sequences', sequenceId, {
      ...data,
      updated_at: new Date().toISOString()
    })
  }

  // Get message templates
  async getTemplates(channel?: string) {
    const options: QueryOptions = {
      order: { by: 'created_at', ascending: false }
    }

    if (channel) {
      options.filters = { channel }
    }

    return this.query('message_templates', options)
  }

  // Save template
  async saveTemplate(template: any) {
    return this.insert('message_templates', {
      ...template,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
  }

  // Update template
  async updateTemplate(templateId: string, data: any) {
    return this.update('message_templates', templateId, {
      ...data,
      updated_at: new Date().toISOString()
    })
  }
}
