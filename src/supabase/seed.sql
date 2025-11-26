-- Seed data for Kajoo 2.0 Migration Platform

-- Insert sample workspaces
INSERT INTO workspaces (id, name, description, status, phase, source_system, target_system, team_size, estimated_duration, progress) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'Enterprise Portal Migration', 'Large-scale enterprise portal migration from legacy Sitecore to cloud-native architecture', 'active', 'migrate', 'Sitecore XP 10.2', 'Sitecore XM Cloud', 8, '6 months', 65),
('550e8400-e29b-41d4-a716-446655440002', 'E-commerce Platform Upgrade', 'Modernizing e-commerce platform with new content management capabilities', 'planning', 'assessment', 'Sitecore XP 9.3', 'Sitecore XM Cloud', 5, '4 months', 15)
ON CONFLICT (id) DO NOTHING;

-- Insert sample projects
INSERT INTO projects (id, workspace_id, name, description, status, priority, progress, tags) VALUES
('660e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440001', 'Content Architecture Analysis', 'Analyze and document the existing content architecture for migration planning', 'active', 'high', 80, ARRAY['analysis', 'content', 'architecture']),
('660e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440001', 'Component Migration Strategy', 'Define strategy for migrating custom components to the new platform', 'in-progress', 'high', 45, ARRAY['components', 'strategy', 'migration']),
('660e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440002', 'Platform Assessment', 'Initial assessment of current e-commerce platform capabilities', 'planning', 'medium', 25, ARRAY['assessment', 'platform'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample tasks
INSERT INTO tasks (id, project_id, title, description, status, priority, type, estimated_hours, tags) VALUES
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Content Type Inventory', 'Create comprehensive inventory of all content types and their usage', 'completed', 'high', 'assessment', 16, ARRAY['inventory', 'content-types']),
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440001', 'Template Analysis', 'Analyze existing templates and their dependencies', 'in-progress', 'high', 'assessment', 24, ARRAY['templates', 'analysis']),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002', 'Component Audit', 'Audit all custom components for migration compatibility', 'todo', 'medium', 'assessment', 32, ARRAY['components', 'audit']),
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003', 'Performance Baseline', 'Establish current platform performance metrics', 'todo', 'low', 'assessment', 8, ARRAY['performance', 'baseline'])
ON CONFLICT (id) DO NOTHING;

-- Insert sample comments
INSERT INTO comments (task_id, author, content, is_system) VALUES
('770e8400-e29b-41d4-a716-446655440001', 'AI Assistant', 'Task completed successfully. Identified 23 unique content types across the platform.', true),
('770e8400-e29b-41d4-a716-446655440002', 'John Smith', 'Started analysis of the main page templates. Found some complex dependencies that need further investigation.', false),
('770e8400-e29b-41d4-a716-446655440002', 'AI Assistant', 'Detected 3 templates with circular dependencies. Flagging for manual review.', true)
ON CONFLICT DO NOTHING;

-- Insert sample artifacts
INSERT INTO artifacts (id, project_id, title, description, type, content, status, tags) VALUES
('880e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001', 'Content Architecture Diagram', 'Visual representation of the content structure and relationships', 'diagram', 'Content architecture diagram content here...', 'completed', ARRAY['architecture', 'content']),
('880e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002', 'Component Mapping Report', 'Detailed mapping of existing components to new architecture', 'document', 'Component mapping report content...', 'in-progress', ARRAY['components', 'mapping']),
('880e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440001', 'Migration Checklist', 'Step-by-step checklist for the migration process', 'checklist', 'Migration checklist items...', 'completed', ARRAY['migration', 'checklist'])
ON CONFLICT (id) DO NOTHING;