import { useState } from 'react';
import { generateTaskPrompt } from '../utils/taskPrompt';
import { type Workspace, type Project } from '../components/WorkspaceList';
import { DEFAULT_CHAT_PANEL_SIZE } from '../constants/defaults';

interface UseChatTaskManagerProps {
  selectedWorkspace: Workspace | null;
  setSelectedProject: React.Dispatch<React.SetStateAction<Project | null>>;
  setCurrentView: React.Dispatch<React.SetStateAction<any>>;
  setActiveTab: React.Dispatch<React.SetStateAction<any>>;
}

export const useChatTaskManager = ({
  selectedWorkspace,
  setSelectedProject,
  setCurrentView,
  setActiveTab
}: UseChatTaskManagerProps) => {
  const [currentTaskName, setCurrentTaskName] = useState<string | null>(null);
  const [chatCollapsed, setChatCollapsed] = useState(false);
  const [chatPanelSize, setChatPanelSize] = useState(DEFAULT_CHAT_PANEL_SIZE);
  const [pendingTaskPrompt, setPendingTaskPrompt] = useState<string | null>(null);

  const handleTaskTrigger = (taskId: string, context?: string, task?: any) => {
    const taskPrompt = generateTaskPrompt(taskId, selectedWorkspace, context, task);
    const taskName = task?.title || task?.name || `Task ${taskId}`;
    
    setCurrentTaskName(taskName);
    
    if (task?.projectId && selectedWorkspace) {
      const taskProject = selectedWorkspace.projects?.find(p => p.id === task.projectId);
      if (taskProject) {
        setSelectedProject(taskProject);
      }
    }
    
    setChatCollapsed(false);
    setCurrentView('workspace');
    setActiveTab('project-analysis');
    setPendingTaskPrompt(taskPrompt);
  };

  const handleJiraSync = (tasks: any[]) => {
    console.log('Syncing to JIRA:', tasks.length, 'tasks');
  };

  const handleTaskClose = () => {
    setCurrentTaskName(null);
    setSelectedProject(null);
    setActiveTab(null);
    if (selectedWorkspace) {
      setCurrentView('workspace');
    }
  };

  const handlePromptProcessed = () => {
    setPendingTaskPrompt(null);
  };

  const handleChatToggle = () => {
    setChatCollapsed(!chatCollapsed);
  };

  return {
    // State
    currentTaskName,
    chatCollapsed,
    chatPanelSize,
    pendingTaskPrompt,
    
    // Handlers
    handleTaskTrigger,
    handleJiraSync,
    handleTaskClose,
    handlePromptProcessed,
    handleChatToggle,
    setChatPanelSize,
    setCurrentTaskName
  };
};