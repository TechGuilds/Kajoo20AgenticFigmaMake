import { NextRequest, NextResponse } from 'next/server';
import { mockChatThreads } from '../../_seed';

export async function GET(
  request: NextRequest,
  { params }: { params: { pid: string } }
) {
  try {
    const projectId = params.pid;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'project';
    
    let thread = mockChatThreads.find(thread => 
      thread.projectId === projectId && 
      thread.type === type &&
      !thread.taskId
    );
    
    // Create thread if it doesn't exist
    if (!thread) {
      thread = {
        id: `thread-${type}-${projectId}`,
        projectId,
        type: type as 'project' | 'task',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
    }
    
    return NextResponse.json(thread);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch chat thread' },
      { status: 500 }
    );
  }
}