import type { AiLog, Artifact, ArtifactType } from '../../../types';
import { mockArtifacts } from '../_seed';

export async function captureArtifactsFromAttachments(log: AiLog): Promise<void> {
  if (!log.attachments) return;
  
  for (const attachment of log.attachments) {
    if (attachment.createArtifact && attachment.content) {
      // Extract task and project info from thread ID
      const threadParts = log.threadId.split('-');
      if (threadParts.length < 3) continue;
      
      const taskId = threadParts[2];
      const projectId = getProjectIdFromTaskId(taskId);
      
      if (!projectId) continue;
      
      const artifact: Artifact = {
        id: `artifact-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        projectId,
        taskId,
        type: attachment.createArtifact,
        label: attachment.label,
        summary: generateSummary(attachment.createArtifact, attachment.content),
        content: attachment.content,
        meta: generateMeta(attachment.createArtifact, attachment),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // In a real app, save to database
      mockArtifacts.push(artifact);
      
      console.log(`Created artifact: ${artifact.id} for task: ${taskId}`);
    }
  }
}

function getProjectIdFromTaskId(taskId: string): string | null {
  // In a real app, this would query the database
  // For now, we'll extract from mock task data
  const task = mockArtifacts.find(a => a.taskId === taskId);
  return task?.projectId || '1'; // Default to project 1 for demo
}

function generateSummary(type: ArtifactType, content: string): string {
  switch (type) {
    case 'code':
      const lines = content.split('\n').length;
      return `Code file with ${lines} lines`;
    case 'sitecore':
      return 'Sitecore content analysis';
    case 'text':
      try {
        const parsed = JSON.parse(content);
        const keys = Object.keys(parsed).length;
        return `JSON document with ${keys} properties`;
      } catch {
        const words = content.split(' ').length;
        return `Text document with ${words} words`;
      }
    default:
      return 'Generated artifact';
  }
}

function generateMeta(type: ArtifactType, attachment: any): Record<string, any> {
  const meta: Record<string, any> = {
    generatedAt: new Date().toISOString(),
    source: 'ai-agent'
  };
  
  switch (type) {
    case 'code':
      meta.language = detectLanguage(attachment.content || '');
      meta.size = (attachment.content || '').length;
      break;
    case 'sitecore':
      meta.analysisType = 'content-tree';
      break;
    case 'text':
      try {
        JSON.parse(attachment.content || '');
        meta.format = 'json';
      } catch {
        meta.format = 'text';
      }
      break;
  }
  
  return meta;
}

function detectLanguage(content: string): string {
  if (content.includes('import ') && content.includes('export ')) {
    return 'typescript';
  }
  if (content.includes('<?xml')) {
    return 'xml';
  }
  if (content.includes('{') && content.includes('}')) {
    return 'json';
  }
  return 'text';
}