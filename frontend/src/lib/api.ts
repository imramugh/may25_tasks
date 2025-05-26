const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    const response = await fetch(url, {
      ...options,
      headers,
    })

    if (!response.ok) {
      const error = await response.text()
      throw new Error(`API Error: ${response.status} - ${error}`)
    }

    return response.json()
  }

  // Authentication
  async login(email: string, password: string) {
    const response = await this.request<{ access_token: string; token_type: string }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    this.setToken(response.access_token)
    return response
  }

  async getCurrentUser() {
    return this.request<any>('/api/auth/me')
  }

  async logout() {
    this.clearToken()
  }

  // Tasks
  async getTasks() {
    return this.request<any[]>('/api/tasks/')
  }

  async createTask(task: any) {
    return this.request<any>('/api/tasks/', {
      method: 'POST',
      body: JSON.stringify(task),
    })
  }

  async updateTask(id: number, task: any) {
    return this.request<any>(`/api/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    })
  }

  async deleteTask(id: number) {
    return this.request<void>(`/api/tasks/${id}`, {
      method: 'DELETE',
    })
  }

  // Projects
  async getProjects() {
    return this.request<any[]>('/api/projects/')
  }

  async createProject(project: any) {
    return this.request<any>('/api/projects/', {
      method: 'POST',
      body: JSON.stringify(project),
    })
  }

  async updateProject(id: number, project: any) {
    return this.request<any>(`/api/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(project),
    })
  }

  async deleteProject(id: number) {
    return this.request<void>(`/api/projects/${id}`, {
      method: 'DELETE',
    })
  }

  // Settings
  async getSettings() {
    return this.request<any>('/api/settings/')
  }

  async updateSettings(settings: any) {
    return this.request<any>('/api/settings/', {
      method: 'PUT',
      body: JSON.stringify(settings),
    })
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
export default apiClient 