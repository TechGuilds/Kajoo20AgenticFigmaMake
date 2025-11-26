import React, { useState, useMemo, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ResizablePanelGroup, ResizablePanel, ResizableHandle } from '@/components/ui/resizable';
import { Separator } from '@/components/ui/separator';
import { type Artifact } from '@/constants/artifacts';
import { 
  Search, 
  X, 
  ChevronRight, 
  Eye, 
  Settings, 
  FileText, 
  Code, 
  MoreHorizontal,
  Copy,
  Download,
  CheckCircle2,
  Circle,
  Folder,
  Layout,
  Component,
  Database
} from 'lucide-react';

// Sitecore Artifact Viewer
export function SitecoreArtifactView({ artifact }: { artifact: Artifact }) {
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set(['1', '5', '12', '16', '22'])); // Default expanded
  const [detailsViewMode, setDetailsViewMode] = useState<'normal' | 'json'>('normal');
  
  // Mock Sitecore content tree data matching Assets Explorer structure
  const contentTree = [
    {
      id: '1',
      name: 'Page Templates',
      type: 'folder',
      path: '/templates/pages',
      icon: <Folder className="size-4 text-muted-foreground" />,
      children: [
        {
          id: '2',
          name: 'Homepage Template',
          type: 'page-template',
          path: '/templates/pages/homepage',
          icon: <Layout className="size-4 text-primary" />,
          description: 'Main homepage template with hero and content sections',
          fields: ['Title', 'Hero Image', 'Content Blocks', 'SEO Meta'],
          dependencies: ['Navigation Component', 'Footer Component']
        },
        {
          id: '3',
          name: 'Article Page',
          type: 'page-template',
          path: '/templates/pages/article',
          icon: <Layout className="size-4 text-primary" />,
          description: 'Standard article template with sidebar',
          fields: ['Title', 'Content', 'Author', 'Date', 'Category'],
          dependencies: ['Navigation Component', 'Sidebar Component']
        },
        {
          id: '4',
          name: 'Product Details',
          type: 'page-template',
          path: '/templates/pages/product',
          icon: <Layout className="size-4 text-primary" />,
          description: 'Product template for e-commerce',
          fields: ['Name', 'Description', 'Price', 'Images', 'Specifications']
        }
      ]
    },
    {
      id: '5',
      name: 'Components',
      type: 'folder',
      path: '/templates/components',
      icon: <Folder className="size-4 text-muted-foreground" />,
      children: [
        {
          id: '6',
          name: 'Navigation',
          type: 'folder',
          path: '/templates/components/navigation',
          icon: <Folder className="size-4 text-muted-foreground" />,
          children: [
            {
              id: '7',
              name: 'Main Navigation',
              type: 'component',
              path: '/templates/components/navigation/main',
              icon: <Component className="size-4 text-success" />,
              description: 'Primary site navigation with dropdowns',
              complexity: 'medium'
            },
            {
              id: '8',
              name: 'Breadcrumb',
              type: 'component',
              path: '/templates/components/navigation/breadcrumb',
              icon: <Component className="size-4 text-success" />,
              description: 'Breadcrumb navigation component',
              complexity: 'straightforward'
            }
          ]
        },
        {
          id: '9',
          name: 'Content Components',
          type: 'folder',
          path: '/templates/components/content',
          icon: <Folder className="size-4 text-muted-foreground" />,
          children: [
            {
              id: '10',
              name: 'Hero Banner',
              type: 'component',
              path: '/templates/components/content/hero',
              icon: <Component className="size-4 text-success" />,
              description: 'Hero banner with background image and CTA',
              complexity: 'straightforward'
            },
            {
              id: '11',
              name: 'Content Listing',
              type: 'component',
              path: '/templates/components/content/listing',
              icon: <Component className="size-4 text-success" />,
              description: 'Dynamic content listing with pagination',
              complexity: 'medium'
            }
          ]
        }
      ]
    },
    {
      id: '12',
      name: 'Content Models',
      type: 'folder',
      path: '/content/models',
      icon: <Folder className="size-4 text-muted-foreground" />,
      children: [
        {
          id: '13',
          name: 'Article Model',
          type: 'content-model',
          path: '/content/models/article',
          icon: <FileText className="size-4 text-primary" />,
          description: 'Content model for article pages',
          fields: ['Title', 'Body', 'Author', 'Date', 'Tags', 'Featured Image']
        }
      ]
    }
  ];

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  // Filter content tree based on search
  const filterItems = (items: any[]): any[] => {
    if (!searchQuery) return items;
    
    return items.reduce((filtered: any[], item) => {
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (item.children) {
        const filteredChildren = filterItems(item.children);
        if (matchesSearch || filteredChildren.length > 0) {
          filtered.push({
            ...item,
            children: filteredChildren
          });
        }
      } else if (matchesSearch) {
        filtered.push(item);
      }
      
      return filtered;
    }, []);
  };

  const filteredContentTree = filterItems(contentTree);

  const formatItemAsJson = (item: any): string => {
    const timestamp = new Date().toISOString();
    const jsonData = {
      "$schema": "https://kajoo.ai/schemas/sitecore-migration-asset.json",
      "version": "2.0",
      "exportedAt": timestamp,
      "asset": {
        "id": item.id,
        "name": item.name,
        "type": item.type,
        "path": item.path,
        ...(item.description && { "description": item.description }),
        ...(item.complexity && { 
          "complexity": {
            "level": item.complexity,
            "estimatedEffort": item.complexity === 'straightforward' ? '1-3 days' : 
                             item.complexity === 'medium' ? '3-7 days' : '1-3 weeks'
          }
        }),
        ...(item.fields && { "fields": item.fields }),
        ...(item.dependencies && { "dependencies": item.dependencies }),
        "migration": {
          "priority": item.complexity === 'complex' ? 'high' : 
                     item.complexity === 'medium' ? 'medium' : 'low',
          "estimatedMigrationHours": item.complexity === 'straightforward' ? 8 : 
                                   item.complexity === 'medium' ? 24 : 64
        },
        "metadata": {
          "sitecoreItemId": `{${crypto.randomUUID()}}`,
          "templateId": `{${crypto.randomUUID()}}`,
          "originalPath": item.path,
          "targetPath": item.path.replace('/templates/', '/items/'),
          "contentDatabase": "master",
          "languages": ["en"],
          "versions": [
            {
              "language": "en",
              "version": 1,
              "created": "2023-01-15T10:30:00Z",
              "updated": "2024-08-14T14:22:00Z"
            }
          ]
        }
      },
      "migrationContext": {
        "sourceSystem": "Sitecore XP MVC",
        "targetSystem": "Sitecore XM Cloud Headless",
        "framework": "Next.js",
        "contentDeliveryApi": "Sitecore GraphQL",
        "renderingHost": "Vercel"
      }
    };
    
    return JSON.stringify(jsonData, null, 2);
  };

  const renderTreeItem = (item: any, level: number = 0): React.ReactNode => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedItem?.id === item.id;

    return (
      <div key={item.id} className="min-w-fit">
        <div 
          className={`flex items-center gap-2 py-1.5 px-2 rounded hover:bg-muted/50 cursor-pointer transition-colors group whitespace-nowrap ${
            isSelected ? 'bg-primary/10 border border-primary/20' : ''
          }`}
          style={{ paddingLeft: `${level * 20 + 8}px` }}
          onClick={() => setSelectedItem(item)}
        >
          {hasChildren ? (
            <Button
              variant="ghost"
              size="sm"
              className="h-4 w-4 p-0 hover:bg-muted flex-shrink-0"
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(item.id);
              }}
            >
              {isExpanded ? <ChevronRight className="size-3 rotate-90" /> : <ChevronRight className="size-3" />}
            </Button>
          ) : (
            <div className="w-4 flex-shrink-0" />
          )}
          
          <div className="flex-shrink-0">
            {item.icon}
          </div>
          
          <span className="flex-shrink-0 min-w-0">{item.name}</span>
          
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
            {item.complexity && (
              <Badge 
                variant="outline" 
                className={`h-5 ${
                  item.complexity === 'straightforward' 
                    ? 'bg-success/10 text-success border-success/20' 
                    : item.complexity === 'medium'
                    ? 'bg-warning/10 text-warning border-warning/20'
                    : 'bg-destructive/10 text-destructive border-destructive/20'
                }`}
              >
                {item.complexity}
              </Badge>
            )}
            <Badge variant="outline" className="h-5">
              {item.type}
            </Badge>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="min-w-fit">
            {item.children.map((child: any) => renderTreeItem(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ResizablePanelGroup direction="horizontal" className="h-full min-h-0">
      {/* Left Panel - Content Tree */}
      <ResizablePanel defaultSize={33} minSize={20} maxSize={60}>
        <div className="h-full bg-muted/20 flex flex-col">
          <div className="border-b flex-shrink-0 space-y-3 px-[16px] p-[16px]">
            <div>
              <h4>Content Tree</h4>
              <p className="text-muted-foreground">Click items to view details</p>
            </div>
            
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-10 h-8 text-sm"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
                  onClick={() => setSearchQuery('')}
                >
                  <X className="size-3" />
                </Button>
              )}
            </div>
          </div>
          
          <div className="flex-1 min-h-0 bg-background overflow-hidden">
            <ScrollArea className="h-full w-full scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100 scrollbar-corner-gray-100">
              <div className="p-4 min-w-max overflow-x-auto">
                <div className="space-y-0 min-w-fit">
                  {filteredContentTree.length > 0 ? (
                    filteredContentTree.map(item => renderTreeItem(item))
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <Search className="size-8 mx-auto mb-2 opacity-50" />
                      <p>No results found</p>
                      <p>Try a different search term</p>
                    </div>
                  )}
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>
      </ResizablePanel>

      <ResizableHandle withHandle />

      {/* Right Panel - Details */}
      <ResizablePanel defaultSize={67} minSize={40}>
        <div className="h-full">
          {selectedItem ? (
            <div className="p-6 h-full overflow-y-auto">
              {/* Header with View Toggle */}
              <div className="flex items-start gap-3 mb-4">
                {selectedItem.icon}
                <div className="flex-1">
                  <h3>{selectedItem.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedItem.path}</p>
                </div>
                
                {/* View Mode Toggle */}
                <div className="flex border rounded-lg p-1 bg-card mr-2">
                  <Button 
                    variant={detailsViewMode === 'normal' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDetailsViewMode('normal')}
                    className="h-7 px-3"
                  >
                    <FileText className="size-3 mr-1" />
                    Details
                  </Button>
                  <Button 
                    variant={detailsViewMode === 'json' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setDetailsViewMode('json')}
                    className="h-7 px-3"
                  >
                    <Code className="size-3 mr-1" />
                    JSON
                  </Button>
                </div>
                

              </div>

              {/* Content based on view mode */}
              {detailsViewMode === 'normal' ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="capitalize">
                      {selectedItem.type}
                    </Badge>
                    {selectedItem.complexity && (
                      <Badge variant="outline" className={`text-xs h-5 ${
                        selectedItem.complexity === 'straightforward' 
                          ? 'bg-success/10 text-success border-success/20' 
                          : selectedItem.complexity === 'medium'
                          ? 'bg-warning/10 text-warning border-warning/20'
                          : 'bg-destructive/10 text-destructive border-destructive/20'
                      }`}>
                        {selectedItem.complexity} complexity
                      </Badge>
                    )}
                  </div>

                  {selectedItem.description && (
                    <div>
                      <div className="text-sm mb-1">Description</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedItem.description}
                      </div>
                    </div>
                  )}

                  {selectedItem.fields && (
                    <div>
                      <div className="text-sm mb-1">Fields</div>
                      <div className="grid grid-cols-2 gap-2">
                        {selectedItem.fields.map((field: string) => (
                          <div key={field} className="p-2 bg-muted/30 rounded text-sm">
                            {field}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}



                  {selectedItem.complexity && (
                    <div>
                      <div className="text-sm mb-1">Migration Notes</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedItem.complexity === 'medium' 
                          ? 'Requires careful migration planning with testing'
                          : selectedItem.complexity === 'complex'
                          ? 'Complex migration requiring significant changes and testing'
                          : 'Straightforward migration, minimal changes needed'
                        }
                      </div>
                    </div>
                  )}

                  <Separator />
                </div>
              ) : (
                <div className="space-y-4">
                  {/* JSON View Header */}
                  <div className="flex items-center justify-between">
                    <div className="text-sm">Asset JSON Structure</div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => copyToClipboard(formatItemAsJson(selectedItem))}
                      className="h-7 px-2"
                    >
                      <Copy className="size-3 mr-1" />
                      Copy
                    </Button>
                  </div>

                  {/* JSON Display */}
                  <div className="relative">
                    <div className="bg-card border rounded-lg overflow-hidden">
                      {/* JSON Header */}
                      <div className="bg-muted/30 border-b px-3 py-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-destructive"></div>
                          <div className="w-3 h-3 rounded-full bg-warning"></div>
                          <div className="w-3 h-3 rounded-full bg-success"></div>
                          <span className="text-xs text-muted-foreground ml-2">
                            {selectedItem.name}.json
                          </span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Sitecore Asset Schema
                        </div>
                      </div>
                      
                      {/* JSON Content */}
                      <div className="relative">
                        <ScrollArea className="h-[400px]">
                          <pre className="p-4 text-xs font-mono leading-relaxed">
                            <code className="text-foreground whitespace-pre-wrap break-words">
                              {formatItemAsJson(selectedItem)}
                            </code>
                          </pre>
                        </ScrollArea>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  {/* JSON Metadata */}
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <div className="text-muted-foreground mb-1">JSON Size</div>
                      <div className="text-primary">
                        {Math.round(formatItemAsJson(selectedItem).length / 1024 * 100) / 100} KB
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Schema Version</div>
                      <div className="text-primary">v2.0</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Properties</div>
                      <div className="text-primary">
                        {Object.keys(JSON.parse(formatItemAsJson(selectedItem))).length}
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground mb-1">Validation</div>
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="size-3 text-success" />
                        <span className="text-success">Valid</span>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <Button 
                      size="sm" 
                      className="w-full"
                      onClick={() => {
                        const jsonString = formatItemAsJson(selectedItem);
                        const blob = new Blob([jsonString], { type: 'application/json' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `${selectedItem.name.toLowerCase().replace(/\s+/g, '-')}-migration.json`;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="size-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Code className="size-4 mr-2" />
                      Generate JIRA Ticket
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <Eye className="size-12 text-muted-foreground mx-auto mb-4" />
                <h3>Select an item</h3>
                <p className="text-muted-foreground">
                  Choose an item from the tree to view its details
                </p>
              </div>
            </div>
          )}
        </div>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

// Enhanced Code Artifact Viewer with FIXED SYNTAX HIGHLIGHTING
export function CodeArtifactView({ artifact }: { artifact: Artifact }) {
  const [selectedFile, setSelectedFile] = useState('components.css');
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFolders, setExpandedFolders] = useState(new Set(['src', 'components', 'styles']));

  // Complete file structure with proper nesting
  const fileStructure = [
    {
      name: 'src',
      type: 'folder',
      children: [
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Navigation.tsx', type: 'file', language: 'typescript' },
            { name: 'HeaderBanner.tsx', type: 'file', language: 'typescript' }
          ]
        },
        {
          name: 'pages',
          type: 'folder',
          children: [
            { name: 'HomePage.tsx', type: 'file', language: 'typescript' },
            { name: 'AboutPage.tsx', type: 'file', language: 'typescript' }
          ]
        },
        {
          name: 'styles',
          type: 'folder',
          children: [
            { name: 'globals.css', type: 'file', language: 'css' },
            { name: 'components.css', type: 'file', language: 'css' }
          ]
        }
      ]
    },
    { name: 'package.json', type: 'file', language: 'json' },
    { name: 'README.md', type: 'file', language: 'markdown' },
    { name: 'tsconfig.json', type: 'file', language: 'json' }
  ];

  // File content based on selected file
  const getFileContent = (fileName: string) => {
    const contents = {
      'components.css': {
        language: 'css',
        extension: 'css',
        size: '3.5 kB',
        modified: '4 days ago',
        lines: 29,
        content: `/* Component-specific styles */

.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: var(--radius);
  font-weight: 500;
  line-height: 1;
  cursor: pointer;
  white-space: nowrap;
}

.button--primary {
  background: var(--primary);
  color: var(--primary-foreground);
}

.button--primary:hover {
  background: hsl(from var(--primary) h s calc(l - 5%));
}

.button--secondary {
  background: var(--secondary);
  color: var(--secondary-foreground);
}

.button--outline {
  background: transparent;
  border-color: var(--border);
  color: var(--foreground);
}

.button--outline:hover {
  background: var(--accent);
}`
      },
      'Navigation.tsx': {
        language: 'typescript',
        extension: 'tsx',
        size: '2.1 kB',
        modified: '2 hours ago',
        lines: 42,
        content: `import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { ChevronRight, Menu } from 'lucide-react';

interface NavigationItem {
  label: string;
  href: string;
  active?: boolean;
  children?: NavigationItem[];
}

interface NavigationProps {
  items: NavigationItem[];
  onToggleMobile?: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({ 
  items, 
  onToggleMobile 
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    new Set()
  );

  const toggleExpanded = (label: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedItems(newExpanded);
  };

  const renderNavItems = (items: NavigationItem[], level = 0) => {
    return (
      <ul className="space-y-1">
        {items.map((item, index) => (
          <li key={item.href + '-' + index}>
            <Link
              to={item.href}
              className={\`flex items-center gap-2 px-3 py-2 rounded-lg \${
                item.active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
              }\`}
            >
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>
    );
  };

  return <nav className="w-full">{renderNavItems(items)}</nav>;
};`
      },
      'HeaderBanner.tsx': {
        language: 'typescript',
        extension: 'tsx',
        size: '1.8 kB',
        modified: '1 day ago',
        lines: 28,
        content: `import React from 'react';
import { Button } from '../ui/button';

interface HeaderBannerProps {
  title: string;
  subtitle?: string;
  backgroundImage?: string;
  ctaText?: string;
  onCtaClick?: () => void;
}

export const HeaderBanner: React.FC<HeaderBannerProps> = ({
  title,
  subtitle,
  backgroundImage,
  ctaText,
  onCtaClick
}) => {
  return (
    <section 
      className="relative bg-gradient-to-r from-primary to-primary/80 text-primary-foreground py-16 px-6"
      style={backgroundImage ? { 
        backgroundImage: \`url(\${backgroundImage})\`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      } : {}}
    >
      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">{title}</h1>
        {subtitle && (
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            {subtitle}
          </p>
        )}
        {ctaText && onCtaClick && (
          <Button 
            size="lg" 
            variant="secondary"
            onClick={onCtaClick}
            className="mt-4"
          >
            {ctaText}
          </Button>
        )}
      </div>
    </section>
  );
};`
      },
      'globals.css': {
        language: 'css',
        extension: 'css',
        size: '4.2 kB',
        modified: '3 days ago',
        lines: 45,
        content: `@custom-variant dark (&:is(.dark *));

:root, .light {
  --font-size: 14px;
  --background: #ffffff;
  --foreground: oklch(0.145 0 0);
  --primary: #5F55EE;
  --primary-foreground: #ffffff;
  --secondary: #E7E5FF;
  --secondary-foreground: #5F55EE;
  --muted: #ececf0;
  --muted-foreground: #717182;
  --accent: #F3F2FF;
  --accent-foreground: #5F55EE;
  --destructive: #d4183d;
  --destructive-foreground: #ffffff;
  --border: rgba(0, 0, 0, 0.1);
  --input: #ffffff;
  --ring: #5F55EE;
  --radius: 0.625rem;
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: #7B73F0;
  --primary-foreground: #ffffff;
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: #f87171;
  --destructive-foreground: #ffffff;
  --border: oklch(0.269 0 0);
  --input: oklch(0.205 0 0);
  --ring: #7B73F0;
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }
}`
      },
      'package.json': {
        language: 'json',
        extension: 'json',
        size: '1.2 kB',
        modified: '1 week ago',
        lines: 32,
        content: `{
  "name": "kajoo-migration-project",
  "version": "1.0.0",
  "description": "AI-powered migration tools for Sitecore XP to XM Cloud",
  "main": "index.js",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "jest",
    "test:watch": "jest --watch"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "next": "^14.0.0",
    "typescript": "^5.0.0",
    "tailwindcss": "^3.3.0",
    "lucide-react": "^0.263.1"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.0.0",
    "eslint-config-next": "^14.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^13.4.0"
  },
  "keywords": [
    "sitecore",
    "migration",
    "ai",
    "automation"
  ],
  "author": "Kajoo Team",
  "license": "MIT"
}`
      },
      'README.md': {
        language: 'markdown',
        extension: 'md',
        size: '2.8 kB',
        modified: '5 days ago',
        lines: 67,
        content: `# Kajoo 2.0 Migration Project

## Overview

Kajoo 2.0 is a next-generation AI-powered platform that automates DXP migrations from **Sitecore XP MVC** to **Sitecore XM Cloud Headless**. The system orchestrates specialized AI agents for comprehensive migration workflows.

## Key Features

### 🤖 AI Agent Orchestration
- **Legacy Audit Agents**: Analyze existing Sitecore implementations
- **Content Model Generators**: Auto-generate visual sitemaps with content models
- **JIRA Integration**: Create migration stories with P50/P80 estimates
- **Code Migration Agents**: Handle component and template migration

### 🎨 Canvas Workspace
- **Visual Architecture Discovery**: Interactive canvas for exploring discovered systems
- **Real-time Editing**: Modify and validate architecture components
- **Integrated Panels**: Seamless integration with backlog, validation, and activity logging

### 🔧 Migration Tools
- **Human-in-the-Loop**: Strategic approval checkpoints throughout the process
- **Automated Code Generation**: Transform legacy MVC components to modern headless architecture
- **Content Migration**: Preserve content structure and relationships
- **Performance Optimization**: Built-in performance monitoring and optimization

## Technology Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase, AI/ML APIs
- **Integrations**: JIRA, Sitecore APIs, GraphQL
- **Deployment**: Vercel, Sitecore XM Cloud

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Sitecore XP instance (for legacy analysis)
- Sitecore XM Cloud instance (target)

### Installation

\`\`\`bash
# Clone the repository
git clone https://github.com/kajoo-ai/kajoo-2.0.git

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Start development server
npm run dev
\`\`\`

### Configuration

Set up your environment variables:

\`\`\`env
SITECORE_XP_URL=https://your-xp-instance.com
SITECORE_CLOUD_URL=https://your-xmcloud-instance.com  
SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-key
OPENAI_API_KEY=your-openai-key
JIRA_API_TOKEN=your-jira-token
\`\`\`

## Migration Workflow

1. **Discovery Phase**: AI agents scan legacy Sitecore implementation
2. **Analysis Phase**: Generate comprehensive migration roadmap
3. **Planning Phase**: Create JIRA backlog with effort estimates  
4. **Implementation Phase**: Execute migration with approval gates
5. **Launch Phase**: Deploy to XM Cloud with performance validation

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.`
      },
      'tsconfig.json': {
        language: 'json',
        extension: 'json',
        size: '0.8 kB',
        modified: '1 week ago',
        lines: 25,
        content: `{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}`
      }
    };

    return contents[fileName] || contents['components.css'];
  };

  // Enhanced file selection with debugging
  const handleFileSelect = (filePath: string) => {
    console.log('🎯 Selecting file:', filePath);
    setSelectedFile(filePath);
  };

  // Toggle folder expansion
  const toggleFolder = (folderPath: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderPath)) {
      newExpanded.delete(folderPath);
    } else {
      newExpanded.add(folderPath);
    }
    setExpandedFolders(newExpanded);
  };

  // Render file tree with proper VS Code styling
  const renderFileTree = (items: any[], level = 0, parentPath = '') => {
    return items.map((item) => {
      const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;
      const isExpanded = expandedFolders.has(currentPath);
      const isSelected = selectedFile === item.name;

      if (item.type === 'folder') {
        return (
          <div key={currentPath}>
            <div 
              className="flex items-center gap-2 py-2 px-3 hover:bg-muted/50 cursor-pointer transition-colors"
              style={{ paddingLeft: `${level * 20 + 12}px` }}
              onClick={() => toggleFolder(currentPath)}
            >
              <ChevronRight 
                className={`size-4 transition-transform text-muted-foreground ${
                  isExpanded ? 'rotate-90' : ''
                }`} 
              />
              <Folder className={`size-4 ${isExpanded ? 'text-primary' : 'text-warning'}`} />
              <span className="text-sm font-medium text-foreground">{item.name}</span>
            </div>
            {isExpanded && item.children && (
              <div>
                {renderFileTree(item.children, level + 1, currentPath)}
              </div>
            )}
          </div>
        );
      } else {
        // File icons based on extension
        const getFileIcon = (fileName: string) => {
          if (fileName.endsWith('.tsx')) {
            return <FileText className="size-4 text-primary" />;
          } else if (fileName.endsWith('.ts')) {
            return <FileText className="size-4 text-primary" />;
          } else if (fileName.endsWith('.css')) {
            return <FileText className="size-4 text-pink-500" />;
          } else if (fileName.endsWith('.json')) {
            return <FileText className="size-4 text-warning" />;
          } else if (fileName.endsWith('.md')) {
            return <FileText className="size-4 text-gray-600" />;
          }
          return <FileText className="size-4 text-muted-foreground" />;
        };

        return (
          <div 
            key={currentPath}
            className={`flex items-center gap-2 py-2 px-3 cursor-pointer transition-colors ${
              isSelected 
                ? 'bg-primary/15 text-primary border-r-2 border-primary font-medium' 
                : 'hover:bg-muted/50 text-foreground'
            }`}
            style={{ paddingLeft: `${(level + 1) * 20 + 12}px` }}
            onClick={() => handleFileSelect(item.name)}
          >
            {getFileIcon(item.name)}
            <span className="text-sm font-medium">{item.name}</span>
          </div>
        );
      }
    });
  };

  // Filter files based on search
  const filteredFiles = searchTerm ? 
    fileStructure.filter(item => 
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) : fileStructure;

  const currentFile = useMemo(() => {
    console.log('🔄 Getting content for file:', selectedFile);
    return getFileContent(selectedFile);
  }, [selectedFile]);

  // Get file path based on selected file
  const getFilePath = (fileName: string) => {
    if (fileName.endsWith('.css')) {
      return 'styles /';
    } else if (fileName.endsWith('.tsx') || fileName.endsWith('.ts')) {
      if (fileName.includes('Page')) {
        return 'pages /';
      }
      return 'components /';
    } else if (fileName.endsWith('.json') || fileName.endsWith('.md')) {
      return 'root /';
    }
    return '';
  };

  // ✅ FIXED SYNTAX HIGHLIGHTING with theme-aware colors
  const highlightCode = (code: string, language: string) => {
    const lines = code.split('\n');
    return lines.map((line, index) => {
      let highlightedLine = line;

      if (language === 'css') {
        // CSS syntax highlighting with theme-aware colors
        highlightedLine = line
          .replace(/\/\*[\s\S]*?\*\//g, '<span style="color: var(--color-syntax-comment);">$&</span>')
          .replace(/([.#][\w-]+)/g, '<span style="color: var(--color-syntax-property);">$1</span>')
          .replace(/([a-zA-Z-]+)(?=\s*:)/g, '<span style="color: var(--color-syntax-keyword);">$1</span>')
          .replace(/(:\s*)([^;{}]+)(;?)/g, '$1<span style="color: var(--color-syntax-string);">$2</span>$3')
          .replace(/var\(([^)]+)\)/g, '<span style="color: var(--color-syntax-function);">var($1)</span>')
          .replace(/\b(from|to|calc|hsl|flex|inline-flex|center|solid|transparent)\b/g, '<span style="color: var(--color-syntax-keyword);">$1</span>')
          .replace(/(\d+\.?\d*)(px|rem|em|%|vh|vw)?/g, '<span style="color: var(--color-syntax-number);">$1$2</span>');
      } else if (language === 'typescript') {
        // TypeScript syntax highlighting with theme-aware colors
        highlightedLine = line
          .replace(/\b(import|export|const|let|var|function|interface|type|class|return|if|else|for|while|do|switch|case|break|continue)\b/g, '<span style="color: var(--color-syntax-keyword);">$1</span>')
          .replace(/\b(React|useState|useEffect|FC)\b/g, '<span style="color: var(--color-syntax-type);">$1</span>')
          .replace(/'([^']*)'/g, '<span style="color: var(--color-syntax-string);">\'$1\'</span>')
          .replace(/\"([^\"]*)\"/g, '<span style="color: var(--color-syntax-string);">\"$1\"</span>')
          .replace(/`([^`]*)`/g, '<span style="color: var(--color-syntax-string);">`$1`</span>')
          .replace(/\/\/.*$/g, '<span style="color: var(--color-syntax-comment);">$&</span>')
          .replace(/\b(string|number|boolean|void|any|unknown)\b/g, '<span style="color: var(--color-syntax-type);">$1</span>')
          .replace(/([A-Z][a-zA-Z]*Props?)\b/g, '<span style="color: var(--color-syntax-type);">$1</span>');
      } else if (language === 'json') {
        // JSON syntax highlighting with theme-aware colors
        highlightedLine = line
          .replace(/\"([^\"]*)\"(\s*:)/g, '<span style="color: var(--color-syntax-property);">\"$1\"</span>$2')
          .replace(/(:\s*)\"([^\"]*)\"(,?)/g, '$1<span style="color: var(--color-syntax-string);">\"$2\"</span>$3')
          .replace(/(:\s*)(\d+\.?\d*)(,?)/g, '$1<span style="color: var(--color-syntax-number);">$2</span>$3')
          .replace(/(:\s*)(true|false|null)(,?)/g, '$1<span style="color: var(--color-syntax-keyword);">$2</span>$3');
      } else if (language === 'markdown') {
        // Markdown syntax highlighting with theme-aware colors
        highlightedLine = line
          .replace(/^(#+)\s+(.+)/g, '<span style="color: var(--color-syntax-keyword);">$1</span> <span style="color: var(--color-syntax-function);">$2</span>')
          .replace(/\*\*([^*]+)\*\*/g, '<span style="color: var(--color-syntax-keyword); font-weight: bold;">$1</span>')
          .replace(/\*([^*]+)\*/g, '<span style="color: var(--color-syntax-string); font-style: italic;">$1</span>')
          .replace(/`([^`]+)`/g, '<span style="color: var(--color-syntax-string); background: var(--color-muted); padding: 2px 4px; border-radius: 3px;">$1</span>')
          .replace(/^(\s*-\s+)/g, '<span style="color: var(--color-syntax-keyword);">$1</span>')
          .replace(/\[(.*?)\]\((.*?)\)/g, '<span style="color: var(--color-syntax-keyword);">[$1]</span><span style="color: var(--color-syntax-string);">($2)</span>');
      }

      return (
        <div key={index} className="min-h-[20px] leading-5">
          <span dangerouslySetInnerHTML={{ __html: highlightedLine || '&nbsp;' }} />
        </div>
      );
    });
  };

  return (
    <div className="h-full flex bg-background">
      {/* Left Panel - File Explorer */}
      <div className="w-80 bg-background border-r border-border flex flex-col">
        <div className="px-4 py-3 border-b border-border bg-muted/30">
          <h4 className="font-semibold text-sm uppercase tracking-wide text-muted-foreground">Explorer</h4>
          <p className="text-xs text-muted-foreground mt-1">Migration project files</p>
        </div>
        
        <div className="px-3 py-2 border-b border-border">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search files..." 
              className="pl-9 h-8 text-sm bg-background border-border focus:ring-1 focus:ring-primary"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="py-2">
            {renderFileTree(filteredFiles)}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel - Code Editor */}
      <div className="flex-1 flex flex-col bg-background">
        {/* Header with file path and actions */}
        <div className="flex items-center justify-between bg-muted/20 border-b border-border px-4 py-2 h-10">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">{getFilePath(selectedFile)}</span>
            <span className="font-medium">{selectedFile}</span>
            <span className="text-muted-foreground text-xs">{currentFile.size}</span>
            <span className="text-muted-foreground text-xs">Modified {currentFile.modified}</span>
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Copy className="size-3 mr-1" />
              Copy
            </Button>
            <Button variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Download className="size-3 mr-1" />
              Download
            </Button>
          </div>
        </div>

        {/* Code content */}
        <div className="flex-1 relative">
          <div className="absolute inset-0 flex">
            {/* Line numbers */}
            <div className="bg-muted/30 border-r border-border flex-shrink-0 w-12 py-3 px-2">
              <div className="text-right text-xs text-muted-foreground leading-5 font-mono">
                {Array.from({length: currentFile.lines}, (_, i) => (
                  <div key={i + 1} className="min-h-[20px] leading-5">
                    {i + 1}
                  </div>
                ))}
              </div>
            </div>

            {/* Code content */}
            <div className="flex-1 overflow-auto" key={selectedFile}>
              <div className="p-3 font-mono text-sm leading-5">
                {highlightCode(currentFile.content, currentFile.language)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Text Artifact Viewer  
export function TextArtifactView({ artifact }: { artifact: Artifact }) {
  return (
    <div className="h-full">
      <ScrollArea className="h-full">
        <div className="p-6">
          <div className="prose prose-sm max-w-none">
            <p className="text-muted-foreground mb-4">
              {artifact.summary}
            </p>
            <div className="bg-muted/50 rounded-lg p-4 whitespace-pre-wrap">
              {artifact.content || 'No content available'}
            </div>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
}

// Hybrid Artifact Viewer
export function HybridArtifactView({ artifact }: { artifact: Artifact }) {
  const [viewMode, setViewMode] = useState<'sitecore' | 'code'>('sitecore');

  return (
    <div className="h-full flex flex-col">
      {/* Toggle Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-background">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-primary" />
          <span className="font-medium">Hybrid View</span>
        </div>
        <div className="flex items-center bg-muted rounded-lg p-1">
          <Button
            variant={viewMode === 'sitecore' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('sitecore')}
            className="px-3 py-1 h-8"
          >
            <Database className="size-4 mr-1" />
            Sitecore Tree View
          </Button>
          <Button
            variant={viewMode === 'code' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('code')}
            className="px-3 py-1 h-8"
          >
            <Code className="size-4 mr-1" />
            Code View
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1">
        {viewMode === 'sitecore' ? (
          <SitecoreArtifactView artifact={artifact} />
        ) : (
          <CodeArtifactView artifact={artifact} />
        )}
      </div>
    </div>
  );
}