import { NextRequest, NextResponse } from 'next/server';
import { mockTasks, mockAiLogs } from '../../_seed';

export async function POST(
  request: NextRequest,
  { params }: { params: { tid: string } }
) {
  try {
    const taskId = params.tid;
    const body = await request.json();
    const { action } = body;
    
    const task = mockTasks.find(t => t.id === taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    let result;
    
    switch (action) {
      case 'triggerExecution':
        // Simulate triggering task execution
        result = {
          success: true,
          message: 'Task execution triggered successfully',
          taskId,
          status: 'in-progress'
        };
        
        // Add system message to task thread
        const executionMessage = {
          id: `msg-execution-${Date.now()}`,
          threadId: `thread-task-${taskId}`,
          at: new Date().toISOString(),
          role: 'system' as const,
          message: `Task execution triggered for "${task.title}". The assigned agent (${task.assignedAgent}) will begin processing this task.`
        };
        mockAiLogs.push(executionMessage);
        
        // Add AI agent response
        setTimeout(() => {
          const agentResponse = {
            id: `msg-agent-${Date.now()}`,
            threadId: `thread-task-${taskId}`,
            at: new Date().toISOString(),
            role: 'agent' as const,
            message: `I've received the execution request for this task. Let me start by analyzing the requirements and current status. I'll provide updates as I make progress.`,
            attachments: []
          };
          mockAiLogs.push(agentResponse);
        }, 2000);
        
        break;
        
      case 'syncJira':
        // Mock Jira sync
        const jiraKey = `MIGR-${Math.floor(Math.random() * 1000)}`;
        result = {
          success: true,
          message: 'Task synced to JIRA successfully',
          taskId,
          jira: {
            key: jiraKey,
            url: `https://company.atlassian.net/browse/${jiraKey}`
          }
        };
        
        // Update task with JIRA info
        const taskIndex = mockTasks.findIndex(t => t.id === taskId);
        if (taskIndex >= 0) {
          mockTasks[taskIndex].linkedIssues = [
            ...(mockTasks[taskIndex].linkedIssues || []),
            {
              provider: 'jira',
              key: jiraKey,
              url: `https://company.atlassian.net/browse/${jiraKey}`
            }
          ];
        }
        break;
        
      case 'refresh':
        result = {
          success: true,
          message: 'Task data refreshed',
          taskId,
          task: task
        };
        break;
        
      default:
        return NextResponse.json(
          { error: 'Unknown action' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to execute action' },
      { status: 500 }
    );
  }
}