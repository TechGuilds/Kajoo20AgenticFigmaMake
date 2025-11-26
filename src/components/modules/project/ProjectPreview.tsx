import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Database, 
  Code, 
  Settings, 
  FileText, 
  ExternalLink,
  BarChart3,
  CalendarDays,
  Users,
  Rocket,
  CheckCircle2,
  Eye
} from 'lucide-react';
import { PROJECT_ARTIFACTS, type Artifact } from '@/constants/artifacts';

interface ProjectPreviewProps {
  projectStats: {
    totalTasks: number;
    completedTasks: number;
    inProgressTasks: number;
    blockedTasks: number;
    completionRate: number;
    totalHours: number;
  };
  tasks: any[];
}

export function ProjectPreview({ projectStats, tasks }: ProjectPreviewProps) {
  // Defensive programming - ensure we have valid data
  const safeProjectStats = {
    totalTasks: projectStats?.totalTasks || 0,
    completedTasks: projectStats?.completedTasks || 0,
    inProgressTasks: projectStats?.inProgressTasks || 0,
    blockedTasks: projectStats?.blockedTasks || 0,
    completionRate: projectStats?.completionRate || 0,
    totalHours: projectStats?.totalHours || 0
  };
  
  const safeTasks = tasks || [];

  return (
    <div className="h-full overflow-y-auto">
      <div className="h-full flex items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center h-full max-w-md mx-auto text-center">
          <div className="size-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
            <Eye className="size-8 text-muted-foreground" />
          </div>
          <h3 className="mb-2">No Artifact Selected</h3>
          <p className="text-muted-foreground mb-4 leading-relaxed">
            Select an artifact from the explorer to view its preview
          </p>
        </div>
      </div>
    </div>
  );
}
