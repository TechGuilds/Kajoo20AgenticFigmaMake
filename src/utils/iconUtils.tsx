import React from 'react';
import { 
  Code, 
  Database, 
  FileText,
  Component,
  Layout,
  Image as ImageIcon,
  Settings,
  Globe,
  Layers,
  Zap,
  File,
  Folder,
  FolderOpen,
  Box,
  Package
} from 'lucide-react';

/**
 * Icon utility functions for consistent icon usage across the app
 * All icons use Lucide React with consistent sizing
 */

export type ArtifactType = 'code' | 'sitecore' | 'hybrid' | 'document' | 'config';
export type TemplateType = 'page' | 'component' | 'layout' | 'partial' | 'content';
export type FileType = 'folder' | 'file' | 'component' | 'config';

interface IconProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Get size class for icon based on size prop
 */
function getIconSizeClass(size: 'sm' | 'md' | 'lg' = 'md'): string {
  switch (size) {
    case 'sm': return 'size-3';
    case 'md': return 'size-4';
    case 'lg': return 'size-5';
    default: return 'size-4';
  }
}

/**
 * Get icon component for artifact type
 * @param type - The artifact type
 * @param options - Icon customization options
 */
export function getArtifactIcon(type: ArtifactType, options: IconProps = {}) {
  const { className = '', size = 'md' } = options;
  const sizeClass = getIconSizeClass(size);

  switch (type) {
    case 'code':
      return <Code className={`${sizeClass} text-info ${className}`} />;
    case 'sitecore':
      return <Database className={`${sizeClass} text-success ${className}`} />;
    case 'hybrid':
      return (
        <div className="relative">
          <Database className="size-3 text-success" />
          <Code className="size-3 text-info absolute top-0 left-0" />
        </div>
      );
    case 'config':
      return <Settings className={`${sizeClass} text-warning ${className}`} />;
    case 'document':
    default:
      return <FileText className={`${sizeClass} ${className}`} />;
  }
}

/**
 * Get color classes for artifact type badge
 * Uses design system color variables
 */
export function getArtifactBadgeClass(type: ArtifactType): string {
  switch (type) {
    case 'code':
      return 'bg-info/10 text-info border-info/20';
    case 'sitecore':
      return 'bg-success/10 text-success border-success/20';
    case 'hybrid':
      return 'bg-primary/10 text-primary border-primary/20';
    case 'config':
      return 'bg-warning/10 text-warning border-warning/20';
    case 'document':
    default:
      return 'bg-muted text-muted-foreground border-muted-foreground/20';
  }
}

/**
 * Get icon component for template type
 * @param type - The template type
 * @param options - Icon customization options
 */
export function getTemplateIcon(type: TemplateType, options: IconProps = {}) {
  const { className = '', size = 'md' } = options;
  const sizeClass = getIconSizeClass(size);

  switch (type) {
    case 'page':
      return <Globe className={`${sizeClass} ${className}`} />;
    case 'component':
      return <Component className={`${sizeClass} ${className}`} />;
    case 'layout':
      return <Layout className={`${sizeClass} ${className}`} />;
    case 'partial':
      return <Package className={`${sizeClass} ${className}`} />;
    case 'content':
      return <FileText className={`${sizeClass} ${className}`} />;
    default:
      return <File className={`${sizeClass} ${className}`} />;
  }
}

/**
 * Get color classes for template type
 * Uses design system color variables
 */
export function getTemplateTypeColor(type: TemplateType): string {
  switch (type) {
    case 'page':
      return 'bg-primary';
    case 'component':
      return 'bg-success';
    case 'layout':
      return 'bg-warning';
    case 'partial':
      return 'bg-info';
    case 'content':
      return 'bg-accent';
    default:
      return 'bg-muted';
  }
}

/**
 * Get icon component for file type
 * @param type - The file type
 * @param isOpen - For folders, whether they're expanded
 * @param options - Icon customization options
 */
export function getFileIcon(
  type: FileType, 
  isOpen: boolean = false,
  options: IconProps = {}
) {
  const { className = '', size = 'md' } = options;
  const sizeClass = getIconSizeClass(size);

  switch (type) {
    case 'folder':
      return isOpen 
        ? <FolderOpen className={`${sizeClass} text-primary ${className}`} />
        : <Folder className={`${sizeClass} text-primary ${className}`} />;
    case 'component':
      return <Component className={`${sizeClass} text-success ${className}`} />;
    case 'config':
      return <Settings className={`${sizeClass} text-warning ${className}`} />;
    case 'file':
    default:
      return <File className={`${sizeClass} ${className}`} />;
  }
}

/**
 * Get human-readable label for artifact type
 */
export function getArtifactTypeLabel(type: ArtifactType): string {
  switch (type) {
    case 'code': return 'Code';
    case 'sitecore': return 'Sitecore';
    case 'hybrid': return 'Hybrid';
    case 'config': return 'Configuration';
    case 'document': return 'Document';
    default: return type;
  }
}

/**
 * Get human-readable label for template type
 */
export function getTemplateTypeLabel(type: TemplateType): string {
  switch (type) {
    case 'page': return 'Page';
    case 'component': return 'Component';
    case 'layout': return 'Layout';
    case 'partial': return 'Partial';
    case 'content': return 'Content';
    default: return type;
  }
}
