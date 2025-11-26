# Agent Tool Response Component

## Overview
The Agent Tool Response component visualizes multi-agent AI workflows within the chat interface. Each specialized agent can perform actions, communicate progress, and request user approvals while maintaining visual consistency with existing chat components.

## Features

### 1. **Agent Types**
Four specialized agents with unique visual identities:

- **Migration Agent** (Blue)
  - Icon: Database
  - Role: Migration Specialist
  - Purpose: Handles Sitecore environment connections, migration tasks, and data transfer

- **QA Agent** (Green)
  - Icon: Target
  - Role: Quality Assurance
  - Purpose: Quality checks, testing, and validation tasks

- **Sitecore Agent** (Purple)
  - Icon: Code
  - Role: Platform Specialist
  - Purpose: Sitecore platform analysis, configuration, and template inspection

- **Content Agent** (Orange)
  - Icon: FileText
  - Role: Content Specialist
  - Purpose: Content inventory, analysis, field structures, and content relationships

### 2. **Status Indicators**
- **Executing**: Shows animated spinner - agent is currently working
- **Completed**: Task finished successfully
- **Awaiting Approval**: User action required - displays Approve/Reject buttons

### 3. **Approval Flow**
Agents can request user approval for critical actions:
- Approve button: Primary action (purple)
- Reject button: Secondary action (outlined)
- Loading states during approval processing
- Smooth transitions after user response

## Usage

### Basic Agent Response
```typescript
{
  id: 'agent_1',
  agentType: 'migration',
  message: 'Connecting to Sitecore environment...',
  status: 'executing'
}
```

### Agent Response with Approval
```typescript
{
  id: 'agent_2',
  agentType: 'qa',
  message: 'Would you like me to create automated test suites?',
  status: 'awaiting-approval',
  requiresApproval: true,
  onApprove: () => {
    // Handle approval logic
  },
  onReject: () => {
    // Handle rejection logic
  }
}
```

### Adding to a Message
```typescript
{
  id: '5',
  role: 'assistant',
  content: 'Coordinating with specialized agents...',
  timestamp: '10:36 AM',
  agentResponses: [
    {
      id: 'agent_1',
      agentType: 'migration',
      message: 'Fetching configuration...',
      status: 'executing'
    },
    {
      id: 'agent_2',
      agentType: 'sitecore',
      message: 'Analysis complete. Found 12 templates.',
      status: 'completed'
    }
  ]
}
```

## Design System Compliance

### Colors
- Uses CSS custom properties from `styles/globals.css`
- Light/dark mode support with proper contrast
- Agent-specific color themes using Tailwind utilities

### Layout
- Same width as AI Reasoning and Tool Calling cards (`w-full`)
- Consistent padding (p-3)
- Standard border radius and glassmorphic styling
- Matches existing card component patterns

### Animations
- Fade-in and slide-up entry animation (300ms)
- Smooth transitions for approval interactions
- Loading spinner for executing status

### Typography
- Follows global typography hierarchy
- Agent name: `text-sm font-medium`
- Message: `text-sm leading-relaxed`
- Uses default font faces from design system

## Visual Consistency
The component maintains perfect alignment with:
- AI Reasoning cards (collapsible thought process)
- Tool Calling cards (JSON visualization)
- Artifact cards (preview functionality)
- Inbox Item cards (approval workflows)

All cards share:
- Same maximum width (80% of container)
- Consistent spacing (space-y-2)
- Unified border styling
- Similar interaction patterns

## Sequential Agent Flow
Multiple agents can work in sequence:
1. Each agent appears as a separate card
2. Cards stack chronologically
3. Status updates independently per agent
4. Smooth animations for natural conversation rhythm

## Examples in ChatLayout

Check session '2' (Component Analysis) for a complete example showing:
- Migration Agent connecting to Sitecore
- Sitecore Agent analyzing templates
- QA Agent requesting approval for test suite creation

Check session '1' (Content Migration Strategy) for:
- Content Agent performing inventory
- Migration Agent fetching metrics

## Extending the Component

### Adding New Agent Types
1. Add new type to `agentConfig` object
2. Define unique colors, icon, and role
3. Add type to `AgentResponse` type union

### Customizing Approval Logic
Implement `onApprove` and `onReject` callbacks to:
- Trigger API calls
- Update application state
- Navigate to different views
- Create new tasks or artifacts

## Best Practices
1. Keep agent messages concise and action-oriented
2. Use 'executing' status for long-running operations
3. Reserve approval requests for critical decisions
4. Provide clear context in approval messages
5. Use appropriate agent type for the task
6. Stack related agent responses in a single message
