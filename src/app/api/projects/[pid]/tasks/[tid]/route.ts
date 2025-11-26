import { NextRequest, NextResponse } from 'next/server';
import { mockTasks } from '../../../_seed';

export async function GET(
  request: NextRequest,
  { params }: { params: { pid: string; tid: string } }
) {
  try {
    const { pid: projectId, tid: taskId } = params;
    const task = mockTasks.find(task => 
      task.projectId === projectId && task.id === taskId
    );
    
    if (!task) {
      return NextResponse.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(task);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch task' },
      { status: 500 }
    );
  }
}