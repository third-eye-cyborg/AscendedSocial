# Postman GUI Walkthrough - Injecting Secrets into Environments

This is a detailed, step-by-step visual guide for importing Ascended Social's Postman environments and injecting your secrets through Postman's GUI.

## ⚡ How This Works

**You DO NOT need to create variables one-by-one!** 

When you import the JSON files:
- ✅ Postman automatically creates ALL 31 variables (DEV) or 16 variables (PROD)
- ✅ All variable names, types, and descriptions are imported
- ✅ Default values (like URLs) are already filled in
- ⏭️ You only need to fill in the **empty secret fields** afterward

**TL;DR**: Import → Fill secrets → Done! Much faster than manual entry.

## 📋 What You'll Need

Before starting, gather these secrets from your Replit workspace:
- [ ] `DATABASE_URL` (from Replit Database tab)
- [ ] `SESSION_SECRET` (from Replit Secrets)
- [ ] `OPENAI_API_KEY` (from OpenAI Platform)
- [ ] `POSTHOG_API_TOKEN` (from PostHog Settings)
- [ ] Other API keys as needed

## 🎯 Step-by-Step GUI Instructions

### Part 1: Import Environment Files

#### Step 1: Open Postman Environments

1. **Launch Postman** (Desktop app or Web version at postman.com)
2. Look at the **left sidebar**
3. Click on **"Environments"** (icon looks like a stack/layers ⚙️)

```
┌─────────────────────────────────────┐
│  Postman                            │
├─────────────────────────────────────┤
│  🏠 Home                            │
│  📁 Collections                     │
│  ⚙️  Environments    ← Click here   │
│  📊 Mock Servers                    │
│  🔔 Monitors                        │
└─────────────────────────────────────┘
```

#### Step 2: Click Import Button

1. In the Environments section, look for the **"Import"** button (top right area)
2. Click **"Import"**

```
┌────────────────────────────────────────────────┐
│  Environments                  [+] [Import]    │ ← Click Import
├────────────────────────────────────────────────┤
│  My Workspace Environments                     │
│  (Your existing environments listed here)      │
└────────────────────────────────────────────────┘
```

#### Step 3: Select Files to Import

1. A modal window will appear: **"Import"**
2. You have several options - use **"Upload Files"**
3. Click **"Upload Files"** or drag-and-drop the files

```
┌──────────────────────────────────────────┐
│  Import                            ✕     │
├──────────────────────────────────────────┤
│                                          │
│   📁 Upload Files                        │
│   🔗 Import From Link                    │
│   📋 Paste Raw Text                      │
│   💾 Import From Workspace               │
│                                          │
│   [Choose Files] or drag files here      │
│                                          │
└──────────────────────────────────────────┘
```

#### Step 4: Select Environment Files

**💡 TIP: This imports ALL variables at once - no manual entry needed!**

1. Navigate to your Ascended Social workspace folder
2. Select BOTH environment files:
   - ✅ `postman-environment-dev.json`
   - ✅ `postman-environment-prod.json`
3. Click **"Open"**

**What gets imported automatically:**
- ✅ All 31 variables (DEV) or 16 variables (PROD)
- ✅ All variable names, types, and descriptions
- ✅ Default values (like BASE_URL, POSTHOG_HOST)
- ⏭️ Secret fields will be empty (you'll fill these in step 8)

```
File Picker Dialog:
┌──────────────────────────────────────────┐
│  📁 workspace/                           │
├──────────────────────────────────────────┤
│  ☑️ postman-environment-dev.json         │
│  ☑️ postman-environment-prod.json        │
│  ☐ other-files.json                      │
├──────────────────────────────────────────┤
│            [Cancel]  [Open]              │
└──────────────────────────────────────────┘
```

#### Step 5: Confirm Import

1. Postman will show a preview of what will be imported
2. You'll see both environments listed
3. Click **"Import"** button to confirm

```
┌──────────────────────────────────────────┐
│  Confirm Import                    ✕     │
├──────────────────────────────────────────┤
│  ✓ Ascended Social - DEV (localhost)     │
│    31 variables                          │
│                                          │
│  ✓ Ascended Social - PROD (live)         │
│    16 variables                          │
│                                          │
│            [Cancel]  [Import]            │
└──────────────────────────────────────────┘
```

---

### Part 2: Inject Your Secrets

#### Step 6: Open DEV Environment for Editing

1. Back in the **Environments** section
2. Find **"Ascended Social - DEV (localhost)"**
3. Click on the environment name to open it

```
┌────────────────────────────────────────────────┐
│  Environments                                  │
├────────────────────────────────────────────────┤
│  📂 My Workspace                               │
│     📄 Ascended Social - DEV (localhost)  ← Click │
│     📄 Ascended Social - PROD (live)           │
└────────────────────────────────────────────────┘
```

#### Step 7: Understanding the Variable Table

You'll now see a table with columns:

```
┌────────────────────────────────────────────────────────────────────┐
│  Ascended Social - DEV (localhost)                    [Save] [✕]   │
├────────────────────────────────────────────────────────────────────┤
│  VARIABLE          | TYPE    | INITIAL VALUE | CURRENT VALUE       │
├────────────────────────────────────────────────────────────────────┤
│  BASE_URL          | default | localhost...  | localhost:5000      │
│  DATABASE_URL      | secret  |               | [empty - fill this] │
│  SESSION_SECRET    | secret  |               | [empty - fill this] │
│  OPENAI_API_KEY    | secret  |               | [empty - fill this] │
└────────────────────────────────────────────────────────────────────┘
```

**Important Understanding:**
- **INITIAL VALUE** = Shared with team (synced to Postman cloud)
- **CURRENT VALUE** = Local only (stays on your computer)
- **⚠️ ALWAYS put secrets in CURRENT VALUE, never INITIAL VALUE**

#### Step 8: Fill in Database URL

1. Locate the **`DATABASE_URL`** row
2. Click in the **CURRENT VALUE** column for that row
3. Paste your database connection string from Replit

**Where to find it:**
```
Replit Workspace → Database Tab → Connection String
Example: postgresql://username:password@host:5432/database
```

**In Postman:**
```
┌────────────────────────────────────────────────────────────────────┐
│  VARIABLE          | TYPE    | INITIAL VALUE | CURRENT VALUE       │
├────────────────────────────────────────────────────────────────────┤
│  DATABASE_URL      | secret  |               | postgresql://...    │← Paste here
└────────────────────────────────────────────────────────────────────┘
```

#### Step 9: Fill in Session Secret

1. Locate the **`SESSION_SECRET`** row
2. Click in the **CURRENT VALUE** column

**Generate a secure secret:**
```bash
# Option 1: In your terminal
openssl rand -hex 32

# Option 2: From Replit Secrets
# Go to Replit Secrets tab → Find SESSION_SECRET → Copy value
```

3. Paste the generated secret into **CURRENT VALUE**

```
┌────────────────────────────────────────────────────────────────────┐
│  SESSION_SECRET    | secret  |               | abc123def456...     │← Paste here
└────────────────────────────────────────────────────────────────────┘
```

#### Step 10: Fill in OpenAI API Key

1. Locate the **`OPENAI_API_KEY`** row
2. Click in the **CURRENT VALUE** column

**Where to find it:**
```
1. Go to: https://platform.openai.com/api-keys
2. Sign in to your OpenAI account
3. Click "Create new secret key"
4. Copy the key (starts with sk-...)
5. Store it somewhere safe - you can only see it once!
```

3. Paste your OpenAI key into **CURRENT VALUE**

```
┌────────────────────────────────────────────────────────────────────┐
│  OPENAI_API_KEY    | secret  |               | sk-proj-...         │← Paste here
└────────────────────────────────────────────────────────────────────┘
```

#### Step 11: Fill in PostHog API Token

1. Locate the **`POSTHOG_API_TOKEN`** row
2. Click in the **CURRENT VALUE** column

**Where to find it:**
```
1. Go to: https://app.posthog.com/settings/project
2. Sign in to PostHog
3. Go to Project Settings → API Keys
4. Copy your "Project API Key" (starts with phc_...)
```

3. Paste into **CURRENT VALUE**

```
┌────────────────────────────────────────────────────────────────────┐
│  POSTHOG_API_TOKEN | secret  |               | phc_...             │← Paste here
└────────────────────────────────────────────────────────────────────┘
```

#### Step 12: Fill in Additional Secrets (Optional)

Continue filling in any other secrets you need:

| Variable | Where to Get | Required? |
|----------|--------------|-----------|
| `AUTH_TOKEN` | After login - see step 15 | For authenticated requests |
| `ADMIN_TOKEN` | Same as AUTH_TOKEN | For admin endpoints |
| `BUILDER_API_KEY` | builder.io/account | For CMS features |
| `FIGMA_ACCESS_TOKEN` | figma.com/settings | For design sync |
| `NOTION_INTEGRATION_SECRET` | notion.so/my-integrations | For content sync |
| `SENTRY_DSN` | sentry.io/settings | For error tracking |
| `CLOUDFLARE_API_TOKEN` | dash.cloudflare.com | For CDN/D1 |

**Tip:** Scroll down in the variable table to see all 31 variables

#### Step 13: Save Your Changes

1. After filling in all your secrets, look at the **top right**
2. Click the **"Save"** button (or Ctrl+S / Cmd+S)
3. You should see a confirmation toast: "Environment saved"

```
┌────────────────────────────────────────────────────────────────────┐
│  Ascended Social - DEV (localhost)    💾[Save]  [Reset]  [✕]      │← Click Save
├────────────────────────────────────────────────────────────────────┤
│  (Your variables table)                                            │
└────────────────────────────────────────────────────────────────────┘
```

**Important:** Changes are NOT saved automatically - you MUST click Save!

---

### Part 3: Repeat for Production Environment

#### Step 14: Open PROD Environment

1. Go back to **Environments** sidebar
2. Click on **"Ascended Social - PROD (live)"**
3. **Use DIFFERENT secrets than DEV!** (different database, API keys, etc.)
4. Fill in the **CURRENT VALUE** column for all secrets
5. Click **Save**

**⚠️ Production Security Reminders:**
- Use separate database (not your dev database!)
- Use production API keys (not test keys)
- Never share production secrets
- Be extra careful when testing

---

### Part 4: Activate and Use Your Environment

#### Step 15: Select Active Environment

1. Look at the **top right corner** of Postman
2. You'll see a dropdown that says "No Environment" or an environment name
3. Click the dropdown
4. Select **"Ascended Social - DEV (localhost)"**

```
┌────────────────────────────────────────────────────────────────────┐
│  Postman                          [No Environment ▼]  👤           │
├────────────────────────────────────────────────────────────────────┤
│                                                                    │
│  Dropdown menu:                                                    │
│  ┌──────────────────────────────────┐                            │
│  │ Select Environment               │                            │
│  ├──────────────────────────────────┤                            │
│  │ ✓ Ascended Social - DEV (localhost) ← Select this            │
│  │   Ascended Social - PROD (live)  │                            │
│  │ ─────────────────────────────────│                            │
│  │ No Environment                   │                            │
│  └──────────────────────────────────┘                            │
└────────────────────────────────────────────────────────────────────┘
```

#### Step 16: Test Your Environment Variables

1. Create a new request or open an existing one
2. In the URL field, type: `{{BASE_URL}}/api/auth/user`
3. Notice how `{{BASE_URL}}` turns orange/highlighted (variable detected!)
4. Hover over it to see the resolved value: `http://localhost:5000`

```
┌────────────────────────────────────────────────────────────────────┐
│  GET  {{BASE_URL}}/api/auth/user                        [Send]    │
│        ↑ turns orange - variable is working!                       │
└────────────────────────────────────────────────────────────────────┘
```

#### Step 17: View All Active Variables (Quick Reference)

1. Click the **"eye" icon** 👁️ next to the environment dropdown
2. A sidebar will show all variables and their current values
3. Secrets will show as ***** (masked)
4. This is useful for checking what's active without opening the editor

```
┌────────────────────────────────────────────────────────────────────┐
│  Postman              [Ascended Social - DEV ▼] 👁️ ← Click eye    │
├────────────────────────────────────────────────────────────────────┤
│  Quick Look Sidebar:                                               │
│  ┌──────────────────────────────────┐                             │
│  │ Ascended Social - DEV            │                             │
│  ├──────────────────────────────────┤                             │
│  │ BASE_URL: http://localhost:5000  │                             │
│  │ DATABASE_URL: *********          │ ← Secrets are masked        │
│  │ SESSION_SECRET: *********        │                             │
│  │ OPENAI_API_KEY: *********        │                             │
│  │ ...                              │                             │
│  └──────────────────────────────────┘                             │
└────────────────────────────────────────────────────────────────────┘
```

---

### Part 5: Getting AUTH_TOKEN for API Testing

#### Step 18: Login to Get AUTH_TOKEN

**Method 1: Using Browser DevTools**

1. Open your Ascended Social app in browser: `http://localhost:5000`
2. Login with your test account
3. Open DevTools (F12 or Right-click → Inspect)
4. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
5. Look in **Cookies** or **Local Storage**
6. Find the session token or JWT
7. Copy the token value

**Method 2: Using Postman Request**

1. In Postman, create a new request
2. Set method to **POST**
3. URL: `{{BASE_URL}}/api/auth/login`
4. Go to **Body** tab → Select **raw** → Select **JSON**
5. Add this body:
```json
{
  "email": "your-email@example.com",
  "password": "your-password"
}
```
6. Click **Send**
7. Look at the response - find the `token` field
8. Copy the token value

#### Step 19: Save AUTH_TOKEN to Environment

1. After getting your token from Step 18
2. Go back to **Environments** → Open **Ascended Social - DEV**
3. Find the **`AUTH_TOKEN`** row
4. Paste your token into **CURRENT VALUE**
5. Click **Save**

```
┌────────────────────────────────────────────────────────────────────┐
│  AUTH_TOKEN        | secret  |               | eyJhbGc.iOiJIUz...  │← Paste token
└────────────────────────────────────────────────────────────────────┘
```

#### Step 20: Use AUTH_TOKEN in Requests

Now you can use `{{AUTH_TOKEN}}` in any request that requires authentication:

1. Open your API request
2. Go to **Headers** tab
3. Add a header:
   - Key: `Authorization`
   - Value: `Bearer {{AUTH_TOKEN}}`

```
┌────────────────────────────────────────────────────────────────────┐
│  Headers                                           [Bulk Edit]     │
├────────────────────────────────────────────────────────────────────┤
│  KEY               | VALUE                         | DESCRIPTION   │
├────────────────────────────────────────────────────────────────────┤
│  Authorization     | Bearer {{AUTH_TOKEN}}         | Auth header   │
│  Content-Type      | application/json              |               │
└────────────────────────────────────────────────────────────────────┘
```

Or use the **Authorization** tab:
1. Click **Authorization** tab
2. Type: Select **Bearer Token**
3. Token: Enter `{{AUTH_TOKEN}}`

```
┌────────────────────────────────────────────────────────────────────┐
│  Authorization                                                     │
├────────────────────────────────────────────────────────────────────┤
│  Type: [Bearer Token ▼]                                           │
│                                                                    │
│  Token: {{AUTH_TOKEN}}                                            │
└────────────────────────────────────────────────────────────────────┘
```

---

## ✅ Verification Checklist

After completing all steps, verify:

- [ ] Both environments imported (DEV and PROD)
- [ ] DEV environment has all secrets filled in CURRENT VALUE
- [ ] Clicked Save after adding secrets
- [ ] DEV environment is selected (top right dropdown)
- [ ] Can see `{{BASE_URL}}` resolve when typed in request URL
- [ ] AUTH_TOKEN obtained and saved
- [ ] Test request works with environment variables

---

## 🔒 Security Best Practices

### ✅ DO:
- Store secrets in **CURRENT VALUE** (local only)
- Use different secrets for DEV vs PROD
- Keep production environment extremely secure
- Regenerate secrets if accidentally exposed
- Use the "eye" icon to verify which environment is active

### ❌ DON'T:
- Put secrets in **INITIAL VALUE** (syncs to cloud!)
- Share your personal environment files
- Commit filled environment files to git
- Use production secrets in development
- Share screenshots with visible secrets

---

## 🐛 Troubleshooting

### "Variable not resolving" / Shows `{{VAR_NAME}}` in red

**Fix:**
1. Check environment is selected (top right dropdown)
2. Verify variable name matches exactly (case-sensitive)
3. Make sure you clicked Save after editing
4. Try closing and reopening Postman

### "Unauthorized" error when using AUTH_TOKEN

**Fix:**
1. Token may have expired - get a new one
2. Check you pasted the full token (no spaces)
3. Verify you're using `Bearer {{AUTH_TOKEN}}` format
4. Make sure you're logged in to the app

### Secret values showing as empty in "Quick Look"

**Fix:**
- This is normal! Secrets are masked as ***** for security
- They're still there and working
- To verify, edit the environment and check CURRENT VALUE

### Changes not saving

**Fix:**
1. Make sure you clicked the **Save** button
2. Check for save confirmation toast
3. Try Ctrl+S (Windows) or Cmd+S (Mac)
4. If still failing, try restarting Postman

### Can't see environment dropdown

**Fix:**
- You might be in a Collection request
- Look for environment dropdown at top right
- Make sure you're in a workspace that has environments

---

## 📚 What's Next?

Now that your environments are set up:

1. **Import the API Collection**: Import `docs/integrations/postman-posthog-collection.json`
2. **Test EndPoints**: Try the pre-configured PostHog analytics requests  
3. **Create Your Own**: Add more requests for other Ascended Social endpoints
4. **Automate**: Use Postman collection runner or Newman for CI/CD
5. **Read MCP Guide**: See `POSTMAN_MCP_GUIDE.md` for programmatic access

---

## 🎉 You're All Set!

You now have fully configured Postman environments with your secrets securely injected. Start testing the Ascended Social spiritual platform API! 🚀✨

Need help? Check:
- [POSTMAN_SETUP.md](./POSTMAN_SETUP.md) - Complete reference
- [POSTMAN_MCP_GUIDE.md](./POSTMAN_MCP_GUIDE.md) - Programmatic usage
- [Postman Learning Center](https://learning.postman.com/)
