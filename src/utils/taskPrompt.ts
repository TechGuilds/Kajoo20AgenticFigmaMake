import { type Workspace } from '../components/WorkspaceList';

export const generateTaskPrompt = (
  taskId: string, 
  selectedWorkspace: Workspace | null,
  context?: string, 
  task?: any
): string => {
  const timestamp = new Date().toISOString();
  const workspaceName = selectedWorkspace?.name || 'Migration Workspace';
  
  return `# 🚀 Task Execution Request

## Task Details
**Task ID:** ${taskId}
**Workspace:** ${workspaceName}
**Timestamp:** ${timestamp}

## Task Overview
${task ? `**Title:** ${task.title}

**Description:** ${task.description}

**Category:** ${task.category}
**Phase:** ${task.phase}
**Priority:** ${task.priority}
**Status:** ${task.status}

**Assigned Agent:** ${task.assignedAgent}
${task.humanReviewer ? `**Human Reviewer:** ${task.humanReviewer}` : ''}

**Estimated Hours:** ${task.estimatedHours}
**Due Date:** ${task.dueDate}

## Acceptance Criteria
${task.acceptanceCriteria?.map((criteria: string, index: number) => `${index + 1}. ${criteria}`).join('\n') || 'No acceptance criteria defined'}

## Dependencies
${task.dependencies?.length > 0 
  ? task.dependencies.map((dep: any) => `- ${dep.name} (${dep.status})`).join('\n')
  : 'No dependencies'
}

## Context & Instructions
${context || 'No additional context provided'}

## Workspace Context
- **Source System:** ${selectedWorkspace?.sourceSystem}
- **Target System:** ${selectedWorkspace?.targetSystem}
- **Current Phase:** ${selectedWorkspace?.phase}
- **Progress:** ${selectedWorkspace?.progress}%

## Tags
${task.tags?.join(', ') || 'No tags'}` : `**Context:** ${context || 'Task execution requested'}`}

---

Please help me execute this task step by step. Provide specific guidance, code examples, best practices, and actionable recommendations. If this task involves JIRA ticket creation, generate comprehensive ticket details with proper formatting.`;
};