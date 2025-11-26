import React from 'react';
import { Skeleton } from '../../ui/skeleton';

// Workspace Overview Skeleton - Matches ProjectOverview.tsx layout
export function WorkspaceOverviewSkeleton() {
  return (
    <div className="h-screen bg-gradient-to-br from-primary/18 via-accent/22 through-secondary/16 to-primary/14 relative overflow-y-auto animate-fade-in" style={{ padding: 'var(--spacing-16)' }}>
      <div className="flex-shrink-0 min-h-[65vh] relative overflow-hidden flex items-center justify-center" style={{ padding: 'var(--spacing-16)' }}>
        {/* Subtle background pattern */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/3 via-transparent to-accent/4 opacity-40 pointer-events-none z-0" />
        
        <div className="max-w-4xl w-full relative z-10">
          {/* Header */}
          <div className="text-center" style={{ marginBottom: 'var(--spacing-8)' }}>
            <Skeleton className="mx-auto" style={{ height: 'var(--spacing-10)', width: '384px', marginBottom: 'var(--spacing-2)' }} />
            <Skeleton className="mx-auto" style={{ height: 'var(--spacing-5)', width: '320px' }} />
          </div>
          
          {/* Central AI Chat Input */}
          <div className="max-w-3xl mx-auto border border-border/60 bg-card/95 backdrop-blur-sm shadow-lg" style={{ borderRadius: 'var(--radius-5)', padding: 'var(--spacing-6)' }}>
            <div className="relative">
              {/* Chat Input */}
              <Skeleton className="w-full rounded-lg" style={{ height: 'var(--spacing-12)', marginBottom: 'var(--spacing-3)' }} />
              
              {/* Input Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                  <Skeleton className="rounded-full" style={{ height: 'var(--spacing-4)', width: 'var(--spacing-4)' }} />
                  <Skeleton style={{ height: 'var(--spacing-3)', width: '128px' }} />
                </div>
                <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                  <Skeleton className="rounded-full" style={{ height: 'var(--spacing-4)', width: 'var(--spacing-4)' }} />
                  <Skeleton style={{ height: 'var(--spacing-3)', width: '80px' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Grid */}
          <div className="grid grid-cols-2 max-w-3xl mx-auto" style={{ gap: 'var(--spacing-4)', marginTop: 'var(--spacing-8)' }}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="border border-border rounded-lg bg-card/80 backdrop-blur-sm hover:border-primary/30 transition-colors" style={{ padding: 'var(--spacing-4)' }}>
                <div className="flex items-start" style={{ gap: 'var(--spacing-3)' }}>
                  <Skeleton className="rounded-md flex-shrink-0" style={{ height: 'var(--spacing-10)', width: 'var(--spacing-10)' }} />
                  <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Skeleton className="w-full" style={{ height: 'var(--spacing-4)' }} />
                    <Skeleton className="w-4/5" style={{ height: 'var(--spacing-3)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="max-w-7xl mx-auto" style={{ paddingLeft: 'var(--spacing-16)', paddingRight: 'var(--spacing-16)', paddingBottom: 'var(--spacing-16)' }}>
        <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-6)' }}>
          <Skeleton style={{ height: 'var(--spacing-7)', width: '192px' }} />
          <Skeleton className="rounded-md" style={{ height: 'var(--spacing-10)', width: '144px' }} />
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: 'var(--spacing-6)' }}>
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="border border-border rounded-lg bg-card hover:border-primary/30 transition-colors" style={{ padding: 'var(--spacing-6)' }}>
              <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-4)' }}>
                <Skeleton style={{ height: 'var(--spacing-6)', width: '192px' }} />
                <Skeleton className="rounded-full" style={{ height: 'var(--spacing-6)', width: '80px' }} />
              </div>
              <Skeleton className="w-full" style={{ height: 'var(--spacing-4)', marginBottom: 'var(--spacing-2)' }} />
              <Skeleton className="w-5/6" style={{ height: 'var(--spacing-4)', marginBottom: 'var(--spacing-4)' }} />
              <div className="flex items-center justify-between">
                <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
                  <Skeleton className="rounded-full" style={{ height: 'var(--spacing-6)', width: '64px' }} />
                  <Skeleton className="rounded-full" style={{ height: 'var(--spacing-6)', width: '80px' }} />
                </div>
                <Skeleton style={{ height: 'var(--spacing-6)', width: '48px' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Project Overview Skeleton - Matches ProjectUnifiedRedesigned.tsx layout
export function ProjectOverviewSkeleton() {
  return (
    <div className="flex h-full bg-background animate-fade-in">
      {/* Left Panel - 25% default width with resizable panels */}
      <div className="h-full border-r border-border flex" style={{ width: '25%' }}>
        {/* Icon Navigation Strip - 64px fixed */}
        <div className="border-r border-border w-16 min-w-16 max-w-16 h-full flex flex-col bg-card flex-shrink-0" style={{ paddingTop: 'var(--spacing-4)', paddingBottom: 'var(--spacing-4)', gap: 'var(--spacing-2)' }}>
          {[1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="mx-auto rounded-lg" style={{ height: 'var(--spacing-10)', width: 'var(--spacing-10)', minWidth: 'var(--spacing-10)', maxWidth: 'var(--spacing-10)' }} />
          ))}
        </div>
        
        {/* Section Content Area - Flexible */}
        <div className="flex-1 h-full flex flex-col">
          {/* Header */}
          <div className="border-b border-border flex-shrink-0" style={{ padding: 'var(--spacing-4)' }}>
            <div className="flex items-center justify-between" style={{ marginBottom: 'var(--spacing-3)' }}>
              <Skeleton style={{ height: 'var(--spacing-5)', width: '96px' }} />
              <div className="flex items-center" style={{ gap: 'var(--spacing-2)' }}>
                <Skeleton className="rounded-md" style={{ height: 'var(--spacing-9)', width: 'var(--spacing-9)' }} />
                <Skeleton className="rounded-md" style={{ height: 'var(--spacing-9)', width: '80px' }} />
              </div>
            </div>
            {/* Search */}
            <Skeleton className="w-full rounded-md" style={{ height: 'var(--spacing-9)' }} />
          </div>
          
          {/* Scrollable List Area */}
          <div className="flex-1 min-h-0" style={{ padding: 'var(--spacing-2)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="rounded-lg border border-border bg-card" style={{ padding: 'var(--spacing-3)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  {/* Title and Badge */}
                  <div className="flex items-start justify-between" style={{ marginBottom: 'var(--spacing-2)' }}>
                    <div className="flex items-center flex-1" style={{ gap: 'var(--spacing-2)' }}>
                      <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: 'var(--spacing-4)' }} />
                      <Skeleton style={{ height: 'var(--spacing-4)', width: '128px' }} />
                    </div>
                    <Skeleton className="rounded-full" style={{ height: 'var(--spacing-5)', width: '64px' }} />
                  </div>
                  {/* Description */}
                  <Skeleton className="w-full" style={{ height: 'var(--spacing-3)' }} />
                  <Skeleton className="w-3/4" style={{ height: 'var(--spacing-3)' }} />
                  {/* Button */}
                  <Skeleton className="rounded-md" style={{ height: 'var(--spacing-7)', width: '128px', marginTop: 'var(--spacing-2)' }} />
                  {/* Meta */}
                  <div className="flex items-center justify-between" style={{ paddingTop: 'var(--spacing-1)' }}>
                    <Skeleton style={{ height: 'var(--spacing-3)', width: '80px' }} />
                    <Skeleton className="rounded-full" style={{ height: 'var(--spacing-5)', width: 'var(--spacing-5)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Resize Handle Placeholder */}
      <div className="w-1 bg-border flex-shrink-0" />

      {/* Main Chat Area - 75% default width */}
      <div className="flex-1 h-full flex flex-col">
        {/* Chat Header */}
        <div className="border-b border-border flex-shrink-0" style={{ padding: 'var(--spacing-4)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center" style={{ gap: 'var(--spacing-3)' }}>
              <Skeleton className="rounded-full" style={{ height: 'var(--spacing-8)', width: 'var(--spacing-8)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <Skeleton style={{ height: 'var(--spacing-5)', width: '160px' }} />
                <Skeleton style={{ height: 'var(--spacing-3)', width: '192px' }} />
              </div>
            </div>
            <Skeleton className="rounded-lg" style={{ height: 'var(--spacing-9)', width: 'var(--spacing-9)' }} />
          </div>
        </div>

        {/* Chat Content - Centered Empty State */}
        <div className="flex-1 flex items-center justify-center overflow-y-auto" style={{ padding: 'var(--spacing-8)' }}>
          <div className="max-w-2xl w-full" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-8)' }}>
            {/* Welcome Section */}
            <div className="text-center" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <Skeleton className="rounded-lg mx-auto" style={{ height: 'var(--spacing-12)', width: 'var(--spacing-12)' }} />
              <Skeleton className="mx-auto" style={{ height: 'var(--spacing-7)', width: '288px' }} />
              <Skeleton className="mx-auto" style={{ height: 'var(--spacing-4)', width: '384px' }} />
            </div>

            {/* Conversation Starters Grid - 2 columns + 1 full width */}
            <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-3)' }}>
              {[1, 2, 3, 4].map((i) => (
                <div 
                  key={i} 
                  className="border border-border rounded-lg hover:bg-accent/50 transition-colors"
                  style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}
                >
                  <div className="flex items-start" style={{ gap: 'var(--spacing-3)' }}>
                    <Skeleton className="rounded-sm flex-shrink-0" style={{ height: 'var(--spacing-5)', width: 'var(--spacing-5)' }} />
                    <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                      <Skeleton className="w-full" style={{ height: 'var(--spacing-4)' }} />
                      <Skeleton className="w-4/5" style={{ height: 'var(--spacing-3)' }} />
                    </div>
                  </div>
                </div>
              ))}
              {/* Full width card */}
              <div className="col-span-2 border border-border rounded-lg hover:bg-accent/50 transition-colors" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div className="flex items-start" style={{ gap: 'var(--spacing-3)' }}>
                  <Skeleton className="rounded-sm flex-shrink-0" style={{ height: 'var(--spacing-5)', width: 'var(--spacing-5)' }} />
                  <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Skeleton className="w-full" style={{ height: 'var(--spacing-4)' }} />
                    <Skeleton className="w-3/4" style={{ height: 'var(--spacing-3)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Input Area */}
        <div className="border-t border-border flex-shrink-0" style={{ padding: 'var(--spacing-4)' }}>
          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Skeleton className="w-full rounded-lg" style={{ height: 'var(--spacing-14)' }} />
            </div>
            <div className="flex items-center justify-between" style={{ marginTop: 'var(--spacing-2)' }}>
              <Skeleton style={{ height: 'var(--spacing-3)', width: '192px' }} />
              <Skeleton style={{ height: 'var(--spacing-3)', width: '96px' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Task Detail Skeleton - For task detail views
export function TaskDetailSkeleton() {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Breadcrumb */}
      <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '256px' }} />
      
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
        <Skeleton className="rounded-md" style={{ height: 'var(--spacing-8)', width: '384px' }} />
        <div className="flex" style={{ gap: 'var(--spacing-2)' }}>
          <Skeleton className="rounded-full" style={{ height: 'var(--spacing-6)', width: '80px' }} />
          <Skeleton className="rounded-full" style={{ height: 'var(--spacing-6)', width: '96px' }} />
          <Skeleton className="rounded-full" style={{ height: 'var(--spacing-6)', width: '64px' }} />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 'var(--spacing-6)' }}>
        {/* Left Column */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          {/* Description */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-5)', width: '128px' }} />
            <Skeleton className="w-full rounded-sm" style={{ height: 'var(--spacing-4)' }} />
            <Skeleton className="w-full rounded-sm" style={{ height: 'var(--spacing-4)' }} />
            <Skeleton className="w-3/4 rounded-sm" style={{ height: 'var(--spacing-4)' }} />
          </div>

          {/* Artifacts */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-5)', width: '96px' }} />
            <div className="grid grid-cols-2" style={{ gap: 'var(--spacing-3)' }}>
              {[1, 2].map((i) => (
                <div key={i} className="border border-border rounded-lg" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                  <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '128px' }} />
                  <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-3)', width: '96px' }} />
                </div>
              ))}
            </div>
          </div>

          {/* Comments/Activity */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-5)', width: '112px' }} />
            {[1, 2, 3].map((i) => (
              <div key={i} className="border border-border rounded-lg" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                <div className="flex items-start" style={{ gap: 'var(--spacing-3)' }}>
                  <Skeleton className="rounded-full flex-shrink-0" style={{ height: 'var(--spacing-8)', width: 'var(--spacing-8)' }} />
                  <div className="flex-1" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                    <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '128px' }} />
                    <Skeleton className="w-full rounded-sm" style={{ height: 'var(--spacing-3)' }} />
                    <Skeleton className="w-5/6 rounded-sm" style={{ height: 'var(--spacing-3)' }} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
          <div className="border border-border rounded-lg" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
            <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-5)', width: '96px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
              <div>
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-3)', width: '64px', marginBottom: 'var(--spacing-2)' }} />
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '128px' }} />
              </div>
              <div>
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-3)', width: '64px', marginBottom: 'var(--spacing-2)' }} />
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '112px' }} />
              </div>
              <div>
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-3)', width: '64px', marginBottom: 'var(--spacing-2)' }} />
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '96px' }} />
              </div>
            </div>
          </div>

          {/* Additional Info Card */}
          <div className="border border-border rounded-lg" style={{ padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-5)', width: '112px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
              <Skeleton className="w-full rounded-sm" style={{ height: 'var(--spacing-3)' }} />
              <Skeleton className="w-5/6 rounded-sm" style={{ height: 'var(--spacing-3)' }} />
              <Skeleton className="w-4/5 rounded-sm" style={{ height: 'var(--spacing-3)' }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Settings Skeleton - For settings pages
export function SettingsSkeleton() {
  return (
    <div style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-6)' }}>
      {/* Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
        <Skeleton className="rounded-md" style={{ height: 'var(--spacing-8)', width: '192px' }} />
        <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '384px' }} />
      </div>

      {/* Settings Sections */}
      {[1, 2, 3].map((i) => (
        <div key={i} className="border border-border rounded-lg" style={{ padding: 'var(--spacing-6)', display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
          <Skeleton className="rounded-md" style={{ height: 'var(--spacing-6)', width: '160px' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
            <div className="flex items-center justify-between border-b border-border" style={{ paddingTop: 'var(--spacing-3)', paddingBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '128px' }} />
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-3)', width: '192px' }} />
              </div>
              <Skeleton className="rounded-md" style={{ height: 'var(--spacing-9)', width: '80px' }} />
            </div>
            <div className="flex items-center justify-between border-b border-border" style={{ paddingTop: 'var(--spacing-3)', paddingBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '160px' }} />
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-3)', width: '224px' }} />
              </div>
              <Skeleton className="rounded-md" style={{ height: 'var(--spacing-9)', width: '80px' }} />
            </div>
            <div className="flex items-center justify-between" style={{ paddingTop: 'var(--spacing-3)', paddingBottom: 'var(--spacing-3)' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-1)' }}>
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-4)', width: '144px' }} />
                <Skeleton className="rounded-sm" style={{ height: 'var(--spacing-3)', width: '208px' }} />
              </div>
              <Skeleton className="rounded-md" style={{ height: 'var(--spacing-9)', width: '80px' }} />
            </div>
          </div>
        </div>
      ))}

      {/* Action Buttons */}
      <div className="flex justify-end" style={{ gap: 'var(--spacing-3)' }}>
        <Skeleton className="rounded-md" style={{ height: 'var(--spacing-10)', width: '96px' }} />
        <Skeleton className="rounded-md" style={{ height: 'var(--spacing-10)', width: '128px' }} />
      </div>
    </div>
  );
}
