# Microservices Blog Backend

A backend system for a blogging platform built using a **microservices architecture**. The application is divided into independent services, with each service responsible for its own domain, application logic, and database.

The services communicate with each other through **HTTP requests using Axios**.

## Architecture

The project is composed of the following services:

* **Users Service** — authentication and user management
* **Posts Service** — post and tag management
* **Comments Service** — comment management
* **Admin Service** — administrative functionality

Each service has its **own database** and Prisma schema. A service does not directly access another service's database. Communication between services is handled through service APIs.

### High-Level Architecture

```text
                         ┌───────────────┐
                         │     Client    │
                         └───────┬───────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │    Microservices       │
                    │       Backend          │
                    └───────────┬────────────┘
                                │
             ┌──────────────────┼──────────────────┐
             │                  │                  │
             ▼                  ▼                  ▼
      ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
      │    Users    │    │    Posts    │    │  Comments   │
      │   Service   │    │   Service   │    │   Service   │
      └──────┬──────┘    └──────┬──────┘    └──────┬──────┘
             │                  │                  │
             ▼                  ▼                  ▼
        PostgreSQL         PostgreSQL         PostgreSQL
             │
             ▼
           Redis

                         ┌─────────────┐
                         │    Admin    │
                         │   Service   │
                         └──────┬──────┘
                                │
                                ▼
                           PostgreSQL


        Service-to-service communication:
                    HTTP / Axios
```

## Architecture Principles

This project follows several important microservices principles:

### Database per Service

Each service owns its own database.

```text
Users Service      → Users Database
Posts Service      → Posts Database
Comments Service   → Comments Database
Admin Service      → Admin Database
```

Services do not directly query or modify another service's database.

### Independent Services

Each service contains its own:

* `package.json`
* application entry point
* controllers
* routes
* middleware
* configuration
* Prisma schema
* database migrations

This allows each service to maintain its own domain logic.

### Service-to-Service Communication

Services currently communicate through synchronous HTTP requests using **Axios**.

For example:

```text
Posts Service
      │
      │ HTTP request
      ▼
Users Service
      │
      │ response
      ▼
Posts Service
```

Asynchronous message queues are planned as a future improvement for use cases where asynchronous communication would be more appropriate.

---

# Services

## Users Service

The Users Service is responsible for user-related functionality.

### Responsibilities

* User registration
* User authentication
* User management
* Authentication middleware
* OTP-related functionality
* Email functionality
* Redis integration
* User authorization

### Main Technologies

* Node.js
* Express.js
* PostgreSQL
* Prisma
* Redis
* Nodemailer

### Directory

```text
users/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── generated/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── package.json
└── .env.example
```

---

# Posts Service

The Posts Service manages blog posts and tags.

### Responsibilities

* Post management
* Tag management
* Author-related authorization
* Post database operations
* Media handling
* S3 integration
* Presigned URL generation
* Object deletion

### Main Technologies

* Node.js
* Express.js
* PostgreSQL
* Prisma
* AWS S3
* Axios

### Directory

```text
posts/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── generated/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── package.json
└── .env.example
```

---

# Comments Service

The Comments Service manages comments associated with posts.

### Responsibilities

* Creating comments
* Managing comments
* Comment authorization
* User authentication checks
* Communication with other services where required

### Main Technologies

* Node.js
* Express.js
* PostgreSQL
* Prisma
* Axios

### Directory

```text
comments/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── config/
│   ├── controllers/
│   ├── generated/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── package.json
└── .env.example
```

---

# Admin Service

The Admin Service is responsible for administrative functionality.

### Responsibilities

* Administrative operations
* Admin authorization
* Admin-specific routes
* Administrative middleware

### Main Technologies

* Node.js
* Express.js

### Directory

```text
admin/
├── src/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── routes/
│   └── utils/
├── package.json
└── .env.example
```

---

# Technology Stack

## Backend

* **Node.js**
* **Express.js**

## Database

* **PostgreSQL**
* **Prisma ORM**

## Authentication & Security

* Authentication middleware
* JWT-based authentication where applicable
* Role-based authorization
* Password handling

## Infrastructure / Services

* **Redis** — used by the Posts Service
* **AWS S3** — used by the Posts Service for object storage
* **Nodemailer** — email functionality
* **Axios** — service-to-service HTTP communication

---

# Project Structure

```text
.
├── admin/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       └── utils/
│
├── comments/
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── generated/
│       ├── middlewares/
│       ├── routes/
│       └── utils/
│
├── posts/
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── generated/
│       ├── middlewares/
│       ├── routes/
│       └── utils/
│
├── users/
│   ├── .env.example
│   ├── package.json
│   ├── prisma/
│   │   ├── migrations/
│   │   └── schema.prisma
│   └── src/
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── generated/
│       ├── middlewares/
│       ├── routes/
│       └── utils/
│
├── .gitignore
└── README.md
```

---

# Environment Variables

Each service has its own environment configuration.

```text
admin/.env.example
comments/.env.example
posts/.env.example
users/.env.example
```

The actual `.env` files should **never be committed to Git**.

To create a local environment file, copy the appropriate example:

```bash
cp users/.env.example users/.env
```

```bash
cp posts/.env.example posts/.env
```

```bash
cp comments/.env.example comments/.env
```

```bash
cp admin/.env.example admin/.env
```

Then configure the required values for each service.

---

# Installation

## 1. Clone the repository

```bash
git clone <your-repository-url>
```

Navigate into the project:

```bash
cd <project-directory>
```

## 2. Install dependencies

Each service is an independent Node.js application.

### Users

```bash
cd users
npm install
```

### Posts

```bash
cd ../posts
npm install
```

### Comments

```bash
cd ../comments
npm install
```

### Admin

```bash
cd ../admin
npm install
```

---

# Database Setup

Each service has its own Prisma schema and database migrations.

After configuring the required `DATABASE_URL` for a service, generate the Prisma Client:

```bash
npx prisma generate
```

Apply the database migrations:

```bash
npx prisma migrate dev
```

Run these commands from the relevant service directory.

For example:

```bash
cd users

npx prisma generate
npx prisma migrate dev
```

The same process applies to the other services.

---

# Running the Services

Each service runs independently.

## Users Service

```bash
cd users
npm run dev
```

## Posts Service

```bash
cd posts
npm run dev
```

## Comments Service

```bash
cd comments
npm run dev
```

## Admin Service

```bash
cd admin
npm run dev
```

Make sure each service is configured with its correct environment variables and database connection.

---

# API Documentation

API documentation will be maintained as the project develops.

The API consists of separate endpoints exposed by each microservice.

Examples include:

```text
Users Service
    ├── Authentication
    └── User management

Posts Service
    ├── Posts
    └── Tags

Comments Service
    └── Comments

Admin Service
    └── Administrative operations
```

A Postman collection and/or OpenAPI documentation can be added in the future.

---

# Prisma Migrations

Each service maintains its own database schema and migrations.

```text
users/prisma/migrations/
posts/prisma/migrations/
comments/prisma/migrations/
```

Migrations are committed to the repository so that the database schema can be reproduced when setting up the project.

Generated Prisma clients are generated locally and are not required to be committed to the repository.

---

# Current Development Status

The current version focuses on establishing the core microservices architecture and service boundaries.

### Currently Implemented

* Microservices architecture
* Independent services
* Database per service
* PostgreSQL
* Prisma ORM
* Prisma migrations
* Service-to-service HTTP communication
* Axios
* Authentication and authorization
* Redis integration
* Email functionality
* S3 object storage
* Admin functionality

### Not Yet Implemented

* Automated tests
* Request/input validation
* Asynchronous message queues
* Centralized logging
* CI/CD
* Containerized development environment

These are planned improvements rather than currently implemented features.

---

# Future Improvements

The project will continue to evolve with additional backend and distributed-system features.

### Validation

Introduce structured request validation to ensure that incoming API data is validated consistently.

### Automated Testing

Add unit and integration tests for individual services and important API flows.

### Message Queues

Introduce asynchronous communication for suitable workflows where synchronous HTTP communication is not necessary.

Potential use cases include:

```text
User events
Email processing
Notifications
Background tasks
Cross-service events
```

### Docker

Containerize the services and their infrastructure dependencies using Docker and Docker Compose.

### CI/CD

Add GitHub Actions to automatically:

* Install dependencies
* Generate Prisma clients
* Run tests
* Perform code quality checks
* Build services

### Observability

Improve production readiness with:

* Structured logging
* Request IDs
* Centralized logs
* Metrics
* Distributed tracing

---

# Development Philosophy

The project is being developed incrementally with a focus on understanding the underlying backend and distributed-system concepts rather than simply adding technologies.

The architecture will evolve as new requirements are introduced.

The goal is to maintain clear service boundaries while gradually improving:

* Reliability
* Maintainability
* Scalability
* Security
* Observability
* Developer experience

---

# License

This project is licensed under the MIT License.
