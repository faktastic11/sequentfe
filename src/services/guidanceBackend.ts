// TODO: make class for calling guidance backend methods

import axios from 'axios'
import { GUIDANCE_SERVER_URL } from '../config'

interface GuidanceCompanyAPIResponseT {
  companies: string[]
}

interface TickerTranscriptPeriodsAPIResponseT {
  companies: string
  transcriptPeriods: {
    year: number
    quarter: number
  }[]
}

export interface CompanyGuidanceAPIResponseT {
  guidance: {
    _id: string
    companyName: string
    companyTicker: string
    lineItem: string
    metricType: 'Guidance' | 'Retrospective'
    valueCategory: 'unknown' | 'keyMetric'
    value: {
      raw: {
        low: string
        high: string
        unit: string
        scale: string
      }
      low?: {
        amt: number
        unit?: string | null
      }
      mid?: {
        amt: number
        unit?: string
      }
      high?: {
        amt: number
        unit?: string
      }
    }
    guidancePeriod: {
      fiscalYear: number
      fiscalQuarter: number | null
      raw: string
    }
    transcriptPeriod: {
      fiscalYear: number
      fiscalQuarter: number | null
      raw: string
    }
    transcriptPosition: {
      startLine: number
      endLine: number
    }
    rawTranscriptSourceSentence: string
    rawTranscriptSourceParagraph: string
    rawTranscriptId: string
    createdAt: string
    updatedAt: string
  }[]
}

class GuidanceBackend {
  url: string

  constructor(url: string) {
    this.url = url
  }

  async getGuidanceCompanies(): Promise<GuidanceCompanyAPIResponseT> {
    const response = await axios.get(`${this.url}/api/v1/guidance/companies`)
    return response.data as GuidanceCompanyAPIResponseT
  }

  async getTickerTranscriptPeriods(companyTicker: string): Promise<TickerTranscriptPeriodsAPIResponseT> {
    const response = await axios.get(`${this.url}/api/v1/guidance/transcripts/${companyTicker}`)
    return response.data as TickerTranscriptPeriodsAPIResponseT
  }

  async getCompanyGuidance(companyTicker: string, transcriptYear: number, transcriptQuarter: number): Promise<CompanyGuidanceAPIResponseT> {
    const response = await axios.get(
      `${this.url}/api/v1/guidance?companyTicker=${companyTicker}&transcriptYear=${transcriptYear}&transcriptQuarter=${transcriptQuarter}`,
    )
    return response.data as CompanyGuidanceAPIResponseT
  }
}

export default new GuidanceBackend(GUIDANCE_SERVER_URL)
