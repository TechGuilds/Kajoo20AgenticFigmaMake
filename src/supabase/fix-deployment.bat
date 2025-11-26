@echo off
echo 🔧 Fixing Supabase Deployment Issues...

:: Step 1: Check if Supabase CLI is installed
echo 1. Checking Supabase CLI installation...
supabase --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Supabase CLI not found. Installing...
    npm install -g @supabase/cli@latest
) else (
    echo ✅ Supabase CLI found
    supabase --version
)

:: Step 2: Check authentication
echo.
echo 2. Checking authentication status...
supabase projects list >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Not authenticated. Please run: supabase login
    echo After logging in, re-run this script.
    pause
    exit /b 1
) else (
    echo ✅ Already authenticated
)

:: Step 3: Check project linking
echo.
echo 3. Checking project linking...
supabase status >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️ Project not linked
    echo Available projects:
    supabase projects list
    echo.
    echo To link your project, run:
    echo supabase link --project-ref UcFkSlf0RkoeDppotTtfTX
    pause
    exit /b 1
) else (
    echo ✅ Project is linked
)

:: Step 4: Deploy minimal function
echo.
echo 4. Testing minimal function deployment...
supabase functions deploy make-server-minimal --no-verify-jwt
if %errorlevel% equ 0 (
    echo ✅ Minimal function deployed successfully!
) else (
    echo ❌ Minimal function deployment failed
)

:: Step 5: Deploy main function
echo.
echo 5. Attempting main function deployment...
supabase functions deploy make-server --no-verify-jwt
if %errorlevel% equ 0 (
    echo ✅ Main function deployed successfully!
) else (
    echo ❌ Main function deployment failed
    echo You can use the minimal function for now
)

echo.
echo 🎉 Deployment troubleshooting complete!
echo If you're still having issues, try deploying via the Supabase Dashboard.
pause