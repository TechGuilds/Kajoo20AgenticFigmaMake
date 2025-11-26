import React from 'react';
import { 
  PlayCircle, 
  PauseCircle, 
  CheckCircle, 
  FileSearch,
  AlertCircle,
  Clock,
  Circle
} from 'lucide-react';

/**
 * Status utility functions for consistent status handling across the app
 * Uses CSS variables for theming - 100% design system compliant
 */

export type Status = 'active' | 'paused' | 'completed' | 'planning' | 'pending' | 'in-progress' | 'blocked';
export type Priority = 'high' | 'medium' | 'low' | 'critical';
export type Phase = 'assessment' | 'setup' | 'migrate' | 'reconstruct' | 'launch' | 'completed';

interface IconStyleProps {
  width?: string;
  height?: string;
}

/**
 * Get icon component for a given status
 * @param status - The status type
 * @param iconStyle - Optional style override
 */
export function getStatusIcon(status: Status, iconStyle?: IconStyleProps) {
  const defaultStyle = { 
    width: iconStyle?.width || 'var(--spacing-4)', 
    height: iconStyle?.height || 'var(--spacing-4)' 
  };

  switch (status) {
    case 'active':
    case 'in-progress':
      return <PlayCircle className="text-primary" style={defaultStyle} />;
    case 'paused':
      return <PauseCircle className="text-muted-foreground" style={defaultStyle} />;
    case 'completed':
      return <CheckCircle className="text-success" style={defaultStyle} />;
    case 'planning':
      return <FileSearch className="text-primary" style={defaultStyle} />;
    case 'pending':
      return <Clock className="text-warning" style={defaultStyle} />;
    case 'blocked':
      return <AlertCircle className="text-destructive" style={defaultStyle} />;
    default:
      return <Circle style={defaultStyle} />;
  }
}

/**
 * Get badge color classes for a given status
 * Uses semantic color variables from design system
 */
export function getStatusColor(status: Status): string {
  switch (status) {
    case 'active':
    case 'in-progress':
      return 'bg-success/10 text-success border-success/20';
    case 'paused':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'completed':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'planning':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'pending':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'blocked':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    default:
      return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
}

/**
 * Get badge color classes for a given priority
 * Uses semantic color variables from design system
 */
export function getPriorityColor(priority: Priority): string {
  switch (priority) {
    case 'critical':
    case 'high':
      return 'bg-destructive/10 text-destructive border-destructive/20';
    case 'medium':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'low':
      return 'bg-primary/10 text-primary border-primary/20';
    default:
      return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
}

/**
 * Get badge color classes for a given phase
 * Uses semantic color variables from design system
 */
export function getPhaseColor(phase: Phase): string {
  switch (phase) {
    case 'assessment':
    case 'setup':
    case 'reconstruct':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'migrate':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'launch':
    case 'completed':
      return 'bg-success/10 text-success border-success/20';
    default:
      return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
}

/**
 * Get human-readable label for status
 */
export function getStatusLabel(status: Status): string {
  switch (status) {
    case 'active': return 'Active';
    case 'paused': return 'Paused';
    case 'completed': return 'Completed';
    case 'planning': return 'Planning';
    case 'pending': return 'Pending';
    case 'in-progress': return 'In Progress';
    case 'blocked': return 'Blocked';
    default: return status;
  }
}

/**
 * Get human-readable label for priority
 */
export function getPriorityLabel(priority: Priority): string {
  switch (priority) {
    case 'critical': return 'Critical';
    case 'high': return 'High';
    case 'medium': return 'Medium';
    case 'low': return 'Low';
    default: return priority;
  }
}

/**
 * Get human-readable label for phase
 */
export function getPhaseLabel(phase: Phase): string {
  switch (phase) {
    case 'assessment': return 'Assessment';
    case 'setup': return 'Setup';
    case 'migrate': return 'Migration';
    case 'reconstruct': return 'Reconstruction';
    case 'launch': return 'Launch';
    case 'completed': return 'Completed';
    default: return phase;
  }
}
