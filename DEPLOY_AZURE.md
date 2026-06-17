# Deploy ColorVista Backend to Azure App Service

## Prerequisites
- Azure account with $200 free trial
- Azure CLI installed locally

## Step 1: Install Azure CLI
```bash
brew install azure-cli
```

## Step 2: Login to Azure
```bash
az login
```

## Step 3: Create a Resource Group
```bash
az group create --name colorvista-rg --location eastus
```

## Step 4: Create App Service Plan (Free Tier)
```bash
az appservice plan create --name colorvista-plan --resource-group colorvista-rg --sku F1 --is-linux
```

## Step 5: Create the Web App
```bash
az webapp create --name colorvista-server --resource-group colorvista-rg --plan colorvista-plan --runtime "PYTHON:3.11"
```

## Step 6: Configure Startup Command
```bash
az webapp config set --name colorvista-server --resource-group colorvista-rg --startup-file "gunicorn --bind=0.0.0.0:8000 --workers=1 --threads=2 --timeout=600 app:app"
```

## Step 7: Configure Environment Variables (if needed)
```bash
# Example: if you add API keys later
az webapp config appsettings set --name colorvista-server --resource-group colorvista-rg --settings WEBSITES_PORT=8000
```

## Step 8: Deploy Code
```bash
# From the project root directory
az webapp deployment source config-local-git --name colorvista-server --resource-group colorvista-rg

# Get the deployment URL
az webapp deployment list-publishing-profiles --name colorvista-server --resource-group colorvista-rg --query "[?publishMethod=='MSDeploy'].publishUrl" -o tsv
```

Alternative deployment method (ZIP deploy):
```bash
# Create a deployment package (exclude unnecessary files)
zip -r deploy.zip . -x "*.git*" -x ".venv/*" -x "node_modules/*" -x ".expo/*" -x "android/*" -x "ios/*"

# Deploy
az webapp deployment source config-zip --name colorvista-server --resource-group colorvista-rg --src deploy.zip
```

## Step 9: Verify Deployment
```bash
# Get the URL
az webapp show --name colorvista-server --resource-group colorvista-rg --query defaultHostName -o tsv
```

Your server will be at: `https://colorvista-server.azurewebsites.net`

Test with:
```bash
curl https://colorvista-server.azurewebsites.net/ping
```

## Step 10: Update Frontend
Update the `SERVER_URL` in your frontend files to point to Azure:
- `screens/MediaUpload.tsx`
- `enhancer.tsx`
- `screens/LiveScreen.tsx`

Replace `http://192.168.x.x:5000` with `https://colorvista-server.azurewebsites.net`

## Cost Estimate
- **F1 (Free Tier)**: $0/month (60 min/day compute, 1GB RAM)
- **B1 (Basic Tier)**: ~$13/month (if you need more)
- **$200 free trial**: covers B1 for ~15 months or F1 indefinitely

## Cleanup (when done)
```bash
az group delete --name colorvista-rg --yes --no-wait
```
