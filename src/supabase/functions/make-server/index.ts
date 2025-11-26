import { serve } from "https://deno.land/std@0.192.0/http/server.ts"

console.log("Make Server function started")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)
    const path = url.pathname

    console.log(`${req.method} ${path}`)

    // Health check endpoint
    if (path.endsWith('/health') || path === '/') {
      return new Response(
        JSON.stringify({ 
          status: 'healthy', 
          timestamp: new Date().toISOString(),
          version: '1.0.0'
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Simple echo endpoint
    if (path.endsWith('/echo')) {
      let body = null
      try {
        if (req.method === 'POST') {
          body = await req.json()
        }
      } catch (error) {
        console.log('Could not parse JSON body:', error)
      }

      return new Response(
        JSON.stringify({ 
          method: req.method,
          path: path,
          body: body,
          timestamp: new Date().toISOString()
        }),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Mock workspaces endpoint
    if (path.includes('/workspaces') && req.method === 'GET') {
      const mockWorkspaces = [
        {
          id: '1',
          name: 'Enterprise Portal Migration',
          description: 'Large-scale enterprise portal migration',
          status: 'active',
          progress: 75,
          createdAt: new Date().toISOString()
        },
        {
          id: '2', 
          name: 'E-commerce Platform Upgrade',
          description: 'Modernizing e-commerce platform',
          status: 'planning',
          progress: 25,
          createdAt: new Date().toISOString()
        }
      ]

      return new Response(
        JSON.stringify(mockWorkspaces),
        { 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json' 
          } 
        }
      )
    }

    // Default response
    return new Response(
      JSON.stringify({ 
        error: 'Not found',
        path: path,
        available_endpoints: ['/health', '/echo', '/workspaces']
      }),
      { 
        status: 404,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        message: error.message || 'Unknown error'
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )
  }
})