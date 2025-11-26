import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SourceSitemapPanel } from '@/components/SourceSitemapPanel';
import { 
  Monitor,
  Smartphone,
  Tablet,
  Code,
  Eye,
  FileText,
  Image,
  Users,
  Database,
  Layers,
  ExternalLink,
  Download,
  RefreshCw,
  Grid3X3,
  List,
  Network,
  MoreHorizontal,
  Plus,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Maximize,
  MousePointer2,
  Filter,
  FileCode
} from 'lucide-react';

interface MigrationPreviewCanvasProps {
  selectedProject: any;
}

interface PreviewItem {
  id: string;
  name: string;
  type: 'page' | 'component' | 'content-model' | 'content-item' | 'media' | 'user';
  status: 'migrated' | 'in-progress' | 'pending' | 'review';
  url?: string;
  preview?: string;
  metadata: {
    sourceFile?: string;
    targetFile?: string;
    lastModified: string;
    size?: string;
    dependencies?: string[];
  };
}

export function MigrationPreviewCanvas({ selectedProject }: MigrationPreviewCanvasProps) {
  const [activeTab, setActiveTab] = useState('pages');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'sitemap'>('grid');
  const [deviceView, setDeviceView] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [selectedItem, setSelectedItem] = useState<PreviewItem | null>(null);

  // Mock data for preview items
  const previewItems: Record<string, PreviewItem[]> = {
    pages: [
      {
        id: 'p1',
        name: 'Homepage',
        type: 'page',
        status: 'migrated',
        url: '/home',
        preview: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        metadata: {
          sourceFile: '/layouts/Home.cshtml',
          targetFile: '/pages/index.tsx',
          lastModified: '2 hours ago',
          dependencies: ['Header', 'Hero', 'ProductGrid', 'Footer']
        }
      },
      {
        id: 'p2', 
        name: 'Product Catalog',
        type: 'page',
        status: 'migrated',
        url: '/catalog',
        preview: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop',
        metadata: {
          sourceFile: '/layouts/Catalog.cshtml',
          targetFile: '/pages/catalog.tsx',
          lastModified: '4 hours ago',
          dependencies: ['Header', 'ProductList', 'FilterSidebar', 'Pagination']
        }
      },
      {
        id: 'p3',
        name: 'Product Detail',
        type: 'page', 
        status: 'in-progress',
        url: '/product/[id]',
        preview: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
        metadata: {
          sourceFile: '/layouts/ProductDetail.cshtml',
          targetFile: '/pages/product/[id].tsx',
          lastModified: '1 hour ago',
          dependencies: ['Header', 'ProductGallery', 'ProductInfo', 'Reviews']
        }
      },
      {
        id: 'p4',
        name: 'Contact Us',
        type: 'page',
        status: 'pending',
        url: '/contact',
        metadata: {
          sourceFile: '/layouts/Contact.cshtml',
          targetFile: '/pages/contact.tsx',
          lastModified: '1 day ago',
          dependencies: ['Header', 'ContactForm', 'LocationMap']
        }
      }
    ],
    components: [
      {
        id: 'c1',
        name: 'Header Navigation',
        type: 'component',
        status: 'migrated',
        preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=100&fit=crop',
        metadata: {
          sourceFile: '/renderings/Header.cshtml',
          targetFile: '/components/Header.tsx',
          lastModified: '3 hours ago'
        }
      },
      {
        id: 'c2',
        name: 'Product Grid',
        type: 'component',
        status: 'migrated',
        preview: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=200&fit=crop',
        metadata: {
          sourceFile: '/renderings/ProductGrid.cshtml',
          targetFile: '/components/ProductGrid.tsx',
          lastModified: '2 hours ago'
        }
      },
      {
        id: 'c3',
        name: 'Contact Form',
        type: 'component',
        status: 'review',
        preview: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=200&fit=crop',
        metadata: {
          sourceFile: '/renderings/ContactForm.cshtml',
          targetFile: '/components/ContactForm.tsx',
          lastModified: '30 minutes ago'
        }
      }
    ],
    'content-models': [
      {
        id: 'cm1',
        name: 'Product Template',
        type: 'content-model',
        status: 'migrated',
        metadata: {
          sourceFile: '/templates/Product.json',
          targetFile: '/types/Product.ts',
          lastModified: '1 day ago'
        }
      },
      {
        id: 'cm2',
        name: 'Category Template',
        type: 'content-model',
        status: 'migrated',
        metadata: {
          sourceFile: '/templates/Category.json',
          targetFile: '/types/Category.ts',
          lastModified: '1 day ago'
        }
      },
      {
        id: 'cm3',
        name: 'Blog Post Template',
        type: 'content-model',
        status: 'in-progress',
        metadata: {
          sourceFile: '/templates/BlogPost.json',
          targetFile: '/types/BlogPost.ts',
          lastModified: '3 hours ago'
        }
      },
      {
        id: 'cm4',
        name: 'Landing Page Template',
        type: 'content-model',
        status: 'pending',
        metadata: {
          sourceFile: '/templates/LandingPage.json',
          targetFile: '/types/LandingPage.ts',
          lastModified: '5 hours ago'
        }
      }
    ],
    content: [
      {
        id: 'ci1',
        name: 'Homepage Content',
        type: 'content-item',
        status: 'migrated',
        metadata: {
          sourceFile: '/content/home.yml',
          targetFile: '/content/home.json',
          lastModified: '2 hours ago',
          size: '2.3 KB'
        }
      },
      {
        id: 'ci2',
        name: 'Product Catalog Content',
        type: 'content-item',
        status: 'migrated',
        metadata: {
          sourceFile: '/content/catalog.yml',
          targetFile: '/content/catalog.json',
          lastModified: '4 hours ago',
          size: '1.8 KB'
        }
      }
    ],
    media: [
      {
        id: 'm1',
        name: 'Hero Banner',
        type: 'media',
        status: 'migrated',
        preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=200&fit=crop',
        metadata: {
          sourceFile: '/media/hero-banner.jpg',
          targetFile: '/public/images/hero-banner.jpg',
          lastModified: '5 hours ago',
          size: '890 KB'
        }
      }
    ]
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'migrated': return 'bg-success/10 text-success border-success/20';
      case 'in-progress': return 'bg-primary/10 text-primary border-primary/20';
      case 'review': return 'bg-warning/10 text-warning border-warning/20';
      case 'pending': return 'bg-muted text-muted-foreground border-border';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'page': return <FileText className="size-4" />;
      case 'component': return <Layers className="size-4" />;
      case 'content-model': return <Database className="size-4" />;
      case 'content-item': return <FileText className="size-4" />;
      case 'media': return <Image className="size-4" />;
      case 'user': return <Users className="size-4" />;
      default: return <FileText className="size-4" />;
    }
  };

  const currentItems = previewItems[activeTab] || [];

  const renderGridView = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {currentItems.map((item) => (
        <Card 
          key={item.id} 
          className="hover:shadow-md transition-all cursor-pointer"
          onClick={() => setSelectedItem(item)}
        >
          <CardContent className="p-4">
            {item.preview && (
              <div className="aspect-video bg-muted rounded-lg mb-3 overflow-hidden">
                <img 
                  src={item.preview} 
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                {getTypeIcon(item.type)}
                <h4 className="font-medium truncate">{item.name}</h4>
              </div>
              <Badge className={`text-xs ${getStatusColor(item.status)}`}>
                {item.status}
              </Badge>
            </div>
            <div className="text-muted-foreground">
              {item.url && <div className="truncate">URL: {item.url}</div>}
              <div>Modified: {item.metadata.lastModified}</div>
              {item.metadata.size && <div>Size: {item.metadata.size}</div>}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderListView = () => (
    <div className="space-y-2">
      {currentItems.map((item) => (
        <Card 
          key={item.id}
          className="hover:shadow-sm transition-all cursor-pointer"
          onClick={() => setSelectedItem(item)}
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                {getTypeIcon(item.type)}
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{item.name}</h4>
                  <div className="text-muted-foreground">
                    {item.url ? item.url : item.metadata.targetFile}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground text-right">
                  <div>{item.metadata.lastModified}</div>
                  {item.metadata.size && <div>{item.metadata.size}</div>}
                </div>
                <Badge className={`${getStatusColor(item.status)}`}>
                  {item.status}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  // Use the original SourceSitemapPanel component directly
  const renderSitemapView = () => <SourceSitemapPanel />;

  const renderTabContent = () => {
    if (viewMode === 'sitemap') {
      return renderSitemapView();
    }
    
    return (
      <ScrollArea className="h-full">
        <div className="p-4">
          {viewMode === 'grid' ? renderGridView() : renderListView()}
        </div>
      </ScrollArea>
    );
  };

  return (
    <div className="h-full flex flex-col bg-card">
      <div className="p-4 border-b bg-card">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2>Migration Preview</h2>
            <p className="text-muted-foreground">
              {viewMode === 'sitemap' 
                ? 'Interactive site architecture and page template visualization'
                : 'Live preview of migrated content, components, and site architecture'
              }
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Device View Toggle - Only show for non-sitemap views */}
            {viewMode !== 'sitemap' && (
              <div className="flex items-center gap-1 border rounded-lg p-1">
                <Button
                  variant={deviceView === 'desktop' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceView('desktop')}
                >
                  <Monitor className="size-4" />
                </Button>
                <Button
                  variant={deviceView === 'tablet' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceView('tablet')}
                >
                  <Tablet className="size-4" />
                </Button>
                <Button
                  variant={deviceView === 'mobile' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setDeviceView('mobile')}
                >
                  <Smartphone className="size-4" />
                </Button>
              </div>
            )}

            {/* View Mode Toggle */}
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('grid')}
                title="Grid View"
              >
                <Grid3X3 className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('list')}
                title="List View"
              >
                <List className="size-4" />
              </Button>
              <Button
                variant={viewMode === 'sitemap' ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('sitemap')}
                title="Sitemap View"
              >
                <Network className="size-4" />
              </Button>
            </div>

            <Button variant="outline" size="sm">
              <RefreshCw className="size-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Always show tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="pages" className="flex items-center gap-2">
              <FileText className="size-4" />
              Pages ({previewItems.pages?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Layers className="size-4" />
              Components ({previewItems.components?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="content-models" className="flex items-center gap-2">
              <FileCode className="size-4" />
              Content Models ({previewItems['content-models']?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <Database className="size-4" />
              Content ({previewItems.content?.length || 0})
            </TabsTrigger>
            <TabsTrigger value="media" className="flex items-center gap-2">
              <Image className="size-4" />
              Media ({previewItems.media?.length || 0})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Additional context for sitemap view */}
        {viewMode === 'sitemap' && (
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Network className="size-4 text-primary" />
              <span className="font-medium">Interactive Site Architecture</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Showing hierarchical template structure for <strong>{activeTab}</strong>. 
              Switch tabs to view different content types in the sitemap visualization.
            </p>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden">
        {renderTabContent()}
      </div>

      {/* Selected Item Details Modal/Sidebar */}
      {selectedItem && (
        <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <Card className="w-full max-w-4xl max-h-[80vh] overflow-hidden">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getTypeIcon(selectedItem.type)}
                  <div>
                    <CardTitle>{selectedItem.name}</CardTitle>
                    <p className="text-muted-foreground capitalize">{selectedItem.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status}
                  </Badge>
                  <Button variant="outline" size="sm" onClick={() => setSelectedItem(null)}>
                    Close
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Preview */}
                <div>
                  <h4 className="font-medium mb-3">Preview</h4>
                  {selectedItem.preview ? (
                    <div className="aspect-video bg-muted rounded-lg overflow-hidden border">
                      <img 
                        src={selectedItem.preview} 
                        alt={selectedItem.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-muted rounded-lg border flex items-center justify-center">
                      <div className="text-center text-muted-foreground">
                        {getTypeIcon(selectedItem.type)}
                        <p className="mt-2">No preview available</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-3">Migration Details</h4>
                    <div className="space-y-3">
                      {selectedItem.metadata.sourceFile && (
                        <div>
                          <div className="text-muted-foreground">Source File</div>
                          <div className="font-mono bg-muted p-2 rounded">
                            {selectedItem.metadata.sourceFile}
                          </div>
                        </div>
                      )}
                      {selectedItem.metadata.targetFile && (
                        <div>
                          <div className="text-muted-foreground">Target File</div>
                          <div className="font-mono bg-muted p-2 rounded">
                            {selectedItem.metadata.targetFile}
                          </div>
                        </div>
                      )}
                      <div>
                        <div className="text-muted-foreground">Last Modified</div>
                        <div>{selectedItem.metadata.lastModified}</div>
                      </div>
                      {selectedItem.metadata.size && (
                        <div>
                          <div className="text-muted-foreground">Size</div>
                          <div>{selectedItem.metadata.size}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {selectedItem.metadata.dependencies && (
                    <div>
                      <h4 className="font-medium mb-3">Dependencies</h4>
                      <div className="space-y-1">
                        {selectedItem.metadata.dependencies.map((dep, idx) => (
                          <Badge key={idx} variant="outline" className="mr-2 mb-1">
                            {dep}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    <Button size="sm">
                      <Eye className="size-4 mr-2" />
                      View Live
                    </Button>
                    <Button variant="outline" size="sm">
                      <Code className="size-4 mr-2" />
                      View Code
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="size-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}