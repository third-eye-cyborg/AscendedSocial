# Ascended Social - Project Overview Specification

## Overview
Ascended Social is a mystical social media platform that merges spirituality with technology, facilitating spiritual engagement, personalized oracle readings, and community building among spiritually-minded individuals.

## Problem Statement
Traditional social media platforms lack spiritual context and meaningful engagement around personal growth, mystical experiences, and spiritual community building. Users seeking spiritual connection and guidance are scattered across generic platforms that don't understand or support their journey.

## Goals
- **Primary**: Create a unified platform for spiritual social interaction and guidance
- **Secondary**: Provide personalized spiritual insights through AI-powered oracle readings
- **Success Criteria**: Active spiritual community with engagement around chakra-based content and oracle guidance

## Requirements

### Functional Requirements
- **User Authentication**: Secure login/registration with session management
- **Content Sharing**: Text, image, and video posts with spiritual categorization
- **Chakra Classification**: Automatic AI-powered categorization of content into seven chakra types
- **Oracle System**: Personalized daily readings and spiritual recommendations
- **Energy System**: Monthly refreshing energy points for premium engagements
- **3D Starmap**: Interactive visualization of spiritual community connections
- **Premium Subscriptions**: Stripe-powered payment system for enhanced features

### Non-Functional Requirements
- **Performance**: Sub-2 second page loads, real-time updates for community features
- **Security**: GDPR compliance, secure token handling, privacy-first analytics
- **Scalability**: Support for thousands of concurrent users
- **User Experience**: Intuitive spiritual-themed interface with smooth interactions

## Current Architecture
- **Frontend**: React/TypeScript with Vite, shadcn/ui components
- **Backend**: Node.js/Express with TypeScript, RESTful APIs
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Storage**: Google Cloud Storage for media files
- **AI**: OpenAI GPT-4 for content analysis and oracle readings
- **Payments**: Stripe for subscription management

## Dependencies
- **External Services**: OpenAI API, Google Cloud Storage, Stripe, Replit Auth
- **Development Tools**: Figma MCP, Storybook, Cypress/Playwright testing
- **Infrastructure**: Cloudflare Zero Trust, PostHog analytics, OneSignal notifications

## Current Status
Platform is operational with core features implemented including authentication, content sharing, chakra classification, oracle system, and premium subscriptions. Current focus on mobile authentication improvements and cross-platform compatibility.