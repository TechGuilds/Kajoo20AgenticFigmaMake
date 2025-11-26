#!/bin/bash

echo "🔧 Fixing Supabase Deployment Issues..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Step 1: Check if Supabase CLI is installed
echo "1. Checking Supabase CLI installation..."
if ! command -v supabase &> /dev/null; then
    print_error "Supabase CLI not found. Installing..."
    npm install -g @supabase/cli@latest
else
    print_status "Supabase CLI found: $(supabase --version)"
fi

# Step 2: Check login status
echo -e "\n2. Checking authentication status..."
if supabase projects list &> /dev/null; then
    print_status "Already authenticated"
else
    print_warning "Not authenticated. Please run: supabase login"
    echo "After logging in, re-run this script."
    exit 1
fi

# Step 3: Check project linking
echo -e "\n3. Checking project linking..."
if supabase status &> /dev/null; then
    print_status "Project is linked"
    echo "Current project: $(supabase status | grep "Project name" | cut -d: -f2 | xargs)"
else
    print_warning "Project not linked"
    echo "Available projects:"
    supabase projects list
    echo ""
    echo "To link your project, run:"
    echo "supabase link --project-ref UcFkSlf0RkoeDppotTtfTX"
    exit 1
fi

# Step 4: Test minimal function deployment
echo -e "\n4. Testing minimal function deployment..."
if supabase functions deploy make-server-minimal --no-verify-jwt; then
    print_status "Minimal function deployed successfully!"
    
    # Test the function
    echo "Testing deployed function..."
    PROJECT_REF=$(supabase status | grep "API URL" | cut -d: -f2- | xargs | sed 's|https://||' | sed 's|\.supabase\.co.*||')
    FUNCTION_URL="https://${PROJECT_REF}.supabase.co/functions/v1/make-server-minimal/health"
    
    if curl -s "$FUNCTION_URL" | grep -q "healthy"; then
        print_status "Function test passed!"
        echo "Function URL: $FUNCTION_URL"
    else
        print_warning "Function deployed but health check failed"
    fi
else
    print_error "Minimal function deployment failed"
    echo "Check the logs with: supabase functions logs make-server-minimal"
fi

# Step 5: Try main function deployment
echo -e "\n5. Attempting main function deployment..."
if supabase functions deploy make-server --no-verify-jwt; then
    print_status "Main function deployed successfully!"
else
    print_error "Main function deployment failed"
    echo "You can use the minimal function for now"
    echo "Check logs with: supabase functions logs make-server"
fi

echo -e "\n🎉 Deployment troubleshooting complete!"
echo "If you're still having issues, try deploying via the Supabase Dashboard:"
echo "1. Go to your project dashboard"
echo "2. Navigate to Edge Functions"
echo "3. Create a new function manually"
echo "4. Copy and paste the function code"