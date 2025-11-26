# Supabase Deployment Troubleshooting

## Fix 403 Deployment Error

The 403 error usually indicates authentication or permission issues. Follow these steps:

### 1. Check Supabase CLI Installation
```bash
# Install/update Supabase CLI
npm install -g @supabase/cli@latest

# Check version
supabase --version
```

### 2. Login to Supabase
```bash
# Login to your Supabase account
supabase login

# You should see a browser window to authenticate
```

### 3. Link Your Project
```bash
# Link to your specific project
supabase link --project-ref UcFkSlf0RkoeDppotTtfTX

# Or link interactively
supabase link
```

### 4. Verify Project Connection
```bash
# Check project status
supabase status

# List functions
supabase functions list
```

### 5. Deploy the Function
```bash
# Deploy make-server function
supabase functions deploy make-server

# Or deploy with verbose output
supabase functions deploy make-server --debug
```

### 6. Alternative: Deploy via Dashboard
If CLI deployment fails:

1. Go to your Supabase Dashboard
2. Navigate to Edge Functions
3. Click "New Function"
4. Copy the content from `/supabase/functions/make-server/index.ts`
5. Paste and deploy directly

### 7. Test the Function
```bash
# Test locally first
supabase functions serve

# Then test deployed function
curl https://UcFkSlf0RkoeDppotTtfTX.supabase.co/functions/v1/make-server/health
```

## Common Issues and Solutions

### Issue: "Project not found"
**Solution:** 
- Verify project ID is correct
- Check you have access to the project
- Try `supabase projects list` to see available projects

### Issue: "Unauthorized"
**Solution:**
- Run `supabase logout` then `supabase login`
- Check you're logged in with the correct account
- Verify project permissions in dashboard

### Issue: "Function deployment timeout"
**Solution:**
- Simplify the function code (current version is already simplified)
- Check internet connection
- Try deploying during off-peak hours

### Issue: Import/dependency errors
**Solution:**
- Use stable Deno std versions (0.192.0 in current setup)
- Remove complex dependencies
- Test function locally first

## Emergency Fallback

If deployment continues to fail, you can:

1. **Use Supabase Dashboard**: Deploy directly via web interface
2. **Disable Edge Functions**: Comment out Supabase calls in the app temporarily
3. **Use Mock Data**: The app has fallback mechanisms for offline/no-backend operation

## Verification Commands

After successful deployment:

```bash
# Check function logs
supabase functions logs make-server

# Test endpoints
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server/health
curl https://YOUR_PROJECT.supabase.co/functions/v1/make-server/workspaces
```