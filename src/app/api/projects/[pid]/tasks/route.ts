import { NextRequest, NextResponse } from 'next/server';
import { mockTasks } from '../../_seed';

export async function GET(
  request: NextRequest,
  { params }: { params: { pid: string } }
) {
  try {
    const projectId = params.pid;
    const tasks = mockTasks.filter(task => task.projectId === projectId);
    
    return NextResponse.json(tasks);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch tasks' },
      { status: 500 }
    );
  }
}