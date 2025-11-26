import { type View, type TabPanel } from '../components/MainNavigation';

export const shouldClearState = (view: View): boolean => {
  return view !== 'workspace' && view !== 'project-overview-standalone';
};

export const shouldShowBreadcrumbs = (view: View): boolean => {
  return view !== 'project-setup';
};

export const getContentOverflowClass = (view: View, activeTab: TabPanel): string => {
  return view !== 'workspace' || activeTab !== 'project-analysis' 
    ? 'h-full overflow-y-auto' 
    : 'h-full overflow-hidden';
};