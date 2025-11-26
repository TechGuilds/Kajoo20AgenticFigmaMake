import { NextRequest, NextResponse } from 'next/server';
import { mockAiLogs } from '../../../_seed';
import type { AiLog } from '../../../../../types';

export async function GET(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const threadId = params.threadId;
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    const messages = mockAiLogs
      .filter(log => log.threadId === threadId)
      .sort((a, b) => new Date(a.at).getTime() - new Date(b.at).getTime());
    
    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedMessages = messages.slice(startIndex, endIndex);
    
    return NextResponse.json({
      messages: paginatedMessages,
      pagination: {
        page,
        limit,
        total: messages.length,
        hasMore: endIndex < messages.length
      }
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { threadId: string } }
) {
  try {
    const threadId = params.threadId;
    const body = await request.json();
    
    const newMessage: AiLog = {
      id: `msg-${Date.now()}`,
      threadId,
      at: new Date().toISOString(),
      role: 'human',
      message: body.message,
      attachments: body.attachments
    };
    
    // In a real app, save to database
    mockAiLogs.push(newMessage);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse: AiLog = {
        id: `msg-${Date.now()}-ai`,
        threadId,
        at: new Date().toISOString(),
        role: 'agent',
        message: `I understand you said: "${body.message}". How can I help you with this task?`,
        attachments: []
      };
      mockAiLogs.push(aiResponse);
    }, 1000);
    
    return NextResponse.json(newMessage);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}