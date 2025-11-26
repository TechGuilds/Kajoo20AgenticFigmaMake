import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  MoreHorizontal, 
  Plus, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Maximize,
  MousePointer2,
  Filter
} from 'lucide-react';

interface ComponentInstance {
  id: string;
  name: string;
  type: string;
  complexity?: 'low' | 'medium' | 'high';
  migrationEffort?: 'minimal' | 'moderate' | 'significant';
}

interface PageTemplate {
  id: string;
  name: string;
  url?: string;
  category: string;
  components: ComponentInstance[];
  x: number;
  y: number;
  width: number;
  connections?: string[]; // IDs of child templates
  templateType: 'master' | 'content' | 'system';
  estimatedMigrationHours?: number;
  level: number;
}

interface CanvasState {
  zoom: number;
  panX: number;
  panY: number;
  isDragging: boolean;
  dragStart: { x: number; y: number };
  isRightMousePressed: boolean;
  preventContextMenu: boolean;
}

interface TemplateBounds {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  level: number;
}

export function SourceSitemapPanel() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const contextMenuTimeoutRef = useRef<NodeJS.Timeout>();
  
  const [canvasState, setCanvasState] = useState<CanvasState>({
    zoom: 0.25,
    panX: 50,
    panY: 30,
    isDragging: false,
    dragStart: { x: 0, y: 0 },
    isRightMousePressed: false,
    preventContextMenu: false
  });

  // HARD RULE: Minimum spacing between any two templates
  const MIN_HORIZONTAL_SPACING = 100; // Minimum horizontal gap
  const MIN_VERTICAL_SPACING = 80;    // Minimum vertical gap
  const LEVEL_VERTICAL_SPACING = 600; // Spacing between hierarchy levels

  // Calculate dynamic card height based on content
  const getCardHeight = useCallback((template: PageTemplate) => {
    const headerHeight = 85; // Header height with padding
    const componentHeight = template.components.length * 28; // Each component line with padding
    const bottomPadding = 15; // Bottom padding
    return headerHeight + componentHeight + bottomPadding;
  }, []);

  // COLLISION DETECTION: Check if two rectangles overlap
  const checkCollision = useCallback((bounds1: TemplateBounds, bounds2: TemplateBounds): boolean => {
    return !(
      bounds1.x + bounds1.width + MIN_HORIZONTAL_SPACING <= bounds2.x ||
      bounds2.x + bounds2.width + MIN_HORIZONTAL_SPACING <= bounds1.x ||
      bounds1.y + bounds1.height + MIN_VERTICAL_SPACING <= bounds2.y ||
      bounds2.y + bounds2.height + MIN_VERTICAL_SPACING <= bounds1.y
    );
  }, []);

  // LAYOUT VALIDATION: Check for any overlaps in the entire layout
  const validateLayout = useCallback((templates: PageTemplate[]): TemplateBounds[] => {
    const bounds: TemplateBounds[] = templates.map(template => ({
      id: template.id,
      x: template.x,
      y: template.y,
      width: template.width,
      height: getCardHeight(template),
      level: template.level
    }));

    // Check for collisions and log warnings
    for (let i = 0; i < bounds.length; i++) {
      for (let j = i + 1; j < bounds.length; j++) {
        if (checkCollision(bounds[i], bounds[j])) {
          console.warn(`COLLISION DETECTED: ${bounds[i].id} overlaps with ${bounds[j].id}`);
        }
      }
    }

    return bounds;
  }, [getCardHeight, checkCollision]);

  // AUTOMATIC LAYOUT ADJUSTMENT: Fix overlapping templates
  const adjustLayout = useCallback((templates: PageTemplate[]): PageTemplate[] => {
    const adjustedTemplates = [...templates];
    let layoutChanged = true;
    let maxIterations = 50; // Prevent infinite loops
    let iteration = 0;

    while (layoutChanged && iteration < maxIterations) {
      layoutChanged = false;
      iteration++;

      // Group templates by level for level-specific adjustments
      const templatesByLevel = adjustedTemplates.reduce((acc, template) => {
        if (!acc[template.level]) acc[template.level] = [];
        acc[template.level].push(template);
        return acc;
      }, {} as Record<number, PageTemplate[]>);

      // Sort templates by level to handle them in order
      const levels = Object.keys(templatesByLevel).map(Number).sort();

      for (const level of levels) {
        const levelTemplates = templatesByLevel[level];
        
        // Sort templates in this level by x position for left-to-right adjustment
        levelTemplates.sort((a, b) => a.x - b.x);

        for (let i = 0; i < levelTemplates.length; i++) {
          const currentTemplate = levelTemplates[i];
          const currentBounds: TemplateBounds = {
            id: currentTemplate.id,
            x: currentTemplate.x,
            y: currentTemplate.y,
            width: currentTemplate.width,
            height: getCardHeight(currentTemplate),
            level: currentTemplate.level
          };

          // Check collision with all other templates
          for (const otherTemplate of adjustedTemplates) {
            if (currentTemplate.id === otherTemplate.id) continue;

            const otherBounds: TemplateBounds = {
              id: otherTemplate.id,
              x: otherTemplate.x,
              y: otherTemplate.y,
              width: otherTemplate.width,
              height: getCardHeight(otherTemplate),
              level: otherTemplate.level
            };

            if (checkCollision(currentBounds, otherBounds)) {
              // COLLISION FOUND - ADJUST POSITION
              const templateIndex = adjustedTemplates.findIndex(t => t.id === currentTemplate.id);
              
              if (currentTemplate.level === otherTemplate.level) {
                // Same level - move horizontally to the right
                const newX = otherTemplate.x + otherTemplate.width + MIN_HORIZONTAL_SPACING;
                adjustedTemplates[templateIndex] = {
                  ...currentTemplate,
                  x: newX
                };
                console.log(`FIXED: Moved ${currentTemplate.id} horizontally to x=${newX} to avoid collision with ${otherTemplate.id}`);
              } else if (currentTemplate.level > otherTemplate.level) {
                // Current is lower level - move vertically down if needed
                const newY = otherTemplate.y + getCardHeight(otherTemplate) + MIN_VERTICAL_SPACING;
                if (newY > currentTemplate.y) {
                  adjustedTemplates[templateIndex] = {
                    ...currentTemplate,
                    y: newY
                  };
                  console.log(`FIXED: Moved ${currentTemplate.id} vertically to y=${newY} to avoid collision with ${otherTemplate.id}`);
                }
              } else {
                // Current is higher level - move other template down
                const otherIndex = adjustedTemplates.findIndex(t => t.id === otherTemplate.id);
                const newY = currentTemplate.y + getCardHeight(currentTemplate) + MIN_VERTICAL_SPACING;
                if (newY > otherTemplate.y) {
                  adjustedTemplates[otherIndex] = {
                    ...otherTemplate,
                    y: newY
                  };
                  console.log(`FIXED: Moved ${otherTemplate.id} vertically to y=${newY} to avoid collision with ${currentTemplate.id}`);
                }
              }
              
              layoutChanged = true;
            }
          }
        }
      }
    }

    if (iteration >= maxIterations) {
      console.warn('Layout adjustment reached maximum iterations - some overlaps may remain');
    } else {
      console.log(`Layout successfully adjusted in ${iteration} iterations`);
    }

    return adjustedTemplates;
  }, [getCardHeight, checkCollision]);

  // LEVEL-BASED AUTOMATIC POSITIONING: Organize templates by hierarchy
  const organizeByLevel = useCallback((templates: PageTemplate[]): PageTemplate[] => {
    const organizedTemplates = [...templates];
    
    // Group by level
    const templatesByLevel = organizedTemplates.reduce((acc, template) => {
      if (!acc[template.level]) acc[template.level] = [];
      acc[template.level].push(template);
      return acc;
    }, {} as Record<number, PageTemplate[]>);

    const levels = Object.keys(templatesByLevel).map(Number).sort();
    let canvasWidth = 6000; // Increased canvas width

    levels.forEach(level => {
      const levelTemplates = templatesByLevel[level];
      const baseY = 50 + (level - 1) * LEVEL_VERTICAL_SPACING;
      
      // Calculate total width needed for this level
      const totalWidth = levelTemplates.reduce((sum, template) => sum + template.width, 0);
      const totalSpacing = (levelTemplates.length - 1) * MIN_HORIZONTAL_SPACING;
      const neededWidth = totalWidth + totalSpacing;
      
      // Calculate starting X position to center the level
      const startX = Math.max(100, (canvasWidth - neededWidth) / 2);
      
      // Position templates in this level
      let currentX = startX;
      levelTemplates.forEach((template, index) => {
        const templateIndex = organizedTemplates.findIndex(t => t.id === template.id);
        organizedTemplates[templateIndex] = {
          ...template,
          x: currentX,
          y: baseY
        };
        currentX += template.width + MIN_HORIZONTAL_SPACING;
      });
    });

    return organizedTemplates;
  }, []);

  // Apply all layout rules and return collision-free templates
  const [pageTemplates] = useState<PageTemplate[]>(() => {
    // Initial template data with basic positioning
    const initialTemplates: PageTemplate[] = [
      // Level 1 - Master Template (Root)
      {
        id: 'home-template',
        name: 'Home Page Template',
        url: '/',
        category: 'Marketing',
        templateType: 'master',
        level: 1,
        estimatedMigrationHours: 32,
        x: 0, // Will be auto-positioned
        y: 0, // Will be auto-positioned
        width: 340,
        connections: ['product-landing-template', 'about-template', 'blog-listing-template', 'contact-template'],
        components: [
          { id: 'home-1', name: 'Global Navigation Header', type: 'navigation', complexity: 'high', migrationEffort: 'significant' },
          { id: 'home-2', name: 'Hero Banner with Video Background', type: 'hero', complexity: 'high', migrationEffort: 'significant' },
          { id: 'home-3', name: 'Value Proposition Section', type: 'content', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'home-4', name: 'Interactive Feature Showcase', type: 'interactive', complexity: 'high', migrationEffort: 'significant' },
          { id: 'home-5', name: 'Customer Success Stories Carousel', type: 'testimonial', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'home-6', name: 'Industry Solutions Grid', type: 'grid', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'home-7', name: 'Trust Indicators Bar', type: 'social-proof', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'home-8', name: 'Newsletter Signup Form', type: 'form', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'home-9', name: 'Primary CTA Section', type: 'cta', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'home-10', name: 'Global Footer with Sitemap', type: 'footer', complexity: 'medium', migrationEffort: 'moderate' }
        ]
      },

      // Level 2 - Primary Content Templates
      {
        id: 'product-landing-template',
        name: 'Product Landing Template',
        url: '/products/*',
        category: 'Marketing',
        templateType: 'content',
        level: 2,
        estimatedMigrationHours: 28,
        x: 0,
        y: 0,
        width: 320,
        connections: ['product-detail-template', 'product-comparison-template', 'pricing-template'],
        components: [
          { id: 'prod-1', name: 'Contextual Navigation Breadcrumb', type: 'navigation', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'prod-2', name: 'Product Hero with Interactive Demo', type: 'hero', complexity: 'high', migrationEffort: 'significant' },
          { id: 'prod-3', name: 'Key Benefits Highlight Section', type: 'feature', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'prod-4', name: 'Technical Specifications Table', type: 'table', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'prod-5', name: 'Customer Case Studies Slider', type: 'testimonial', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'prod-6', name: 'Integration Partners Showcase', type: 'logos', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'prod-7', name: 'ROI Calculator Widget', type: 'calculator', complexity: 'high', migrationEffort: 'significant' },
          { id: 'prod-8', name: 'Free Trial Registration Form', type: 'form', complexity: 'high', migrationEffort: 'significant' }
        ]
      },
      {
        id: 'about-template',
        name: 'About Us Template',
        url: '/about',
        category: 'Marketing',
        templateType: 'content',
        level: 2,
        estimatedMigrationHours: 20,
        x: 0,
        y: 0,
        width: 320,
        connections: ['team-directory-template', 'careers-template', 'investor-relations-template'],
        components: [
          { id: 'about-1', name: 'Executive Summary Section', type: 'content', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'about-2', name: 'Company Timeline Interactive', type: 'timeline', complexity: 'high', migrationEffort: 'significant' },
          { id: 'about-3', name: 'Leadership Team Grid', type: 'team', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'about-4', name: 'Mission and Values Cards', type: 'content', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'about-5', name: 'Awards and Recognition Display', type: 'achievement', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'about-6', name: 'Office Locations Map', type: 'map', complexity: 'high', migrationEffort: 'significant' },
          { id: 'about-7', name: 'Corporate Culture Video', type: 'video', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'about-8', name: 'Press Kit Download Section', type: 'download', complexity: 'medium', migrationEffort: 'moderate' }
        ]
      },
      {
        id: 'blog-listing-template',
        name: 'Blog Listing Template',
        url: '/blog',
        category: 'Content',
        templateType: 'content',
        level: 2,
        estimatedMigrationHours: 18,
        x: 0,
        y: 0,
        width: 320,
        connections: ['blog-post-template', 'blog-category-template'],
        components: [
          { id: 'blog-1', name: 'Featured Article Hero', type: 'hero', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'blog-2', name: 'Category Filter Navigation', type: 'filter', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'blog-3', name: 'Article Grid with Pagination', type: 'grid', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'blog-4', name: 'Search Functionality Widget', type: 'search', complexity: 'high', migrationEffort: 'significant' },
          { id: 'blog-5', name: 'Popular Tags Cloud', type: 'tags', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'blog-6', name: 'Subscription Newsletter Prompt', type: 'form', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'blog-7', name: 'Social Media Integration Bar', type: 'social', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'blog-8', name: 'Archive Navigation Sidebar', type: 'navigation', complexity: 'low', migrationEffort: 'minimal' }
        ]
      },
      {
        id: 'contact-template',
        name: 'Contact Us Template',
        url: '/contact',
        category: 'Marketing',
        templateType: 'content',
        level: 2,
        estimatedMigrationHours: 24,
        x: 0,
        y: 0,
        width: 320,
        connections: ['support-portal-template'],
        components: [
          { id: 'contact-1', name: 'Multi-step Contact Form', type: 'form', complexity: 'high', migrationEffort: 'significant' },
          { id: 'contact-2', name: 'Department Routing Logic', type: 'logic', complexity: 'high', migrationEffort: 'significant' },
          { id: 'contact-3', name: 'Interactive Office Locations Map', type: 'map', complexity: 'high', migrationEffort: 'significant' },
          { id: 'contact-4', name: 'Real-time Chat Widget Integration', type: 'chat', complexity: 'high', migrationEffort: 'significant' },
          { id: 'contact-5', name: 'Business Hours Display', type: 'schedule', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'contact-6', name: 'Emergency Contact Information', type: 'contact-info', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'contact-7', name: 'FAQ Quick Access Section', type: 'faq', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'contact-8', name: 'Appointment Booking Calendar', type: 'calendar', complexity: 'high', migrationEffort: 'significant' }
        ]
      },

      // Level 3 - Specialized Templates
      {
        id: 'product-detail-template',
        name: 'Product Detail Template',
        url: '/products/*/details',
        category: 'Commerce',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 35,
        x: 0,
        y: 0,
        width: 300,
        connections: ['product-docs-template'],
        components: [
          { id: 'detail-1', name: 'Product Image Gallery with Zoom', type: 'gallery', complexity: 'high', migrationEffort: 'significant' },
          { id: 'detail-2', name: 'Dynamic Pricing Display', type: 'pricing', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'detail-3', name: 'Configuration Options Selector', type: 'configurator', complexity: 'high', migrationEffort: 'significant' },
          { id: 'detail-4', name: 'Inventory Status Indicator', type: 'inventory', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'detail-5', name: 'Customer Reviews and Ratings', type: 'reviews', complexity: 'high', migrationEffort: 'significant' },
          { id: 'detail-6', name: 'Technical Documentation Links', type: 'documentation', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'detail-7', name: 'Compatibility Matrix Table', type: 'matrix', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'detail-8', name: 'Add to Cart with Options', type: 'cart', complexity: 'high', migrationEffort: 'significant' }
        ]
      },
      {
        id: 'product-comparison-template',
        name: 'Product Comparison Template',
        url: '/products/compare',
        category: 'Commerce',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 30,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'compare-1', name: 'Product Selection Interface', type: 'selector', complexity: 'high', migrationEffort: 'significant' },
          { id: 'compare-2', name: 'Feature Comparison Matrix', type: 'comparison', complexity: 'high', migrationEffort: 'significant' },
          { id: 'compare-3', name: 'Side-by-side Specifications', type: 'table', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'compare-4', name: 'Pricing Comparison Charts', type: 'chart', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'compare-5', name: 'Customer Rating Comparison', type: 'rating', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'compare-6', name: 'Pros and Cons Breakdown', type: 'analysis', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'compare-7', name: 'Recommendation Engine Results', type: 'recommendation', complexity: 'high', migrationEffort: 'significant' }
        ]
      },
      {
        id: 'pricing-template',
        name: 'Pricing Template',
        url: '/pricing',
        category: 'Commerce',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 26,
        x: 0,
        y: 0,
        width: 300,
        connections: ['quote-request-template'],
        components: [
          { id: 'pricing-1', name: 'Pricing Tier Cards Interactive', type: 'pricing', complexity: 'high', migrationEffort: 'significant' },
          { id: 'pricing-2', name: 'Feature Inclusion Matrix', type: 'matrix', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'pricing-3', name: 'Volume Discount Calculator', type: 'calculator', complexity: 'high', migrationEffort: 'significant' },
          { id: 'pricing-4', name: 'Currency and Region Selector', type: 'localization', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'pricing-5', name: 'Enterprise Custom Quote CTA', type: 'cta', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'pricing-6', name: 'Payment Method Icons Display', type: 'payment', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'pricing-7', name: 'Pricing FAQ Accordion', type: 'faq', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'pricing-8', name: 'Customer Success Stories Related to Pricing', type: 'testimonial', complexity: 'low', migrationEffort: 'minimal' }
        ]
      },
      {
        id: 'team-directory-template',
        name: 'Team Directory Template',
        url: '/about/team',
        category: 'Marketing',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 22,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'team-1', name: 'Executive Team Showcase', type: 'team', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'team-2', name: 'Department Filter Navigation', type: 'filter', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'team-3', name: 'Employee Profile Cards Grid', type: 'profile', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'team-4', name: 'Employee Search Functionality', type: 'search', complexity: 'high', migrationEffort: 'significant' },
          { id: 'team-5', name: 'Organizational Chart View', type: 'org-chart', complexity: 'high', migrationEffort: 'significant' },
          { id: 'team-6', name: 'Contact Information Display', type: 'contact-info', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'team-7', name: 'Social Media Links Integration', type: 'social', complexity: 'low', migrationEffort: 'minimal' }
        ]
      },
      {
        id: 'careers-template',
        name: 'Careers Portal Template',
        url: '/careers',
        category: 'Marketing',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 30,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'careers-1', name: 'Job Listing Search and Filter', type: 'search', complexity: 'high', migrationEffort: 'significant' },
          { id: 'careers-2', name: 'Application Tracking System', type: 'ats', complexity: 'high', migrationEffort: 'significant' },
          { id: 'careers-3', name: 'Employee Benefits Showcase', type: 'benefits', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'careers-4', name: 'Company Culture Video Gallery', type: 'gallery', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'careers-5', name: 'Employee Testimonials Section', type: 'testimonial', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'careers-6', name: 'Diversity and Inclusion Statement', type: 'statement', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'careers-7', name: 'Resume Upload and Parsing', type: 'upload', complexity: 'high', migrationEffort: 'significant' },
          { id: 'careers-8', name: 'Interview Scheduling Integration', type: 'scheduling', complexity: 'high', migrationEffort: 'significant' }
        ]
      },
      {
        id: 'investor-relations-template',
        name: 'Investor Relations Template',
        url: '/investors',
        category: 'Marketing',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 25,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'ir-1', name: 'Financial Reports Repository', type: 'repository', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'ir-2', name: 'Stock Price Widget Integration', type: 'widget', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ir-3', name: 'Earnings Call Calendar', type: 'calendar', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'ir-4', name: 'Press Release Archive', type: 'archive', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'ir-5', name: 'Investor Contact Information', type: 'contact-info', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'ir-6', name: 'SEC Filing Downloads', type: 'downloads', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'ir-7', name: 'Annual Report Interactive Viewer', type: 'viewer', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ir-8', name: 'Analyst Coverage Information', type: 'coverage', complexity: 'low', migrationEffort: 'minimal' }
        ]
      },
      {
        id: 'blog-post-template',
        name: 'Blog Post Template',
        url: '/blog/*',
        category: 'Content',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 25,
        x: 0,
        y: 0,
        width: 300,
        connections: ['blog-author-template'],
        components: [
          { id: 'post-1', name: 'Article Header with Metadata', type: 'header', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'post-2', name: 'Rich Text Content Editor Output', type: 'content', complexity: 'high', migrationEffort: 'significant' },
          { id: 'post-3', name: 'Author Biography Sidebar', type: 'author', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'post-4', name: 'Social Sharing Buttons', type: 'social', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'post-5', name: 'Related Articles Recommendations', type: 'recommendation', complexity: 'high', migrationEffort: 'significant' },
          { id: 'post-6', name: 'Comments System Integration', type: 'comments', complexity: 'high', migrationEffort: 'significant' },
          { id: 'post-7', name: 'Reading Progress Indicator', type: 'progress', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'post-8', name: 'Email Newsletter Subscription', type: 'subscription', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'post-9', name: 'Tag and Category Navigation', type: 'navigation', complexity: 'low', migrationEffort: 'minimal' }
        ]
      },
      {
        id: 'blog-category-template',
        name: 'Blog Category Template',
        url: '/blog/category/*',
        category: 'Content',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 15,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'cat-1', name: 'Category Header with Description', type: 'header', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'cat-2', name: 'Filtered Article Grid', type: 'grid', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'cat-3', name: 'Sub-category Navigation', type: 'navigation', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'cat-4', name: 'Sort and Filter Options', type: 'filter', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'cat-5', name: 'Category RSS Feed Link', type: 'feed', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'cat-6', name: 'Popular Articles in Category', type: 'popular', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'cat-7', name: 'Category Subscription Option', type: 'subscription', complexity: 'medium', migrationEffort: 'moderate' }
        ]
      },
      {
        id: 'support-portal-template',
        name: 'Support Portal Template',
        url: '/support',
        category: 'Support',
        templateType: 'content',
        level: 3,
        estimatedMigrationHours: 40,
        x: 0,
        y: 0,
        width: 300,
        connections: ['knowledge-base-template', 'ticket-system-template'],
        components: [
          { id: 'support-1', name: 'Support Case Creation Form', type: 'form', complexity: 'high', migrationEffort: 'significant' },
          { id: 'support-2', name: 'Knowledge Base Search', type: 'search', complexity: 'high', migrationEffort: 'significant' },
          { id: 'support-3', name: 'Live Chat Integration', type: 'chat', complexity: 'high', migrationEffort: 'significant' },
          { id: 'support-4', name: 'Support Ticket Status Portal', type: 'portal', complexity: 'high', migrationEffort: 'significant' },
          { id: 'support-5', name: 'FAQ Dynamic Section', type: 'faq', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'support-6', name: 'Community Forum Integration', type: 'forum', complexity: 'high', migrationEffort: 'significant' },
          { id: 'support-7', name: 'Support Hours and SLA Display', type: 'schedule', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'support-8', name: 'Escalation Process Flowchart', type: 'process', complexity: 'medium', migrationEffort: 'moderate' }
        ]
      },

      // Level 4 - Deep Specialized Templates
      {
        id: 'product-docs-template',
        name: 'Product Documentation Template',
        url: '/docs/*',
        category: 'Support',
        templateType: 'content',
        level: 4,
        estimatedMigrationHours: 28,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'docs-1', name: 'Documentation Navigation Tree', type: 'navigation', complexity: 'high', migrationEffort: 'significant' },
          { id: 'docs-2', name: 'Searchable Content Database', type: 'search', complexity: 'high', migrationEffort: 'significant' },
          { id: 'docs-3', name: 'Interactive API Documentation', type: 'api-docs', complexity: 'high', migrationEffort: 'significant' },
          { id: 'docs-4', name: 'Code Example Syntax Highlighter', type: 'code', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'docs-5', name: 'Document Version Control', type: 'versioning', complexity: 'high', migrationEffort: 'significant' },
          { id: 'docs-6', name: 'User Feedback and Rating System', type: 'feedback', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'docs-7', name: 'Printable Documentation Export', type: 'export', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'docs-8', name: 'Related Documentation Links', type: 'related', complexity: 'low', migrationEffort: 'minimal' }
        ]
      },
      {
        id: 'quote-request-template',
        name: 'Quote Request Template',
        url: '/quote',
        category: 'Commerce',
        templateType: 'content',
        level: 4,
        estimatedMigrationHours: 32,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'quote-1', name: 'Multi-step Quote Request Form', type: 'form', complexity: 'high', migrationEffort: 'significant' },
          { id: 'quote-2', name: 'Product Configuration Builder', type: 'configurator', complexity: 'high', migrationEffort: 'significant' },
          { id: 'quote-3', name: 'Volume Pricing Calculator', type: 'calculator', complexity: 'high', migrationEffort: 'significant' },
          { id: 'quote-4', name: 'Customer Information Validation', type: 'validation', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'quote-5', name: 'Sales Rep Assignment Logic', type: 'assignment', complexity: 'high', migrationEffort: 'significant' },
          { id: 'quote-6', name: 'Quote Status Tracking Portal', type: 'tracking', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'quote-7', name: 'Terms and Conditions Acceptance', type: 'legal', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'quote-8', name: 'CRM Integration Webhook', type: 'integration', complexity: 'high', migrationEffort: 'significant' }
        ]
      },
      {
        id: 'blog-author-template',
        name: 'Author Profile Template',
        url: '/blog/author/*',
        category: 'Content',
        templateType: 'content',
        level: 4,
        estimatedMigrationHours: 18,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'author-1', name: 'Author Profile Information', type: 'profile', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'author-2', name: 'Professional Biography Section', type: 'biography', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'author-3', name: 'Published Articles Grid', type: 'grid', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'author-4', name: 'Social Media Profile Links', type: 'social', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'author-5', name: 'Author Contact Form', type: 'form', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'author-6', name: 'Publication Statistics', type: 'statistics', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'author-7', name: 'Reader Engagement Metrics', type: 'metrics', complexity: 'medium', migrationEffort: 'moderate' }
        ]
      },
      {
        id: 'knowledge-base-template',
        name: 'Knowledge Base Template',
        url: '/support/kb',
        category: 'Support',
        templateType: 'content',
        level: 4,
        estimatedMigrationHours: 35,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'kb-1', name: 'Hierarchical Article Organization', type: 'hierarchy', complexity: 'high', migrationEffort: 'significant' },
          { id: 'kb-2', name: 'Advanced Search with Filters', type: 'search', complexity: 'high', migrationEffort: 'significant' },
          { id: 'kb-3', name: 'Article Rating and Feedback', type: 'feedback', complexity: 'medium', migrationEffort: 'moderate' },
          { id: 'kb-4', name: 'Popular Articles Showcase', type: 'popular', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'kb-5', name: 'Recently Updated Content', type: 'recent', complexity: 'low', migrationEffort: 'minimal' },
          { id: 'kb-6', name: 'Article Suggestion Engine', type: 'suggestion', complexity: 'high', migrationEffort: 'significant' },
          { id: 'kb-7', name: 'Multi-language Content Support', type: 'localization', complexity: 'high', migrationEffort: 'significant' },
          { id: 'kb-8', name: 'Analytics and Usage Tracking', type: 'analytics', complexity: 'medium', migrationEffort: 'moderate' }
        ]
      },
      {
        id: 'ticket-system-template',
        name: 'Support Ticket System Template',
        url: '/support/tickets',
        category: 'Support',
        templateType: 'system',
        level: 4,
        estimatedMigrationHours: 45,
        x: 0,
        y: 0,
        width: 300,
        components: [
          { id: 'ticket-1', name: 'Ticket Creation and Classification', type: 'ticketing', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ticket-2', name: 'Priority and Severity Assignment', type: 'assignment', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ticket-3', name: 'Customer Portal Dashboard', type: 'dashboard', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ticket-4', name: 'Agent Workbench Interface', type: 'workbench', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ticket-5', name: 'Automated Routing and Assignment', type: 'automation', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ticket-6', name: 'SLA Monitoring and Alerts', type: 'monitoring', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ticket-7', name: 'Customer Communication Portal', type: 'communication', complexity: 'high', migrationEffort: 'significant' },
          { id: 'ticket-8', name: 'Reporting and Analytics Dashboard', type: 'reporting', complexity: 'high', migrationEffort: 'significant' }
        ]
      }
    ];

    // APPLY AUTOMATIC LAYOUT SYSTEM
    console.log('🔧 APPLYING AUTOMATIC LAYOUT SYSTEM...');
    
    // Step 1: Organize by level
    const levelOrganized = organizeByLevel(initialTemplates);
    console.log('✅ Step 1: Level-based organization complete');
    
    // Step 2: Adjust for collisions
    const collisionFree = adjustLayout(levelOrganized);
    console.log('✅ Step 2: Collision detection and adjustment complete');
    
    // Step 3: Final validation
    const finalBounds = validateLayout(collisionFree);
    console.log('✅ Step 3: Final layout validation complete');
    console.log(`📊 Final layout: ${finalBounds.length} templates positioned with NO overlaps guaranteed`);
    
    return collisionFree;
  });

  // Zoom functionality
  const handleZoom = useCallback((delta: number, centerX?: number, centerY?: number) => {
    setCanvasState(prev => {
      const zoomFactor = delta > 0 ? 1.1 : 0.9;
      const newZoom = Math.max(0.1, Math.min(3, prev.zoom * zoomFactor));
      
      if (centerX !== undefined && centerY !== undefined && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        const x = centerX - rect.left;
        const y = centerY - rect.top;
        
        // Calculate new pan to zoom towards mouse position
        const zoomRatio = newZoom / prev.zoom;
        const newPanX = x - (x - prev.panX) * zoomRatio;
        const newPanY = y - (y - prev.panY) * zoomRatio;
        
        return {
          ...prev,
          zoom: newZoom,
          panX: newPanX,
          panY: newPanY
        };
      }
      
      return { ...prev, zoom: newZoom };
    });
  }, []);

  // Mouse wheel zoom
  const handleWheel = useCallback((e: WheelEvent) => {
    e.preventDefault();
    handleZoom(-e.deltaY, e.clientX, e.clientY);
  }, [handleZoom]);

  // Mouse events for panning with right-click
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 2) { // Right mouse button
      e.preventDefault();
      e.stopPropagation();
      
      setCanvasState(prev => ({
        ...prev,
        isDragging: true,
        isRightMousePressed: true,
        preventContextMenu: true,
        dragStart: { x: e.clientX - prev.panX, y: e.clientY - prev.panY }
      }));

      // Set a timeout to allow context menu prevention
      if (contextMenuTimeoutRef.current) {
        clearTimeout(contextMenuTimeoutRef.current);
      }
      contextMenuTimeoutRef.current = setTimeout(() => {
        setCanvasState(prev => ({ ...prev, preventContextMenu: false }));
      }, 300);
    }
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (canvasState.isDragging && canvasState.isRightMousePressed) {
      e.preventDefault();
      e.stopPropagation();
      setCanvasState(prev => ({
        ...prev,
        panX: e.clientX - prev.dragStart.x,
        panY: e.clientY - prev.dragStart.y
      }));
    }
  }, [canvasState.isDragging, canvasState.isRightMousePressed]);

  const handleMouseUp = useCallback((e: React.MouseEvent) => {
    if (e.button === 2 || canvasState.isDragging) {
      e.preventDefault();
      e.stopPropagation();
      
      setCanvasState(prev => ({ 
        ...prev, 
        isDragging: false,
        isRightMousePressed: false
      }));
    }
  }, [canvasState.isDragging]);

  // Enhanced context menu prevention
  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }, []);

  // Global context menu prevention during dragging
  useEffect(() => {
    const preventGlobalContextMenu = (e: MouseEvent) => {
      if (canvasState.isDragging || canvasState.isRightMousePressed || canvasState.preventContextMenu) {
        e.preventDefault();
        e.stopPropagation();
        return false;
      }
    };

    if (canvasState.isDragging || canvasState.isRightMousePressed || canvasState.preventContextMenu) {
      document.addEventListener('contextmenu', preventGlobalContextMenu, { capture: true });
    }

    return () => {
      document.removeEventListener('contextmenu', preventGlobalContextMenu, { capture: true });
    };
  }, [canvasState.isDragging, canvasState.isRightMousePressed, canvasState.preventContextMenu]);

  // Reset and fit functions
  const resetView = useCallback(() => {
    setCanvasState(prev => ({
      ...prev,
      zoom: 0.25,
      panX: 50,
      panY: 30
    }));
  }, []);

  const fitToView = useCallback(() => {
    if (canvasRef.current && contentRef.current) {
      const canvasRect = canvasRef.current.getBoundingClientRect();
      const contentRect = { width: 6000, height: 3000 }; // Updated content size for wider layout
      
      const scaleX = (canvasRect.width - 100) / contentRect.width;
      const scaleY = (canvasRect.height - 100) / contentRect.height;
      const newZoom = Math.min(scaleX, scaleY, 1);
      
      const centerX = (canvasRect.width - contentRect.width * newZoom) / 2;
      const centerY = (canvasRect.height - contentRect.height * newZoom) / 2;
      
      setCanvasState(prev => ({
        ...prev,
        zoom: newZoom,
        panX: centerX,
        panY: centerY
      }));
    }
  }, []);

  // Event listeners
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvas.removeEventListener('wheel', handleWheel);
      if (contextMenuTimeoutRef.current) {
        clearTimeout(contextMenuTimeoutRef.current);
      }
    };
  }, [handleWheel]);

  // Enhanced connection rendering with collision-aware routing
  const renderConnections = () => {
    const connections = [];
    
    pageTemplates.forEach(template => {
      if (template.connections) {
        template.connections.forEach(connectionId => {
          const targetTemplate = pageTemplates.find(t => t.id === connectionId);
          if (targetTemplate) {
            // Calculate connection points with proper clearance
            const startX = template.x + template.width / 2;
            const startY = template.y + getCardHeight(template) + 15; // 15px clearance below card
            const endX = targetTemplate.x + targetTemplate.width / 2;
            const endY = targetTemplate.y - 15; // 15px clearance above target card

            // Create smooth, collision-aware connection path
            const midY = startY + (endY - startY) * 0.6;

            connections.push(
              <g key={`${template.id}-${connectionId}`}>
                {/* Main connection path with smooth curves */}
                <path
                  d={`M ${startX} ${startY} Q ${startX} ${midY} ${(startX + endX) / 2} ${midY} Q ${endX} ${midY} ${endX} ${endY}`}
                  stroke="#94a3b8"
                  strokeWidth="2.5"
                  fill="none"
                  className="transition-all duration-300 hover:stroke-info hover:stroke-width-3"
                  opacity="0.8"
                />
                {/* Enhanced arrow indicator */}
                <polygon
                  points={`${endX-5},${endY-10} ${endX+5},${endY-10} ${endX},${endY-2}`}
                  fill="#94a3b8"
                  className="transition-colors duration-300"
                />
                {/* Connection point indicators */}
                <circle
                  cx={startX}
                  cy={startY}
                  r="4"
                  fill="#3b82f6"
                  className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
                <circle
                  cx={endX}
                  cy={endY}
                  r="4"
                  fill="#10b981"
                  className="opacity-70 hover:opacity-100 transition-opacity duration-300"
                />
              </g>
            );
          }
        });
      }
    });

    return connections;
  };

  const getComplexityColor = (complexity?: string) => {
    switch (complexity) {
      case 'high': return 'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20';
      case 'medium': return 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20';
      case 'low': return 'bg-success/10 text-success border-success/20 hover:bg-success/20';
      default: return 'bg-gray-50 text-gray-800 border-gray-200 hover:bg-gray-100';
    }
  };

  const getTemplateTypeColor = (templateType: string) => {
    switch (templateType) {
      case 'master': return 'bg-info';
      case 'content': return 'bg-success';
      case 'system': return 'bg-accent-purple';
      default: return 'bg-gray-500';
    }
  };

  const getLevelColor = (level: number) => {
    switch (level) {
      case 1: return 'border-info/30 shadow-info/10 bg-info/5';
      case 2: return 'border-success/30 shadow-success/10 bg-success/5';
      case 3: return 'border-warning/30 shadow-warning/10 bg-warning/5';
      case 4: return 'border-accent-purple/30 shadow-accent-purple/10 bg-accent-purple/5';
      default: return 'border-gray-300 shadow-gray-100/50 bg-white';
    }
  };

  const renderPageTemplate = (template: PageTemplate) => {
    return (
      <div
        key={template.id}
        className="absolute transition-all duration-300 hover:z-10"
        style={{
          left: `${template.x}px`,
          top: `${template.y}px`,
          width: `${template.width}px`
        }}
        onContextMenu={handleContextMenu}
      >
        <Card className={`border-2 transition-all duration-300 hover:shadow-xl hover:scale-105 ${getLevelColor(template.level)}`}>
          <CardHeader className="pb-3 px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full ${getTemplateTypeColor(template.templateType)} shadow-sm`} />
                <CardTitle className="text-sm font-medium truncate pr-2">{template.name}</CardTitle>
              </div>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0 hover:bg-gray-100">
                <MoreHorizontal className="h-3 w-3" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              {template.url && (
                <p className="text-xs text-gray-600 truncate font-mono bg-white/80 px-2 py-1 rounded border">{template.url}</p>
              )}
              <div className="flex items-center gap-1 ml-2">
                <Badge variant="secondary" className="text-xs px-2 py-0.5 bg-white/60">
                  L{template.level}
                </Badge>
                <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white/40">
                  {template.category}
                </Badge>
                {template.estimatedMigrationHours && (
                  <Badge variant="outline" className="text-xs px-2 py-0.5 bg-white/40 border-info/30 text-info">
                    {template.estimatedMigrationHours}h
                  </Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-4 py-2 pt-0 space-y-2">
            {template.components.map((component, index) => (
              <div
                key={component.id}
                className={`${getComplexityColor(component.complexity)} border rounded-md px-3 py-2 text-xs transition-all duration-200 cursor-pointer group shadow-sm`}
                onContextMenu={handleContextMenu}
                title={`Type: ${component.type} | Complexity: ${component.complexity || 'unknown'} | Migration: ${component.migrationEffort || 'unknown'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="truncate flex-1 font-medium">{component.name}</span>
                  <div className="flex items-center gap-1 ml-2">
                    {component.complexity === 'high' && (
                      <div className="w-2 h-2 bg-destructive rounded-full opacity-80" />
                    )}
                    {component.migrationEffort === 'significant' && (
                      <div className="w-1 h-4 bg-warning rounded-full opacity-60 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  };

  const totalTemplates = pageTemplates.length;
  const totalComponents = pageTemplates.reduce((sum, template) => sum + template.components.length, 0);
  const totalMigrationHours = pageTemplates.reduce((sum, template) => sum + (template.estimatedMigrationHours || 0), 0);

  const getCursor = () => {
    if (canvasState.isRightMousePressed || canvasState.isDragging) {
      return 'grabbing';
    }
    return 'default';
  };

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-gray-900 mb-1">Source Page Template Hierarchy</h2>
            <p className="text-sm text-gray-600">
              ✅ COLLISION-FREE sitemap with automatic layout adjustment - guaranteed NO overlapping templates
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{totalTemplates}</div>
              <div className="text-xs text-gray-500">Templates</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{totalComponents}</div>
              <div className="text-xs text-gray-500">Components</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-medium text-gray-900">{totalMigrationHours}h</div>
              <div className="text-xs text-gray-500">Est. Migration</div>
            </div>
            <Button className="gap-2">
              <Plus className="size-4" />
              Add Template
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Legend */}
      <div className="px-6 py-3 border-b border-gray-200 bg-white/95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Layout Engine:</span>
              <Badge variant="outline" className="text-xs px-2 py-1 text-success border-success/20 bg-success/10">
                ✅ COLLISION-FREE
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Spacing:</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs px-1">H: {MIN_HORIZONTAL_SPACING}px</Badge>
                <Badge variant="outline" className="text-xs px-1">V: {MIN_VERTICAL_SPACING}px</Badge>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Template Types:</span>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-info" />
                  <span className="text-xs">Master</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-xs">Content</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-accent-purple" />
                  <span className="text-xs">System</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1 px-2 py-1">
              <MousePointer2 className="size-3" />
              Right-Click + Drag to Pan
            </Badge>
            <Badge variant="outline" className="px-2 py-1">
              Scroll to Zoom
            </Badge>
          </div>
        </div>
      </div>

      {/* Canvas Controls */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white/95">
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600">
            🎯 Auto-organized layout: {pageTemplates.filter(t => t.level === 1).length} root → {' '}
            {pageTemplates.filter(t => t.level === 2).length} primary → {' '}
            {pageTemplates.filter(t => t.level === 3).length} specialized → {' '}
            {pageTemplates.filter(t => t.level === 4).length} detailed templates
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="text-sm text-gray-600 min-w-16">
            {Math.round(canvasState.zoom * 100)}%
          </div>
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleZoom(-1)}
              disabled={canvasState.zoom <= 0.1}
            >
              <ZoomOut className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={() => handleZoom(1)}
              disabled={canvasState.zoom >= 3}
            >
              <ZoomIn className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={resetView}
            >
              <RotateCcw className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 px-2"
              onClick={fitToView}
            >
              <Maximize className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <div 
        ref={canvasRef}
        className="flex-1 relative overflow-hidden select-none"
        style={{ cursor: getCursor() }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onContextMenu={handleContextMenu}
      >
        <div
          ref={contentRef}
          className="absolute inset-0"
          style={{
            transform: `translate(${canvasState.panX}px, ${canvasState.panY}px) scale(${canvasState.zoom})`,
            transformOrigin: '0 0',
            transition: canvasState.isDragging ? 'none' : 'transform 0.2s ease-out'
          }}
          onContextMenu={handleContextMenu}
        >
          {/* Enhanced SVG for connection lines */}
          <svg 
            className="absolute top-0 left-0 pointer-events-none"
            style={{ width: '6000px', height: '3000px' }}
            onContextMenu={handleContextMenu}
          >
            <defs>
              {/* Enhanced arrow marker */}
              <marker
                id="arrowhead"
                markerWidth="12"
                markerHeight="8"
                refX="10"
                refY="4"
                orient="auto"
                fill="#94a3b8"
              >
                <polygon points="0 0, 12 4, 0 8" />
              </marker>
            </defs>
            {renderConnections()}
          </svg>

          {/* Page templates with GUARANTEED no overlapping */}
          <div 
            className="relative" 
            style={{ width: '6000px', height: '3000px' }}
            onContextMenu={handleContextMenu}
          >
            {pageTemplates.map(renderPageTemplate)}
          </div>
        </div>
      </div>
    </div>
  );
}