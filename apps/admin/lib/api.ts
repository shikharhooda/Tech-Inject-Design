import {
  ApiResponse,
  UserDto,
  ComponentBundleInput,
  ComponentUpdateInput,
} from '@tech-inject/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchAdminApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const url = `${API_BASE.replace(/\/+$/, '')}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

  let token: string | null = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('tech_inject_admin_token') || localStorage.getItem('tech_inject_token');
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

export const AdminApi = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await fetchAdminApi<{ user: UserDto; token: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    if (res.success && res.data?.token && typeof window !== 'undefined') {
      localStorage.setItem('tech_inject_admin_token', res.data.token);
    }
    return res;
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tech_inject_admin_token');
    }
    return fetchAdminApi<{ message: string }>('/api/auth/logout', { method: 'POST' });
  },

  getMe: async () => {
    return fetchAdminApi<{ user: UserDto }>('/api/auth/me');
  },

  getStats: async () => {
    return fetchAdminApi<{
      totalComponents: number;
      publishedComponents: number;
      draftComponents: number;
      premiumComponents: number;
      totalCustomers: number;
      activeLicenses: number;
    }>('/api/admin/stats');
  },

  getComponents: async () => {
    return fetchAdminApi<any[]>('/api/admin/components');
  },

  getComponent: async (id: string) => {
    return fetchAdminApi<any>(`/api/admin/components/${id}`);
  },

  createComponent: async (bundle: ComponentBundleInput) => {
    return fetchAdminApi<any>('/api/admin/components', {
      method: 'POST',
      body: JSON.stringify(bundle),
    });
  },

  updateComponent: async (id: string, bundle: ComponentUpdateInput) => {
    return fetchAdminApi<any>(`/api/admin/components/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(bundle),
    });
  },

  deleteComponent: async (id: string) => {
    return fetchAdminApi<{ message: string }>(`/api/admin/components/${id}`, {
      method: 'DELETE',
    });
  },

  validateComponent: async (id: string) => {
    return fetchAdminApi<{ valid: boolean; errors: string[] }>(`/api/admin/components/${id}/validate`, {
      method: 'POST',
    });
  },

  publishComponent: async (id: string) => {
    return fetchAdminApi<{ message: string; component: any }>(`/api/admin/components/${id}/publish`, {
      method: 'POST',
    });
  },

  unpublishComponent: async (id: string) => {
    return fetchAdminApi<{ message: string; component: any }>(`/api/admin/components/${id}/unpublish`, {
      method: 'POST',
    });
  },

  getCustomers: async () => {
    return fetchAdminApi<any[]>('/api/admin/customers');
  },

  getCustomer: async (id: string) => {
    return fetchAdminApi<any>(`/api/admin/customers/${id}`);
  },

  grantPremium: async (id: string, expiresAt?: string | null) => {
    return fetchAdminApi<{
      message: string;
      userId: string;
      email: string;
      licenseKey: string;
      expiresAt: string | null;
    }>(`/api/admin/customers/${id}/grant-premium`, {
      method: 'POST',
      body: JSON.stringify({ expiresAt }),
    });
  },

  revokePremium: async (id: string) => {
    return fetchAdminApi<{
      message: string;
      userId: string;
      email: string;
      premiumAccess: boolean;
    }>(`/api/admin/customers/${id}/revoke-premium`, {
      method: 'POST',
    });
  },
};
