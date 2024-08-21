import axios from 'axios'
import { GUIDANCE_SERVER_URL } from '../config'

interface GuidanceCompanyAPIResponseT {
  companies: string[]
}

interface TickerTranscriptPeriodsAPIResponseT {
  companyName: string
  companies: string
  transcriptPeriods: {
    year: number
    quarter: number
  }[]
}

export interface RecentSearchesAPIResponse {
  message: string
  searches: string[]
}

export interface UserInfoAPIResponse {
  user: string
  name: string
  email: string
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
  token: string | null

  constructor(url: string) {
    this.url = url
    this.token = localStorage.getItem('token') || null
  }

  setToken(token: string | null) {
    this.token = token
  }

  getHeaders() {
    return {
      headers: {
        Authorization: this.token ? `Bearer ${this.token}` : '',
      },
    }
  }

  async login(email: string, password: string): Promise<void> {
    const response = await axios.post(`${this.url}/api/v1/users/login`, { email, password })
    this.setToken(response.data.token)
    localStorage.setItem('token', response.data.token)
    localStorage.setItem('name', response.data.user.name)
    return response.data as void
  }

  async signup(name: string, email: string, password: string): Promise<void> {
    const response = await axios.post(`${this.url}/api/v1/users`, { name, email, password })
    this.setToken(response.data.token)
    return response.data as void
  }

  async getGuidanceCompanies(): Promise<GuidanceCompanyAPIResponseT> {
    const response = await axios.get(`${this.url}/api/v1/guidance/companies`, this.getHeaders())
    return response.data as GuidanceCompanyAPIResponseT
  }

  async getTickerTranscriptPeriods(companyTicker: string): Promise<TickerTranscriptPeriodsAPIResponseT> {
    const response = await axios.get(`${this.url}/api/v1/guidance/transcripts/${companyTicker}`, this.getHeaders())
    return response.data as TickerTranscriptPeriodsAPIResponseT
  }

  async getCompanyGuidance(companyTicker: string, transcriptYear: number, transcriptQuarter: number): Promise<CompanyGuidanceAPIResponseT> {
    const response = await axios.get(
      `${this.url}/api/v1/guidance?companyTicker=${companyTicker}&transcriptYear=${transcriptYear}&transcriptQuarter=${transcriptQuarter}`,
      this.getHeaders(),
    )
    return response.data as CompanyGuidanceAPIResponseT
  }

  async getRecentSearches(): Promise<RecentSearchesAPIResponse> {
    const response = await axios.get(`${this.url}/api/v1/users/recent-searches`, this.getHeaders())
    return response.data as RecentSearchesAPIResponse
  }

  async getUserInfo(): Promise<UserInfoAPIResponse> {
    const response = await axios.get(`${this.url}/api/v1/users/myProfile`, this.getHeaders())
    return response.data as UserInfoAPIResponse
  }

  async logout(): Promise<void> {
    const response = await axios.get(`${this.url}/api/v1/users/logout`, this.getHeaders())
    this.setToken(null)
    localStorage.removeItem('token')
    return response.data as void
  }
}

export default new GuidanceBackend(GUIDANCE_SERVER_URL)
