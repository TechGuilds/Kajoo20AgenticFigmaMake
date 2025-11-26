import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Hash } from 'lucide-react';
import type { AppTab } from '@/types';

interface TabManagerProps {
  tabs: AppTab[];
  activeTabId: string | null;
  onTabSelect: (tabId: string) => void;
  onTabClose: (tabId: string) => void;
  className?: string;
}

export function TabManager({ 
  tabs, 
  activeTabId, 
  onTabSelect, 
  onTabClose, 
  className = '' 
}: TabManagerProps) {
  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={`border-b bg-card ${className}`}>
      <div className="flex items-center overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            className={`
              flex items-center border-r cursor-pointer group
              transition-colors duration-150 min-w-0 flex-shrink-0 max-w-[300px]
              ${activeTabId === tab.id 
                ? 'bg-background border-b-2 border-b-primary text-primary' 
                : 'hover:bg-muted/50'
              }
            `}
            style={{ 
              gap: 'var(--spacing-2)', 
              padding: 'var(--spacing-3) var(--spacing-4)' 
            }}
            onClick={() => onTabSelect(tab.id)}
          >
            {/* Tab Icon & Title */}
            <div 
              className="flex items-center min-w-0 flex-1"
              style={{ gap: 'var(--spacing-2)' }}
            >
              {tab.type === 'task' && (
                <Badge 
                  variant="secondary" 
                  className="gap-1 bg-primary/10 text-primary border-primary/20 flex-shrink-0"
                >
                  <Hash className="size-3" />
                  {tab.taskId.toUpperCase()}
                </Badge>
              )}
              <span className="truncate">
                {tab.title}
              </span>
            </div>

            {/* Close Button */}
            <Button
              size="sm"
              variant="ghost"
              onClick={(e) => {
                e.stopPropagation();
                onTabClose(tab.id);
              }}
              className="size-6 p-0 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive flex-shrink-0"
            >
              <X className="size-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
