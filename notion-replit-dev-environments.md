# Replit Development Environments - Notion Documentation

## 📚 Table of Contents
1. [Development Environment Setup](#development-environment-setup)
2. [Resource Isolation Strategy](#resource-isolation-strategy)
3. [Sync Instructions](#sync-instructions)
4. [Mobile App Environment Setup](#mobile-app-environment-setup)
5. [Merge & Deployment Workflows](#merge--deployment-workflows)
6. [Environment Management](#environment-management)

---

## 🔧 Development Environment Setup

### Overview
Create completely isolated development environments that mirror production setups while maintaining separation of concerns, resources, and data.

### Prerequisites Checklist
- [ ] Access to original production Replit
- [ ] Team permissions for creating new Replit Apps
- [ ] Notion API access configured
- [ ] Development team member assignments

### Step-by-Step Setup

#### 1. Create New Replit App
1. **Fork/Duplicate Production Replit**
   - Navigate to production Replit
   - Click "Fork" or create new Replit from template
   - Name convention: `[project-name]-dev` or `[project-name]-staging`

2. **Initial Configuration**
   - Set environment type in `.env` or secrets
   - Configure development-specific settings
   - Verify all dependencies are installed

#### 2. Database Isolation Setup

##### PostgreSQL Database
```bash
# Each environment gets its own database
# Development: [project]-dev-db
# Staging: [project]-staging-db  
# Production: [project]-prod-db
```

**Configuration Steps:**
1. Create new PostgreSQL database in Replit
2. Configure connection variables:
   - `DATABASE_URL`
   - `PGHOST`
   - `PGUSER` 
   - `PGPASSWORD`
   - `PGDATABASE`
3. Run migration scripts to replicate schema
4. Import development-safe data (no production data)

##### Key-Value Store (ReplDB)
- **Automatic Isolation**: Each Replit App has isolated ReplDB
- **No additional setup required**
- **Access via**: `REPLIT_DB_URL` environment variable

#### 3. Authentication Isolation

##### Replit Auth Setup
1. **Configure Separate Auth Instance**
   ```javascript
   // Development configuration
   const authConfig = {
     environment: 'development',
     redirectURI: 'https://[dev-repl-url]/auth/callback',
     clientId: process.env.DEV_AUTH_CLIENT_ID
   };
   ```

2. **Environment-Specific Secrets**
   - `DEV_AUTH_CLIENT_ID`
   - `DEV_AUTH_CLIENT_SECRET` 
   - `STAGING_AUTH_CLIENT_ID`
   - `STAGING_AUTH_CLIENT_SECRET`
   - `PROD_AUTH_CLIENT_ID`
   - `PROD_AUTH_CLIENT_SECRET`

3. **Login Page Customization**
   - Development: "[App Name] - Dev"
   - Staging: "[App Name] - Staging"
   - Production: "[App Name]"

#### 4. Storage Isolation

##### App Storage (Object Storage)
1. **Create Environment-Specific Buckets**
   - Development: `[project]-dev-storage`
   - Staging: `[project]-staging-storage`
   - Production: `[project]-prod-storage`

2. **Configure Access**
   ```javascript
   // Environment-specific storage configuration
   const storageConfig = {
     bucketName: process.env.STORAGE_BUCKET_NAME,
     region: process.env.STORAGE_REGION,
     credentials: {
       accessKey: process.env.STORAGE_ACCESS_KEY,
       secretKey: process.env.STORAGE_SECRET_KEY
     }
   };
   ```

3. **Storage Secrets Setup**
   - `DEV_STORAGE_BUCKET_NAME`
   - `DEV_STORAGE_ACCESS_KEY`
   - `DEV_STORAGE_SECRET_KEY`
   - (Repeat for staging/production)

---

## 🔐 Resource Isolation Strategy

### Environment Separation Matrix

| Resource | Development | Staging | Production |
|----------|-------------|---------|------------|
| **Replit App** | `project-dev` | `project-staging` | `project-prod` |
| **Database** | `project-dev-db` | `project-staging-db` | `project-prod-db` |
| **Auth Instance** | Dev OAuth Client | Staging OAuth Client | Prod OAuth Client |
| **Object Storage** | `project-dev-storage` | `project-staging-storage` | `project-prod-storage` |
| **ReplDB** | Auto-isolated | Auto-isolated | Auto-isolated |
| **Secrets** | `DEV_*` prefix | `STAGING_*` prefix | `PROD_*` prefix |

### Secrets Management

#### Environment Variable Naming Convention
```bash
# Development
DEV_DATABASE_URL=postgresql://...
DEV_AUTH_CLIENT_ID=dev_client_123
DEV_STORAGE_BUCKET=project-dev-storage
DEV_API_KEY=dev_api_key_456

# Staging  
STAGING_DATABASE_URL=postgresql://...
STAGING_AUTH_CLIENT_ID=staging_client_789
STAGING_STORAGE_BUCKET=project-staging-storage
STAGING_API_KEY=staging_api_key_012

# Production
PROD_DATABASE_URL=postgresql://...
PROD_AUTH_CLIENT_ID=prod_client_345
PROD_STORAGE_BUCKET=project-prod-storage
PROD_API_KEY=prod_api_key_678
```

#### Security Best Practices
1. **Never share secrets between environments**
2. **Use AES-256 encryption for all secrets**
3. **Implement least-privilege access**
4. **Regular secret rotation schedule**
5. **Audit trail for secret access**

---

## 🔄 Sync Instructions

### Initial Project Sync

#### 1. Code Synchronization
```bash
# Clone from production to development
git clone [production-repo-url]
cd project-name

# Create development branch
git checkout -b development
git checkout -b staging

# Push to development Replit
# (Use Replit Git integration or manual upload)
```

#### 2. Configuration Sync
1. **Copy project structure** (identical file organization)
2. **Update environment-specific configs**
3. **Install identical dependencies** (`package.json`, `requirements.txt`, etc.)
4. **Verify build processes work** in development

#### 3. Database Schema Sync
```sql
-- Export schema from production (structure only)
pg_dump --schema-only [prod-db] > schema.sql

-- Import to development database  
psql [dev-db] < schema.sql

-- Verify tables and relationships
\dt
\d+ [table_name]
```

#### 4. Storage Structure Sync
1. **Replicate bucket structure** (folders, permissions)
2. **Copy essential files** (no sensitive production data)
3. **Test upload/download functionality**
4. **Verify access controls**

### Ongoing Sync Process

#### Daily Sync Checklist
- [ ] Code changes pushed to appropriate branches
- [ ] Database migrations tested in development
- [ ] New secrets added to appropriate environments
- [ ] Storage configurations updated if needed
- [ ] Dependencies updated across environments

#### Weekly Sync Checklist  
- [ ] Development → Staging deployment test
- [ ] Staging → Production readiness review
- [ ] Secret rotation if scheduled
- [ ] Performance metrics comparison
- [ ] Security audit completion

---

## 📱 Mobile App Environment Setup

### React Native / Mobile Development

#### 1. Environment-Specific Configuration
```javascript
// config/environments.js
const environments = {
  development: {
    apiUrl: 'https://[dev-repl-url]/api',
    authClientId: process.env.DEV_AUTH_CLIENT_ID,
    storageUrl: 'https://[dev-storage-url]',
    socketUrl: 'wss://[dev-repl-url]/ws'
  },
  staging: {
    apiUrl: 'https://[staging-repl-url]/api', 
    authClientId: process.env.STAGING_AUTH_CLIENT_ID,
    storageUrl: 'https://[staging-storage-url]',
    socketUrl: 'wss://[staging-repl-url]/ws'
  },
  production: {
    apiUrl: 'https://[prod-repl-url]/api',
    authClientId: process.env.PROD_AUTH_CLIENT_ID,
    storageUrl: 'https://[prod-storage-url]', 
    socketUrl: 'wss://[prod-repl-url]/ws'
  }
};
```

#### 2. Mobile App Replit Setup
1. **Create separate mobile app Repls**
   - `[project]-mobile-dev`
   - `[project]-mobile-staging`  
   - `[project]-mobile-prod`

2. **Configure build environments**
   - Development: Debug builds, development APIs
   - Staging: Release builds, staging APIs
   - Production: Production builds, production APIs

#### 3. Backend API Sync
1. **Ensure API compatibility** across environments
2. **Version API endpoints** for mobile requirements
3. **Test mobile-specific endpoints** in each environment
4. **Validate push notification configs** per environment

### Mobile-Specific Secrets
```bash
# Mobile Development
DEV_MOBILE_AUTH_CLIENT_ID=mobile_dev_123
DEV_PUSH_NOTIFICATION_KEY=mobile_push_dev_456
DEV_DEEPLINK_SCHEME=myapp-dev://

# Mobile Staging
STAGING_MOBILE_AUTH_CLIENT_ID=mobile_staging_789
STAGING_PUSH_NOTIFICATION_KEY=mobile_push_staging_012
STAGING_DEEPLINK_SCHEME=myapp-staging://

# Mobile Production  
PROD_MOBILE_AUTH_CLIENT_ID=mobile_prod_345
PROD_PUSH_NOTIFICATION_KEY=mobile_push_prod_678
PROD_DEEPLINK_SCHEME=myapp://
```

---

## 🚀 Merge & Deployment Workflows

### Git Workflow Strategy

#### Branch Structure
```
main (production)
├── staging
│   ├── feature/user-auth-improvement
│   ├── feature/new-dashboard
│   └── bugfix/login-error-handling
└── development
    ├── feature/experimental-ui
    ├── feature/ai-integration
    └── hotfix/critical-security-patch
```

#### Merge Process Documentation

##### 1. Development → Staging Merge
**Prerequisites:**
- [ ] All development tests passing
- [ ] Code review completed
- [ ] Database migrations tested
- [ ] No breaking changes identified

**Process:**
1. **Create staging merge request**
   ```bash
   git checkout staging
   git pull origin staging
   git merge development
   ```

2. **Deploy to staging environment**
   - Trigger staging Replit deployment
   - Run migration scripts if needed
   - Update staging secrets if required

3. **Staging validation checklist**
   - [ ] Application loads correctly
   - [ ] Authentication works with staging auth
   - [ ] Database operations function properly  
   - [ ] Storage uploads/downloads work
   - [ ] API endpoints respond correctly
   - [ ] Mobile app connects successfully (if applicable)

4. **Stakeholder approval**
   - Product team review
   - QA team testing completion
   - Security review if needed
   - Performance metrics validation

##### 2. Staging → Production Merge
**Prerequisites:**
- [ ] Staging environment fully tested
- [ ] Security audit completed
- [ ] Performance benchmarks met
- [ ] Rollback plan prepared

**Process:**
1. **Production deployment preparation**
   ```bash
   git checkout main
   git pull origin main  
   git merge staging
   ```

2. **Pre-deployment checklist**
   - [ ] Production secrets verified
   - [ ] Database backup completed
   - [ ] CDN/cache invalidation planned
   - [ ] Monitoring alerts configured
   - [ ] Team availability confirmed

3. **Production deployment**
   - Deploy to production Replit
   - Monitor application health
   - Verify critical user paths
   - Monitor error rates and performance

4. **Post-deployment validation**
   - [ ] Production health checks pass
   - [ ] User authentication working
   - [ ] Payment processing functional (if applicable)
   - [ ] External integrations operational
   - [ ] Mobile app compatibility confirmed

### Rollback Procedures

#### Automatic Rollback Triggers
- Error rate > 5% for 5 minutes
- Response time > 2 seconds for 3 minutes  
- Authentication failure rate > 1%
- Database connection failures

#### Manual Rollback Process
1. **Immediate actions**
   ```bash
   # Revert to previous stable deployment
   git checkout [previous-stable-commit]
   # Deploy to production Replit
   # Restore database if needed
   ```

2. **Communication protocol**
   - Notify team in #incidents channel
   - Update status page
   - Prepare incident post-mortem
   - Schedule fix deployment

---

## 🎛️ Environment Management

### Daily Operations

#### Development Environment
- **Purpose**: Feature development, experimentation
- **Data**: Synthetic test data only
- **Updates**: Multiple times daily
- **Access**: Development team only
- **Monitoring**: Basic error tracking

#### Staging Environment  
- **Purpose**: Integration testing, QA validation
- **Data**: Production-like test data (sanitized)
- **Updates**: Daily or per feature completion
- **Access**: Development + QA + Product teams
- **Monitoring**: Full monitoring stack

#### Production Environment
- **Purpose**: Live user-facing application
- **Data**: Real user data
- **Updates**: Scheduled releases only
- **Access**: Senior developers + DevOps only
- **Monitoring**: Complete observability stack

### Monitoring & Alerts

#### Key Metrics per Environment
```yaml
Development:
  - Application startup time
  - Build success rate
  - Test suite execution time

Staging:  
  - API response times
  - Authentication success rate
  - Database query performance
  - Integration test results

Production:
  - User sign-up rate
  - Payment success rate  
  - Error rates by endpoint
  - System resource usage
  - Security incident detection
```

#### Alert Configuration
- **Development**: Slack notifications for build failures
- **Staging**: Email alerts for test failures  
- **Production**: Immediate PagerDuty alerts for critical issues

### Environment Health Dashboard

#### Notion Integration
Create Notion dashboard with:
- Environment status indicators
- Recent deployment history
- Current feature branch status
- Pending merge requests
- Production incident log
- Performance metric trends

#### Automated Sync with Notion
```javascript
// Example Notion API sync script
const notion = new Client({ auth: process.env.NOTION_API_KEY });

async function updateEnvironmentStatus(environment, status) {
  await notion.pages.update({
    page_id: process.env.NOTION_ENV_STATUS_PAGE_ID,
    properties: {
      [environment]: {
        select: { name: status }
      },
      'Last Updated': {
        date: { start: new Date().toISOString() }
      }
    }
  });
}
```

---

## 📋 Quick Reference

### Environment URLs Template
```
Development:  https://[project-name]-dev.[replit-domain]
Staging:      https://[project-name]-staging.[replit-domain]  
Production:   https://[project-name].[replit-domain]
```

### Essential Commands
```bash
# Environment setup
npm run setup:dev
npm run setup:staging  
npm run setup:prod

# Database operations
npm run db:migrate:dev
npm run db:seed:dev
npm run db:backup:prod

# Deployment
npm run deploy:staging
npm run deploy:prod
npm run rollback:prod
```

### Emergency Contacts
- **DevOps Lead**: [Contact Info]
- **Senior Developer**: [Contact Info]  
- **Product Manager**: [Contact Info]
- **Security Team**: [Contact Info]

---

## 🔗 Related Documentation
- [Main Project Notion Workspace](https://notion.so/[workspace-link])
- [API Documentation](https://[project-docs-url])
- [Security Protocols](https://notion.so/[security-docs])
- [Incident Response Playbook](https://notion.so/[incident-docs])

---

*Last Updated: [Current Date]*
*Document Version: 1.0*
*Maintained by: Development Team*