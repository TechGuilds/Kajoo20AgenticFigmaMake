import React, { useState, useEffect } from 'react';
import type { RouteContext } from '../../../types';

interface TaskRouterProps {
  children: (context: RouteContext, setContext: (context: RouteContext) => void) => React.ReactNode;
  initialProjectId: string;
}

export function TaskRouter({ children, initialProjectId }: TaskRouterProps) {
  const [context, setContext] = useState<RouteContext>({
    projectId: initialProjectId,
    type: 'project'
  });

  // Update context when project changes
  useEffect(() => {
    setContext(prev => ({
      ...prev,
      projectId: initialProjectId
    }));
  }, [initialProjectId]);

  return <>{children(context, setContext)}</>;
}
