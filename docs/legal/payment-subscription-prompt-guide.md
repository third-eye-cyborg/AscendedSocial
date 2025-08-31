
# Payment & Subscription Documents Prompt Guide for Doc Legal AI

This document provides structured prompts for generating comprehensive payment and subscription legal documents for Ascended Social's Stripe integration.

## Platform Overview for AI Context

**Platform Name:** Ascended Social  
**Business Entity:** Third Eye Cyborg, LLC  
**Platform Type:** Spiritual community and wellness platform  
**Payment Processor:** Stripe  
**Subscription Model:** Monthly ($20/month) and Annual ($200/year) premium subscriptions  
**Target Audience:** Adults seeking spiritual growth and community (18+)  
**Jurisdiction:** United States (serving global users)  
**Key Features:** Premium spiritual features, unlimited energy, AI Oracle readings, custom sigil generation

## Document Requirements

### 1. Refund Policy

**Primary Prompt:**
```
Create a comprehensive refund policy for Ascended Social, a spiritual community platform operated by Third Eye Cyborg, LLC. The platform offers:

- Monthly premium subscriptions at $20/month
- Annual premium subscriptions at $200/year (17% discount)
- Digital spiritual services (AI Oracle readings, tarot features, unlimited energy)
- Premium community access
- Custom sigil generation tools

Key Requirements:
- Pro-rated refunds for subscription cancellations
- No refunds for consumed digital services (completed tarot readings, generated sigils)
- 7-day free trial period with full refund if canceled during trial
- Clear dispute resolution process
- Stripe payment processing integration
- Force majeure clauses for service interruptions
- Different refund rules for monthly vs annual subscriptions
- Account suspension/termination scenarios
- Processing timeframes (5-10 business days)
- Circumstances where refunds may be denied (violation of terms, chargebacks)

Special Considerations:
- Spiritual services are intangible digital products
- Some features consume "energy points" that cannot be restored
- Premium community access benefits cannot be "returned"
- Custom generated content (sigils, readings) are personalized and non-transferable
- Platform operates 24/7 with global users across time zones
```

**Secondary Prompt for Specific Scenarios:**
```
Expand the refund policy to address these specific scenarios for Ascended Social:

1. Mid-cycle cancellations: User cancels 15 days into monthly subscription
2. Annual subscription cancellations: User cancels 3 months into annual plan
3. Payment failure scenarios: Card declined, insufficient funds, expired cards
4. Account violations: User violates community guidelines during subscription period
5. Technical issues: Platform downtime affecting premium features
6. Disputed charges: User claims unauthorized subscription
7. Death or incapacity: Family member requests cancellation
8. Service changes: Major feature removal or platform changes
9. Currency fluctuations: International subscribers affected by exchange rates
10. Promotional pricing: Users on discounted rates who cancel early

Include specific calculation examples and customer service procedures for each scenario.
```

### 2. Billing Terms

**Primary Prompt:**
```
Create detailed billing terms for Ascended Social premium subscriptions processed through Stripe. Cover:

SUBSCRIPTION BILLING:
- Automatic recurring billing on monthly/annual cycles
- Billing date establishment (signup date becomes billing anniversary)
- Payment method requirements (valid credit/debit card)
- Currency (USD as primary, international conversions)
- Tax handling (sales tax, VAT, GST where applicable)
- Price change notifications (30-day advance notice)

PAYMENT PROCESSING:
- Stripe as exclusive payment processor
- PCI DSS compliance through Stripe
- Accepted payment methods (Visa, MasterCard, American Express, Discover)
- International payment acceptance and restrictions
- Payment authorization and capture process
- Stored payment method security

BILLING FAILURES:
- Failed payment retry schedule (immediate, 3 days, 7 days, final attempt)
- Account suspension timeline after failed payments
- Grace period for resolving payment issues (7 days)
- Service restoration upon successful payment
- Account termination after multiple failed attempts (30 days)
- Outstanding balance collection procedures

ACCOUNT MANAGEMENT:
- Upgrading from monthly to annual (immediate billing adjustment)
- Downgrading from annual to monthly (credit applied to future billing)
- Payment method updates and verification
- Billing address changes and verification
- Invoice generation and delivery (email)
- Payment history access and records retention

Include specific examples of billing calculations and failure scenarios.
```

**Technical Integration Prompt:**
```
Detail the technical aspects of billing terms for Ascended Social's Stripe integration:

STRIPE WEBHOOK HANDLING:
- Invoice payment succeeded/failed events
- Subscription status change notifications
- Payment method expiration warnings
- Chargeback and dispute notifications
- Customer portal session management

PRORATION CALCULATIONS:
- Mid-cycle plan changes and credits
- Partial period billing for upgrades/downgrades
- Annual to monthly conversion formulas
- Unused subscription time refund calculations
- Multiple subscription management (if applicable)

COMPLIANCE REQUIREMENTS:
- PCI DSS compliance through Stripe
- GDPR compliance for EU customers payment data
- CCPA compliance for California residents
- International payment regulations
- Anti-money laundering (AML) procedures
- Know Your Customer (KYC) requirements for high-value transactions

DUNNING MANAGEMENT:
- Automated payment retry logic
- Customer notification sequences for failed payments
- Alternative payment method requests
- Payment plan options for outstanding balances
- Final notice procedures before account termination
```

### 3. Subscription Cancellation Policy

**Primary Prompt:**
```
Create a comprehensive subscription cancellation policy for Ascended Social premium memberships. Address:

CANCELLATION METHODS:
- Self-service cancellation through user account settings
- Customer support assisted cancellation (email, chat)
- Stripe customer portal cancellation
- Automatic cancellation for payment failures
- Administrative cancellation for policy violations

CANCELLATION TIMING:
- Immediate cancellation with end-of-period access
- Mid-cycle cancellation with pro-rated refunds
- Annual subscription early termination
- Free trial cancellation (no charges)
- Grace period after missed payments

DATA RETENTION:
- Account data preservation for 90 days post-cancellation
- Premium content access removal (immediate)
- User-generated content retention (posts, comments remain)
- Export options for personal data before cancellation
- Permanent deletion procedures upon request

REACTIVATION PROCEDURES:
- Account reactivation within 90-day window
- Previous subscription level restoration
- Payment method re-verification
- Lost premium content recovery
- Pricing grandfathering for returning customers

SPECIFIC CANCELLATION SCENARIOS:
- Voluntary cancellation by user
- Involuntary cancellation for non-payment
- Policy violation cancellations
- Platform discontinuation
- Business closure procedures
- Transferred ownership situations

Include clear timelines, user rights, and company obligations for each cancellation type.
```

**Data and Access Management Prompt:**
```
Expand the cancellation policy to cover data handling and access management:

IMMEDIATE EFFECTS OF CANCELLATION:
- Premium feature access removal timeline
- Unlimited energy reverts to free tier limits
- AI Oracle and tarot feature restrictions
- Premium community space access removal
- Custom sigil generation tool restrictions
- Priority customer support changes

CONTENT AND DATA MANAGEMENT:
- User posts and comments remain public (community benefit)
- Private messages and personal data retention
- Generated spiritual content (readings, sigils) access
- Analytics and progress data export options
- Account restoration data preservation period
- GDPR "right to be forgotten" compliance

FINANCIAL OBLIGATIONS POST-CANCELLATION:
- Outstanding balance collection procedures
- Partial month/year refund calculations
- Payment dispute resolution during cancellation
- Final invoice generation and delivery
- Recurring payment cessation confirmation
- Receipt and confirmation documentation

CUSTOMER COMMUNICATION:
- Cancellation confirmation emails
- Service termination notifications
- Win-back campaign opt-out options
- Feedback collection on cancellation reasons
- Alternative service recommendations
- Re-engagement opportunity timelines

Include specific examples and edge case handling procedures.
```

## Integration Requirements

### Stripe-Specific Legal Considerations
```
Address these Stripe-specific requirements in all payment documents:

1. Stripe Terms of Service acknowledgment
2. Stripe's dispute and chargeback procedures
3. Stripe Connect compliance (if using third-party payouts)
4. Strong Customer Authentication (SCA) for European customers
5. Stripe's data processing and privacy requirements
6. Payment Card Industry (PCI) compliance through Stripe
7. Stripe's fraud prevention measures and customer impact
8. International payment acceptance limitations
9. Stripe's customer portal integration requirements
10. Webhook reliability and payment confirmation procedures
```

### Compliance and Legal Framework
```
Ensure all payment documents comply with:

UNITED STATES:
- Federal Trade Commission (FTC) regulations
- Consumer Financial Protection Bureau (CFPB) guidelines
- Electronic Fund Transfer Act (EFTA)
- Fair Credit Billing Act (FCBA)
- State-specific subscription law requirements

INTERNATIONAL:
- European Union Payment Services Directive (PSD2)
- General Data Protection Regulation (GDPR) payment data provisions
- UK Consumer Rights Act 2015
- Canadian Personal Information Protection and Electronic Documents Act (PIPEDA)
- Australian Consumer Law and Competition and Consumer Act

INDUSTRY-SPECIFIC:
- Software-as-a-Service (SaaS) billing best practices
- Digital content and services regulations
- Subscription commerce legal requirements
- Online marketplace compliance standards
```

## Document Formatting Requirements

### Structure for Each Document
1. **Executive Summary** - Key terms in plain language
2. **Definitions** - Clear terminology explanations
3. **Scope and Application** - Who and what is covered
4. **Detailed Terms** - Comprehensive policy explanations
5. **Procedures** - Step-by-step processes
6. **Customer Rights** - User protections and options
7. **Company Obligations** - Service provider responsibilities
8. **Dispute Resolution** - Conflict resolution procedures
9. **Updates and Changes** - Policy modification procedures
10. **Contact Information** - Customer service and legal contacts

### Language and Accessibility
- Use clear, jargon-free language
- Provide examples and scenarios
- Include FAQ sections for common questions
- Ensure mobile-friendly formatting
- Offer translations for international users (if applicable)
- Comply with accessibility standards (WCAG 2.1 AA)

---

*These documents are essential for legal compliance and customer trust in Ascended Social's premium subscription service. Each policy should be reviewed by qualified legal counsel before implementation.*
