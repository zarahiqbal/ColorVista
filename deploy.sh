#!/bin/bash
set -e

RESOURCE_GROUP="colorvista-rg"
APP_NAME="colorvista-server"
PLAN_NAME="colorvista-plan"
LOCATION="eastus"

echo "=== ColorVista Azure Deployment ==="
echo ""

# Check if Azure CLI is installed
if ! command -v az &> /dev/null; then
    echo "Azure CLI not found. Install with: brew install azure-cli"
    exit 1
fi

# Check if logged in
echo "Checking Azure login..."
az account show > /dev/null 2>&1 || {
    echo "Not logged in. Running az login..."
    az login
}

echo "1/6 Creating resource group..."
az group create --name $RESOURCE_GROUP --location $LOCATION --output none

echo "2/6 Creating App Service Plan (Free Tier)..."
az appservice plan create --name $PLAN_NAME --resource-group $RESOURCE_GROUP --sku F1 --is-linux --output none

echo "3/6 Creating Web App..."
az webapp create --name $APP_NAME --resource-group $RESOURCE_GROUP --plan $PLAN_NAME --runtime "PYTHON:3.11" --output none

echo "4/6 Configuring startup command..."
az webapp config set --name $APP_NAME --resource-group $RESOURCE_GROUP \
    --startup-file "gunicorn --bind=0.0.0.0:8000 --workers=1 --threads=2 --timeout=600 app:app" \
    --output none

az webapp config appsettings set --name $APP_NAME --resource-group $RESOURCE_GROUP \
    --settings WEBSITES_PORT=8000 \
    --output none

echo "5/6 Creating deployment package..."
cd "$(dirname "$0")"
zip -r deploy.zip . \
    -x "*.git*" \
    -x ".venv/*" \
    -x "node_modules/*" \
    -x ".expo/*" \
    -x "android/*" \
    -x "ios/*" \
    -x ".vscode/*" \
    -x "*.md" \
    -x "deploy.zip" \
    -x ".DS_Store"

echo "6/6 Deploying to Azure..."
az webapp deployment source config-zip --name $APP_NAME --resource-group $RESOURCE_GROUP --src deploy.zip --output none

# Clean up zip
rm -f deploy.zip

echo ""
echo "=== Deployment Complete ==="
URL="https://${APP_NAME}.azurewebsites.net"
echo "Server URL: $URL"
echo "Ping test: curl ${URL}/ping"
echo ""
echo "Update your frontend SERVER_URL to: ${URL}"
