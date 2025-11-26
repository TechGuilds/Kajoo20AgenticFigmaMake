import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { 
  Bot, 
  Cpu, 
  Code, 
  Palette, 
  FileText, 
  Search, 
  CheckCircle,
  AlertCircle,
  Settings,
  Zap,
  X
} from 'lucide-react';

interface Agent {
  id: string;
  name: string;
  handle: string;
  role: string;
  avatar: React.ComponentType<{ className?: string }>;
  status: 'online' | 'busy' | 'away' | 'offline';
  description: string;
  colorClass: string; // Now uses CSS-based color classes
}

interface MentionInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit?: (value: string) => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

// Mock AI Agents for Kajoo platform - updated to use design system colors
const agents: Agent[] = [
  {
    id: 'architect',
    name: 'Migration Architect',
    handle: 'architect',
    role: 'Lead Migration Planning',
    avatar: Cpu,
    status: 'online',
    description: 'Plans and orchestrates migration strategies',
    colorClass: 'bg-primary text-primary-foreground'
  },
  {
    id: 'analyzer',
    name: 'Code Analyzer',
    handle: 'analyzer',
    role: 'Legacy Code Analysis',
    avatar: Code,
    status: 'online',
    description: 'Analyzes legacy codebases and dependencies',
    colorClass: 'bg-success text-success-foreground'
  },
  {
    id: 'designer',
    name: 'UI Migration Designer',
    handle: 'designer',
    role: 'Design System Migration',
    avatar: Palette,
    status: 'busy',
    description: 'Migrates design systems and UI components',
    colorClass: 'bg-primary text-primary-foreground'
  },
  {
    id: 'content',
    name: 'Content Migration Agent',
    handle: 'content',
    role: 'Content & Data Migration',
    avatar: FileText,
    status: 'online',
    description: 'Handles content and data transformation',
    colorClass: 'bg-warning text-warning-foreground'
  },
  {
    id: 'tester',
    name: 'QA Testing Agent',
    handle: 'tester',
    role: 'Quality Assurance',
    avatar: CheckCircle,
    status: 'away',
    description: 'Automated testing and quality validation',
    colorClass: 'bg-success text-success-foreground'
  },
  {
    id: 'validator',
    name: 'Validation Agent',
    handle: 'validator',
    role: 'Compliance & Standards',
    avatar: AlertCircle,
    status: 'online',
    description: 'Validates accessibility and SEO compliance',
    colorClass: 'bg-warning text-warning-foreground'
  },
  {
    id: 'deployer',
    name: 'Deployment Agent',
    handle: 'deployer',
    role: 'Infrastructure & Deployment',
    avatar: Settings,
    status: 'offline',
    description: 'Manages deployment and infrastructure setup',
    colorClass: 'bg-muted text-muted-foreground'
  },
  {
    id: 'optimizer',
    name: 'Performance Optimizer',
    handle: 'optimizer',
    role: 'Performance Enhancement',
    avatar: Zap,
    status: 'online',
    description: 'Optimizes performance and monitors metrics',
    colorClass: 'bg-destructive text-destructive-foreground'
  }
];

// Component for rendering agent chips
interface AgentChipProps {
  agent: Agent;
  onRemove: () => void;
}

function AgentChip({ agent, onRemove }: AgentChipProps) {
  const Icon = agent.avatar;
  
  return (
    <div 
      className={`inline-flex items-center rounded-full mr-1 mb-1 ${agent.colorClass}`}
      style={{ 
        gap: 'var(--spacing-1-5)', 
        padding: 'var(--spacing-1) var(--spacing-2)' 
      }}
    >
      <Icon className="size-3" />
      <span>@{agent.handle}</span>
      <button
        type="button"
        onClick={onRemove}
        className="hover:bg-white/20 rounded-full transition-colors"
        style={{ 
          marginLeft: 'var(--spacing-0-5)', 
          padding: 'var(--spacing-0-5)' 
        }}
      >
        <X className="size-3" />
      </button>
    </div>
  );
}

export function MentionInput({ 
  value, 
  onChange, 
  onSubmit, 
  onKeyDown,
  placeholder = "Type @ to mention an agent...",
  className = "",
  disabled = false 
}: MentionInputProps) {
  const [showMentions, setShowMentions] = useState(false);
  const [mentionFilter, setMentionFilter] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Extract mentioned agents from text
  const mentionedAgents = React.useMemo(() => {
    const mentions: Agent[] = [];
    const mentionRegex = /@(\w+)/g;
    let match;
    
    while ((match = mentionRegex.exec(value)) !== null) {
      const handle = match[1];
      const agent = agents.find(a => a.handle === handle);
      if (agent && !mentions.find(m => m.id === agent.id)) {
        mentions.push(agent);
      }
    }
    
    return mentions;
  }, [value]);

  // Filter agents based on current mention text
  const filteredAgents = agents.filter(agent => 
    agent.name.toLowerCase().includes(mentionFilter.toLowerCase()) ||
    agent.handle.toLowerCase().includes(mentionFilter.toLowerCase()) ||
    agent.role.toLowerCase().includes(mentionFilter.toLowerCase())
  );

  // Get status indicator using design system colors
  const getStatusIndicator = (status: Agent['status']) => {
    switch (status) {
      case 'online': return 'bg-success';
      case 'busy': return 'bg-destructive';
      case 'away': return 'bg-warning';
      case 'offline': return 'bg-muted-foreground';
      default: return 'bg-muted-foreground';
    }
  };

  // Handle text change and detect @ mentions
  const handleTextChange = useCallback((newValue: string) => {
    onChange(newValue);
    
    if (!textareaRef.current) return;
    
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = newValue.substring(0, cursorPosition);
    
    // Look for @ mentions
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    
    if (mentionMatch) {
      setMentionFilter(mentionMatch[1]);
      setShowMentions(true);
      setSelectedIndex(0);
    } else {
      setShowMentions(false);
      setMentionFilter('');
    }
  }, [onChange]);

  // Handle mention selection
  const selectMention = useCallback((agent: Agent) => {
    if (!textareaRef.current) return;
    
    const cursorPosition = textareaRef.current.selectionStart;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const textAfterCursor = value.substring(cursorPosition);
    
    // Find the @ symbol and replace with mention
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    if (mentionMatch) {
      const beforeMention = textBeforeCursor.substring(0, mentionMatch.index);
      const newValue = `${beforeMention}@${agent.handle} ${textAfterCursor}`;
      onChange(newValue);
      
      // Set cursor position after the mention
      setTimeout(() => {
        if (textareaRef.current) {
          const newCursorPos = beforeMention.length + agent.handle.length + 2;
          textareaRef.current.setSelectionRange(newCursorPos, newCursorPos);
          textareaRef.current.focus();
        }
      }, 0);
    }
    
    setShowMentions(false);
    setMentionFilter('');
  }, [value, onChange]);

  // Remove agent mention from text
  const removeAgentMention = useCallback((agentHandle: string) => {
    const regex = new RegExp(`@${agentHandle}\\s?`, 'g');
    const newValue = value.replace(regex, '').trim();
    onChange(newValue);
  }, [value, onChange]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    // First, call the external onKeyDown handler if provided
    if (onKeyDown && !showMentions) {
      onKeyDown(e);
      // If the event was handled by the external handler, return early
      if (e.defaultPrevented) {
        return;
      }
    }

    if (!showMentions) {
      if (e.key === 'Enter' && !e.shiftKey && onSubmit) {
        e.preventDefault();
        onSubmit(value);
      }
      return;
    }

    // Handle mention dropdown navigation
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < filteredAgents.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : filteredAgents.length - 1
        );
        break;
      case 'Enter':
      case 'Tab':
        e.preventDefault();
        if (filteredAgents[selectedIndex]) {
          selectMention(filteredAgents[selectedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setShowMentions(false);
        setMentionFilter('');
        break;
    }
  }, [showMentions, filteredAgents, selectedIndex, selectMention, onSubmit, value, onKeyDown]);

  // Close mentions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          textareaRef.current && !textareaRef.current.contains(event.target as Node)) {
        setShowMentions(false);
        setMentionFilter('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Scroll selected item into view
  useEffect(() => {
    if (showMentions && dropdownRef.current) {
      const dropdownContent = dropdownRef.current.querySelector('.agents-list');
      const selectedElement = dropdownContent?.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
      }
    }
  }, [selectedIndex, showMentions]);

  // Get dropdown position (above the input)
  const getDropdownPosition = () => {
    if (!textareaRef.current) return { top: 0, left: 0 };
    
    const textareaRect = textareaRef.current.getBoundingClientRect();
    const dropdownHeight = 300;
    const spacing = 8;
    
    return {
      top: textareaRect.top - dropdownHeight - spacing,
      left: textareaRect.left,
    };
  };

  return (
    <div ref={containerRef} className="relative">
      {/* Mention Dropdown - Positioned above the input */}
      {showMentions && filteredAgents.length > 0 && (
        <div
          ref={dropdownRef}
          className="fixed z-[9999] bg-popover border border-border rounded-lg shadow-lg overflow-hidden"
          style={{
            ...getDropdownPosition(),
            width: 'var(--spacing-80)'
          }}
        >
          <div style={{ padding: 'var(--spacing-2)' }}>
            <div 
              className="text-muted-foreground"
              style={{ 
                marginBottom: 'var(--spacing-2)', 
                paddingLeft: 'var(--spacing-2)', 
                paddingRight: 'var(--spacing-2)' 
              }}
            >
              Available Agents ({filteredAgents.length})
            </div>
            <div 
              className="agents-list overflow-y-auto"
              style={{ 
                maxHeight: 'var(--spacing-48)',
                gap: 'var(--spacing-1)',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {filteredAgents.map((agent, index) => {
                const Icon = agent.avatar;
                return (
                  <div
                    key={agent.id}
                    className={`flex items-center rounded-lg cursor-pointer transition-colors ${
                      index === selectedIndex 
                        ? 'bg-primary text-primary-foreground' 
                        : 'hover:bg-muted'
                    }`}
                    style={{ 
                      gap: 'var(--spacing-3)', 
                      padding: 'var(--spacing-2)' 
                    }}
                    onClick={() => selectMention(agent)}
                  >
                    <div className="relative flex-shrink-0">
                      <div 
                        className={`rounded-lg ${agent.colorClass}`}
                        style={{ padding: 'var(--spacing-2)' }}
                      >
                        <Icon className="size-4" />
                      </div>
                      <div 
                        className={`absolute rounded-full border-2 border-background ${getStatusIndicator(agent.status)}`}
                        style={{
                          bottom: 'calc(-1 * var(--spacing-0-5))',
                          right: 'calc(-1 * var(--spacing-0-5))',
                          width: 'var(--spacing-3)',
                          height: 'var(--spacing-3)'
                        }}
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div 
                        className="flex items-center"
                        style={{ gap: 'var(--spacing-2)' }}
                      >
                        <span className="truncate">{agent.name}</span>
                        <Badge 
                          variant="secondary" 
                          className={index === selectedIndex ? 'bg-primary-foreground/20' : ''}
                        >
                          @{agent.handle}
                        </Badge>
                      </div>
                      <div className={`truncate ${
                        index === selectedIndex 
                          ? 'text-primary-foreground/80' 
                          : 'text-muted-foreground'
                      }`}>
                        {agent.role}
                      </div>
                      <div className={`truncate ${
                        index === selectedIndex 
                          ? 'text-primary-foreground/70' 
                          : 'text-muted-foreground'
                      }`}>
                        {agent.description}
                      </div>
                    </div>
                    
                    {index === selectedIndex && (
                      <div className="text-primary-foreground/60 flex-shrink-0">
                        ↵
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
            
            {mentionFilter && filteredAgents.length === 0 && (
              <div 
                className="text-center text-muted-foreground"
                style={{ padding: 'var(--spacing-4)' }}
              >
                <Search 
                  className="mx-auto opacity-50"
                  style={{ 
                    width: 'var(--spacing-8)', 
                    height: 'var(--spacing-8)', 
                    marginBottom: 'var(--spacing-2)' 
                  }}
                />
                No agents found for "{mentionFilter}"
              </div>
            )}
          </div>
          
          {/* Keyboard hints */}
          <div 
            className="border-t bg-muted/30"
            style={{ padding: 'var(--spacing-2)' }}
          >
            <div 
              className="text-muted-foreground flex items-center"
              style={{ gap: 'var(--spacing-4)' }}
            >
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      )}

      {/* Mentioned Agents Chips - Display above textarea */}
      {mentionedAgents.length > 0 && (
        <div 
          className="flex flex-wrap bg-muted/30 rounded-lg border"
          style={{ 
            gap: 'var(--spacing-1)', 
            marginBottom: 'var(--spacing-2)', 
            padding: 'var(--spacing-2)' 
          }}
        >
          <div 
            className="text-muted-foreground flex items-center"
            style={{ marginRight: 'var(--spacing-2)' }}
          >
            Mentioned:
          </div>
          {mentionedAgents.map((agent) => (
            <AgentChip
              key={agent.id}
              agent={agent}
              onRemove={() => removeAgentMention(agent.handle)}
            />
          ))}
        </div>
      )}

      {/* Regular Textarea */}
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => handleTextChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={`min-h-[100px] resize-none ${className}`}
        disabled={disabled}
      />
    </div>
  );
}
