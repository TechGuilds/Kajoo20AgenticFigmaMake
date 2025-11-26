# Supabase Edge Functions

This directory contains the edge functions for the Kajoo 2.0 Migration Platform.

## Functions

### make-server
The main API server function that handles backend operations for the application.

**Endpoints:**
- `GET /health` - Health check endpoint
- `GET /echo` - Echo endpoint for testing
- `POST /echo` - Echo endpoint with body
- `GET /workspaces` - List workspaces
- `POST /workspaces` - Create workspace

## Development

### Prerequisites
- Supabase CLI installed
- Deno runtime

### Local Development

1. Start the Supabase local development server:
```bash
supabase start
```

2. The edge function will be available at:
```
http://localhost:54327/functions/v1/make-server
```

3. Test the function:
```bash
cd supabase/functions/make-server
deno run --allow-net --allow-env test.ts
```

### Deployment

Deploy the function to your Supabase project:

```bash
supabase functions deploy make-server
```

### Environment Variables

The function requires these environment variables:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key for database access

## Troubleshooting

### 403 Deployment Errors
- Ensure you're logged in: `supabase login`
- Check project linking: `supabase link --project-ref YOUR_PROJECT_ID`
- Verify permissions in your Supabase project dashboard

### Function Not Working
- Check the function logs: `supabase functions logs make-server`
- Verify environment variables are set correctly
- Test locally first before deploying

### Import Issues
- All imports use versioned URLs for stability
- Import map is configured in `import_map.json`
- Deno configuration is in `deno.json`