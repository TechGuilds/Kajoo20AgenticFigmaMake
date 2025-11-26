# 📚 Kajoo 2.0 - Module Import Quick Reference

**Last Updated:** November 26, 2025

---

## 🎯 Quick Start

All components are now organized in modules. Use absolute imports:

```typescript
import { ComponentName } from '@/components/modules/[module-name]';
```

---

## 📦 Module Directory

### **Agent Module**
```typescript
import { AgentOrchestration } from '@/components/modules/agent';
```

### **AI Module**
```typescript
import { AIInbox } from '@/components/modules/ai';
```

### **Artifact Module**
```typescript
import { 
  ArtifactCards,
  ArtifactPreviewModal,
  SitecoreArtifactView,
  CodeArtifactView 
} from '@/components/modules/artifact';
```

### **Chat Module**
```typescript
import { 
  ChatLayout,
  AIChatPanel,
  ChatHeader,
  MentionInput,
  MarkdownField,
  AIInbox,
  TaskContextChatPanel 
} from '@/components/modules/chat';
```

### **Composite Module** 🆕
```typescript
import { InstructionsScreen } from '@/components/modules/composite';
```

### **Credit Module**
```typescript
import { 
  AICreditTracker,
  CreditDebugPanel,
  CreditGate,
  CreditGatedChatInput,
  CreditManagementDemo,
  CreditProvider,
  CreditTestingPanel,
  CreditUsageDialog,
  LowCreditWarning,
  PurchaseCreditsDialog 
} from '@/components/modules/credit';
```

### **Integration Module** 🆕
```typescript
import { 
  IntegrationManager,
  ManageConnectionsDrawer 
} from '@/components/modules/integration';
```

### **Layout Module**
```typescript
import { 
  AppLayout,
  ViewLayout,
  FlyoutPanel 
} from '@/components/modules/layout';
```

### **Migration Module** 🆕
```typescript
import { MigrationPreviewCanvas } from '@/components/modules/migration';
```

### **Navigation Module**
```typescript
import { 
  Breadcrumbs,
  MainNavigation,
  VerticalNavBar 
} from '@/components/modules/navigation';
```

### **Project Module**
```typescript
import { 
  Project,
  ProjectAnalysisHub,
  ProjectList,
  ProjectPreview,
  ProjectsList,
  ProjectSettings,
  ProjectSettingsPanel,
  ProjectSetup,
  ProjectUnifiedRedesigned 
} from '@/components/modules/project';
```

### **Settings Module**
```typescript
import { 
  GeneralSettings,
  Settings,
  WorkspaceSettingsPanel 
} from '@/components/modules/settings';
```

### **Shared Module**
```typescript
import { 
  ThemeProvider,
  useTheme,
  DesignSystemPanel,
  SourceSitemapPanel 
} from '@/components/modules/shared';
```

### **Task Module**
```typescript
import { 
  TaskDetailFlyout,
  TaskRouter 
} from '@/components/modules/task';
```

### **Views Module**
```typescript
import { 
  ArtifactsView,
  DashboardView,
  NoWorkspaceView,
  ProjectOverviewView,
  ProjectsView,
  TaskDetailView,
  TaskListView,
  WorkspaceView 
} from '@/components/views';
```

### **Workspace Module**
```typescript
import { 
  WorkspaceConfigurationModal,
  WorkspaceDropdown,
  WorkspaceList,
  WorkspaceSettings,
  Dashboard,
  ProjectOverview 
} from '@/components/modules/workspace';
```

---

## 🎨 UI Components (shadcn/ui)

```typescript
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
// ... etc
```

---

## 🚫 DEPRECATED Import Patterns

### ❌ **DON'T** - Relative imports from root
```typescript
import { Component } from '../Component';           // ❌ DON'T
import { Component } from '../../Component';        // ❌ DON'T
import { Component } from './components/Component'; // ❌ DON'T
```

### ✅ **DO** - Absolute imports from modules
```typescript
import { Component } from '@/components/modules/[module]'; // ✅ DO
```

---

## 📝 Import Best Practices

### 1. **Use Module Barrel Exports**
```typescript
// ✅ Good - Import from module index
import { ArtifactCards, ArtifactPreviewModal } from '@/components/modules/artifact';

// ❌ Avoid - Direct file imports (unless necessary)
import { ArtifactCards } from '@/components/modules/artifact/ArtifactCards';
```

### 2. **Group Related Imports**
```typescript
// ✅ Good - Organized by source
import React, { useState, useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

import { ChatLayout } from '@/components/modules/chat';
import { ArtifactCards } from '@/components/modules/artifact';
```

### 3. **Use Type Imports When Needed**
```typescript
import type { Task, Project } from '~/types';
```

---

## 🔍 Finding Components

### **By Feature:**
- **Chat/Messaging** → `modules/chat`
- **Task Management** → `modules/task`
- **Project Management** → `modules/project`
- **Artifacts** → `modules/artifact`
- **Navigation** → `modules/navigation`
- **Integrations** → `modules/integration`
- **Settings** → `modules/settings`
- **Credits** → `modules/credit`

### **By Type:**
- **Views/Screens** → `views/`
- **Layout Components** → `modules/layout`
- **Shared Utilities** → `modules/shared`
- **UI Primitives** → `ui/`

---

## 🆕 Adding New Components

### **1. Choose the Right Module**
```
Feature-specific → Add to existing feature module
Reusable across features → Add to shared module
Page-level component → Add to views
Layout component → Add to layout module
```

### **2. Create Component File**
```typescript
// /components/modules/[module]/YourComponent.tsx
import React from 'react';
// ... imports using absolute paths

export function YourComponent() {
  // Component implementation
}
```

### **3. Update Module Index**
```typescript
// /components/modules/[module]/index.ts
export { YourComponent } from './YourComponent';
```

### **4. Use Design System Variables**
```typescript
// ✅ Use CSS variables
<div style={{ 
  padding: 'var(--spacing-4)',
  color: 'var(--color-primary)',
  borderRadius: 'var(--radius-2)'
}}>

// ❌ Don't use Tailwind font classes
<h1 className="text-2xl font-bold">  // ❌ NO

// ✅ Use semantic HTML
<h1>Title</h1>                       // ✅ YES
```

---

## 🐛 Troubleshooting

### **Import Error: Cannot find module**
```
❌ Error: Cannot find module '@/components/modules/xyz'
```

**Solution:**
1. Check module name spelling
2. Verify component is exported in module's index.ts
3. Check if module directory exists

### **Circular Dependency Warning**
```
❌ Warning: Circular dependency detected
```

**Solution:**
1. Extract shared logic to a separate file
2. Use dependency injection
3. Restructure component hierarchy

---

## 📖 Additional Resources

- **Full Migration Report:** `/PHASE_2_COMPLETION_REPORT.md`
- **Architecture Guidelines:** `/Guidelines.md`
- **Design System:** `/styles/globals.css`

---

**Pro Tip:** Use your IDE's auto-import feature with `@/components/modules/` prefix to quickly find components! 🚀
