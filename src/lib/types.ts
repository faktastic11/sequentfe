export interface GuidanceCompanyAPIResponseT {
    companies: string[]
  }
  
 export interface TickerTranscriptPeriodsAPIResponseT {
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
    message: string;
    user: {
      name: string;
      email: string;
      _id: string
    }
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
  
  interface Metric {
    earningsReport: string;
    excerpt: string;
    high: string;
    low: string;
    similarity: number;
    source: string;
    unit: string;
  }
  
  interface LineItem {
    lineItem: string;
    metrics: Metric[];
  }
  
export  interface GuidanceRevisionsAPIResponseT {
    companyTicker: string;
    fiscalYear: number;
    metricType: string;
    metrics: LineItem[];
  }

export  interface TranscriptPeriod {
    year: number;
    quarter: string | number | null;
  }
  
export  interface ProcessedPeriod {
    year: number;
    quarter: string | number | null;
    label: string;
  }
  
export  interface CompanyPeriod {
    label: string;
    value: { fiscalYear: number; fiscalQuarter: string | number | null };
  }
  
export  interface CompanyYear {
    label: string | number;
    value: number;
  }

  export interface DataTableRowT {
    lineItem: string;
    period: string;
    low: string;
    high: string;
    source: string;
    sourceParagraph?: string;
    excerpt?: string;
  }