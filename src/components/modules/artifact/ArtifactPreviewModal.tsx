import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { SitecoreArtifactView, CodeArtifactView } from './ArtifactViewers';
import { 
  X, 
  Send, 
  Paperclip, 
  Bot, 
  Clock, 
  MessageSquare
} from 'lucide-react';

interface ArtifactPreviewModalProps {
  artifact: any;
  isOpen: boolean;
  onClose: () => void;
  onHighlightInChat?: (artifactId: string) => void;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export function ArtifactPreviewModal({ 
  artifact, 
  isOpen, 
  onClose,
  onHighlightInChat 
}: ArtifactPreviewModalProps) {
  const [messageInput, setMessageInput] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: `I'm ready to help you iterate on the "${artifact?.title}" artifact. What changes would you like to make?`,
      timestamp: 'Just now'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageInput,
      timestamp: 'Just now'
    };

    // Simulate AI response
    const aiResponse: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: `I understand you want to: "${messageInput}". Let me help you make those changes to the ${artifact?.title} artifact.`,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage, aiResponse]);
    setMessageInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const renderArtifactPreview = () => {
    if (!artifact) return null;

    switch (artifact.type) {
      case 'sitecore':
        return <SitecoreArtifactView artifact={artifact} />;
      case 'code':
        return <CodeArtifactView artifact={artifact} />;
      case 'hybrid':
        // For hybrid, show code view by default
        return <CodeArtifactView artifact={artifact} />;
      default:
        return (
          <div className="flex items-center justify-center h-full text-center">
            <div>
              <h3>Unsupported Artifact Type</h3>
              <p className="text-muted-foreground">
                Cannot preview artifact of type: {artifact.type}
              </p>
            </div>
          </div>
        );
    }
  };

  const getArtifactTypeStyles = (type: string): string => {
    switch (type) {
      case 'sitecore':
        return 'bg-info/10 text-info border-info/20';
      case 'code':
        return 'bg-success/10 text-success border-success/20';
      case 'hybrid':
        return 'bg-accent-purple/10 text-accent-purple border-accent-purple/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  if (!artifact) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className="!fixed !top-0 !left-0 !translate-x-0 !translate-y-0 !max-w-none !max-h-none !w-screen !h-screen !p-0 !rounded-none !border-none !shadow-none overflow-hidden !gap-0 flex flex-col"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => {
          e.preventDefault();
          onClose();
        }}
      >
        <DialogTitle className="sr-only">{artifact.title} - Artifact Preview</DialogTitle>
        <DialogDescription className="sr-only">
          Preview and interact with the {artifact.type} artifact: {artifact.description}
        </DialogDescription>
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border bg-card flex-shrink-0" style={{ paddingLeft: 'var(--spacing-4)', paddingRight: 'var(--spacing-4)', paddingTop: 'var(--spacing-2)', paddingBottom: 'var(--spacing-2)', height: 'var(--spacing-12)' }}>
          <div className="flex items-center min-w-0 flex-1" style={{ gap: 'var(--spacing-3)' }}>

            <div className="min-w-0 flex-1">
              <div className="flex items-center flex-wrap" style={{ gap: 'var(--spacing-3)' }}>
                <h2 className="truncate leading-none">
                  {artifact.title}
                </h2>
                <Badge 
                  variant="outline" 
                  className={`capitalize leading-none flex-shrink-0 ${getArtifactTypeStyles(artifact.type)}`}
                  style={{ fontSize: 'var(--font-size-xs)' }}
                >
                  {artifact.type}
                </Badge>
                <span className="text-muted-foreground leading-none truncate">
                  {artifact.description}
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center flex-shrink-0" style={{ gap: 'var(--spacing-2)' }}>
            {/* Action buttons removed for cleaner interface */}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Left Panel - Artifact Preview */}
            <ResizablePanel defaultSize={75} minSize={60} maxSize={90}>
              <div className="h-full bg-background">
                {renderArtifactPreview()}
              </div>
            </ResizablePanel>

            <ResizableHandle withHandle />

            {/* Right Panel - Chat Interface */}
            <ResizablePanel defaultSize={25} minSize={10} maxSize={40}>
              <div className="h-full flex flex-col bg-card">
                {/* Chat Header */}
                <div className="border-b border-border flex-shrink-0" style={{ padding: 'var(--spacing-3)' }}>
                  <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                    <Bot className="text-primary" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    <div>
                      <h4>Artifact Assistant</h4>
                      <p className="text-muted-foreground" style={{ fontSize: 'var(--font-size-xs)' }}>
                        Iterate on this artifact
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-hidden">
                  <ScrollArea className="h-full">
                    <div style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                          style={{ gap: 'var(--spacing-2)' }}
                        >
                          {message.role === 'assistant' && (
                            <div className="rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0" style={{ width: 'var(--spacing-6)', height: 'var(--spacing-6)' }}>
                              <Bot className="text-primary" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
                            </div>
                          )}
                          
                          <div className={`
                            max-w-[85%] flex flex-col
                            ${message.role === 'user' ? 'items-end' : 'items-start'}
                          `} style={{ gap: 'var(--spacing-1)' }}>
                            <div className={`
                              rounded-lg whitespace-pre-wrap
                              ${message.role === 'user' 
                                ? 'bg-primary text-primary-foreground' 
                                : 'bg-muted'
                              }
                            `} style={{ padding: 'var(--spacing-2)' }}>
                              {message.content}
                            </div>
                            
                            <div className={`
                              text-muted-foreground flex items-center
                              ${message.role === 'user' ? 'justify-end' : 'justify-start'}
                            `} style={{ fontSize: 'var(--font-size-xs)', gap: 'var(--spacing-1)' }}>
                              <Clock style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)' }} />
                              {message.timestamp}
                            </div>
                          </div>
                          
                          {message.role === 'user' && (
                            <div className="rounded-full bg-secondary flex items-center justify-center flex-shrink-0" style={{ width: 'var(--spacing-6)', height: 'var(--spacing-6)' }}>
                              <span className="text-secondary-foreground" style={{ fontSize: 'var(--font-size-xs)' }}>
                                U
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </div>

                {/* Message Input */}
                <div className="border-t border-border bg-card flex-shrink-0" style={{ padding: 'var(--spacing-3)' }}>
                  <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
                    <div className="flex-1 relative">
                      <Textarea
                        placeholder="Ask about this artifact..."
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="resize-none overflow-y-auto border-2 border-border/50 focus:border-primary/50 bg-background shadow-sm transition-all duration-200"
                        style={{ 
                          height: '10.5rem',
                          paddingTop: 'var(--spacing-4)',
                          paddingLeft: 'var(--spacing-6)',
                          paddingRight: 'var(--spacing-6)',
                          paddingBottom: 'var(--spacing-16)',
                          borderRadius: 'var(--radius-3)'
                        }}
                        rows={6}
                      />
                      <Button 
                        size="sm" 
                        className="absolute"
                        style={{ 
                          right: 'var(--spacing-2)', 
                          bottom: 'var(--spacing-2)', 
                          height: 'var(--spacing-6)', 
                          width: 'var(--spacing-6)', 
                          padding: 0 
                        }}
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                      >
                        <Send style={{ width: 'var(--spacing-2)', height: 'var(--spacing-2)' }} />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </div>
      </DialogContent>
    </Dialog>
  );
}
