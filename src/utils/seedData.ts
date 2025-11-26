import { apiClient } from './api';
import { INITIAL_WORKSPACES } from '../constants/workspaces';
import { type Workspace, type Project, type Task } from '../types/entities';

export async function seedDatabase(): Promise<void> {
  console.log('🌱 Starting database seeding...');
  
  try {
    // Check if data already exists
    const existingWorkspaces = await apiClient.getWorkspaces();
    
    if (existingWorkspaces.length > 0) {
      console.log('📊 Database already contains data. Skipping seed.');
      return;
    }

    // Seed workspaces and their projects/tasks
    for (const workspaceData of INITIAL_WORKSPACES) {
      console.log(`📁 Creating workspace: ${workspaceData.name}`);
      
      // Create workspace (without projects)
      const { projects, ...workspaceWithoutProjects } = workspaceData;
      const createdWorkspace = await apiClient.createWorkspace(workspaceWithoutProjects);
      
      if (!createdWorkspace || !projects) {
        console.warn(`⚠️ Failed to create workspace or no projects found: ${workspaceData.name}`);
        continue;
      }

      // Create projects for this workspace
      for (const projectData of projects) {
        console.log(`  📋 Creating project: ${projectData.name}`);
        
        // Create project (without tasks)
        const { tasks, ...projectWithoutTasks } = projectData;
        const createdProject = await apiClient.createProject(
          createdWorkspace.id, 
          projectWithoutTasks
        );
        
        if (!createdProject || !tasks || tasks.length === 0) {
          console.log(`    ℹ️ Project created with no tasks: ${projectData.name}`);
          continue;
        }

        // Create tasks for this project in bulk
        console.log(`    📝 Creating ${tasks.length} tasks for project: ${projectData.name}`);
        
        // Prepare tasks data (remove computed fields that will be set by the server)
        const tasksForCreation = tasks.map(task => {
          const { artifacts, comments, ...taskWithoutComputed } = task;
          return taskWithoutComputed;
        });
        
        try {
          const bulkResult = await apiClient.createTasksBulk(createdProject.id, tasksForCreation);
          if (bulkResult) {
            console.log(`    ✅ Created ${bulkResult.tasks.length} tasks successfully`);
            
            // Create artifacts and comments for tasks that had them
            for (let i = 0; i < tasks.length; i++) {
              const originalTask = tasks[i];
              const createdTask = bulkResult.tasks[i];
              
              if (!createdTask) continue;
              
              // Create artifacts
              if (originalTask.artifacts && originalTask.artifacts.length > 0) {
                for (const artifact of originalTask.artifacts) {
                  try {
                    await apiClient.createArtifact(createdTask.id, {
                      name: artifact.name,
                      type: artifact.type,
                      url: artifact.url,
                      content: artifact.content,
                      size: artifact.size,
                      mimeType: artifact.mimeType
                    });
                  } catch (error) {
                    console.warn(`⚠️ Failed to create artifact for task ${createdTask.title}:`, error);
                  }
                }
              }
              
              // Create comments
              if (originalTask.comments && originalTask.comments.length > 0) {
                for (const comment of originalTask.comments) {
                  try {
                    await apiClient.createComment(createdTask.id, {
                      content: comment.content,
                      isAIGenerated: comment.isAIGenerated
                    });
                  } catch (error) {
                    console.warn(`⚠️ Failed to create comment for task ${createdTask.title}:`, error);
                  }
                }
              }
            }
          }
        } catch (error) {
          console.error(`❌ Failed to create tasks for project ${projectData.name}:`, error);
        }
      }
    }
    
    console.log('✅ Database seeding completed successfully!');
    
  } catch (error) {
    console.error('❌ Database seeding failed:', error);
    throw error;
  }
}

export async function clearDatabase(): Promise<void> {
  console.log('🗑️ Clearing database...');
  
  try {
    const workspaces = await apiClient.getWorkspaces();
    
    for (const workspace of workspaces) {
      console.log(`🗑️ Deleting workspace: ${workspace.name}`);
      await apiClient.deleteWorkspace(workspace.id);
    }
    
    console.log('✅ Database cleared successfully!');
  } catch (error) {
    console.error('❌ Failed to clear database:', error);
    throw error;
  }
}

export async function resetDatabase(): Promise<void> {
  console.log('🔄 Resetting database...');
  await clearDatabase();
  await seedDatabase();
  console.log('✅ Database reset completed!');
}