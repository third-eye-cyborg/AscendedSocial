# PostHog Integration Documentation

This directory contains comprehensive documentation for integrating PostHog analytics with Ascended Social, including ClickUp project management and Postman API testing.

## 📚 Documentation Files

### [PostHog + ClickUp + Postman Integration Guide](./posthog-clickup-postman-integration.md)
**Complete integration guide covering:**
- PostHog setup and configuration
- ClickUp integration for analytics task management
- Postman API testing for PostHog endpoints
- Event tracking schema for spiritual platform features
- Privacy and compliance implementation
- Troubleshooting common issues
- MCP integration examples

**Use this for:** Understanding the full integration architecture and workflow

---

### [PostHog Environment Setup](./posthog-environment-setup.md)
**Detailed environment variable configuration:**
- Required PostHog API keys
- Replit Secrets setup instructions
- Local development configuration
- Environment variable verification
- Security best practices
- Troubleshooting environment issues

**Use this for:** Setting up PostHog credentials and environment

---

### [Postman Collection](./postman-posthog-collection.json)
**Importable Postman collection featuring:**
- Event tracking endpoints (spiritual posts, oracle readings, energy sharing)
- PostHog API query endpoints
- User identification with spiritual properties
- Pre-configured variables and auth
- Test scripts for validation

**Use this for:** Testing PostHog API integration with Postman

---

## 🚀 Quick Start Guide

### 1. Configure Environment Variables

Follow [PostHog Environment Setup](./posthog-environment-setup.md) to add these to Replit Secrets:

```bash
POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
POSTHOG_HOST=https://app.posthog.com
VITE_POSTHOG_API_KEY=phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB
VITE_POSTHOG_HOST=https://app.posthog.com
```

### 2. Verify PostHog Integration

```bash
# Start dev server
npm run dev

# Check browser console for:
# ✅ PostHog client analytics initialized with privacy protection

# Check server console for:
# ✅ PostHog server analytics initialized
```

### 3. Import Postman Collection

**Option A: Import from file**
1. Open Postman
2. Click "Import" button
3. Select [postman-posthog-collection.json](./postman-posthog-collection.json)
4. Collection imported to workspace: "Ascended Social - Consent System"

**Option B: Manual import**
1. Copy the JSON from [postman-posthog-collection.json](./postman-posthog-collection.json)
2. Postman → Import → Raw Text
3. Paste JSON and click "Continue"

### 4. Test PostHog Events

In Postman:
1. Select "PostHog Analytics - Ascended Social" collection
2. Open "Event Tracking" folder
3. Run "Track Spiritual Post Created"
4. Verify in PostHog dashboard: https://app.posthog.com/project/122488/events

### 5. Create ClickUp Tasks for Analytics

Use ClickUp to track analytics implementation:
- **Workspace:** Team Space (90172999754)
- **List:** Backend Development (901710283478)
- **Task Template:** See [integration guide](./posthog-clickup-postman-integration.md#1-tracking-analytics-tasks)

---

## 🎯 PostHog Project Information

- **Project Name:** Ascended Social
- **Project ID:** 122488
- **Organization:** Third Eye Cyborg (0194b522-eca9-0000-1bd4-87f3c600a8d4)
- **API Token:** `phc_69GDi6zFcLWK7zOrZ3kf4uBSKYLvB5ZVChi1advEFIB`
- **Dashboard:** https://app.posthog.com/project/122488

---

## 📊 Event Tracking Examples

### Spiritual Post Creation
```javascript
posthog.capture('spiritual_post_created', {
  chakra_type: 'heart',
  energy_spent: 5,
  has_image: true,
  word_count: 150,
  spiritual_frequency: 8.5
});
```

### Oracle Reading Generation
```javascript
posthog.capture('oracle_reading_generated', {
  reading_type: 'daily',
  chakra_focus: 'third_eye',
  cards_drawn: 3,
  reading_length: 'detailed'
});
```

### Energy Sharing
```javascript
posthog.capture('energy_shared', {
  from_user: userId,
  to_post: postId,
  energy_amount: 10,
  user_energy_remaining: 35
});
```

See [Event Tracking Schema](./posthog-clickup-postman-integration.md#event-tracking-schema) for complete event documentation.

---

## 🔗 Integration Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Ascended Social                          │
│  ┌──────────────┐    ┌──────────────┐    ┌──────────────┐ │
│  │   Frontend   │───▶│   PostHog    │◀───│   Backend    │ │
│  │  (React +    │    │  Analytics   │    │  (Express +  │ │
│  │   Vite)      │    │              │    │   Node.js)   │ │
│  └──────────────┘    └───────┬──────┘    └──────────────┘ │
└────────────────────────────┬─│─────────────────────────────┘
                             │ │
              ┌──────────────┘ └──────────────┐
              ▼                                ▼
    ┌─────────────────┐              ┌─────────────────┐
    │     ClickUp     │              │    Postman      │
    │ Project Tracking│              │  API Testing    │
    │  & Task Mgmt    │              │  & Monitoring   │
    └─────────────────┘              └─────────────────┘
```

---

## 🔐 Privacy & Compliance

PostHog integration follows strict privacy guidelines:

✅ **Implemented:**
- Opt-out by default (requires user consent)
- Do Not Track (DNT) respected
- IP address anonymization
- PII data sanitization
- Session recording with masking
- GDPR-compliant data retention
- Cookie consent integration

🔒 **Data Protection:**
- Email addresses never tracked
- Passwords always masked
- Sensitive inputs blocked
- Personal data sanitized
- EU data residency compliance

See [Privacy & Compliance](./posthog-clickup-postman-integration.md#privacy--compliance) for details.

---

## 🛠️ Using MCPs (Model Context Protocol)

### PostHog MCP

```bash
# Get projects
mcp_posthog_projects-get

# Switch to Ascended Social project
mcp_posthog_switch-project --projectId 122488

# Get all insights
mcp_posthog_insights-get-all --data '{"favorited": true}'

# Query logs
mcp_posthog_logs-query --dateFrom "2026-02-01T00:00:00Z" --dateTo "2026-02-08T23:59:59Z"
```

### ClickUp MCP

```bash
# Get workspace hierarchy
mcp_clickup_get_workspace_hierarchy

# Find team member
mcp_clickup_find_member_by_name --name_or_email "main@thirdeyecyborg.com"
```

### Postman MCP

```bash
# Get authenticated user
mcp_postman_getAuthenticatedUser

# Get workspaces
mcp_postman_getWorkspaces --createdBy 49956946

# Get collections
mcp_postman_getCollections --workspace "78a326aa-4c1a-4905-a5c0-0d56b4533018"
```

---

## 📖 Related Documentation

### Ascended Social Docs
- [Analytics Client Library](../../client/src/lib/analytics.ts)
- [Analytics Server Service](../../server/analytics.ts)
- [Consent Management](../../client/src/lib/consent.ts)
- [Privacy Policy](../legal/privacy-policy.md)

### External Links
- [PostHog Documentation](https://posthog.com/docs)
- [PostHog API Reference](https://posthog.com/docs/api)
- [ClickUp API Docs](https://clickup.com/api)
- [Postman Learning Center](https://learning.postman.com/)

---

## 🐛 Troubleshooting

### Common Issues

**PostHog not initializing:**
- Check environment variables are set
- Verify API key format (starts with `phc_`)
- Restart dev server after env changes

**Events not appearing:**
- Check user consent is granted
- Verify no ad blockers
- Check browser console for errors
- Verify API key is correct

**Authentication failures:**
- Verify API key in PostHog dashboard
- Check if key is for correct project
- Regenerate key if compromised

See [Troubleshooting Guide](./posthog-clickup-postman-integration.md#troubleshooting) for detailed solutions.

---

## 💡 Best Practices

### Event Naming
```
✅ spiritual_post_created
✅ user_chakra_aligned
✅ oracle_reading_generated

❌ postCreated
❌ userDidSomething
❌ event_1
```

### Property Structure
```typescript
{
  event: string,
  distinct_id: string,
  chakra_type: ChakraType,
  energy_level: number,
  timestamp: ISO8601
}
```

### Testing Workflow
1. Write code with PostHog event
2. Create ClickUp task for tracking
3. Add Postman test
4. Run test and verify in PostHog
5. Mark ClickUp task complete
6. Document in README

---

## 📞 Support

**Technical Support:**
- Email: main@thirdeyecyborg.com
- Create task in ClickUp "Testing & QA" list
- PostHog Dashboard: https://app.posthog.com/project/122488

**Team:**
- **Owner:** Dan Root (Third Eye Cyborg LLC)
- **Team ID:** 11452547
- **Email:** main@thirdeyecyborg.com

---

## 🎉 Summary

This integration provides:
- ✅ PostHog analytics fully configured
- ✅ Privacy-first implementation
- ✅ ClickUp task management integration
- ✅ Postman API testing collection
- ✅ Comprehensive documentation
- ✅ MCP support for all tools
- ✅ Environment setup guide
- ✅ Troubleshooting resources

**Next Steps:**
1. Configure environment variables
2. Import Postman collection
3. Create ClickUp tasks for analytics
4. Start tracking spiritual events
5. Monitor PostHog dashboard

---

*Last Updated: February 8, 2026*  
*Version: 1.0.0*  
*Owner: Third Eye Cyborg LLC*  
*Project: Ascended Social*
