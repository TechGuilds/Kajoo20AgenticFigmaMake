import { projectId, publicAnonKey } from './supabase/info';
import { type Workspace, type Project, type Task, type Artifact, type Comment } from '~/types';

// Base API configuration with fallback
const API_BASE_URL = projectId 
  ? `https://${projectId}.supabase.co/functions/v1/make-server-5d020fdc`
  : 'http://localhost:54321/functions/v1/make-server-5d020fdc'; // Fallback for local development

// API client class
class ApiClient {
  private baseUrl: string;
  private defaultHeaders: HeadersInit;

  constructor() {
    this.baseUrl = API_BASE_URL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${publicAnonKey}`,
    };
    
    console.log('🔧 API Client initialized:', {
      baseUrl: this.baseUrl,
      anonKeyLength: publicAnonKey?.length || 0,
      anonKeyPrefix: publicAnonKey ? publicAnonKey.substring(0, 20) + '...' : 'No key provided'
    });
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      ...options,
      headers: {
        ...this.defaultHeaders,
        ...options.headers,
      },
    };

    try {
      console.log(`🌐 API Request: ${config.method || 'GET'} ${url}`);
      console.log('🌐 Request headers:', config.headers);
      if (config.body) {
        console.log('🌐 Request body:', config.body);
      }
      
      const response = await fetch(url, config);
      
      console.log(`🌐 Response status: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        try {
          const errorData = await response.json();
          console.log('🌐 Error response data:', errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
          
          // Improve error messages for common cases
          if (response.status === 404) {
            if (endpoint.includes('/projects/')) {
              errorMessage = 'Project not found';
            } else if (endpoint.includes('/workspaces/')) {
              errorMessage = 'Workspace not found';
            } else if (endpoint.includes('/tasks/')) {
              errorMessage = 'Task not found';
            }
          }
        } catch {
          // If we can't parse the error response, use the default message
          console.log('🌐 Could not parse error response as JSON');
          if (response.status === 404) {
            errorMessage = `Resource not found (404)`;
          }
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log(`✅ API Success: ${config.method || 'GET'} ${url}`, data);
      return data;
    } catch (error) {
      console.error(`❌ API Error: ${config.method || 'GET'} ${url}`, error);
      
      // Enhance network error messages
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Network connection failed - check your internet connection');
      }
      
      throw error;
    }
  }

  // =================== WORKSPACE METHODS ===================

  async getWorkspaces(): Promise<Workspace[]> {
    return this.request<Workspace[]>('/workspaces');
  }

  async getWorkspace(id: string): Promise<Workspace> {
    return this.request<Workspace>(`/workspaces/${id}`);
  }

  async createWorkspace(data: Partial<Workspace>): Promise<Workspace> {
    return this.request<Workspace>('/workspaces', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateWorkspace(id: string, data: Partial<Workspace>): Promise<Workspace> {
    return this.request<Workspace>(`/workspaces/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteWorkspace(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/workspaces/${id}`, {
      method: 'DELETE',
    });
  }

  // =================== PROJECT METHODS ===================

  async getProjectsInWorkspace(workspaceId: string): Promise<Project[]> {
    return this.request<Project[]>(`/workspaces/${workspaceId}/projects`);
  }

  async getProject(id: string): Promise<Project> {
    return this.request<Project>(`/projects/${id}`);
  }

  async createProject(workspaceId: string, data: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/workspaces/${workspaceId}/projects`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProject(id: string, data: Partial<Project>): Promise<Project> {
    return this.request<Project>(`/projects/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteProject(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/projects/${id}`, {
      method: 'DELETE',
    });
  }

  // =================== TASK METHODS ===================

  async getTasksInProject(projectId: string): Promise<Task[]> {
    return this.request<Task[]>(`/projects/${projectId}/tasks`);
  }

  async getTask(id: string): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`);
  }

  async createTask(projectId: string, data: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/projects/${projectId}/tasks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async createTasksBulk(projectId: string, tasks: Partial<Task>[]): Promise<{ message: string; tasks: Task[] }> {
    return this.request<{ message: string; tasks: Task[] }>(`/projects/${projectId}/tasks/bulk`, {
      method: 'POST',
      body: JSON.stringify({ tasks }),
    });
  }

  async updateTask(id: string, data: Partial<Task>): Promise<Task> {
    return this.request<Task>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(id: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/tasks/${id}`, {
      method: 'DELETE',
    });
  }

  // =================== ARTIFACT METHODS ===================

  async getTaskArtifacts(taskId: string): Promise<Artifact[]> {
    return this.request<Artifact[]>(`/tasks/${taskId}/artifacts`);
  }

  async createArtifact(taskId: string, data: Partial<Artifact>): Promise<Artifact> {
    return this.request<Artifact>(`/tasks/${taskId}/artifacts`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // =================== COMMENT METHODS ===================

  async getTaskComments(taskId: string): Promise<Comment[]> {
    return this.request<Comment[]>(`/tasks/${taskId}/comments`);
  }

  async createComment(taskId: string, data: { content: string; isAIGenerated?: boolean }): Promise<Comment> {
    return this.request<Comment>(`/tasks/${taskId}/comments`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // =================== SEARCH METHODS ===================

  async searchTasks(
    workspaceId: string,
    query: string,
    filters?: {
      status?: string;
      priority?: string;
      type?: string;
    }
  ): Promise<Task[]> {
    const searchParams = new URLSearchParams();
    searchParams.append('q', query);
    
    if (filters?.status) searchParams.append('status', filters.status);
    if (filters?.priority) searchParams.append('priority', filters.priority);
    if (filters?.type) searchParams.append('type', filters.type);

    return this.request<Task[]>(`/workspaces/${workspaceId}/search?${searchParams.toString()}`);
  }

  // =================== HEALTH CHECK ===================

  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.request<{ status: string; timestamp: string }>('/health');
  }
}

// Export singleton instance
export const apiClient = new ApiClient();

// Export individual methods for convenience
export const {
  getWorkspaces,
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  deleteWorkspace,
  getProjectsInWorkspace,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getTasksInProject,
  getTask,
  createTask,
  createTasksBulk,
  updateTask,
  deleteTask,
  getTaskArtifacts,
  createArtifact,
  getTaskComments,
  createComment,
  searchTasks,
  healthCheck,
} = apiClient;

// Error handling utilities
export class ApiError extends Error {
  constructor(message: string, public status?: number) {
    super(message);
    this.name = 'ApiError';
  }
}

// Type helpers for API responses
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Utility function for handling API calls with loading states
export async function withApiCall<T>(
  apiCall: () => Promise<T>,
  options: {
    onStart?: () => void;
    onSuccess?: (data: T) => void;
    onError?: (error: Error) => void;
    onFinally?: () => void;
  } = {}
): Promise<T | null> {
  const { onStart, onSuccess, onError, onFinally } = options;

  try {
    onStart?.();
    const result = await apiCall();
    onSuccess?.(result);
    return result;
  } catch (error) {
    const apiError = error instanceof Error ? error : new Error('Unknown API error');
    onError?.(apiError);
    console.error('API call failed:', apiError);
    return null;
  } finally {
    onFinally?.();
  }
}