import { ApiResponse, ComponentSummaryDto, ComponentDetailDto, UserDto } from '@tech-inject/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE.replace(/\/+$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  // Read client-side token from localStorage if available
  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('tech_inject_token');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token && !headers['Authorization'] && !headers['authorization']) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers,
      credentials: 'include',
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      return {
        success: false,
        error: data.error || `HTTP ${res.status}: ${res.statusText}`,
        details: data.details,
      };
    }

    return data as ApiResponse<T>;
  } catch (err: any) {
    return {
      success: false,
      error: err.message || 'Network connection failed',
    };
  }
}

export const CatalogueApi = {
  getComponents: async (params?: { search?: string; category?: string; access?: string }) => {
    const query = new URLSearchParams();
    if (params?.search) query.append('search', params.search);
    if (params?.category) query.append('category', params.category);
    if (params?.access) query.append('access', params.access);
    const queryString = query.toString() ? `?${query.toString()}` : '';
    return fetchApi<ComponentSummaryDto[]>(`/api/components${queryString}`);
  },

  getComponent: async (slug: string) => {
    return fetchApi<ComponentDetailDto>(`/api/components/${slug}`);
  },

  getComponentSource: async (slug: string) => {
    return fetchApi<{ slug: string; name: string; version: string; source: string; dependencies: string[] }>(
      `/api/components/${slug}/source`
    );
  },

  getMe: async () => {
    return fetchApi<{ user: UserDto }>('/api/auth/me');
  },

  login: async (credentials: { email: string; password: string }) => {
    const res = await fetchApi<{ user: UserDto; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('tech_inject_token', res.data.token);
    }
    return res;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tech_inject_token');
    }
    return fetchApi<{ message: string }>('/api/auth/logout', { method: 'POST' });
  },

  verifyLicense: async (licenseKey: string) => {
    return fetchApi<{ valid: boolean; status: string; expiresAt: string | null; message: string }>(
      '/api/auth/verify-license',
      {
        method: 'POST',
        body: JSON.stringify({ licenseKey }),
      }
    );
  },
};
