import { apiClient } from './api';

export async function testWorkspaceCreation() {
  console.log('🧪 Testing workspace creation...');
  
  const testWorkspace = {
    name: 'Test Workspace ' + Date.now(),
    description: 'This is a test workspace created for debugging',
    sourceSystem: 'Test Source',
    targetSystem: 'Test Target',
    teamSize: 1,
    estimatedDuration: 'Test Duration'
  };
  
  try {
    console.log('📤 Sending workspace creation request:', testWorkspace);
    const result = await apiClient.createWorkspace(testWorkspace);
    console.log('✅ Workspace creation successful:', result);
    return result;
  } catch (error) {
    console.error('❌ Workspace creation failed:', error);
    throw error;
  }
}

export async function testWorkspaceList() {
  console.log('🧪 Testing workspace list...');
  
  try {
    const workspaces = await apiClient.getWorkspaces();
    console.log('✅ Workspace list successful:', workspaces);
    return workspaces;
  } catch (error) {
    console.error('❌ Workspace list failed:', error);
    throw error;
  }
}

export async function testProjectDeletion() {
  console.log('🧪 Testing project deletion...');
  
  try {
    // First, get all workspaces to find a project to delete
    const workspaces = await apiClient.getWorkspaces();
    console.log('📋 Found workspaces:', workspaces);
    
    // Find a workspace with projects
    let testProject = null;
    let testWorkspace = null;
    
    for (const workspace of workspaces) {
      if (workspace.projects && workspace.projects.length > 0) {
        testWorkspace = workspace;
        testProject = workspace.projects[0];
        break;
      }
    }
    
    if (!testProject) {
      // Create a test project first
      console.log('🧪 No projects found, creating test project...');
      if (workspaces.length === 0) {
        throw new Error('No workspaces available for testing');
      }
      
      testWorkspace = workspaces[0];
      testProject = await apiClient.createProject(testWorkspace.id, {
        name: 'Test Project for Deletion ' + Date.now(),
        description: 'This project will be deleted for testing',
        status: 'planning'
      });
      console.log('✅ Test project created:', testProject);
    }
    
    console.log('🗑️ Attempting to delete project:', testProject.id);
    const result = await apiClient.deleteProject(testProject.id);
    console.log('✅ Project deletion API successful:', result);
    
    // Verify deletion by checking if project still exists
    console.log('🔍 Verifying deletion...');
    const updatedWorkspace = await apiClient.getWorkspace(testWorkspace.id);
    const projectStillExists = updatedWorkspace.projects?.some(p => p.id === testProject.id);
    
    if (projectStillExists) {
      console.error('❌ Project still exists after deletion!');
      throw new Error('Project deletion verification failed - project still exists');
    } else {
      console.log('✅ Project deletion verified - project no longer exists');
    }
    
    return { success: true, deletedProject: testProject, workspace: updatedWorkspace };
  } catch (error) {
    console.error('❌ Project deletion test failed:', error);
    throw error;
  }
}

// Make functions available in browser console for testing
(window as any).testWorkspaceCreation = testWorkspaceCreation;
(window as any).testWorkspaceList = testWorkspaceList;
(window as any).testProjectDeletion = testProjectDeletion;