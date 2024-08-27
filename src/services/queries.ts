import {
    useQuery
} from '@tanstack/react-query';
import axiosInstance from '@/lib/axios-instance';

import { TickerTranscriptPeriodsAPIResponseT, CompanyGuidanceAPIResponseT, GuidanceRevisionsAPIResponseT, RecentSearchesAPIResponse } from '@/lib/types';

export const useFetchCompanies = () => {
    const fetchCompanies = async (): Promise<any | null> => {
        try {
            const response = await axiosInstance.get('/api/v1/guidance/companies')
            if (!response.data) {
                return null;
            }
            return response.data.companies;
        } catch (error: any) {
            if (error.response && error.response.status === 404) {
                return null;
            } else {
                throw error;
            }
        }
    };

    return useQuery({
        queryKey: ['companies'],
        queryFn: fetchCompanies,
    });
};

export const useFetchTickerTranscriptPeriods = (ticker: string | null) => {
    const fetchTranscriptPeriods = async (): Promise<any | null> => {
        try {
            const response = await axiosInstance.get(`/api/v1/guidance/transcripts/${ticker}`)
            return response.data as TickerTranscriptPeriodsAPIResponseT;
        } catch (error: any) {
            throw error;
        }
    };

    return useQuery({
        queryKey: ['transcript', ticker],
        queryFn: fetchTranscriptPeriods,
        enabled: Boolean(ticker)
    });
};

export const useFetchCompanyGuidance = (
    ticker: string | null,
    year: number | null,
    quarter: number | string | null,
    metricType: string | null
) => {
    const fetchCompanyGuidance = async (): Promise<CompanyGuidanceAPIResponseT | null> => {
        try {
            const params = new URLSearchParams();
            if (ticker) params.append('companyTicker', ticker);
            if (year !== null) params.append('fiscalYear', year.toString());
            if (quarter !== null) params.append('fiscalQuarter', quarter.toString());
            if (metricType !== null) params.append('metricType', metricType);


            const response = await axiosInstance.get(`/api/v1/guidance?${params.toString()}`);
            return response.data as CompanyGuidanceAPIResponseT;
        } catch (error: any) {
            throw error;
        }
    };

    return useQuery({
        queryKey: ['guidance', ticker, year, quarter, metricType],
        queryFn: fetchCompanyGuidance,
        enabled: Boolean(ticker),
    });
};

export const useFetchCompanyGuidanceRevision = (
    ticker: string | null,
    year: number | null,
    metricType: string | null,
) => {
    const fetchCompanyGuidanceRevision = async (): Promise<GuidanceRevisionsAPIResponseT | null> => {
        try {
            const params = new URLSearchParams();
            if (ticker) params.append('companyTicker', ticker);
            if (year !== null) params.append('fiscalYear', year.toString());
            if (metricType !== null) params.append('metricType', metricType)

            const response = await axiosInstance.get(`/api/v1/guidance/revisions?${params.toString()}`);
            return response.data as GuidanceRevisionsAPIResponseT;
        } catch (error: any) {
            throw error;
        }
    };

    return useQuery({
        queryKey: ['guidance', ticker, year, metricType],
        queryFn: fetchCompanyGuidanceRevision,
        enabled: Boolean(ticker),
    });
};

export const useFetchRecentSearches = () => {
    const fetchRecentSearches = async (): Promise<RecentSearchesAPIResponse | null> => {
        try {
            const response = await axiosInstance.get('/api/v1/users/recent-searches');
            return response.data as RecentSearchesAPIResponse;
        } catch (error: any) {
            throw error;
        }
    };

    return useQuery({
        queryKey: ['recent-searches'],
        queryFn: fetchRecentSearches,
    });
};