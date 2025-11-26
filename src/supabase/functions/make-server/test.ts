#!/usr/bin/env -S deno run --allow-net --allow-env

// Simple test script for the make-server edge function

const BASE_URL = 'http://localhost:54327/functions/v1/make-server'

async function testEndpoint(endpoint: string, method: string = 'GET', body?: any) {
  try {
    console.log(`\n🧪 Testing ${method} ${endpoint}`)
    
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + (Deno.env.get('SUPABASE_ANON_KEY') || 'test-key')
      }
    }
    
    if (body && method !== 'GET') {
      options.body = JSON.stringify(body)
    }
    
    const response = await fetch(`${BASE_URL}${endpoint}`, options)
    const responseText = await response.text()
    
    console.log(`✅ Status: ${response.status}`)
    console.log(`📄 Response: ${responseText}`)
    
    return { status: response.status, body: responseText }
  } catch (error) {
    console.error(`❌ Error testing ${endpoint}:`, error)
    return { status: 500, error: error.message }
  }
}

async function runTests() {
  console.log('🚀 Starting edge function tests...')
  
  // Test health endpoint
  await testEndpoint('/health')
  
  // Test echo endpoint
  await testEndpoint('/echo')
  await testEndpoint('/echo', 'POST', { message: 'Hello, World!' })
  
  // Test workspaces endpoint
  await testEndpoint('/workspaces')
  await testEndpoint('/workspaces', 'POST', { 
    name: 'Test Workspace',
    description: 'Created by test script'
  })
  
  // Test 404 handling
  await testEndpoint('/nonexistent')
  
  console.log('\n✅ Tests completed!')
}

if (import.meta.main) {
  await runTests()
}