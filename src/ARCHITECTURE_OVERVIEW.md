# 🏛️ Kajoo 2.0 - System Architecture Overview

**Version:** 2.0  
**Last Updated:** November 26, 2025  
**Status:** Production Ready ✅

---

## 📐 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Kajoo 2.0                           │
│              Multi-Agent AI Platform                        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│   Frontend    │    │   Backend     │    │  AI Agents    │
│  (React/TS)   │◄───┤  (Supabase)   │◄───┤ (Orchestrated)│
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## 🎯 Core Principles

### 1. **Modular Architecture**
- Component-based design
- Clear separation of concerns
- Scalable module structure

### 2. **Design System First**
- CSS variables for all styling
- Consistent spacing, colors, typography
- Theme-aware components

### 3. **Type Safety**
- TypeScript throughout
- Strict type checking
- Shared type definitions

### 4. **Developer Experience**
- Absolute imports
- Hot module reloading
- Clear documentation

---

## 📦 Module Organization

### **Feature Modules** (Domain-Specific)
```
modules/
├── agent/          → AI agent orchestration
├── artifact/       → Generated output management
├── chat/           → Messaging & communication
├── credit/         → Credit tracking & billing
├── integration/    → External service connections
├── migration/      → Migration workflows
├── project/        → Project management
├── task/           → Task tracking
└── workspace/      → Workspace management
```

### **Infrastructure Modules** (Cross-Cutting)
```
modules/
├── ai/             → AI utilities
├── composite/      → High-level orchestrators
├── layout/         → Layout components
├── navigation/     → Navigation components
├── settings/       → Configuration
├── shared/         → Shared utilities
└── views/          → Page-level views
```

### **Foundation**
```
ui/                 → shadcn/ui primitives
styles/             → Global CSS & design tokens
types/              → Shared TypeScript types
utils/              → Helper functions
hooks/              → Custom React hooks
```

---

## 🔄 Data Flow

### **Unidirectional Data Flow**
```
User Action → Component → Hook → API → Backend
                ▲                        │
                └────────────────────────┘
                     State Update
```

### **State Management Layers**

1. **Local State** (React useState)
   - Component-specific UI state
   - Form inputs
   - Toggle states

2. **Shared State** (Context API)
   - Theme preferences
   - User authentication
   - Workspace selection

3. **Server State** (Supabase Realtime)
   - Projects, tasks, artifacts
   - Chat messages
   - Real-time updates

---

## 🎨 Design System Architecture

### **CSS Variable Hierarchy**
```css
:root {
  /* Colors */
  --color-primary: #5F55EE;
  --color-background: hsl(0 0% 100%);
  
  /* Spacing (8px system) */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-4: 1rem;     /* 16px */
  
  /* Typography */
  --font-size-base: 1rem;
  --font-family-base: 'Geist', sans-serif;
  
  /* Borders */
  --border-width: 1px;
  --radius-1: 0.25rem;
}

[data-theme="dark"] {
  --color-primary: #7B73F0;
  --color-background: hsl(0 0% 3.9%);
}
```

### **Component Styling Strategy**

1. **Semantic HTML** - Let global styles apply
   ```tsx
   <h1>Title</h1>  // Inherits font-size, font-weight, line-height
   ```

2. **CSS Variables** - All custom styling
   ```tsx
   <div style={{ 
     padding: 'var(--spacing-4)',
     color: 'var(--color-primary)' 
   }}>
   ```

3. **Tailwind Utilities** - Layout & positioning only
   ```tsx
   <div className="flex items-center gap-2">
   ```

---

## 🔌 Integration Points

### **External Services**

```
Kajoo 2.0
    │
    ├─► Supabase (Database & Auth)
    │   ├─► PostgreSQL
    │   ├─► Realtime Subscriptions
    │   └─► Authentication
    │
    ├─► AI Services
    │   ├─► OpenAI GPT-4
    │   ├─► Anthropic Claude
    │   └─► Custom Agents
    │
    └─► Third-Party Integrations
        ├─► Jira
        ├─► GitHub
        └─► Sitecore
```

---

## 🛣️ Routing Structure

### **Main Routes**
```
/                           → Landing/Dashboard
/workspaces                 → Workspace List
/workspaces/:id             → Workspace Detail
/workspaces/:id/projects    → Projects List
/projects/:id               → Project Canvas
/projects/:id/tasks         → Task List
/projects/:id/tasks/:id     → Task Detail
/settings                   → Application Settings
```

### **Route Guards**
- Authentication required for all workspace routes
- Workspace membership validation
- Credit gate for AI features

---

## 🔐 Security Architecture

### **Authentication Flow**
```
1. User logs in → Supabase Auth
2. JWT token generated
3. Token stored in httpOnly cookie
4. All API requests include token
5. Backend validates token
```

### **Authorization Layers**
1. **Route Level** - Protected routes check auth
2. **Component Level** - Conditional rendering
3. **API Level** - Row-level security (RLS)
4. **Data Level** - Workspace membership checks

---

## 📊 Performance Strategy

### **Code Splitting**
```typescript
// Lazy load heavy modules
const MigrationCanvas = lazy(() => 
  import('@/components/modules/migration')
);

// Route-based splitting
const ProjectView = lazy(() => 
  import('@/components/views/ProjectsView')
);
```

### **Optimization Techniques**
- ✅ React.memo for expensive renders
- ✅ useMemo for computed values
- ✅ useCallback for event handlers
- ✅ Virtual scrolling for long lists
- ✅ Debounced search inputs
- ✅ Optimistic UI updates

---

## 🧪 Testing Strategy

### **Testing Pyramid**
```
       /\
      /  \     E2E Tests (Few)
     /____\    
    /      \   Integration Tests (Some)
   /________\  
  /          \ Unit Tests (Many)
 /____________\
```

### **Test Coverage Goals**
- **Unit Tests**: 80%+ (utilities, hooks, logic)
- **Integration Tests**: 60%+ (component interactions)
- **E2E Tests**: Critical paths only (auth, project creation)

---

## 🚀 Deployment Architecture

### **Build Process**
```
Source Code (TypeScript/React)
    ↓
ESBuild/Vite Compilation
    ↓
Bundle Optimization
    ↓
Asset Generation
    ↓
Static Site (dist/)
    ↓
Deploy to Vercel/Netlify
```

### **Environment Configuration**
```
Development:  localhost:3000
Staging:      staging.kajoo.ai
Production:   app.kajoo.ai
```

---

## 📈 Scalability Considerations

### **Horizontal Scaling**
- Stateless frontend (deployed to CDN)
- Backend scales with Supabase
- AI agents can run distributed

### **Vertical Scaling**
- Module lazy loading reduces initial bundle
- Component-level code splitting
- Incremental static regeneration

### **Data Scaling**
- Pagination for large lists
- Virtual scrolling for performance
- Optimistic updates for responsiveness
- Background sync for offline support

---

## 🔧 Development Workflow

### **Local Development**
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run type checking
npm run type-check

# Run tests
npm test

# Build for production
npm run build
```

### **Adding New Features**
1. Create feature module in `modules/[feature]/`
2. Add components with proper types
3. Export from module index
4. Use CSS variables for styling
5. Add tests
6. Update documentation

---

## 📚 Key Technologies

### **Frontend Stack**
- **React 18** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS v4** - Utility-first CSS
- **Vite** - Build tool
- **React Router** - Client-side routing

### **Backend Stack**
- **Supabase** - Backend as a service
- **PostgreSQL** - Database
- **Row Level Security** - Data protection
- **Realtime** - Live updates

### **UI Components**
- **shadcn/ui** - Component library
- **Radix UI** - Headless primitives
- **Lucide Icons** - Icon system

---

## 🎯 Future Enhancements

### **Planned Features**
- [ ] Collaborative editing
- [ ] Advanced AI agents
- [ ] Mobile app
- [ ] Offline mode
- [ ] Advanced analytics
- [ ] Custom integrations API

### **Performance Improvements**
- [ ] Service worker caching
- [ ] GraphQL for data fetching
- [ ] Redis for session storage
- [ ] CDN for static assets

---

## 📖 Documentation Map

```
/
├── ARCHITECTURE_OVERVIEW.md     ← You are here
├── Guidelines.md                → Development guidelines
├── PHASE_2_COMPLETION_REPORT.md → Migration report
├── MODULE_IMPORT_GUIDE.md       → Import reference
├── /styles/globals.css          → Design tokens
└── /types/index.ts              → Type definitions
```

---

## 🤝 Contributing

### **Code Standards**
- Follow Kajoo 2.0 guidelines
- Use TypeScript strictly
- Write clean, documented code
- Test your changes
- Use CSS variables

### **Module Guidelines**
- Single Responsibility Principle
- DRY (Don't Repeat Yourself)
- Composition over inheritance
- Absolute imports only
- Export from index.ts

---

## 📞 Support & Resources

- **Documentation:** `/docs`
- **Guidelines:** `/Guidelines.md`
- **API Reference:** `/API.md`
- **Design System:** `/DESIGN_SYSTEM.md`

---

**Kajoo 2.0** - Built for scalability, performance, and developer happiness! 🚀

*Last updated: November 26, 2025*
