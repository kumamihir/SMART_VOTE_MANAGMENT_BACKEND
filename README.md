# SMART VOTE MANAGEMENT BACKEND

[![Node.js](https://img.shields.io/badge/Node.js-16.x+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-blue.svg)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-5.x+-brightgreen.svg)](https://www.mongodb.com/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

A secure, role-based Voter Management System backend implementing real-world election workflows with hierarchical approval processes. This system streamlines voter registration and verification through a three-tier role structure: **VOTER → BLO → ERO**.

## 📋 Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Role Hierarchy](#role-hierarchy)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Security Features](#security-features)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

The Smart Vote Management Backend is a comprehensive solution designed to modernize and secure the voter registration and management process. It implements a real-world election workflow that mirrors actual electoral systems, ensuring integrity, transparency, and security throughout the voter lifecycle.

### What Problem Does It Solve?

Traditional voter management systems often face challenges such as:
- **Duplicate registrations** leading to voter fraud
- **Lack of transparency** in approval processes
- **Security vulnerabilities** in voter data management
- **Inefficient workflows** between different administrative levels
- **Poor audit trails** making it difficult to track changes

This system addresses these issues by implementing a hierarchical, role-based workflow with built-in duplicate detection, comprehensive audit logging, and secure JWT-based authentication.

## ✨ Key Features

### 🔐 Security & Authentication
- **JWT-based authentication** with secure token management
- **Role-based access control (RBAC)** with three distinct user levels
- **Password hashing** using industry-standard algorithms
- **Session management** with token expiration and refresh mechanisms
- **API rate limiting** to prevent abuse

### 👥 Role-Based Workflow
- **Three-tier hierarchy**: VOTER → BLO (Booth Level Officer) → ERO (Electoral Registration Officer)
- **Sequential approval process** ensuring proper verification at each level
- **Delegation capabilities** for administrative users
- **Override permissions** for emergency situations

### 🔍 Duplicate Detection
- **Multi-level duplicate checking** across various data points:
  - Aadhaar number verification
  - Voter ID cross-referencing
  - Name and date of birth matching
  - Address similarity detection
  - Biometric data comparison (if integrated)
- **Fuzzy matching algorithms** to catch variations in names
- **Historical data comparison** to prevent re-registration

### 📊 Audit Trail & Logging
- **Complete audit logs** for every action in the system
- **Change tracking** showing who modified what and when
- **Compliance reporting** for electoral commission requirements
- **Searchable audit history** with filtering capabilities

### 📝 Voter Management
- **Registration workflow** with document upload
- **Status tracking** (Pending → Under Review → Approved/Rejected)
- **Amendment requests** for correcting voter information
- **Bulk operations** for efficient data management
- **Export functionality** for reports and analysis

### 🔔 Notifications
- **Email notifications** for status updates
- **SMS alerts** for critical actions
- **Dashboard notifications** for administrative users
- **Webhook support** for third-party integrations

## 🛠 Technology Stack

### Backend Framework
- **Node.js** (v16.x or higher) - JavaScript runtime
- **Express.js** (v4.x) - Web application framework
- **TypeScript** (optional) - For type-safe development

### Database
- **MongoDB** (v5.x or higher) - NoSQL database
- **Mongoose** - ODM (Object Document Mapping) library

### Authentication & Security
- **jsonwebtoken** - JWT implementation
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting middleware
- **cors** - Cross-Origin Resource Sharing

### Validation & Processing
- **joi** or **express-validator** - Request validation
- **multer** - File upload handling
- **nodemailer** - Email sending

### Logging & Monitoring
- **winston** or **morgan** - Application logging
- **dotenv** - Environment variable management

### Testing
- **Jest** - Testing framework
- **Supertest** - HTTP assertion library
- **MongoDB Memory Server** - In-memory database for testing

## 🏗 System Architecture

```
┌─────────────────┐
│   Client Apps   │
│  (Web/Mobile)   │
└────────┬────────┘
         │
         │ HTTPS/REST API
         │
┌────────▼────────┐
│  API Gateway    │
│  (Express.js)   │
├─────────────────┤
│ • Authentication│
│ • Rate Limiting │
│ • CORS          │
│ • Validation    │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
┌───▼───┐ ┌──▼──────┐
│ Auth  │ │ Business│
│ Layer │ │ Logic   │
│       │ │ Layer   │
└───┬───┘ └──┬──────┘
    │        │
    └────┬───┘
         │
┌────────▼────────┐
│  Data Access    │
│     Layer       │
│   (Mongoose)    │
└────────┬────────┘
         │
┌────────▼────────┐
│    MongoDB      │
│   Database      │
└─────────────────┘
```

### Request Flow

1. **Client Request** → API Gateway receives HTTP request
2. **Authentication** → JWT token validated
3. **Authorization** → Role-based permissions checked
4. **Validation** → Request data validated against schema
5. **Business Logic** → Core application logic executed
6. **Database Operation** → Data read/written to MongoDB
7. **Response** → JSON response returned to client
8. **Audit Log** → Action logged for compliance

## 👮 Role Hierarchy

The system implements a three-tier role hierarchy mirroring real-world election administration:

### 1. VOTER (Base Level)
**Responsibilities:**
- Register for voter enrollment
- Submit personal information and documents
- View own registration status
- Update personal information (with approval)
- Request corrections or amendments

**Permissions:**
- `voter:read:self` - View own voter record
- `voter:create:self` - Create registration
- `voter:update:self` - Request updates (pending approval)

**Workflow:**
```
Register → Upload Documents → Wait for BLO Review
```

### 2. BLO - Booth Level Officer (Middle Level)
**Responsibilities:**
- Review voter registrations in assigned booth area
- Verify submitted documents
- Perform initial duplicate checks
- Approve or reject registrations with comments
- Forward approved registrations to ERO
- Manage booth-level voter data

**Permissions:**
- `voter:read:booth` - View voters in assigned booth
- `voter:update:booth` - Update voter status in booth
- `voter:approve:level1` - First-level approval
- `voter:reject:level1` - First-level rejection
- `duplicate:check:booth` - Run duplicate detection

**Workflow:**
```
Receive Application → Verify Documents → Check Duplicates → 
Approve/Reject → Forward to ERO (if approved)
```

### 3. ERO - Electoral Registration Officer (Top Level)
**Responsibilities:**
- Final review of BLO-approved registrations
- Comprehensive duplicate detection across jurisdiction
- Final approval or rejection
- Oversee multiple BLOs
- Generate reports and analytics
- Handle escalations and appeals
- Manage electoral roll

**Permissions:**
- `voter:read:all` - View all voters in jurisdiction
- `voter:update:all` - Update any voter record
- `voter:approve:level2` - Final approval
- `voter:reject:level2` - Final rejection
- `duplicate:check:all` - Run jurisdiction-wide checks
- `report:generate` - Generate compliance reports
- `user:manage` - Manage BLO accounts

**Workflow:**
```
Receive from BLO → Deep Duplicate Check → Final Verification → 
Approve/Reject → Add to Electoral Roll
```

### Approval Flow Diagram

```
┌──────────┐
│  VOTER   │
│ Submits  │
└─────┬────┘
      │
      │ Registration
      │
┌─────▼────┐
│   BLO    │
│ Reviews  │ ───→ [Reject] → Notification to Voter
└─────┬────┘
      │
      │ Approves
      │
┌─────▼────┐
│   ERO    │
│  Final   │ ───→ [Reject] → Notification to Voter & BLO
│  Review  │
└─────┬────┘
      │
      │ Approves
      │
┌─────▼─────┐
│ Electoral │
│   Roll    │
└───────────┘
```

## 📦 Prerequisites

Before setting up the project, ensure you have the following installed:

- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** (v8.x or higher) or **yarn** (v1.22.x or higher)
- **MongoDB** (v5.x or higher) - [Download](https://www.mongodb.com/try/download/community)
  - Or use **MongoDB Atlas** (cloud-hosted) - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Git** - For version control
- **Postman** or similar tool - For API testing (optional)

### System Requirements
- **RAM**: 4GB minimum, 8GB recommended
- **Storage**: 10GB free space
- **OS**: Linux, macOS, or Windows

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/kumamihir/SMART_VOTE_MANAGMENT_BACKEND.git
cd SMART_VOTE_MANAGMENT_BACKEND
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
```

### 3. Set Up Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your configuration (see [Configuration](#configuration) section).

### 4. Set Up Database

**Option A: Local MongoDB**
```bash
# Start MongoDB service
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

**Option B: MongoDB Atlas**
- Create a cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Get your connection string
- Add it to `.env` file

### 5. Initialize Database

```bash
npm run db:seed  # Seed initial data (optional)
```

### 6. Start the Application

**Development Mode:**
```bash
npm run dev
```

**Production Mode:**
```bash
npm start
```

The server will start on `http://localhost:3000` (or your configured port).

## ⚙️ Configuration

### Environment Variables

Create a `.env` file with the following variables:

```env
# Server Configuration
NODE_ENV=development
PORT=3000
API_VERSION=v1

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smart_vote_db
# For MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/smart_vote_db

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=24h
JWT_REFRESH_SECRET=your-refresh-token-secret
JWT_REFRESH_EXPIRES_IN=7d

# Security
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000  # 15 minutes
RATE_LIMIT_MAX_REQUESTS=100

# Email Configuration (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=noreply@smartvote.com

# SMS Configuration (optional)
SMS_PROVIDER=twilio
TWILIO_ACCOUNT_SID=your-account-sid
TWILIO_AUTH_TOKEN=your-auth-token
TWILIO_PHONE_NUMBER=+1234567890

# File Upload Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes
ALLOWED_FILE_TYPES=image/jpeg,image/png,application/pdf

# Duplicate Detection
DUPLICATE_NAME_THRESHOLD=0.85  # Similarity threshold (0-1)
DUPLICATE_ADDRESS_THRESHOLD=0.80

# Logging
LOG_LEVEL=info  # error, warn, info, debug
LOG_FILE_PATH=./logs/app.log

# CORS Configuration
CORS_ORIGIN=http://localhost:3001,http://localhost:3000
```

### Configuration Files

#### `config/database.js`
Database connection configuration with connection pooling and retry logic.

#### `config/auth.js`
Authentication strategies, JWT settings, and password policies.

#### `config/roles.js`
Role definitions and permission mappings.

## 📡 API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

#### POST `/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "voter@example.com",
  "password": "SecurePassword123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890",
  "role": "VOTER"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "userId": "64a5f7e8c9d2b1a3e4f5g6h7",
    "email": "voter@example.com",
    "role": "VOTER"
  }
}
```

#### POST `/auth/login`
Authenticate and receive JWT tokens.

**Request Body:**
```json
{
  "email": "voter@example.com",
  "password": "SecurePassword123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "64a5f7e8c9d2b1a3e4f5g6h7",
      "email": "voter@example.com",
      "role": "VOTER",
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

#### POST `/auth/refresh`
Refresh access token using refresh token.

#### POST `/auth/logout`
Invalidate current session.

### Voter Management Endpoints

#### POST `/voters/register`
Submit voter registration (VOTER role).

**Headers:**
```
Authorization: Bearer <access_token>
```

**Request Body:**
```json
{
  "personalInfo": {
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1990-01-15",
    "gender": "M",
    "aadhaarNumber": "123456789012",
    "phone": "+1234567890",
    "email": "john.doe@example.com"
  },
  "address": {
    "houseNumber": "123",
    "street": "Main Street",
    "landmark": "Near City Mall",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400001"
  },
  "documents": {
    "aadhaarCard": "file_id_from_upload",
    "photo": "file_id_from_upload",
    "addressProof": "file_id_from_upload"
  }
}
```

#### GET `/voters/:id`
Get voter details by ID.

#### PUT `/voters/:id`
Update voter information.

#### GET `/voters/me`
Get current user's voter information.

#### GET `/voters`
List voters (BLO/ERO only, filtered by permission).

**Query Parameters:**
- `status` - Filter by status (pending, approved, rejected)
- `booth` - Filter by booth (BLO role)
- `page` - Page number
- `limit` - Results per page
- `search` - Search by name, ID, etc.

### BLO (Booth Level Officer) Endpoints

#### GET `/blo/pending-applications`
Get pending voter applications for review.

#### PUT `/blo/applications/:id/approve`
Approve voter application (first level).

**Request Body:**
```json
{
  "comments": "Documents verified, no duplicates found",
  "verificationDetails": {
    "documentsVerified": true,
    "addressVerified": true,
    "photoMatched": true
  }
}
```

#### PUT `/blo/applications/:id/reject`
Reject voter application.

**Request Body:**
```json
{
  "reason": "Invalid address proof",
  "comments": "Submitted document is not clear"
}
```

#### POST `/blo/duplicate-check`
Run duplicate detection for a voter.

### ERO (Electoral Registration Officer) Endpoints

#### GET `/ero/pending-approvals`
Get applications pending final approval.

#### PUT `/ero/applications/:id/finalize`
Final approval or rejection.

#### GET `/ero/statistics`
Get dashboard statistics.

#### GET `/ero/reports/electoral-roll`
Generate electoral roll report.

#### GET `/ero/blo-performance`
Get BLO performance metrics.

### Duplicate Detection Endpoints

#### POST `/duplicates/check`
Check for potential duplicates.

**Request Body:**
```json
{
  "aadhaarNumber": "123456789012",
  "name": "John Doe",
  "dateOfBirth": "1990-01-15",
  "address": "123 Main Street, Mumbai"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "hasDuplicates": true,
    "matches": [
      {
        "voterId": "64a5f7e8c9d2b1a3e4f5g6h7",
        "matchType": "aadhaar",
        "confidence": 1.0,
        "details": {
          "name": "John Doe",
          "status": "approved"
        }
      }
    ]
  }
}
```

### Audit Log Endpoints

#### GET `/audit/logs`
Get audit logs (ERO only).

**Query Parameters:**
- `userId` - Filter by user
- `action` - Filter by action type
- `startDate` - From date
- `endDate` - To date
- `page` - Page number

### File Upload Endpoints

#### POST `/upload/document`
Upload voter documents.

**Form Data:**
- `file` - Document file (PDF, JPG, PNG)
- `documentType` - Type of document (aadhaar, photo, address_proof)

## 🗄 Database Schema

### User Collection
```javascript
{
  _id: ObjectId,
  email: String (unique, required),
  password: String (hashed, required),
  role: String (enum: ['VOTER', 'BLO', 'ERO'], required),
  firstName: String (required),
  lastName: String (required),
  phone: String (required),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date,
  lastLogin: Date
}
```

### Voter Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  voterId: String (unique, auto-generated),
  personalInfo: {
    firstName: String (required),
    lastName: String (required),
    dateOfBirth: Date (required),
    gender: String (enum: ['M', 'F', 'O'], required),
    aadhaarNumber: String (unique, required),
    phone: String (required),
    email: String (required)
  },
  address: {
    houseNumber: String (required),
    street: String (required),
    landmark: String,
    city: String (required),
    state: String (required),
    pincode: String (required),
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  documents: {
    aadhaarCard: String (file reference),
    photo: String (file reference),
    addressProof: String (file reference)
  },
  status: String (enum: ['pending', 'blo_approved', 'approved', 'rejected'], default: 'pending'),
  boothNumber: String,
  assignedBLO: ObjectId (ref: 'User'),
  assignedERO: ObjectId (ref: 'User'),
  workflow: {
    submittedAt: Date,
    bloReviewedAt: Date,
    bloReviewedBy: ObjectId (ref: 'User'),
    bloComments: String,
    eroReviewedAt: Date,
    eroReviewedBy: ObjectId (ref: 'User'),
    eroComments: String,
    finalStatus: String,
    rejectionReason: String
  },
  duplicateChecks: [{
    checkedAt: Date,
    checkedBy: ObjectId (ref: 'User'),
    result: String (enum: ['no_duplicate', 'potential_duplicate', 'confirmed_duplicate']),
    matches: Array
  }],
  createdAt: Date,
  updatedAt: Date
}
```

### AuditLog Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  action: String (required),
  resourceType: String (required),
  resourceId: ObjectId,
  changes: Object,
  ipAddress: String,
  userAgent: String,
  timestamp: Date (default: Date.now),
  metadata: Object
}
```

### DuplicateRecord Collection
```javascript
{
  _id: ObjectId,
  voter1: ObjectId (ref: 'Voter', required),
  voter2: ObjectId (ref: 'Voter', required),
  matchType: String (enum: ['aadhaar', 'name', 'address', 'dob'], required),
  confidence: Number (0-1, required),
  status: String (enum: ['pending_review', 'confirmed_duplicate', 'false_positive']),
  reviewedBy: ObjectId (ref: 'User'),
  reviewedAt: Date,
  resolution: String,
  createdAt: Date
}
```

### RefreshToken Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId (ref: 'User', required),
  token: String (required),
  expiresAt: Date (required),
  createdAt: Date,
  isRevoked: Boolean (default: false)
}
```

## 🔒 Authentication & Authorization

### JWT Token Structure

**Access Token Payload:**
```json
{
  "userId": "64a5f7e8c9d2b1a3e4f5g6h7",
  "email": "voter@example.com",
  "role": "VOTER",
  "iat": 1704567890,
  "exp": 1704654290
}
```

### Authorization Middleware

The system uses custom middleware to check permissions:

```javascript
// Example: Protecting routes
router.get('/voters', 
  authenticate,  // Verify JWT token
  authorize('BLO', 'ERO'),  // Check role
  getVoters
);
```

### Permission Matrix

| Action | VOTER | BLO | ERO |
|--------|-------|-----|-----|
| Register self | ✅ | ❌ | ❌ |
| View own data | ✅ | ✅ | ✅ |
| View booth voters | ❌ | ✅ | ✅ |
| View all voters | ❌ | ❌ | ✅ |
| Approve (Level 1) | ❌ | ✅ | ✅ |
| Approve (Level 2) | ❌ | ❌ | ✅ |
| Run duplicate check | ❌ | ✅ | ✅ |
| Generate reports | ❌ | ❌ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

## 🔐 Security Features

### 1. Authentication Security
- **Password hashing** using bcrypt with configurable salt rounds
- **JWT tokens** with short expiration times (24h for access, 7d for refresh)
- **Token blacklisting** on logout
- **Refresh token rotation** to prevent token theft

### 2. Input Validation
- **Schema validation** using Joi/express-validator
- **SQL injection prevention** through MongoDB (NoSQL)
- **XSS protection** through input sanitization
- **File upload validation** (type, size, extension)

### 3. Rate Limiting
- **Request rate limiting** per IP address
- **API endpoint throttling** to prevent abuse
- **Distributed rate limiting** support for scaled deployments

### 4. Data Protection
- **Encryption at rest** for sensitive data
- **HTTPS enforcement** in production
- **Secure headers** using Helmet.js
- **CORS configuration** to restrict origins

### 5. Audit Trail
- **Comprehensive logging** of all actions
- **User activity tracking** with IP and user agent
- **Change history** for all data modifications
- **Compliance reporting** for audits

### 6. Duplicate Detection
- **Multi-factor matching** (Aadhaar, name, DOB, address)
- **Fuzzy matching algorithms** for name variations
- **Levenshtein distance** for similarity scoring
- **Manual review workflow** for edge cases

## 🧪 Testing

### Running Tests

**Run all tests:**
```bash
npm test
```

**Run with coverage:**
```bash
npm run test:coverage
```

**Run specific test suite:**
```bash
npm test -- auth.test.js
```

**Run in watch mode:**
```bash
npm run test:watch
```

### Test Structure

```
tests/
├── unit/
│   ├── models/
│   │   ├── user.test.js
│   │   └── voter.test.js
│   ├── services/
│   │   ├── auth.service.test.js
│   │   └── duplicate.service.test.js
│   └── utils/
│       └── validators.test.js
├── integration/
│   ├── auth.integration.test.js
│   ├── voter.integration.test.js
│   └── workflow.integration.test.js
└── e2e/
    ├── voter-registration.e2e.test.js
    └── approval-workflow.e2e.test.js
```

### Writing Tests

Example test case:

```javascript
describe('Voter Registration', () => {
  it('should register a new voter successfully', async () => {
    const response = await request(app)
      .post('/api/v1/voters/register')
      .set('Authorization', `Bearer ${voterToken}`)
      .send(validVoterData);
    
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.voterId).toBeDefined();
  });
});
```

## 🚀 Deployment

### Deployment Options

#### 1. Traditional Server (VPS/Dedicated)

**Prerequisites:**
- Ubuntu 20.04+ or similar Linux distribution
- Node.js installed
- MongoDB installed or Atlas connection
- Nginx (recommended for reverse proxy)

**Steps:**
```bash
# 1. Clone repository
git clone https://github.com/kumamihir/SMART_VOTE_MANAGMENT_BACKEND.git
cd SMART_VOTE_MANAGMENT_BACKEND

# 2. Install dependencies
npm install --production

# 3. Set up environment variables
cp .env.example .env
nano .env  # Edit configuration

# 4. Install PM2 for process management
npm install -g pm2

# 5. Start application
pm2 start npm --name "smart-vote-backend" -- start

# 6. Set up PM2 to start on boot
pm2 startup
pm2 save

# 7. Configure Nginx reverse proxy
sudo nano /etc/nginx/sites-available/smart-vote
```

**Nginx Configuration:**
```nginx
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 2. Docker Deployment

**Dockerfile** (create this file):
```dockerfile
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
```

**docker-compose.yml** (create this file):
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=mongodb://mongo:27017/smart_vote_db
    depends_on:
      - mongo
    restart: unless-stopped

  mongo:
    image: mongo:5
    volumes:
      - mongodb_data:/data/db
    restart: unless-stopped

volumes:
  mongodb_data:
```

**Deploy with Docker:**
```bash
docker-compose up -d
```

#### 3. Cloud Platforms

**Heroku:**
```bash
heroku create smart-vote-backend
heroku addons:create mongolab:sandbox
git push heroku main
```

**AWS (Elastic Beanstalk):**
```bash
eb init -p node.js smart-vote-backend
eb create smart-vote-production
eb deploy
```

**Google Cloud Run:**
```bash
gcloud run deploy smart-vote-backend \
  --source . \
  --platform managed \
  --region us-central1
```

### Environment-Specific Configurations

**Production Checklist:**
- [ ] Set `NODE_ENV=production`
- [ ] Use strong JWT secrets
- [ ] Enable HTTPS
- [ ] Configure proper CORS origins
- [ ] Set up MongoDB replica set
- [ ] Enable rate limiting
- [ ] Configure log rotation
- [ ] Set up monitoring and alerts
- [ ] Enable database backups
- [ ] Configure firewall rules

## 📊 Monitoring & Maintenance

### Health Check Endpoint

```bash
GET /health
```

Response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-06T12:00:00.000Z",
  "uptime": 86400,
  "database": "connected",
  "version": "1.0.0"
}
```

### Logging

Logs are stored in `./logs/` directory:
- `app.log` - General application logs
- `error.log` - Error logs
- `access.log` - HTTP access logs
- `audit.log` - Audit trail logs

### Database Backups

**Automated backup script:**
```bash
#!/bin/bash
# backup.sh
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="$MONGODB_URI" --out="/backups/backup_$DATE"
```

Add to crontab:
```bash
0 2 * * * /path/to/backup.sh
```

## 🤝 Contributing

We welcome contributions to improve the Smart Vote Management Backend!

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes**
4. **Write/update tests**
5. **Ensure tests pass**
   ```bash
   npm test
   ```
6. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```
7. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```
8. **Open a Pull Request**

### Coding Standards

- Follow **ESLint** configuration
- Use **Prettier** for code formatting
- Write **meaningful commit messages**
- Add **JSDoc comments** for functions
- Write **unit tests** for new features
- Update **documentation** as needed

### Commit Message Format

```
Type: Short description

Longer description if needed

Fixes #issue_number
```

**Types:**
- `Add:` - New feature
- `Fix:` - Bug fix
- `Update:` - Update existing feature
- `Refactor:` - Code refactoring
- `Docs:` - Documentation changes
- `Test:` - Test changes
- `Chore:` - Maintenance tasks

## 📄 License

This project is licensed under the **MIT License**.

```
MIT License

Copyright (c) 2024 Smart Vote Management Backend

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 📞 Support & Contact

- **Issues**: [GitHub Issues](https://github.com/kumamihir/SMART_VOTE_MANAGMENT_BACKEND/issues)
- **Email**: support@smartvote.com
- **Documentation**: [Wiki](https://github.com/kumamihir/SMART_VOTE_MANAGMENT_BACKEND/wiki)

## 🙏 Acknowledgments

- **Node.js Community** - For the excellent runtime environment
- **MongoDB** - For the flexible database solution
- **Express.js** - For the robust web framework
- **Election Commission** - For workflow inspiration
- **All Contributors** - For their valuable contributions

---

**Made with ❤️ for transparent and secure elections**

*Last Updated: January 2024*
