# Modern Trello API Setup (2024)

## ✅ Updated Authentication Method

Trello now requires **Power-Up authentication** through Atlassian's developer platform.

### Your Power-Up Information:
- **Power-Up ID**: `68a9e136bd16bbda3c2a6715`
- **API Key URL**: https://trello.com/power-ups/68a9e136bd16bbda3c2a6715/edit/api-key

### Steps to Get Working Credentials:

1. **Access Your Power-Up Admin**:
   - Go to: https://trello.com/power-ups/admin
   - Find your existing Power-Up or create new one

2. **Generate API Key**:
   - Click on your Power-Up
   - Go to "API Key" tab
   - Click "Generate a new API Key"
   - Copy the 32-character API key

3. **Generate Token**:
   - From the API Key page, click the "Token" link
   - Authorize the Power-Up with read/write permissions
   - Copy the 64-character token

4. **Update Replit Secrets**:
   - `TRELLO_API_KEY` = Your Power-Up API key (32 chars)
   - `TRELLO_TOKEN` = Your authorized token (64 chars)

### What Changed:
- ❌ Old: Direct API access via `https://trello.com/app-key`
- ✅ New: Power-Up based access via developer console
- ✅ Enhanced security with scoped permissions
- ✅ Better integration management

### Testing:
Once updated, test with:
```bash
node dev-tools/trello-dev.js test
```