import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './components/modules/shared';
import { CreditProvider } from './components/modules/credit';
import { AppLayout } from './components/modules/layout';
import { Dashboard } from './components/modules/workspace';
import { CreditManagementDemo } from './components/modules/credit';

import { ProjectSetup, ProjectSettings } from './components/modules/project';
import { ProjectOverview } from './components/modules/workspace';
import { ProjectUnifiedRedesigned } from './components/ProjectUnifiedRedesigned';
import { WorkspaceSettings } from './components/modules/workspace';
import { GeneralSettings } from './components/modules/settings';

import { Button } from './components/ui/button';
import { Toaster } from './components/ui/sonner';
import { Database, FolderOpen, RefreshCw, AlertCircle, Plus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import { 
  WorkspaceOverviewSkeleton, 
  ProjectOverviewSkeleton, 
  TaskDetailSkeleton, 
  SettingsSkeleton 
} from './components/modules/ui/SkeletonLoaders';

import { type View, type TabPanel, type Workspace, type Project, type Task } from '~/types';
import { useWorkspaceApi } from './hooks/useWorkspaceApi';
import { seedDatabase, resetDatabase } from './utils/seedData';
import { testDatabaseConnection } from './utils/testConnection';
import { testWorkspaceCreation, testWorkspaceList } from './utils/debugWorkspace';

function AppContent() {
  const [currentView, setCurrentView] = useState<View>('workspace-overview');
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [activeTab, setActiveTab] = useState<TabPanel>(null);
  const [previousView, setPreviousView] = useState<View>('workspace-overview');
  
  // Use the API hook for all workspace/project/task management
  const {
    workspaces,
    selectedWorkspace,
    selectedProject,
    loading,
    workspacesLoading,
    error,
    loadWorkspaces,
    loadWorkspace,
    loadProject,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    createProject,
    updateProject,
    deleteProject,
    createTask,
    createTasksBulk,
    updateTask,
    deleteTask,
    addComment,
    clearError,
    setSelectedWorkspace,
    setSelectedProject,
  } = useWorkspaceApi();
  
  // Chat and task state
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [chatPanelSize, setChatPanelSize] = useState(25);
  const [pendingTaskPrompt, setPendingTaskPrompt] = useState<string | null>(null);
  const [isSeeding, setIsSeeding] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [pendingProjectMessage, setPendingProjectMessage] = useState<{
    userMessage: string;
    aiResponse: string;
  } | null>(null);
  const [pendingProjectNavigation, setPendingProjectNavigation] = useState<string | null>(null);

  // Initialize database with sample data on first load
  useEffect(() => {
    const initializeDatabase = async () => {
      try {
        console.log('🚀 Initializing application...');
        
        // Create fallback workspace immediately to prevent loading state
        const createFallbackWorkspace = () => {
          // Use stable IDs for demo data to prevent API lookup failures
          const workspaceId = 'demo-workspace-offline';
          const projectId = 'demo-project-offline';
          
          const fallbackWorkspace = {
            id: workspaceId,
            name: 'Demo Workspace',
            description: 'Demo workspace with sample migration project',
            sourceSystem: 'Legacy Sitecore XP',
            targetSystem: 'Sitecore XM Cloud',
            projects: [
              {
                id: projectId,
                workspaceId: workspaceId,
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
                    projectId: projectId,
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
                    projectId: projectId,
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
                    projectId: projectId,
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
              }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          
          console.log('✅ Created demo workspace for offline use');
          setSelectedWorkspace(fallbackWorkspace);
          return fallbackWorkspace;
        };
        
        // Try to load workspaces with aggressive timeout
        const withTimeout = (promise: Promise<any>, timeoutMs: number = 2000) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Connection timeout')), timeoutMs)
            )
          ]);
        };
        
        try {
          // Attempt to load workspaces with very short timeout
          console.log('🔄 Attempting to connect to server...');
          await withTimeout(loadWorkspaces(), 2000);
          console.log('✅ Successfully connected to server');
        } catch (connectionError) {
          // Silent fallback - don't show error to user
          console.log('🔄 Server unavailable, using demo mode');
          createFallbackWorkspace();
          
          // Show a subtle notification instead of an error
          toast('Running in demo mode', {
            description: 'Full functionality available when server is connected',
            duration: 3000
          });
        }
        
        console.log('✅ Application initialized successfully');
      } catch (error) {
        // Final fallback with minimal error handling
        console.log('🔄 Initializing with demo data');
        
        const emergencyWorkspace = {
          id: 'demo-workspace-emergency',
          name: 'Demo Workspace',
          description: 'Demo workspace for offline use',
          sourceSystem: 'Legacy System',
          targetSystem: 'Modern Platform',
          projects: [
            {
              id: 'demo-project-emergency',
              workspaceId: 'demo-workspace-emergency',
              name: 'Sample Migration Project',
              description: 'Get started with your first migration project',
              status: 'planning' as const,
              priority: 'medium' as const,
              progress: 0,
              createdAt: new Date().toISOString(),
              lastActivity: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              tags: ['getting-started'],
              tasks: []
            }
          ],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        setSelectedWorkspace(emergencyWorkspace);
        
        toast('Demo mode active', {
          description: 'Create your first project to get started',
          duration: 3000
        });
      }
    };

    // Initialize after a short delay to ensure smooth startup
    const timeoutId = setTimeout(initializeDatabase, 100);
    
    return () => clearTimeout(timeoutId);
  }, []);

  // Auto-select default workspace when workspaces are loaded
  useEffect(() => {
    if (workspaces.length > 0 && !selectedWorkspace && !workspacesLoading) {
      console.log('🎯 Auto-selecting default workspace:', workspaces[0].name);
      setSelectedWorkspace(workspaces[0]);
    }
  }, [workspaces, selectedWorkspace, workspacesLoading, setSelectedWorkspace]);

  // Handle navigation after project creation from chat
  useEffect(() => {
    if (pendingProjectNavigation && selectedProject && selectedProject.id === pendingProjectNavigation) {
      console.log('🎯 Selected project is now available, navigating to project view:', selectedProject.id);
      
      // Navigate to project view
      setSelectedTask(null);
      setCurrentView('project-overview');
      setActiveTab(null);
      setIsTransitioning(false);
      
      // Clear the pending navigation
      setPendingProjectNavigation(null);
      
      console.log('✅ Successfully navigated to project with chat message');
    }
  }, [selectedProject, pendingProjectNavigation]);

  // Status color utility - using design system colors
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return 'bg-success';
      case 'planning': return 'bg-warning';
      case 'paused': return 'bg-muted-foreground';
      case 'completed': return 'bg-primary';
      default: return 'bg-muted-foreground/60';
    }
  };

  const generateTaskPrompt = (taskId: string, context?: string, task?: any): string => {
    const timestamp = new Date().toLocaleString();
    const workspaceName = selectedWorkspace?.name || 'Migration Workspace';
    const projectName = selectedProject?.name || 'Current Project';
    
    if (!task) {
      return `🤖 **Task Execution Request**\n\n**Task ID:** ${taskId}\n**Workspace:** ${workspaceName}\n**Project:** ${projectName}\n**Requested:** ${timestamp}\n**Context:** ${context || 'Unknown'}\n\nExecuting task with AI assistance...`;
    }

    // Format task details for display
    const taskDetails = `🤖 **Executing Task with AI**

**Task:** ${task.title}
**Description:** ${task.description || 'No description provided'}
**Priority:** ${task.priority?.toUpperCase() || 'MEDIUM'}
**Type:** ${task.type?.charAt(0).toUpperCase() + task.type?.slice(1) || 'Assessment'}
${task.assignee ? `**Assignee:** ${task.assignee}` : '**Assignee:** Unassigned'}
${task.status ? `**Status:** ${task.status.charAt(0).toUpperCase() + task.status.slice(1).replace('-', ' ')}` : ''}
${task.tags && task.tags.length > 0 ? `**Tags:** ${task.tags.join(', ')}` : ''}

**Workspace:** ${workspaceName}
**Project:** ${projectName}
**Execution Context:** ${context || 'Task List'}
**Requested:** ${timestamp}

---

I'm analyzing this task and will provide recommendations, implementation steps, and any artifacts needed to complete it successfully.`;

    return taskDetails;
  };

  // Database management handlers - removed seeding to prevent timeout issues

  // Workspace handlers
  const handleWorkspaceCreate = async (workspaceData: any) => {
    console.log('🏗️ Creating workspace with data:', workspaceData);
    
    try {
      // Add timeout wrapper for workspace creation
      const createWithTimeout = (promise: Promise<any>, timeoutMs: number = 5000) => {
        return Promise.race([
          promise,
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error(`Workspace creation timed out after ${timeoutMs}ms`)), timeoutMs)
          )
        ]);
      };

      const newWorkspace = await createWithTimeout(createWorkspace({
        name: workspaceData.name,
        description: workspaceData.description || '',
        sourceSystem: workspaceData.sourceSystem || 'To be configured',
        targetSystem: workspaceData.targetSystem || 'To be configured',
        teamSize: workspaceData.teamSize || 1,
        estimatedDuration: workspaceData.estimatedDuration || 'TBD',
      }));
      
      console.log('✅ Workspace created successfully:', newWorkspace);
      
      if (newWorkspace) {
        setSelectedTask(null);
        setCurrentView('workspace-overview');
        setActiveTab(null);
        toast.success('Workspace created successfully');
      } else {
        console.error('❌ Workspace creation returned null');
        toast.error('Failed to create workspace - no data returned');
      }
    } catch (error) {
      console.error('❌ Error in handleWorkspaceCreate:', error);
      if (error.message.includes('timed out')) {
        toast.error('Workspace creation timed out', {
          description: 'Please check your connection and try again'
        });
      } else {
        toast.error(`Failed to create workspace: ${error.message}`);
      }
    }
  };

  const handleWorkspaceSelect = async (workspace: Workspace) => {
    console.log('🎯 Selecting workspace:', workspace.name);
    
    // Set view and transition state FIRST
    setCurrentView('workspace-overview');
    setIsTransitioning(true);
    setSelectedProject(null);
    setSelectedTask(null);
    setActiveTab(null);
    
    console.log('🎨 Workspace skeleton should now be visible');
    
    // Force brief delay for skeleton render
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      // Show skeleton for minimum 1500ms
      const startTime = Date.now();
      
      const [workspaceData] = await Promise.all([
        loadWorkspace(workspace.id),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      
      const elapsed = Date.now() - startTime;
      console.log(`✅ Workspace load complete - elapsed: ${elapsed}ms`);
      
      setIsTransitioning(false);
    } catch (error) {
      console.error('Error loading workspace:', error);
      setIsTransitioning(false);
    }
  };

  const handleProjectSelect = async (project: Project) => {
    console.log('🎯 STEP 1: Starting project selection for:', project.name);
    
    // IMPORTANT: Set the view and transition state FIRST so skeleton can render
    setCurrentView('project-overview');
    setIsTransitioning(true);
    setSelectedTask(null);
    setActiveTab(null);
    
    console.log('🎨 Skeleton should now be visible');
    
    // Force a brief delay to ensure skeleton renders
    await new Promise(resolve => setTimeout(resolve, 50));
    
    try {
      // For demo projects, skip workspace loading and use local data
      if (project.id.includes('demo-project') || project.id.includes('offline') || project.id.includes('emergency')) {
        console.log('📝 Demo project selected - using local data');
        
        // Show skeleton for minimum 2000ms for better visibility
        console.log('⏰ Starting 2000ms skeleton display timer...');
        const startTime = Date.now();
        
        const [projectData] = await Promise.all([
          loadProject(project.id),
          new Promise(resolve => setTimeout(resolve, 2000))
        ]);
        
        const elapsed = Date.now() - startTime;
        console.log(`✅ Timer complete - elapsed: ${elapsed}ms`);
        
        // Hide skeleton - view is already set to project-overview
        console.log('🎯 STEP 2: Hiding skeleton');
        setIsTransitioning(false);
        return;
      }
      
      // For real projects, load full project data
      const [projectData] = await Promise.all([
        loadProject(project.id),
        new Promise(resolve => setTimeout(resolve, 2000)) // Minimum skeleton display time
      ]);
      
      // Ensure we have the right workspace selected
      if (!selectedWorkspace || selectedWorkspace.id !== project.workspaceId) {
        try {
          await loadWorkspace(project.workspaceId);
        } catch (workspaceError) {
          console.log('⚠️ Workspace loading failed, continuing with current workspace');
        }
      }
      
      // Hide skeleton
      setIsTransitioning(false);
    } catch (error) {
      console.error('Error loading project:', error);
      
      // Still navigate to project view with whatever data we have
      if (!selectedProject || selectedProject.id !== project.id) {
        setSelectedProject(project);
      }
      setIsTransitioning(false);
    }
  };

  const handleTaskSelect = (task: Task) => {
    setSelectedTask(task);
    setCurrentView('task-detail');
  };

  const handleTaskClose = () => {
    setSelectedTask(null);
    if (selectedProject) {
      setCurrentView('project-overview');
    } else {
      setCurrentView('workspace-overview');
    }
  };

  const handleWorkspaceUpdate = async (workspaceId: string, updates: Partial<Workspace>) => {
    await updateWorkspace(workspaceId, updates);
  };

  const handleProjectUpdate = async (projectId: string, updates: Partial<Project>) => {
    await updateProject(projectId, updates);
  };

  const handleProjectCreate = async (workspaceId: string, projectData: any) => {
    console.log('🏗️ Creating project with data:', projectData);
    
    try {
      const newProject = await createProject(workspaceId, {
        name: projectData.name,
        description: projectData.description || '',
        status: projectData.status || 'planning',
        dueDate: projectData.dueDate,
        tags: projectData.tags || []
      });
      
      console.log('✅ Project created successfully:', newProject);
      
      if (newProject) {
        // If this project was created from a chat message, navigate to it immediately
        if (projectData.createdFromMessage) {
          console.log('🎯 Project created from chat message - navigating immediately');
          
          // Set the project as selected immediately (we already have the full data from creation)
          setSelectedProject(newProject);
          
          // Navigate to the project view immediately
          setSelectedTask(null);
          setCurrentView('project-overview');
          setActiveTab(null);
          setIsTransitioning(false);
          
          console.log('✅ Immediately navigated to project-overview for chat-created project');
          
        } else {
          // Regular project creation flow - navigate with slight delay for smooth transition
          setTimeout(() => {
            setSelectedProject(newProject);
            setSelectedTask(null);
            setCurrentView('project-overview');
            setActiveTab(null);
            setIsTransitioning(false);
          }, 300);
        }
        
        // Reload workspace in background to update the project list (don't block navigation)
        loadWorkspace(workspaceId).catch(error => {
          console.warn('⚠️ Background workspace reload failed:', error.message);
        });
        
        toast.success('Project created successfully');
      } else {
        console.error('❌ Project creation returned null');
        toast.error('Failed to create project - no data returned');
      }
    } catch (error) {
      console.error('❌ Error in handleProjectCreate:', error);
      setIsTransitioning(false);
      
      if (error.message?.includes('timed out')) {
        toast.error('Project creation timed out', {
          description: 'Please check your connection and try again'
        });
      } else {
        toast.error(`Failed to create project: ${error.message || 'Unknown error'}`);
      }
    }
  };

  const handleTaskUpdate = async (taskId: string, updates: Partial<Task>) => {
    await updateTask(taskId, updates);
  };

  const handleCommentAdd = async (taskId: string, comment: string) => {
    await addComment(taskId, comment, false);
  };

  const handleProjectDelete = async (projectId: string) => {
    console.log('🗑️ Deleting project:', projectId);
    
    try {
      await deleteProject(projectId);
      console.log('✅ Project deleted successfully');
      
      // If the deleted project was selected, clear selection
      if (selectedProject?.id === projectId) {
        setSelectedProject(null);
        setSelectedTask(null);
        setCurrentView('workspace-overview');
      }
      
      // Reload workspace to get updated project list
      if (selectedWorkspace) {
        await loadWorkspace(selectedWorkspace.id);
      }
      
      toast.success('Project deleted successfully');
    } catch (error) {
      console.error('❌ Error in handleProjectDelete:', error);
      toast.error(`Failed to delete project: ${error.message}`);
    }
  };

  const handleWorkspaceDelete = async (workspaceId: string) => {
    await deleteWorkspace(workspaceId);
    
    if (selectedWorkspace?.id === workspaceId) {
      setSelectedWorkspace(null);
      setSelectedProject(null);
      setSelectedTask(null);
      setCurrentView('dashboard');
    }
  };

  const handleViewChange = (view: View) => {
    // Store previous view when entering settings mode (but not when exiting)
    if (!isSettingsView(currentView) && isSettingsView(view)) {
      setPreviousView(currentView);
    }
    // Store previous view when navigating between non-settings views
    else if (!isSettingsView(currentView) && !isSettingsView(view)) {
      setPreviousView(currentView);
    }
    // Don't update previousView when going FROM settings to another view
    
    // If navigating back to workspace overview from project view, show skeleton
    if (view === 'workspace-overview' && currentView === 'project-overview') {
      console.log('🎯 Navigating back to workspace overview - showing skeleton');
      setIsTransitioning(true);
      setCurrentView(view);
      setSelectedProject(null);
      setSelectedTask(null);
      setActiveTab(null);
      
      // Show skeleton for a minimum duration
      setTimeout(() => {
        setIsTransitioning(false);
        console.log('✅ Workspace overview skeleton complete');
      }, 1500);
      return;
    }
    
    setCurrentView(view);
    
    // Clear selections based on view - removed dashboard case since it no longer exists
    if (view === 'workspace-overview') {
      setSelectedProject(null);
      setSelectedTask(null);
      setActiveTab(null);
    } else if (view === 'project-overview') {
      setSelectedTask(null);
      setActiveTab(null);
    }
  };

  // Helper function to determine if a view is a settings view
  const isSettingsView = (view: View): boolean => {
    return view === 'workspace-settings' || view === 'project-settings' || view === 'general-settings';
  };

  // Handler to go back from settings
  const handleBackFromSettings = () => {
    setCurrentView(previousView);
  };

  const handleTabChange = (tab: TabPanel) => {
    setActiveTab(tab);
    setCurrentView('workspace-overview'); // Keep in workspace context
  };



  const handleCreateTask = async (taskData?: any) => {
    if (!selectedProject) return;
    
    console.log('🏗️ Creating task for project:', selectedProject.id);
    
    try {
      // If no taskData provided, create a default task for testing
      const defaultTaskData = {
        title: 'New Task',
        description: 'Task created from the interface',
        status: 'todo' as const,
        priority: 'medium' as const,
        type: 'assessment' as const,
        tags: [],
        dependencies: []
      };
      
      const newTask = await createTask(selectedProject.id, taskData || defaultTaskData);
      
      console.log('✅ Task created successfully:', newTask);
      
      if (newTask) {
        // Reload project to get updated task list
        await loadProject(selectedProject.id);
        toast.success('Task created successfully');
      } else {
        console.error('❌ Task creation returned null');
        toast.error('Failed to create task - no data returned');
      }
    } catch (error) {
      console.error('❌ Error in handleCreateTask:', error);
      toast.error(`Failed to create task: ${error.message}`);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    console.log('🗑️ Deleting task:', taskId);
    
    try {
      await deleteTask(taskId);
      console.log('✅ Task deleted successfully');
      
      // If the deleted task was selected, clear selection
      if (selectedTask?.id === taskId) {
        setSelectedTask(null);
      }
      
      // Reload project to get updated task list
      if (selectedProject) {
        await loadProject(selectedProject.id);
      }
      
      toast.success('Task deleted successfully');
    } catch (error) {
      console.error('❌ Error in handleTaskDelete:', error);
      toast.error(`Failed to delete task: ${error.message}`);
    }
  };

  const handleGenerateTasks = async () => {
    if (!selectedProject || !selectedWorkspace) return;
    
    // Sample AI-generated tasks for demonstration
    const aiGeneratedTasks = [
      {
        title: 'Content Architecture Analysis',
        description: 'Analyze existing content structure and identify migration requirements for the new platform.',
        status: 'todo' as const,
        priority: 'high' as const,
        type: 'assessment' as const,
        tags: ['content', 'analysis', 'architecture'],
        dependencies: []
      },
      {
        title: 'Component Inventory and Mapping',
        description: 'Create comprehensive inventory of existing components and map them to new architecture.',
        status: 'todo' as const,
        priority: 'high' as const,
        type: 'assessment' as const,
        tags: ['components', 'mapping', 'inventory'],
        dependencies: []
      },
      {
        title: 'Performance Baseline Assessment',
        description: 'Establish current performance metrics and benchmarks for migration comparison.',
        status: 'todo' as const,
        priority: 'medium' as const,
        type: 'assessment' as const,
        tags: ['performance', 'baseline', 'metrics'],
        dependencies: []
      }
    ];

    try {
      const result = await createTasksBulk(selectedProject.id, aiGeneratedTasks);
      if (result) {
        toast.success(`Generated ${result.length} tasks successfully`);
        // Reload project to get updated task list
        await loadProject(selectedProject.id);
      }
    } catch (error) {
      console.error('Failed to generate tasks:', error);
      toast.error('Failed to generate tasks');
    }
  };

  // Error display component
  const ErrorDisplay = () => {
    if (!error) return null;
    
    const handleRetryWithTimeout = async () => {
      try {
        const retryWithTimeout = (promise: Promise<any>, timeoutMs: number = 3000) => {
          return Promise.race([
            promise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error(`Retry timed out after ${timeoutMs}ms`)), timeoutMs)
            )
          ]);
        };
        
        await retryWithTimeout(loadWorkspaces());
        toast.success('Connection restored');
      } catch (retryError) {
        console.warn('⚠️ Retry failed:', retryError.message);
        toast.error('Retry failed - continuing in offline mode');
        clearError();
      }
    };
    
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
          <h3>Connection Issue</h3>
          <p className="text-muted-foreground mb-4">
            {error.includes('timeout') 
              ? 'The connection is taking too long. You can continue in offline mode or try again.'
              : error
            }
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button onClick={clearError} variant="outline">
              Continue Offline
            </Button>
            <Button onClick={handleRetryWithTimeout} className="bg-success hover:bg-success/90 text-success-foreground">
              <RefreshCw className="size-4 mr-2" />
              Quick Retry
            </Button>
            <Button 
              onClick={() => window.location.reload()} 
              className="bg-warning hover:bg-warning/90 text-warning-foreground"
            >
              <Database className="size-4 mr-2" />
              Refresh Page
            </Button>
          </div>
        </div>
      </div>
    );
  };

  const renderMainContent = () => {
    // Show error state if there's an error
    if (error) {
      return <ErrorDisplay />;
    }

    // Show loading state for initial load
    if (workspacesLoading && workspaces.length === 0) {
      return (
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <RefreshCw className="size-8 animate-spin text-primary mx-auto mb-4" />
            <h3>Loading Workspaces</h3>
            <p className="text-muted-foreground">Initializing application...</p>
            <div className="mt-4">
              <Button 
                onClick={clearError} 
                variant="outline" 
                size="sm"
                className="mr-2"
              >
                Skip Loading
              </Button>
              <Button 
                onClick={() => window.location.reload()} 
                variant="outline" 
                size="sm"
                className="bg-warning hover:bg-warning/90 text-warning-foreground"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    switch (currentView) {
      case 'workspace-setup':
        return (
          <div className="h-full">
            <ProjectSetup 
              onProjectCreate={handleWorkspaceCreate}
              onCancel={() => handleViewChange('workspace-overview')}
            />
          </div>
        );

      case 'workspace-overview':
        // If no workspace is selected and no workspaces exist, show workspace creation prompt
        if (!selectedWorkspace && workspaces.length === 0 && !workspacesLoading) {
          return (
            <div className="h-full flex items-center justify-center">
              <div className="text-center max-w-md">
                <Database className="size-16 text-muted-foreground mx-auto mb-6" />
                <h2 className="text-xl mb-4">Welcome to Kajoo 2.0</h2>
                <p className="text-muted-foreground mb-8">
                  Get started by creating your first workspace for managing DXP migration projects.
                </p>
                <Button onClick={() => handleViewChange('workspace-setup')} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Plus className="size-4 mr-2" />
                  Create Your First Workspace
                </Button>
              </div>
            </div>
          );
        }
        
        // Show skeleton loader during transition to workspace overview
        if (isTransitioning) {
          console.log('🎨 SHOWING WORKSPACE SKELETON - isTransitioning:', isTransitioning);
          return <WorkspaceOverviewSkeleton />;
        }
        
        return (
          <div className="h-full">
            <ProjectOverview 
              selectedWorkspace={selectedWorkspace} 
              availableWorkspaces={workspaces}
              onProjectClick={handleProjectSelect}
              onProjectCreate={handleProjectCreate}
              onProjectDelete={handleProjectDelete}
              onConfigureWorkspace={() => {
                handleViewChange('workspace-settings');
              }}
              onWorkspaceUpdate={handleWorkspaceUpdate}
              onWorkspaceSelect={handleWorkspaceSelect}
              onCreateWorkspace={() => handleViewChange('workspace-setup')}
              onSetProjectMessage={setPendingProjectMessage}
              standalone={true}
            />
          </div>
        );

      case 'project-overview':
        if (!selectedProject) {
          return (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <FolderOpen className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3>No Project Selected</h3>
                <p className="text-muted-foreground mb-4">Select a project to view details</p>
                <Button onClick={() => handleViewChange('workspace-overview')}>
                  <FolderOpen className="size-4 mr-2" />
                  Browse Workspaces
                </Button>
              </div>
            </div>
          );
        }
        
        // Show skeleton loader during transition
        if (isTransitioning) {
          console.log('🎨 SHOWING SKELETON LOADER - isTransitioning:', isTransitioning);
          return <ProjectOverviewSkeleton />;
        }
        
        console.log('✅ SHOWING ACTUAL CONTENT - isTransitioning:', isTransitioning);
        
        return (
          <div className="h-full overflow-hidden">
            <ProjectUnifiedRedesigned
              selectedProject={selectedProject}
              selectedTask={selectedTask}
              onTaskTrigger={(taskId, context, task) => {
                const prompt = generateTaskPrompt(taskId, context, task);
                setPendingTaskPrompt(prompt);
              }}
              onJiraSync={(tasks) => {
                console.log('Sync tasks to JIRA:', tasks);
              }}
              chatCollapsed={chatCollapsed}
              onChatToggle={() => setChatCollapsed(!chatCollapsed)}
              chatPanelSize={chatPanelSize}
              onChatPanelResize={setChatPanelSize}
              taskPrompt={pendingTaskPrompt}
              onPromptProcessed={() => setPendingTaskPrompt(null)}
              onTaskUpdate={handleTaskUpdate}
              onCommentAdd={handleCommentAdd}
              onTaskDelete={handleTaskDelete}
              onCreateTask={handleCreateTask}
              onGenerateTasks={handleGenerateTasks}
              pendingProjectMessage={pendingProjectMessage}
              onClearPendingMessage={() => setPendingProjectMessage(null)}
            />
          </div>
        );



      case 'task-detail':
        if (!selectedTask) {
          return (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Database className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3>No Task Selected</h3>
                <p className="text-muted-foreground mb-4">Select a task to view details</p>
                <Button onClick={() => handleViewChange('task-list')}>
                  View Tasks
                </Button>
              </div>
            </div>
          );
        }
        return (
          <div className="h-full overflow-hidden">
            <TaskDetailView
              task={selectedTask}
              onBack={() => setCurrentView('project-overview')}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onCommentAdd={handleCommentAdd}
            />
          </div>
        );
      
      case 'workspace-settings':
        return (
          <div className="h-full overflow-y-auto">
            <WorkspaceSettings />
          </div>
        );

      case 'project-settings':
        return (
          <div className="h-full overflow-y-auto">
            <ProjectSettings 
              project={selectedProject} 
              onProjectUpdate={handleProjectUpdate}
            />
          </div>
        );

      case 'general-settings':
        return (
          <div className="h-full overflow-y-auto">
            <GeneralSettings />
          </div>
        );

      case 'artifacts':
        return (
          <div className="h-full overflow-hidden">
            <ArtifactsView projectId={selectedProject?.id} />
          </div>
        );

      case 'credit-demo':
        return (
          <div className="h-full overflow-y-auto">
            <CreditManagementDemo />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <AppLayout
      currentView={currentView}
      selectedWorkspace={selectedWorkspace}
      selectedProject={selectedProject}
      selectedTask={selectedTask}
      activeTab={activeTab}
      workspaces={workspaces}
      onViewChange={handleViewChange}
      onTabChange={handleTabChange}
      onWorkspaceSelect={handleWorkspaceSelect}
      onProjectSelect={handleProjectSelect}
      onTaskSelect={handleTaskSelect}
      onTaskClose={handleTaskClose}
      getStatusColor={getStatusColor}
      onBackFromSettings={handleBackFromSettings}
      onCreateWorkspace={() => handleViewChange('workspace-setup')}
    >
      <div className="h-full overflow-hidden">
        {renderMainContent()}
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CreditProvider>
        <AppContent />
        <Toaster />
      </CreditProvider>
    </ThemeProvider>
  );
}