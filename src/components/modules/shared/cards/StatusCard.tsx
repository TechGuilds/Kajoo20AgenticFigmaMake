import React, { ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { getStatusIcon, getStatusColor, type Status } from '@/utils/statusUtils';

/**
 * Flexible card component for displaying items with status
 * Consolidates card patterns from WorkspaceList, ProjectList, etc.
 * 100% design system compliant - uses CSS variables only
 */

export interface StatusCardAction {
  label: string;
  onClick: () => void;
  icon?: ReactNode;
  variant?: 'default' | 'destructive';
}

export interface StatusCardProps {
  /**
   * Card title
   */
  title: string;
  
  /**
   * Optional description
   */
  description?: string;
  
  /**
   * Status of the item
   */
  status?: Status;
  
  /**
   * Additional badges to display
   */
  badges?: Array<{
    label: string;
    variant?: string;
    className?: string;
  }>;
  
  /**
   * Icon to display (overrides status icon)
   */
  icon?: ReactNode;
  
  /**
   * Show status icon
   */
  showStatusIcon?: boolean;
  
  /**
   * Main content area
   */
  children?: ReactNode;
  
  /**
   * Footer content
   */
  footer?: ReactNode;
  
  /**
   * Actions for dropdown menu
   */
  actions?: StatusCardAction[];
  
  /**
   * Click handler for card
   */
  onClick?: () => void;
  
  /**
   * Whether card is clickable (adds hover effect)
   */
  clickable?: boolean;
  
  /**
   * Additional className
   */
  className?: string;
  
  /**
   * Whether card is selected
   */
  selected?: boolean;
}

export function StatusCard({
  title,
  description,
  status,
  badges = [],
  icon,
  showStatusIcon = true,
  children,
  footer,
  actions,
  onClick,
  clickable = false,
  className = '',
  selected = false
}: StatusCardProps) {
  const hasActions = actions && actions.length > 0;
  const isClickable = clickable || !!onClick;

  const cardClassName = `
    ${isClickable ? 'cursor-pointer hover:shadow-md transition-shadow' : ''}
    ${selected ? 'ring-2 ring-primary' : ''}
    ${className}
  `.trim();

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on actions menu
    if ((e.target as HTMLElement).closest('[data-card-actions]')) {
      return;
    }
    onClick?.();
  };

  return (
    <Card className={cardClassName} onClick={isClickable ? handleCardClick : undefined}>
      <CardHeader style={{ paddingBottom: 'var(--spacing-3)' }}>
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Icon */}
            {icon || (showStatusIcon && status) ? (
              <div style={{ flexShrink: 0 }}>
                {icon || (status && getStatusIcon(status))}
              </div>
            ) : null}
            
            {/* Title & Description */}
            <div className="flex-1 min-w-0">
              <CardTitle className="truncate">{title}</CardTitle>
              {description && (
                <p 
                  className="text-muted-foreground truncate"
                  style={{ 
                    marginTop: 'var(--spacing-1)',
                    fontSize: 'var(--font-size-sm)'
                  }}
                >
                  {description}
                </p>
              )}
            </div>
          </div>

          {/* Actions Menu */}
          {hasActions && (
            <div data-card-actions onClick={e => e.stopPropagation()}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    style={{
                      width: 'var(--spacing-8)',
                      height: 'var(--spacing-8)',
                      padding: 0
                    }}
                  >
                    <MoreHorizontal style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
                    <span className="sr-only">Actions</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {actions.map((action, index) => (
                    <DropdownMenuItem
                      key={index}
                      onClick={action.onClick}
                      className={action.variant === 'destructive' ? 'text-destructive' : ''}
                    >
                      {action.icon && (
                        <span style={{ marginRight: 'var(--spacing-2)' }}>
                          {action.icon}
                        </span>
                      )}
                      {action.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>

        {/* Badges */}
        {(status || badges.length > 0) && (
          <div 
            className="flex flex-wrap gap-2"
            style={{ marginTop: 'var(--spacing-3)' }}
          >
            {status && (
              <Badge variant="outline" className={getStatusColor(status)}>
                {status}
              </Badge>
            )}
            {badges.map((badge, index) => (
              <Badge 
                key={index} 
                variant="outline"
                className={badge.className || 'bg-muted text-muted-foreground'}
              >
                {badge.label}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>

      {/* Content */}
      {children && (
        <CardContent style={{ paddingTop: 0 }}>
          {children}
        </CardContent>
      )}

      {/* Footer */}
      {footer && (
        <CardContent 
          style={{ 
            paddingTop: 0,
            paddingBottom: 'var(--spacing-4)'
          }}
        >
          {footer}
        </CardContent>
      )}
    </Card>
  );
}
