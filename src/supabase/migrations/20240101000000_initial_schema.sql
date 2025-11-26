-- Initial schema for Kajoo 2.0 Migration Platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Workspaces table
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed')),
  phase TEXT DEFAULT 'assessment' CHECK (phase IN ('assessment', 'setup', 'migrate', 'reconstruct', 'launch', 'completed')),
  source_system TEXT DEFAULT 'To be configured',
  target_system TEXT DEFAULT 'To be configured', 
  team_size INTEGER DEFAULT 1,
  estimated_duration TEXT DEFAULT 'TBD',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'active', 'paused', 'completed')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tasks table  
CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed', 'blocked')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'critical')),
  type TEXT DEFAULT 'task' CHECK (type IN ('assessment', 'setup', 'development', 'testing', 'deployment', 'task')),
  estimated_hours INTEGER DEFAULT 0,
  actual_hours INTEGER DEFAULT 0,
  assignee TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  tags TEXT[] DEFAULT '{}',
  dependencies UUID[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Comments table
CREATE TABLE IF NOT EXISTS comments (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  author TEXT NOT NULL,
  content TEXT NOT NULL,
  is_system BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('document', 'diagram', 'code', 'sitecore', 'hybrid', 'checklist')),
  content TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in-progress', 'completed', 'archived')),
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_workspace_id ON projects(workspace_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_comments_task_id ON comments(task_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_project_id ON artifacts(project_id);
CREATE INDEX IF NOT EXISTS idx_artifacts_task_id ON artifacts(task_id);

-- Create updated_at triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_workspaces_updated_at BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_projects_updated_at BEFORE UPDATE ON projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_artifacts_updated_at BEFORE UPDATE ON artifacts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE artifacts ENABLE ROW LEVEL SECURITY;

-- Create policies (for now, allow all operations - adjust based on auth requirements)
CREATE POLICY "Allow all operations on workspaces" ON workspaces FOR ALL USING (true);
CREATE POLICY "Allow all operations on projects" ON projects FOR ALL USING (true);
CREATE POLICY "Allow all operations on tasks" ON tasks FOR ALL USING (true);
CREATE POLICY "Allow all operations on comments" ON comments FOR ALL USING (true);
CREATE POLICY "Allow all operations on artifacts" ON artifacts FOR ALL USING (true);