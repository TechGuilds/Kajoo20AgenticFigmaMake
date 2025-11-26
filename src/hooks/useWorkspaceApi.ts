import { useState, useEffect, useCallback } from 'react';
import { apiClient, withApiCall } from '../utils/api';
import { type Workspace, type Project, type Task } from '~/types';
import { toast } from 'sonner@2.0.3';

interface UseWorkspaceApiReturn {
  // Data
  workspaces: Workspace[];
  selectedWorkspace: Workspace | null;
  selectedProject: Project | null;
  
  // Loading states
  loading: boolean;
  workspacesLoading: boolean;
  projectsLoading: boolean;
  tasksLoading: boolean;
  
  // Error states
  error: string | null;
  
  // Actions
  loadWorkspaces: () => Promise<void>;
  loadWorkspace: (id: string) => Promise<void>;
  createWorkspace: (data: Partial<Workspace>) => Promise<Workspace | null>;
  updateWorkspace: (id: string, data: Partial<Workspace>) => Promise<void>;
  deleteWorkspace: (id: string) => Promise<void>;
  
  loadProject: (id: string) => Promise<void>;
  createProject: (workspaceId: string, data: Partial<Project>) => Promise<Project | null>;
  updateProject: (id: string, data: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  
  createTask: (projectId: string, data: Partial<Task>) => Promise<Task | null>;
  createTasksBulk: (projectId: string, tasks: Partial<Task>[]) => Promise<Task[] | null>;
  updateTask: (id: string, data: Partial<Task>) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  addComment: (taskId: string, content: string, isAIGenerated?: boolean) => Promise<void>;
  
  // Utilities
  clearError: () => void;
  setSelectedWorkspace: (workspace: Workspace | null) => void;
  setSelectedProject: (project: Project | null) => void;
}

export function useWorkspaceApi(): UseWorkspaceApiReturn {
  // State
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | null>(null);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [workspacesLoading, setWorkspacesLoading] = useState(false);
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  
  // Error state
  const [error, setError] = useState<string | null>(null);

  // Error handling
  const handleError = useCallback((error: Error, context: string) => {
    const message = `${context}: ${error.message}`;
    setError(message);
    
    // Don't show toast errors for connection failures - let the app handle them silently
    if (!error.message.includes('Failed to fetch') && !error.message.includes('timeout') && !error.message.includes('Connection')) {
      toast.error(message);
    }
    
    console.warn(context, error);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // =================== WORKSPACE OPERATIONS ===================

  const loadWorkspaces = useCallback(async () => {
    await withApiCall(
      () => apiClient.getWorkspaces(),
      {
        onStart: () => {
          setWorkspacesLoading(true);
          clearError();
        },
        onSuccess: (data) => {
          setWorkspaces(data);
        },
        onError: (error) => handleError(error, 'Failed to load workspaces'),
        onFinally: () => setWorkspacesLoading(false),
      }
    );
  }, [handleError, clearError]);

  const loadWorkspace = useCallback(async (id: string) => {
    // Skip API calls for demo/offline workspaces
    if (id.includes('demo-workspace') || id.includes('offline') || id.includes('emergency')) {
      console.log('📝 Loading demo workspace locally, skipping API call');
      setLoading(true);
      clearError();
      
      // Check if we already have this workspace in memory
      const existingWorkspace = workspaces.find(w => w.id === id);
      if (existingWorkspace) {
        console.log('✅ Found existing demo workspace');
        setSelectedWorkspace(existingWorkspace);
        setLoading(false);
        return;
      }
      
      // If not found in memory, keep the currently selected workspace or create a minimal one
      if (selectedWorkspace && selectedWorkspace.id === id) {
        console.log('✅ Demo workspace already selected');
      } else {
        console.log('⚠️ Demo workspace not found, keeping current selection');
      }
      
      setLoading(false);
      return;
    }
    
    // For real workspaces, make API calls
    await withApiCall(
      () => apiClient.getWorkspace(id),
      {
        onStart: () => {
          setLoading(true);
          clearError();
        },
        onSuccess: (data) => {
          setSelectedWorkspace(data);
          // Update the workspace in the list if it exists
          setWorkspaces(prev => 
            prev.map(w => w.id === id ? data : w)
          );
        },
        onError: (error) => handleError(error, 'Failed to load workspace'),
        onFinally: () => setLoading(false),
      }
    );
  }, [handleError, clearError, workspaces, selectedWorkspace]);

  const createWorkspace = useCallback(async (data: Partial<Workspace>): Promise<Workspace | null> => {
    return await withApiCall(
      () => apiClient.createWorkspace(data),
      {
        onStart: () => {
          setLoading(true);
          clearError();
        },
        onSuccess: (newWorkspace) => {
          setWorkspaces(prev => [...prev, newWorkspace]);
          setSelectedWorkspace(newWorkspace);
          toast.success('Workspace created successfully');
        },
        onError: (error) => handleError(error, 'Failed to create workspace'),
        onFinally: () => setLoading(false),
      }
    );
  }, [handleError, clearError]);

  const updateWorkspace = useCallback(async (id: string, data: Partial<Workspace>) => {
    await withApiCall(
      () => apiClient.updateWorkspace(id, data),
      {
        onStart: () => {
          setLoading(true);
          clearError();
        },
        onSuccess: (updatedWorkspace) => {
          setWorkspaces(prev => 
            prev.map(w => w.id === id ? updatedWorkspace : w)
          );
          if (selectedWorkspace?.id === id) {
            setSelectedWorkspace(updatedWorkspace);
          }
          toast.success('Workspace updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update workspace'),
        onFinally: () => setLoading(false),
      }
    );
  }, [selectedWorkspace?.id, handleError, clearError]);

  const deleteWorkspace = useCallback(async (id: string) => {
    await withApiCall(
      () => apiClient.deleteWorkspace(id),
      {
        onStart: () => {
          setLoading(true);
          clearError();
        },
        onSuccess: () => {
          setWorkspaces(prev => prev.filter(w => w.id !== id));
          if (selectedWorkspace?.id === id) {
            setSelectedWorkspace(null);
            setSelectedProject(null);
          }
          toast.success('Workspace deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete workspace'),
        onFinally: () => setLoading(false),
      }
    );
  }, [selectedWorkspace?.id, handleError, clearError]);

  // =================== PROJECT OPERATIONS ===================

  const loadProject = useCallback(async (id: string) => {
    // Skip API calls for demo/offline projects - handle them locally
    if (id.includes('demo-project') || id.includes('offline') || id.includes('emergency')) {
      console.log('📝 Loading demo project locally, skipping API call');
      setProjectsLoading(true);
      clearError();
      
      // Check if we already have this project in the selected workspace
      const existingProject = selectedWorkspace?.projects?.find(p => p.id === id);
      if (existingProject) {
        console.log('✅ Found existing demo project in workspace');
        setSelectedProject(existingProject);
        setProjectsLoading(false);
        return;
      }
      
      // Create demo project data
      const demoProject: Project = {
        id: id,
        workspaceId: selectedWorkspace?.id || 'demo-workspace-offline',
        name: 'E-commerce Platform Migration',
        description: 'Migrating legacy e-commerce platform to modern headless architecture',
        status: 'active' as const,
        priority: 'high' as const,
        progress: 35,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        tags: ['e-commerce', 'migration', 'headless'],
        tasks: [
          {
            id: 'demo-task-1-offline',
            projectId: id,
            title: 'Content Architecture Analysis',
            description: 'Analyze existing content structure and identify migration requirements',
            status: 'completed' as const,
            priority: 'high' as const,
            type: 'assessment' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assignee: 'AI Migration Agent',
            tags: ['content', 'analysis'],
            comments: []
          },
          {
            id: 'demo-task-2-offline',
            projectId: id,
            title: 'Component Inventory',
            description: 'Create comprehensive inventory of existing components',
            status: 'in-progress' as const,
            priority: 'high' as const,
            type: 'assessment' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            assignee: 'Migration Team',
            tags: ['components', 'inventory'],
            comments: []
          },
          {
            id: 'demo-task-3-offline',
            projectId: id,
            title: 'Performance Baseline',
            description: 'Establish current performance metrics for comparison',
            status: 'todo' as const,
            priority: 'medium' as const,
            type: 'assessment' as const,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            tags: ['performance', 'metrics'],
            comments: []
          }
        ]
      };
      
      console.log('✅ Created demo project data locally');
      setSelectedProject(demoProject);
      
      // Update workspace with this demo project if needed
      if (selectedWorkspace && !selectedWorkspace.projects?.find(p => p.id === id)) {
        setSelectedWorkspace(prev => prev ? {
          ...prev,
          projects: [...(prev.projects || []), demoProject]
        } : null);
      }
      
      setProjectsLoading(false);
      return;
    }
    
    // For real projects, make API calls with better error handling
    await withApiCall(
      () => apiClient.getProject(id),
      {
        onStart: () => {
          setProjectsLoading(true);
          clearError();
        },
        onSuccess: (data) => {
          setSelectedProject(data);
        },
        onError: (error) => {
          console.error('❌ Failed to load project from API:', error);
          handleError(error, 'Failed to load project');
        },
        onFinally: () => setProjectsLoading(false),
      }
    );
  }, [handleError, clearError, selectedWorkspace]);

  const createProject = useCallback(async (workspaceId: string, data: Partial<Project>): Promise<Project | null> => {
    console.log('🏗️ useWorkspaceApi: Creating project in workspace', workspaceId, 'with data:', data);
    
    return await withApiCall(
      () => apiClient.createProject(workspaceId, data),
      {
        onStart: () => {
          console.log('🏗️ useWorkspaceApi: Starting project creation...');
          setLoading(true);
          clearError();
        },
        onSuccess: (newProject) => {
          console.log('✅ useWorkspaceApi: Project created successfully:', newProject);
          
          // Update the workspace's projects array
          setWorkspaces(prev => 
            prev.map(w => {
              if (w.id === workspaceId) {
                console.log('📊 useWorkspaceApi: Updating workspace projects array');
                return {
                  ...w,
                  projects: [...(w.projects || []), newProject]
                };
              }
              return w;
            })
          );
          
          if (selectedWorkspace?.id === workspaceId) {
            console.log('📊 useWorkspaceApi: Updating selected workspace');
            setSelectedWorkspace(prev => prev ? {
              ...prev,
              projects: [...(prev.projects || []), newProject]
            } : null);
          }
          
          setSelectedProject(newProject);
          // Toast is shown by the caller (App.tsx) to avoid duplicates
        },
        onError: (error) => {
          console.error('❌ useWorkspaceApi: Project creation failed:', error);
          // Don't call handleError here to avoid duplicate toasts - App.tsx handles the error messaging
          setError(`Failed to create project: ${error.message}`);
        },
        onFinally: () => setLoading(false),
      }
    );
  }, [selectedWorkspace?.id, handleError, clearError]);

  const updateProject = useCallback(async (id: string, data: Partial<Project>) => {
    await withApiCall(
      () => apiClient.updateProject(id, data),
      {
        onStart: () => {
          setLoading(true);
          clearError();
        },
        onSuccess: (updatedProject) => {
          // Update project in workspace
          setWorkspaces(prev => 
            prev.map(w => ({
              ...w,
              projects: w.projects?.map(p => p.id === id ? updatedProject : p) || []
            }))
          );
          
          if (selectedWorkspace) {
            setSelectedWorkspace(prev => prev ? {
              ...prev,
              projects: prev.projects?.map(p => p.id === id ? updatedProject : p) || []
            } : null);
          }
          
          if (selectedProject?.id === id) {
            setSelectedProject(updatedProject);
          }
          
          toast.success('Project updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update project'),
        onFinally: () => setLoading(false),
      }
    );
  }, [selectedWorkspace, selectedProject?.id, handleError, clearError]);

  const deleteProject = useCallback(async (id: string) => {
    console.log('🗑️ useWorkspaceApi: Deleting project:', id);
    
    await withApiCall(
      () => apiClient.deleteProject(id),
      {
        onStart: () => {
          console.log('🗑️ useWorkspaceApi: Starting project deletion...');
          setLoading(true);
          clearError();
        },
        onSuccess: () => {
          console.log('✅ useWorkspaceApi: Project deleted successfully, updating state...');
          
          // Remove project from workspace
          setWorkspaces(prev => {
            const updated = prev.map(w => ({
              ...w,
              projects: w.projects?.filter(p => p.id !== id) || []
            }));
            console.log('📊 useWorkspaceApi: Updated workspaces list');
            return updated;
          });
          
          if (selectedWorkspace) {
            console.log('📊 useWorkspaceApi: Updating selected workspace');
            setSelectedWorkspace(prev => prev ? {
              ...prev,
              projects: prev.projects?.filter(p => p.id !== id) || []
            } : null);
          }
          
          if (selectedProject?.id === id) {
            console.log('📊 useWorkspaceApi: Clearing selected project');
            setSelectedProject(null);
          }
          
          toast.success('Project deleted successfully');
        },
        onError: (error) => {
          console.error('❌ useWorkspaceApi: Project deletion failed:', error);
          handleError(error, 'Failed to delete project');
        },
        onFinally: () => setLoading(false),
      }
    );
  }, [selectedWorkspace, selectedProject?.id, handleError, clearError]);

  // =================== TASK OPERATIONS ===================

  const createTask = useCallback(async (projectId: string, data: Partial<Task>): Promise<Task | null> => {
    console.log('🏗️ useWorkspaceApi: Creating task in project', projectId, 'with data:', data);
    
    return await withApiCall(
      () => apiClient.createTask(projectId, data),
      {
        onStart: () => {
          console.log('🏗️ useWorkspaceApi: Starting task creation...');
          setTasksLoading(true);
          clearError();
        },
        onSuccess: (newTask) => {
          console.log('✅ useWorkspaceApi: Task created successfully:', newTask);
          
          // Update project with new task
          if (selectedProject?.id === projectId) {
            console.log('📊 useWorkspaceApi: Updating selected project with new task');
            setSelectedProject(prev => prev ? {
              ...prev,
              tasks: [...(prev.tasks || []), newTask]
            } : null);
          }
          
          toast.success('Task created successfully');
        },
        onError: (error) => {
          console.error('❌ useWorkspaceApi: Task creation failed:', error);
          handleError(error, 'Failed to create task');
        },
        onFinally: () => setTasksLoading(false),
      }
    );
  }, [selectedProject?.id, handleError, clearError]);

  const createTasksBulk = useCallback(async (projectId: string, tasks: Partial<Task>[]): Promise<Task[] | null> => {
    return await withApiCall(
      () => apiClient.createTasksBulk(projectId, tasks),
      {
        onStart: () => {
          setTasksLoading(true);
          clearError();
        },
        onSuccess: (result) => {
          // Update project with new tasks
          if (selectedProject?.id === projectId) {
            setSelectedProject(prev => prev ? {
              ...prev,
              tasks: [...(prev.tasks || []), ...result.tasks]
            } : null);
          }
          
          toast.success(result.message);
        },
        onError: (error) => handleError(error, 'Failed to create tasks'),
        onFinally: () => setTasksLoading(false),
      }
    );
  }, [selectedProject?.id, handleError, clearError]);

  const updateTask = useCallback(async (id: string, data: Partial<Task>) => {
    await withApiCall(
      () => apiClient.updateTask(id, data),
      {
        onStart: () => {
          setLoading(true);
          clearError();
        },
        onSuccess: (updatedTask) => {
          // Update task in project
          if (selectedProject) {
            setSelectedProject(prev => prev ? {
              ...prev,
              tasks: prev.tasks?.map(t => t.id === id ? updatedTask : t) || []
            } : null);
          }
          
          toast.success('Task updated successfully');
        },
        onError: (error) => handleError(error, 'Failed to update task'),
        onFinally: () => setLoading(false),
      }
    );
  }, [selectedProject, handleError, clearError]);

  const deleteTask = useCallback(async (id: string) => {
    await withApiCall(
      () => apiClient.deleteTask(id),
      {
        onStart: () => {
          setLoading(true);
          clearError();
        },
        onSuccess: () => {
          // Remove task from project
          if (selectedProject) {
            setSelectedProject(prev => prev ? {
              ...prev,
              tasks: prev.tasks?.filter(t => t.id !== id) || []
            } : null);
          }
          
          toast.success('Task deleted successfully');
        },
        onError: (error) => handleError(error, 'Failed to delete task'),
        onFinally: () => setLoading(false),
      }
    );
  }, [selectedProject, handleError, clearError]);

  const addComment = useCallback(async (taskId: string, content: string, isAIGenerated = false) => {
    await withApiCall(
      () => apiClient.createComment(taskId, { content, isAIGenerated }),
      {
        onStart: () => clearError(),
        onSuccess: () => {
          toast.success('Comment added successfully');
        },
        onError: (error) => handleError(error, 'Failed to add comment'),
      }
    );
  }, [handleError, clearError]);

  // Load workspaces on mount - removed to prevent immediate API calls
  // useEffect(() => {
  //   loadWorkspaces();
  // }, [loadWorkspaces]);

  return {
    // Data
    workspaces,
    selectedWorkspace,
    selectedProject,
    
    // Loading states
    loading,
    workspacesLoading,
    projectsLoading,
    tasksLoading,
    
    // Error state
    error,
    
    // Actions
    loadWorkspaces,
    loadWorkspace,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    
    loadProject,
    createProject,
    updateProject,
    deleteProject,
    
    createTask,
    createTasksBulk,
    updateTask,
    deleteTask,
    
    addComment,
    
    // Utilities
    clearError,
    setSelectedWorkspace,
    setSelectedProject,
  };
}