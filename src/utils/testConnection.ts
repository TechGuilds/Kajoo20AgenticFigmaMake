import { apiClient } from './api';

export async function testDatabaseConnection(): Promise<boolean> {
  try {
    console.log('🔍 Testing database connection...');
    console.log('🔍 API Base URL:', `https://nlvqsqeevkoowllywzlv.supabase.co/functions/v1/make-server-5d020fdc`);
    
    // Test health endpoint first
    console.log('🏥 Testing health endpoint...');
    try {
      const health = await apiClient.healthCheck();
      console.log('✅ Health check successful:', health);
    } catch (healthError) {
      console.error('❌ Health check failed:', healthError);
      
      // If health check fails, check if it's a deployment issue
      if (healthError.message.includes('404') || healthError.message.includes('Not Found')) {
        console.log('💡 The edge function appears to not be deployed. Continuing with mock data...');
      } else {
        throw healthError; // Re-throw other errors
      }
    }
    
    // Test workspace endpoint
    console.log('📋 Testing workspaces endpoint...');
    try {
      const workspaces = await apiClient.getWorkspaces();
      console.log('✅ Workspaces endpoint successful:', workspaces.length, 'workspaces found');
    } catch (workspaceError) {
      console.error('❌ Workspaces endpoint failed:', workspaceError);
      
      // For now, continue even if this fails - we can use mock data
      if (workspaceError.message.includes('404') || workspaceError.message.includes('Not Found')) {
        console.log('💡 Workspaces endpoint not available. The app will use local data...');
        return true; // Return true to allow the app to start with local data
      } else {
        throw workspaceError;
      }
    }
    
    return true;
  } catch (error) {
    console.error('❌ Database connection test failed:', error);
    console.error('❌ Full error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Provide helpful guidance
    console.log('💡 Troubleshooting tips:');
    console.log('1. Check if the Supabase edge function is deployed');
    console.log('2. Verify your Supabase project ID and API keys');
    console.log('3. Check if you have sufficient permissions to deploy edge functions');
    console.log('4. Try using the app with local data for now');
    
    return false;
  }
}

// Function to be called from console for testing
(window as any).testDbConnection = testDatabaseConnection;