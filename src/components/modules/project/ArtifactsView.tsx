import React, { useState } from 'react';
import { Button } from '../../ui/button';
import { Input } from '../../ui/input';
import { ScrollArea } from '../../ui/scroll-area';
import { Badge } from '../../ui/badge';
import { Card, CardContent } from '../../ui/card';
import { ArtifactPreviewModal } from '../../ArtifactPreviewModal';
import { 
  Search, 
  Filter,
  Eye,
  Code,
  Database,
  FileText,
  Globe,
  Settings,
  Layers,
  Package,
  Workflow,
  Image,
  Component,
  MoreVertical
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';

// Comprehensive mock artifacts data
const allProjectArtifacts = [
  // Navigation & Core Structure
  {
    id: 'artifact_nav_1',
    name: 'Primary Navigation Template',
    title: 'Primary Navigation Template',
    type: 'sitecore' as const,
    description: 'Multi-level navigation structure with responsive design and accessibility features',
    summary: 'Multi-level navigation structure with responsive design and accessibility features',
    category: 'Navigation',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-16T14:20:00Z',
    size: '24KB',
    complexity: 'High'
  },
  {
    id: 'artifact_nav_2', 
    name: 'NavigationController.cs',
    title: 'NavigationController.cs',
    type: 'code' as const,
    description: 'MVC controller for dynamic navigation generation with caching and personalization',
    summary: 'MVC controller for dynamic navigation generation with caching and personalization',
    category: 'Navigation',
    createdAt: '2024-01-15T11:45:00Z',
    updatedAt: '2024-01-15T16:30:00Z',
    size: '18KB',
    complexity: 'Medium'
  },
  {
    id: 'artifact_nav_3',
    name: 'Breadcrumb Component',
    title: 'Breadcrumb Component',
    type: 'hybrid' as const,
    description: 'Breadcrumb navigation with schema markup and dynamic path generation',
    summary: 'Breadcrumb navigation with schema markup and dynamic path generation',
    category: 'Navigation',
    createdAt: '2024-01-15T09:15:00Z',
    updatedAt: '2024-01-15T12:45:00Z',
    size: '12KB',
    complexity: 'Low'
  },

  // Content Templates
  {
    id: 'artifact_content_1',
    name: 'Article Template',
    title: 'Article Template',
    type: 'sitecore' as const,
    description: 'Content template for blog articles with SEO metadata and social sharing',
    summary: 'Content template for blog articles with SEO metadata and social sharing',
    category: 'Content',
    createdAt: '2024-01-16T08:30:00Z',
    updatedAt: '2024-01-17T10:15:00Z',
    size: '16KB',
    complexity: 'Medium'
  },
  {
    id: 'artifact_content_2',
    name: 'ArticleController.cs',
    title: 'ArticleController.cs',
    type: 'code' as const,
    description: 'MVC controller for article display with comments, ratings, and related content',
    summary: 'MVC controller for article display with comments, ratings, and related content',
    category: 'Content',
    createdAt: '2024-01-16T14:20:00Z',
    updatedAt: '2024-01-16T17:45:00Z',
    size: '22KB',
    complexity: 'High'
  },
  {
    id: 'artifact_content_3',
    name: 'Product Template',
    title: 'Product Template',
    type: 'sitecore' as const,
    description: 'E-commerce product template with variants, pricing, and inventory fields',
    summary: 'E-commerce product template with variants, pricing, and inventory fields',
    category: 'Content',
    createdAt: '2024-01-17T09:00:00Z',
    updatedAt: '2024-01-18T11:30:00Z',
    size: '28KB',
    complexity: 'High'
  },

  // Search Functionality
  {
    id: 'artifact_search_1',
    name: 'SearchService.cs',
    title: 'SearchService.cs',
    type: 'code' as const,
    description: 'Comprehensive search service with faceted search, autocomplete, and analytics',
    summary: 'Comprehensive search service with faceted search, autocomplete, and analytics',
    category: 'Search',
    createdAt: '2024-01-18T13:15:00Z',
    updatedAt: '2024-01-19T09:45:00Z',
    size: '35KB',
    complexity: 'High'
  },
  {
    id: 'artifact_search_2',
    name: 'Search Results Template',
    title: 'Search Results Template',
    type: 'hybrid' as const,
    description: 'Search results page with filters, sorting, and pagination functionality',
    summary: 'Search results page with filters, sorting, and pagination functionality',
    category: 'Search',
    createdAt: '2024-01-18T15:30:00Z',
    updatedAt: '2024-01-19T12:00:00Z',
    size: '19KB',
    complexity: 'Medium'
  },

  // Hero Components
  {
    id: 'artifact_hero_1',
    name: 'HeroComponent.cs',
    title: 'HeroComponent.cs',
    type: 'code' as const,
    description: 'Dynamic hero banner with personalization, A/B testing, and responsive images',
    summary: 'Dynamic hero banner with personalization, A/B testing, and responsive images',
    category: 'Marketing',
    createdAt: '2024-01-19T10:20:00Z',
    updatedAt: '2024-01-20T14:15:00Z',
    size: '21KB',
    complexity: 'High'
  },
  {
    id: 'artifact_hero_2',
    name: 'Hero Section Template',
    title: 'Hero Section Template',
    type: 'sitecore' as const,
    description: 'Hero section template with video background support and call-to-action buttons',
    summary: 'Hero section template with video background support and call-to-action buttons',
    category: 'Marketing',
    createdAt: '2024-01-19T11:45:00Z',
    updatedAt: '2024-01-20T16:30:00Z',
    size: '17KB',
    complexity: 'Medium'
  },

  // Forms & User Input
  {
    id: 'artifact_forms_1',
    name: 'ContactFormProcessor.cs',
    title: 'ContactFormProcessor.cs',
    type: 'code' as const,
    description: 'Form processor with validation, spam protection, and CRM integration',
    summary: 'Form processor with validation, spam protection, and CRM integration',
    category: 'Forms',
    createdAt: '2024-01-20T08:45:00Z',
    updatedAt: '2024-01-21T10:20:00Z',
    size: '26KB',
    complexity: 'High'
  },
  {
    id: 'artifact_forms_2',
    name: 'Registration Template',
    title: 'Registration Template',
    type: 'hybrid' as const,
    description: 'User registration form with multi-step validation and email verification',
    summary: 'User registration form with multi-step validation and email verification',
    category: 'Forms',
    createdAt: '2024-01-20T14:30:00Z',
    updatedAt: '2024-01-21T11:45:00Z',
    size: '23KB',
    complexity: 'Medium'
  },

  // Media & Assets
  {
    id: 'artifact_media_1',
    name: 'ImageProcessor.cs',
    title: 'ImageProcessor.cs',
    type: 'code' as const,
    description: 'Image processing service with resizing, optimization, and CDN integration',
    summary: 'Image processing service with resizing, optimization, and CDN integration',
    category: 'Media',
    createdAt: '2024-01-21T09:15:00Z',
    updatedAt: '2024-01-22T13:30:00Z',
    size: '31KB',
    complexity: 'High'
  },
  {
    id: 'artifact_media_2',
    name: 'Gallery Template',
    title: 'Gallery Template',
    type: 'sitecore' as const,
    description: 'Image gallery with lightbox, thumbnails, and lazy loading support',
    summary: 'Image gallery with lightbox, thumbnails, and lazy loading support',
    category: 'Media',
    createdAt: '2024-01-21T15:45:00Z',
    updatedAt: '2024-01-22T09:20:00Z',
    size: '14KB',
    complexity: 'Low'
  },

  // Authentication & Security
  {
    id: 'artifact_auth_1',
    name: 'AuthenticationService.cs',
    title: 'AuthenticationService.cs',
    type: 'code' as const,
    description: 'Authentication service with SSO, MFA, and session management',
    summary: 'Authentication service with SSO, MFA, and session management',
    category: 'Security',
    createdAt: '2024-01-22T10:30:00Z',
    updatedAt: '2024-01-23T14:45:00Z',
    size: '38KB',
    complexity: 'High'
  },
  {
    id: 'artifact_auth_2',
    name: 'User Profile Template',
    title: 'User Profile Template',
    type: 'hybrid' as const,
    description: 'User profile management with preferences, privacy settings, and activity history',
    summary: 'User profile management with preferences, privacy settings, and activity history',
    category: 'Security',
    createdAt: '2024-01-22T16:15:00Z',
    updatedAt: '2024-01-23T11:20:00Z',
    size: '25KB',
    complexity: 'Medium'
  },

  // E-commerce
  {
    id: 'artifact_ecom_1',
    name: 'ShoppingCartService.cs',
    title: 'ShoppingCartService.cs',
    type: 'code' as const,
    description: 'Shopping cart with persistence, promotions, and abandoned cart recovery',
    summary: 'Shopping cart with persistence, promotions, and abandoned cart recovery',
    category: 'E-commerce',
    createdAt: '2024-01-23T08:20:00Z',
    updatedAt: '2024-01-24T12:15:00Z',
    size: '42KB',
    complexity: 'High'
  },
  {
    id: 'artifact_ecom_2',
    name: 'Checkout Template',
    title: 'Checkout Template',
    type: 'hybrid' as const,
    description: 'Multi-step checkout with payment integration and order confirmation',
    summary: 'Multi-step checkout with payment integration and order confirmation',
    category: 'E-commerce',
    createdAt: '2024-01-23T13:45:00Z',
    updatedAt: '2024-01-24T16:30:00Z',
    size: '33KB',
    complexity: 'High'
  },

  // Analytics & Tracking
  {
    id: 'artifact_analytics_1',
    name: 'AnalyticsProcessor.cs',
    title: 'AnalyticsProcessor.cs',
    type: 'code' as const,
    description: 'Analytics processor with event tracking, conversion goals, and reporting',
    summary: 'Analytics processor with event tracking, conversion goals, and reporting',
    category: 'Analytics',
    createdAt: '2024-01-24T09:30:00Z',
    updatedAt: '2024-01-25T11:45:00Z',
    size: '29KB',
    complexity: 'Medium'
  },

  // API Integration
  {
    id: 'artifact_api_1',
    name: 'APIController.cs',
    title: 'APIController.cs',
    type: 'code' as const,
    description: 'REST API controller with authentication, rate limiting, and documentation',
    summary: 'REST API controller with authentication, rate limiting, and documentation',
    category: 'Integration',
    createdAt: '2024-01-25T14:20:00Z',
    updatedAt: '2024-01-26T10:15:00Z',
    size: '27KB',
    complexity: 'High'
  }
];

// Categories for filtering
const artifactCategories = [
  'All',
  'Navigation',
  'Content', 
  'Search',
  'Marketing',
  'Forms',
  'Media',
  'Security',
  'E-commerce',
  'Analytics',
  'Integration'
];

// Complexity levels
const complexityLevels = ['All', 'Low', 'Medium', 'High'];

interface ArtifactsViewProps {
  projectId?: string;
}

// Artifact card component (reused from ChatLayout)
const ArtifactCard = ({ 
  artifact, 
  onPreview, 
  isHighlighted = false 
}: { 
  artifact: any; 
  onPreview: (artifact: any) => void;
  isHighlighted?: boolean;
}) => {
  const getArtifactIcon = (type: string) => {
    switch (type) {
      case 'code': return <Code className="text-info" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'sitecore': return <Database className="text-success" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
      case 'hybrid': 
        return (
          <div className="relative flex gap-0.5">
            <Database className="text-success" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
            <Code className="text-info" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
          </div>
        );
      default: return <FileText style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />;
    }
  };

  const getArtifactBadgeClass = (type: string) => {
    switch (type) {
      case 'code': return 'bg-info/10 text-info border-info/20';
      case 'sitecore': return 'bg-success/10 text-success border-success/20';
      case 'hybrid': return 'bg-gradient-to-r from-success/10 to-info/10 text-primary border-primary/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Low': return 'bg-success/10 text-success border-success/20';
      case 'Medium': return 'bg-warning/10 text-warning border-warning/20';
      case 'High': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  return (
    <Card className={`hover:bg-muted/30 transition-all duration-300 ${
      isHighlighted ? 'ring-2 ring-primary/50 bg-primary/5 animate-pulse' : ''
    }`}>
      <CardContent style={{ padding: 'var(--spacing-4)' }}>
        <div className="flex items-start justify-between">
          <div className="flex items-start flex-1 min-w-0" style={{ gap: 'var(--spacing-3)' }}>
            {getArtifactIcon(artifact.type)}
            <div className="flex-1 min-w-0">
              <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                <h4 className="font-medium truncate">{artifact.name}</h4>
                <Badge 
                  variant="outline" 
                  className={getArtifactBadgeClass(artifact.type)}
                >
                  {artifact.type}
                </Badge>
              </div>
              
              {artifact.summary && (
                <p className="text-muted-foreground line-clamp-2" style={{ marginBottom: 'var(--spacing-3)' }}>
                  {artifact.summary}
                </p>
              )}
              
              <div className="flex items-center" style={{ gap: 'var(--spacing-2)', marginBottom: 'var(--spacing-2)' }}>
                <Badge variant="outline">
                  {artifact.category}
                </Badge>
                <Badge 
                  variant="outline" 
                  className={getComplexityColor(artifact.complexity)}
                >
                  {artifact.complexity}
                </Badge>
                <span className="text-muted-foreground">{artifact.size}</span>
              </div>
              
              <div className="text-muted-foreground">
                Updated: {new Date(artifact.updatedAt).toLocaleDateString()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center" style={{ gap: 'var(--spacing-1)', marginLeft: 'var(--spacing-4)' }}>
            <Button
              variant="ghost"
              size="sm"
              style={{ height: 'var(--spacing-8)', padding: '0 var(--spacing-2)' }}
              onClick={() => onPreview(artifact)}
            >
              <Eye className="mr-1" style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
              Preview
            </Button>
            <Button
              variant="ghost"
              size="sm"
              style={{ height: 'var(--spacing-8)', width: 'var(--spacing-8)', padding: 0 }}
            >
              <MoreVertical style={{ width: 'var(--spacing-3)', height: 'var(--spacing-3)' }} />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export function ArtifactsView({ projectId }: ArtifactsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedComplexity, setSelectedComplexity] = useState('All');
  const [previewArtifact, setPreviewArtifact] = useState<any>(null);
  const [highlightedArtifactId, setHighlightedArtifactId] = useState<string | null>(null);

  // Filter artifacts based on search and filters
  const filteredArtifacts = allProjectArtifacts.filter(artifact => {
    const matchesSearch = 
      artifact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      artifact.category.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'All' || artifact.category === selectedCategory;
    const matchesComplexity = selectedComplexity === 'All' || artifact.complexity === selectedComplexity;
    
    return matchesSearch && matchesCategory && matchesComplexity;
  });

  const handleArtifactPreview = (artifact: any) => {
    setPreviewArtifact(artifact);
  };

  const handleHighlightInChat = (artifactId: string) => {
    setHighlightedArtifactId(artifactId);
    setTimeout(() => {
      setHighlightedArtifactId(null);
    }, 3000);
  };

  // Get artifact counts by category
  const getCategoryCount = (category: string) => {
    if (category === 'All') return allProjectArtifacts.length;
    return allProjectArtifacts.filter(artifact => artifact.category === category).length;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="border-b border-border bg-card flex-shrink-0" style={{ padding: 'var(--spacing-6)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-6)' }}>
          <div>
            <h1>Project Artifacts</h1>
            <p className="text-muted-foreground">
              {filteredArtifacts.length} of {allProjectArtifacts.length} artifacts
            </p>
          </div>
          <Button variant="outline" size="sm">
            <Package className="mr-2" style={{ width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
            Export All
          </Button>
        </div>
        
        {/* Search and Filters */}
        <div className="flex items-center" style={{ gap: 'var(--spacing-4)' }}>
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute text-muted-foreground" style={{ left: 'var(--spacing-3)', top: '50%', transform: 'translateY(-50%)', width: 'var(--spacing-4)', height: 'var(--spacing-4)' }} />
            <Input
              placeholder="Search artifacts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 'var(--spacing-10)' }}
            />
          </div>
          
          {/* Category Filter */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <span className="font-medium">Category:</span>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {artifactCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    <div className="flex items-center justify-between w-full">
                      <span>{category}</span>
                      {category !== 'All' && (
                        <Badge variant="secondary" className="ml-2 h-4 px-1.5">
                          {getCategoryCount(category)}
                        </Badge>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Complexity Filter */}
          <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
            <span className="font-medium">Complexity:</span>
            <Select value={selectedComplexity} onValueChange={setSelectedComplexity}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Complexity" />
              </SelectTrigger>
              <SelectContent>
                {complexityLevels.map((complexity) => (
                  <SelectItem key={complexity} value={complexity}>
                    {complexity}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Artifacts Grid */}
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full">
          <div style={{ padding: 'var(--spacing-6)' }}>
            {filteredArtifacts.length === 0 ? (
              <div className="flex flex-col items-center justify-center" style={{ padding: 'var(--spacing-12) 0' }}>
                <Package className="text-muted-foreground" style={{ width: 'var(--spacing-12)', height: 'var(--spacing-12)', marginBottom: 'var(--spacing-4)' }} />
                <h3>No artifacts found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  {searchQuery || selectedCategory !== 'All' || selectedComplexity !== 'All'
                    ? 'Try adjusting your search terms or filters'
                    : 'No artifacts have been generated yet for this project'
                  }
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3" style={{ gap: 'var(--spacing-4)' }}>
                {filteredArtifacts.map((artifact) => (
                  <ArtifactCard
                    key={artifact.id}
                    artifact={artifact}
                    onPreview={handleArtifactPreview}
                    isHighlighted={highlightedArtifactId === artifact.id}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Artifact Preview Modal */}
      <ArtifactPreviewModal
        artifact={previewArtifact}
        isOpen={!!previewArtifact}
        onClose={() => setPreviewArtifact(null)}
        onHighlightInChat={handleHighlightInChat}
      />
    </div>
  );
}