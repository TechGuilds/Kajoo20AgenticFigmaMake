import { NextRequest, NextResponse } from 'next/server';
import { mockChatThreads, mockTasks } from '../../../../_seed';

export async function GET(
  request: NextRequest,
  { params }: { params: { pid: string; tid: string } }
) {
  try {
    const { pid: projectId, tid: taskId } = params;
    
    // Verify task exists
    const task = mockTasks.find(t => t.projectId === projectId && t.id === taskId);
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    let thread = mockChatThreads.find(thread => 
      thread.projectId === projectId && 
      thread.taskId === taskId &&
      thread.type === 'task'
    );
    
    // Create thread if it doesn't exist
    if (!thread) {
      thread = {
        id: `thread-task-${taskId}`,
        projectId,
        taskId,
        type: 'task',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch task chat thread' },
      { status: 500 }
    );
  }
}