import { NextRequest, NextResponse } from 'next/server';
import { mockArtifacts } from '../../../../_seed';

export async function GET(
  request: NextRequest,
  { params }: { params: { pid: string; tid: string } }
) {
  try {
    const { pid: projectId, tid: taskId } = params;
    const artifacts = mockArtifacts.filter(artifact => 
      artifact.projectId === projectId && artifact.taskId === taskId
    );
    
    return NextResponse.json(artifacts);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch artifacts' },
      { status: 500 }
    );
  }
}