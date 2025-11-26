// Artifacts data for Kajoo 2.0 DXP Migration Platform

export interface Artifact {
  id: string;
  name: string;
  type: 'sitecore' | 'code' | 'configuration' | 'content' | 'template' | 'component' | 'hybrid';
  category: string;
  size: string;
  lastModified: string;
  status: 'discovered' | 'analyzed' | 'migrated' | 'validated';
  path: string;
  description?: string;
  dependencies?: string[];
  migrationComplexity?: 'low' | 'medium' | 'high' | 'critical';
  // For hybrid artifacts that contain both Sitecore and Code components
  hybridData?: {
    sitecoreComponent: any;
    codeComponent: any;
  };
}

export const PROJECT_ARTIFACTS: Artifact[] = [
  // Sitecore Templates
  {
    id: 'st_001',
    name: 'Article Template',
    type: 'sitecore',
    category: 'Templates',
    size: '24 KB',
    lastModified: '2024-01-15',
    status: 'analyzed',
    path: '/sitecore/templates/User Defined/Article',
    description: 'Main article content template with rich text and metadata fields',
    migrationComplexity: 'medium',
    dependencies: ['st_002', 'st_003']
  },
  {
    id: 'st_002', 
    name: 'Page Template',
    type: 'sitecore',
    category: 'Templates',
    size: '18 KB',
    lastModified: '2024-01-12',
    status: 'analyzed',
    path: '/sitecore/templates/User Defined/Page',
    description: 'Base page template with navigation and SEO fields',
    migrationComplexity: 'low'
  },
  {
    id: 'st_003',
    name: 'Hero Banner Template',
    type: 'sitecore',
    category: 'Templates',
    size: '12 KB',
    lastModified: '2024-01-18',
    status: 'discovered',
    path: '/sitecore/templates/User Defined/Components/Hero Banner',
    description: 'Hero banner component with image, title, and CTA',
    migrationComplexity: 'medium'
  },
  
  // Sitecore Renderings
  {
    id: 'sr_001',
    name: 'Article List Rendering',
    type: 'sitecore',
    category: 'Renderings',
    size: '8 KB',
    lastModified: '2024-01-10',
    status: 'migrated',
    path: '/sitecore/layout/Renderings/Article List',
    description: 'Displays a list of articles with pagination',
    migrationComplexity: 'high',
    dependencies: ['st_001']
  },
  {
    id: 'sr_002',
    name: 'Navigation Rendering',
    type: 'sitecore',
    category: 'Renderings',
    size: '15 KB',
    lastModified: '2024-01-14',
    status: 'analyzed',
    path: '/sitecore/layout/Renderings/Navigation',
    description: 'Main site navigation with multi-level support',
    migrationComplexity: 'critical'
  },
  
  // Code Components
  {
    id: 'cc_001',
    name: 'ArticleController.cs',
    type: 'code',
    category: 'Controllers',
    size: '45 KB',
    lastModified: '2024-01-20',
    status: 'analyzed',
    path: '/Controllers/ArticleController.cs',
    description: 'MVC controller handling article display and search functionality',
    migrationComplexity: 'high',
    dependencies: ['cc_002', 'cc_005']
  },
  {
    id: 'cc_002',
    name: 'ArticleRepository.cs',
    type: 'code',
    category: 'Repositories',
    size: '32 KB',
    lastModified: '2024-01-19',
    status: 'discovered',
    path: '/Repositories/ArticleRepository.cs',
    description: 'Data access layer for article operations',
    migrationComplexity: 'medium'
  },
  {
    id: 'cc_003',
    name: 'BaseLayout.cshtml',
    type: 'code',
    category: 'Views',
    size: '28 KB',
    lastModified: '2024-01-16',
    status: 'analyzed',
    path: '/Views/Layouts/BaseLayout.cshtml',
    description: 'Main layout template with header, footer, and navigation',
    migrationComplexity: 'medium',
    dependencies: ['cc_004']
  },
  {
    id: 'cc_004',
    name: 'Navigation.cshtml',
    type: 'code',
    category: 'Views',
    size: '16 KB',
    lastModified: '2024-01-17',
    status: 'migrated',
    path: '/Views/Shared/Navigation.cshtml',
    description: 'Navigation partial view with responsive design',
    migrationComplexity: 'low'
  },
  {
    id: 'cc_005',
    name: 'SearchService.cs',
    type: 'code',
    category: 'Services',
    size: '52 KB',
    lastModified: '2024-01-21',
    status: 'discovered',
    path: '/Services/SearchService.cs',
    description: 'Sitecore search integration with custom indexing',
    migrationComplexity: 'critical',
    dependencies: ['cf_001']
  },
  
  // Configuration Files
  {
    id: 'cf_001',
    name: 'Sitecore.config',
    type: 'configuration',
    category: 'Configuration',
    size: '128 KB',
    lastModified: '2024-01-08',
    status: 'analyzed',
    path: '/App_Config/Sitecore.config',
    description: 'Main Sitecore configuration file with custom settings',
    migrationComplexity: 'critical'
  },
  {
    id: 'cf_002',
    name: 'ConnectionStrings.config',
    type: 'configuration',
    category: 'Configuration', 
    size: '4 KB',
    lastModified: '2024-01-05',
    status: 'migrated',
    path: '/App_Config/ConnectionStrings.config',
    description: 'Database connection strings configuration',
    migrationComplexity: 'low'
  },
  {
    id: 'cf_003',
    name: 'Custom.config',
    type: 'configuration',
    category: 'Configuration',
    size: '24 KB', 
    lastModified: '2024-01-22',
    status: 'discovered',
    path: '/App_Config/Include/Custom.config',
    description: 'Custom configuration patches and overrides',
    migrationComplexity: 'medium'
  },
  
  // Content Items
  {
    id: 'ci_001',
    name: 'Home Page',
    type: 'content',
    category: 'Content Items',
    size: '12 KB',
    lastModified: '2024-01-25',
    status: 'validated',
    path: '/sitecore/content/Home',
    description: 'Main homepage content with hero banner and featured articles',
    migrationComplexity: 'low'
  },
  {
    id: 'ci_002',
    name: 'News Section',
    type: 'content',
    category: 'Content Items',
    size: '156 KB',
    lastModified: '2024-01-23',
    status: 'migrated',
    path: '/sitecore/content/News',
    description: 'News section containing 45 articles and subcategories',
    migrationComplexity: 'medium'
  },
  {
    id: 'ci_003',
    name: 'Global Footer',
    type: 'content',
    category: 'Content Items',
    size: '8 KB',
    lastModified: '2024-01-11',
    status: 'analyzed',
    path: '/sitecore/content/Global/Footer',
    description: 'Site-wide footer content with links and legal information',
    migrationComplexity: 'low'
  },
  
  // Component Definitions
  {
    id: 'cd_001',
    name: 'Hero Banner Component',
    type: 'component',
    category: 'Components',
    size: '36 KB',
    lastModified: '2024-01-24',
    status: 'analyzed',
    path: '/src/components/HeroBanner',
    description: 'React component for hero banner with responsive images',
    migrationComplexity: 'medium',
    dependencies: ['st_003']
  },
  {
    id: 'cd_002',
    name: 'Article Card Component',
    type: 'component',
    category: 'Components',
    size: '22 KB',
    lastModified: '2024-01-26',
    status: 'discovered',
    path: '/src/components/ArticleCard',
    description: 'Reusable article card with image, title, and summary',
    migrationComplexity: 'low'
  },

  // Hybrid Artifacts (Sitecore + Code)
  {
    id: 'hb_001',
    name: 'Navigation System',
    type: 'hybrid',
    category: 'Hybrid Components',
    size: '84 KB',
    lastModified: '2024-01-27',
    status: 'analyzed',
    path: '/templates/navigation + /Controllers/NavigationController.cs',
    description: 'Complete navigation system with Sitecore template and MVC implementation',
    migrationComplexity: 'high',
    dependencies: ['st_002', 'cc_001'],
    hybridData: {
      sitecoreComponent: {
        templateId: 'nav_template_001',
        templateName: 'Navigation Template',
        fields: ['Menu Items', 'Display Style', 'Navigation Type'],
        renderingPath: '/sitecore/layout/Renderings/Navigation'
      },
      codeComponent: {
        controllerPath: '/Controllers/NavigationController.cs',
        viewPath: '/Views/Navigation/Index.cshtml',
        modelPath: '/Models/NavigationModel.cs',
        dependencies: ['System.Web.Mvc', 'Sitecore.Mvc']
      }
    }
  },
  {
    id: 'hb_002',
    name: 'Product Catalog System',
    type: 'hybrid',
    category: 'Hybrid Components',
    size: '156 KB',
    lastModified: '2024-01-28',
    status: 'discovered',
    path: '/templates/product + /Controllers/ProductController.cs',
    description: 'E-commerce product catalog with Sitecore content structure and business logic',
    migrationComplexity: 'critical',
    dependencies: ['st_004', 'cc_002', 'cc_005'],
    hybridData: {
      sitecoreComponent: {
        templateId: 'product_template_001',
        templateName: 'Product Template',
        fields: ['Name', 'Description', 'Price', 'SKU', 'Category', 'Images', 'Specifications'],
        renderingPath: '/sitecore/layout/Renderings/Product'
      },
      codeComponent: {
        controllerPath: '/Controllers/ProductController.cs',
        viewPath: '/Views/Product/Details.cshtml',
        modelPath: '/Models/ProductModel.cs',
        servicePath: '/Services/ProductService.cs',
        dependencies: ['System.Web.Mvc', 'Sitecore.Mvc', 'Newtonsoft.Json']
      }
    }
  },
  {
    id: 'hb_003',
    name: 'Article Management System',
    type: 'hybrid',
    category: 'Hybrid Components',
    size: '98 KB',
    lastModified: '2024-01-29',
    status: 'migrated',
    path: '/templates/article + /Controllers/ArticleController.cs',
    description: 'Content management system for articles with full CRUD operations',
    migrationComplexity: 'medium',
    dependencies: ['st_001', 'cc_001', 'cc_002'],
    hybridData: {
      sitecoreComponent: {
        templateId: 'article_template_001',
        templateName: 'Article Template',
        fields: ['Title', 'Content', 'Author', 'Publication Date', 'Tags', 'Featured Image'],
        renderingPath: '/sitecore/layout/Renderings/Article'
      },
      codeComponent: {
        controllerPath: '/Controllers/ArticleController.cs',
        viewPath: '/Views/Article/Index.cshtml',
        modelPath: '/Models/ArticleModel.cs',
        repositoryPath: '/Repositories/ArticleRepository.cs',
        dependencies: ['System.Web.Mvc', 'Sitecore.Mvc', 'System.Linq']
      }
    }
  }
];

// Helper functions
export const getArtifactsByType = (type: Artifact['type']) => {
  return PROJECT_ARTIFACTS.filter(artifact => artifact.type === type);
};

export const getArtifactsByStatus = (status: Artifact['status']) => {
  return PROJECT_ARTIFACTS.filter(artifact => artifact.status === status);
};

export const getArtifactsByComplexity = (complexity: Artifact['migrationComplexity']) => {
  return PROJECT_ARTIFACTS.filter(artifact => artifact.migrationComplexity === complexity);
};

export const getArtifactsStats = () => {
  const total = PROJECT_ARTIFACTS.length;
  const byStatus = PROJECT_ARTIFACTS.reduce((acc, artifact) => {
    acc[artifact.status] = (acc[artifact.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byType = PROJECT_ARTIFACTS.reduce((acc, artifact) => {
    acc[artifact.type] = (acc[artifact.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  const byComplexity = PROJECT_ARTIFACTS.reduce((acc, artifact) => {
    if (artifact.migrationComplexity) {
      acc[artifact.migrationComplexity] = (acc[artifact.migrationComplexity] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);
  
  return {
    total,
    byStatus,
    byType,
    byComplexity
  };
};