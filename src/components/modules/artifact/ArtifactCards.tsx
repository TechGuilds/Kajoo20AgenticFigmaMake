import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { ArtifactPreviewModal } from '@/components/modules/artifact/ArtifactPreviewModal';
import { 
  FileText, 
  Code, 
  Database, 
  Eye, 
  Download, 
  Copy,
  ExternalLink,
  ChevronRight,
  ChevronDown,
  Folder,
  File,
  FolderOpen,
  Globe,
  Component,
  Settings,
  Image as ImageIcon,
  Layout,
  Circle,
  Layers,
  Zap,
  Search,
  X,
  MoreHorizontal,
  CheckCircle2
} from 'lucide-react';
import type { Artifact } from '~/types';

interface ArtifactCardsProps {
  artifacts: Artifact[];
  taskId: string;
  context?: 'project' | 'task';
  selectedArtifact?: Artifact | null;
  onArtifactSelect?: (artifact: Artifact | null) => void;
}

export function ArtifactCards({ artifacts, taskId, context = 'project', selectedArtifact, onArtifactSelect }: ArtifactCardsProps) {
  const [previewArtifact, setPreviewArtifact] = useState<any>(null);

  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="size-4 text-info" />;
      case 'sitecore': return <Database className="size-4 text-success" />;
      case 'hybrid': 
        return (
          <div className="relative">
            <Database className="size-3 text-success" />
            <Code className="size-3 text-info" />
          </div>
        );
      default: return <FileText className="size-4" />;
    }
  };

  const getArtifactBadgeClass = (type: string) => {
    switch (type) {
      case 'code': return 'bg-info/10 text-info border-info/20';
      case 'sitecore': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted text-muted-foreground border-muted-foreground/20';
    }
  };

  const handleArtifactPreview = (artifact: any) => {
    console.log('Preview artifact:', artifact);
    setPreviewArtifact(artifact);
  };

  const handleCopyContent = async (content: string) => {
    try {
      // Try modern clipboard API first
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(content);
        return;
      }
      
      // Fallback for environments where clipboard API is not available
      const textArea = document.createElement('textarea');
      textArea.value = content;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      
      try {
        document.execCommand('copy');
      } catch (fallbackError) {
        console.error('Fallback copy failed:', fallbackError);
        alert('Copy failed. Please manually copy the text from the content view.');
      } finally {
        document.body.removeChild(textArea);
      }
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
      alert('Copy failed. Please manually copy the text from the content view.');
    }
  };

  const handleDownload = (artifact: Artifact) => {
    const blob = new Blob([artifact.content || ''], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${artifact.label.replace(/\s+/g, '_')}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (artifacts.length === 0) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <Database className="size-8 mx-auto mb-2 opacity-50" />
        <p>No artifacts generated yet</p>
        <p className="mt-1">Artifacts will appear here when the AI creates outputs</p>
      </div>
    );
  }

  return (
    <>
      <div className="w-full min-w-0 p-4 space-y-3 overflow-x-auto">
        <div className="flex items-center justify-between">
          <h3>
            {context === 'task' ? 'Task Artifacts' : 'Project Artifacts'}
          </h3>
          <Badge variant="secondary">
            {artifacts.length} item{artifacts.length !== 1 ? 's' : ''}
          </Badge>
        </div>
        
        <div className="space-y-2">
          {artifacts.map((artifact) => {
            const isSelected = selectedArtifact?.id === artifact.id;
            return (
              <Card 
                key={artifact.id} 
                className={`hover:bg-muted/30 transition-colors cursor-pointer ${
                  isSelected ? 'ring-2 ring-primary bg-primary/5' : ''
                }`}
              >
                <button 
                  className="w-full text-left"
                  onClick={() => {
                    onArtifactSelect?.(artifact);
                    handleArtifactPreview(artifact);
                  }}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {getArtifactIcon(artifact.type)}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="truncate">{artifact.label}</h4>
                            <Badge 
                              variant="outline" 
                              className={getArtifactBadgeClass(artifact.type)}
                            >
                              {artifact.type}
                            </Badge>
                          </div>
                          {artifact.summary && (
                            <p className="text-muted-foreground line-clamp-2">
                              {artifact.summary}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2 text-muted-foreground">
                            <span>{new Date(artifact.createdAt).toLocaleDateString()}</span>
                            {isSelected && (
                              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
                                Previewing
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Eye className={`size-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                    </div>
                  </CardContent>
                </button>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Artifact Preview Modal */}
      <ArtifactPreviewModal
        artifact={previewArtifact}
        isOpen={!!previewArtifact}
        onClose={() => {
          setPreviewArtifact(null);
          onArtifactSelect?.(null);
        }}
        onHighlightInChat={() => {}}
      />
    </>
  );
}
