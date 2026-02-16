# How to Delete Archived Workspaces in Postman UI
## Complete Step-by-Step Instructions

**Goal**: Remove the 6 archived workspaces so only 4 core workspaces remain visible  
**Time Required**: 5-10 minutes  
**Difficulty**: Easy

---

## Workspaces to Delete

These 6 workspaces need to be deleted from Postman:

1. `[ARCHIVED] Dan Root's Workspace`
2. `[ARCHIVED] Default Workspace`
3. `[ARCHIVED] Expertit Website Integration`
4. `[ARCHIVED] Ascended Social - Marketing Separation`
5. `[ARCHIVED] Ascended Social - Consent System`
6. `[ARCHIVED] Ascended Social - Auth & Mobile Integration`

---

## Step-by-Step: Delete Each Workspace

### **For Each Archived Workspace, Follow These Steps:**

#### **Step 1: Open Postman**
- Go to https://app.postman.com
- Log in as `danjroot`

#### **Step 2: Access Workspace Dropdown Menu**
- Look at the **top-left corner** of Postman
- You'll see your current workspace name (e.g., "Ascended Social")
- Click the **dropdown arrow** next to it OR click "Workspaces" in the sidebar

#### **Step 3: Find the Archived Workspace to Delete**
- In the workspace list, find `[ARCHIVED] Dan Root's Workspace`
- Look for a **three-dot menu icon** (⋯) or **gear icon** next to the workspace name
- **Hover over the workspace name** to reveal options if not visible

#### **Step 4: Open Workspace Settings/Options**
- Click the **three dots (⋯)** or **gear icon** next to the archived workspace
- A dropdown menu should appear with options like:
  - Settings
  - Members
  - Edit
  - Delete
  - Remove from sidebar
  - Archive
  - Leave workspace

#### **Step 5: Click "Delete" or "Remove"**
- If you see **"Delete"** → Click it
- If you see **"Leave"** or **"Remove from workspace"** → Click it
- If you see **"Settings"** → Click it first, then look for a Delete button inside

#### **Step 6: Confirm Deletion**
- Postman will ask: **"Are you sure you want to delete this workspace?"**
- Click **"Yes, delete"** or **"Confirm"** to complete

#### **Step 7: Workspace Deleted**
- The workspace will be removed from your list
- Move to the next archived workspace and repeat

---

## Alternative Method: Via Workspace Settings

If the delete option isn't visible in the dropdown:

#### **Step 1: Enter the Workspace**
- Click on `[ARCHIVED] Dan Root's Workspace` to enter it

#### **Step 2: Open Workspace Settings**
- Click the **gear icon** (⚙️) in the top-right area of Postman
- Look for **"Settings"** or **"Workspace Settings"**
- Click it

#### **Step 3: Find Delete Option**
- In the Settings panel, look for:
  - "Delete workspace"
  - "Remove workspace"
  - "Danger zone" section (usually at bottom)

#### **Step 4: Click Delete**
- Click the **"Delete"** button in the danger zone
- Confirm when prompted

#### **Step 5: You're Back to Dashboard**
- Postman automatically returns you to remaining workspaces
- The deleted workspace is gone

---

## Visual Guide: Where to Find Delete Options

### **Method A: Workspace List Dropdown**
```
Postman Menu Bar
│
├─ [Current Workspace Name] ▼
│  │
│  └─ Click dropdown to see list
│     │
│     ├─ Ascended Social
│     ├─ Techead
│     ├─ Expertit
│     ├─ Flaresmith
│     ├─ [ARCHIVED] Dan Root's Workspace ← HOVER HERE
│     │  │
│     │  └─ ⋯ (three dots appear) ← CLICK THIS
│     │     │
│     │     ├─ Settings
│     │     ├─ Members
│     │     ├─ Delete ← CLICK HERE
│     │     └─ Leave
```

### **Method B: Via Sidebar**
```
Left Sidebar
│
├─ Workspaces
│  │
│  ├─ Ascended Social
│  ├─ Techead
│  ├─ Expertit
│  ├─ Flaresmith
│  └─ [ARCHIVED] Dan Root's Workspace
│     │
│     └─ ⋯ (hover to show) ← CLICK THIS
│        │
│        └─ Delete ← CLICK HERE
```

---

## Exact Order to Delete (Recommended)

Delete in this order to avoid confusion:

1. **First**: `[ARCHIVED] Dan Root's Workspace` ← Empty, safe to delete
2. **Second**: `[ARCHIVED] Default Workspace` ← Empty, safe to delete
3. **Third**: `[ARCHIVED] Expertit Website Integration` ← Empty, safe to delete
4. **Fourth**: `[ARCHIVED] Ascended Social - Marketing Separation` ← Empty, safe to delete
5. **Fifth**: `[ARCHIVED] Ascended Social - Consent System` ← Empty, safe to delete
6. **Sixth**: `[ARCHIVED] Ascended Social - Auth & Mobile Integration` ← Empty, safe to delete

---

## What Deletion Looks Like (Screenshots)

### **Before Deletion**
```
Workspaces:
├─ Ascended Social (6 collections)
├─ Techead (2 collections)
├─ Expertit (1 collection)
├─ Flaresmith (0 collections)
├─ [ARCHIVED] Dan Root's Workspace ← TO DELETE
├─ [ARCHIVED] Default Workspace ← TO DELETE
├─ [ARCHIVED] Expertit Website Integration ← TO DELETE
├─ [ARCHIVED] Ascended Social - Marketing Separation ← TO DELETE
├─ [ARCHIVED] Ascended Social - Consent System ← TO DELETE
└─ [ARCHIVED] Ascended Social - Auth & Mobile Integration ← TO DELETE
```

### **After Deletion (Your Goal)**
```
Workspaces:
├─ Ascended Social (6 collections) ✅
├─ Techead (2 collections) ✅
├─ Expertit (1 collection) ✅
└─ Flaresmith (0 collections) ✅
```

---

## Troubleshooting

### **Problem: Can't find delete button**

**Solution A**: Click the three dots carefully
- Some Postman versions require hovering first
- If no menu appears, try right-clicking on workspace name

**Solution B**: Enter the workspace, then delete from inside
- Click workspace name to enter it
- Click ⚙️ Settings (top right)
- Look for "Delete Workspace" button
- This method always works

**Solution C**: Use different browser
- Try Chrome if using Firefox
- Try Firefox if using Chrome
- Some browser versions display menus differently

### **Problem: "Cannot delete" message appears**

**Possible Reasons**:
1. You don't own the workspace (only owner can delete)
2. Workspace still has collections/environments
3. Other team members are in workspace

**Solution**:
- Check if you're the workspace owner (should be - user ID 49956946)
- Try deleting all collections first (shouldn't matter for empty ones)
- If shared with team, remove team members first
- Contact Postman support if still stuck

### **Problem: Delete option doesn't appear at all**

**Try This**:
1. Enter the workspace
2. Click three dots (⋯) in top-right corner
3. Look for "Workspace Settings"
4. Inside settings, scroll down to "Danger Zone"
5. Click "Delete this workspace"

---

## Quick Checklist: Delete All 6

After deleting each workspace, check it off:

- [ ] Deleted: `[ARCHIVED] Dan Root's Workspace`
- [ ] Deleted: `[ARCHIVED] Default Workspace`
- [ ] Deleted: `[ARCHIVED] Expertit Website Integration`
- [ ] Deleted: `[ARCHIVED] Ascended Social - Marketing Separation`
- [ ] Deleted: `[ARCHIVED] Ascended Social - Consent System`
- [ ] Deleted: `[ARCHIVED] Ascended Social - Auth & Mobile Integration`

**Final Check**: Only these 4 workspaces should remain visible:
- ✅ Ascended Social
- ✅ Techead
- ✅ Expertit
- ✅ Flaresmith

---

## After Deletion: What's Next?

Once all 6 archived workspaces are deleted, your Postman will be clean with only:

```
📱 Ascended Social
   ├── 📱 Ascended Social - Authentication - Mobile Gateway
   ├── 📱 Ascended Social - User Profiles - REST API
   ├── 📱 Ascended Social - Content & Feed - REST API
   ├── 📱 Ascended Social - Spiritual Features - REST API
   └── 📱 Ascended Social - Notifications & Media - REST API

🏗️ Techead
   └── 🏗️ Techead - Privacy & Compliance - REST API

💼 Expertit
   └── 💼 Expertit - Marketing & Partner APIs - REST API

⚒️ Flaresmith
   └── (Empty - ready for new collections)
```

Then follow: **POSTMAN_QUICK_IMPLEMENTATION_GUIDE.md Week 1**

---

## Video Alternative (If Stuck)

If you get stuck, you can also:
1. Search YouTube: "How to delete Postman workspace"
2. Go to: https://learning.postman.com/docs/collaborating-in-postman/using-workspaces/managing-workspaces/
3. Contact Postman Support: support@postman.com

---

**Guide Status**: Ready to execute  
**Time to Complete**: ~5-10 minutes  
**Difficulty**: Easy  
**Support**: This doc + Postman UI help icons
