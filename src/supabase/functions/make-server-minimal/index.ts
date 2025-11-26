// Minimal edge function for deployment testing
Deno.serve(async (req) => {
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  }

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const url = new URL(req.url)

    if (url.pathname.endsWith('/health')) {
      return Response.json(
        { status: 'healthy', timestamp: new Date().toISOString() },
        { headers: corsHeaders }
      )
    }

    return Response.json(
      { error: 'Not found', path: url.pathname },
      { status: 404, headers: corsHeaders }
    )
  } catch (error) {
    return Response.json(
      { error: 'Internal server error' },
      { status: 500, headers: corsHeaders }
    )
  }
})