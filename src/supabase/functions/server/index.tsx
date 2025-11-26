// This file has been moved to /supabase/functions/make-server/index.ts
// Please use the new simplified edge function instead

export default () => {
  return new Response(
    JSON.stringify({ 
      error: 'This endpoint has been moved',
      message: 'Please use the make-server edge function instead',
      newEndpoint: '/functions/v1/make-server-5d020fdc'
    }),
    { 
      status: 301,
      headers: { 'Content-Type': 'application/json' }
    }
  )
}