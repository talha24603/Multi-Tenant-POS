# Multi-Tenant Point of Sale (POS) System

A modern cloud-based Multi-Tenant Point of Sale (POS) application built to help businesses manage sales, inventory, customers, employees, and reporting from a single platform. The system supports multiple independent businesses (tenants), ensuring complete data isolation while sharing the same application infrastructure.

---

## Table of Contents

- Overview
- Features
- Multi-Tenant Architecture
- User Roles
- Technology Stack
- System Architecture
- Project Structure
- Installation
- Environment Variables
- Database Design
- API Modules
- Security
- Future Improvements
- Contributors
- License

---

# Overview

The Multi-Tenant POS System is a Software-as-a-Service (SaaS) application where multiple businesses can register and operate independently on the same platform.

Each tenant has isolated data, including:

- Products
- Categories
- Customers
- Sales
- Inventory
- Employees
- Settings

Although all tenants share the same application and database, every request is automatically scoped to the authenticated tenant, ensuring complete data separation.

---

# Features

## Tenant Management

- Business registration
- Tenant onboarding
- Tenant-specific settings
- Subscription-ready architecture

---

## Authentication

- Secure login
- JWT / NextAuth authentication
- Role-Based Access Control (RBAC)
- Protected routes

---

## Dashboard

- Daily sales summary
- Revenue statistics
- Low-stock alerts
- Recent transactions
- Business insights

---

## Product Management

- Add products
- Update products
- Delete products
- Product categories
- Barcode support
- Product search

---

## Inventory Management

- Stock tracking
- Stock adjustments
- Purchase records
- Inventory history
- Low-stock notifications

---

## Sales Management

- Create sales invoices
- Apply discounts
- Tax calculation
- Multiple payment methods
- Print receipts
- Sales history

---

## Customer Management

- Customer profiles
- Purchase history
- Loyalty-ready architecture

---

## Employee Management

- Employee accounts
- Role assignment
- Permission management

---

## Reports

- Daily sales
- Monthly sales
- Revenue reports
- Inventory reports
- Best-selling products

---

# Multi-Tenant Architecture

Each business is treated as an independent tenant.

```
                 Application
                      │
      ┌───────────────┼───────────────┐
      │               │               │
   Tenant A        Tenant B        Tenant C
      │               │               │
 Products        Products        Products
 Customers       Customers       Customers
 Orders          Orders          Orders
 Inventory       Inventory       Inventory
```

Each request includes the authenticated tenant, and all database queries are filtered using the `tenantId`.

Example:

```ts
await prisma.product.findMany({
  where: {
    tenantId: session.user.tenantId
  }
})
```

This ensures complete data isolation between businesses.

---

# User Roles

| Role | Responsibilities |
|------|------------------|
| Owner | Full system access |
| Manager | Manage sales, inventory, employees |
| Cashier | Create sales and manage customers |

---

# Technology Stack

## Frontend

- Next.js 14+
- React
- TypeScript
- Tailwind CSS

## Backend

- Next.js API Routes
- Prisma ORM

## Database

- PostgreSQL

## Authentication

- NextAuth
- JWT Sessions

## State Management

- Redux Toolkit

---

# System Architecture

```
                    Client Browser
                          │
                    Next.js Frontend
                          │
                 Server Actions / REST APIs
                          │
                    Prisma ORM
                          │
                     PostgreSQL
```

---

# Project Structure

```
multi-tenant-pos/

├── app/
│   ├── dashboard/
│   ├── products/
│   ├── inventory/
│   ├── sales/
│   ├── customers/
│   ├── employees/
│   └── api/
│
├── components/
│
├── lib/
│
├── prisma/
│
├── public/
│
├── middleware.ts
│
└── README.md
```

---

# Database Design

Major entities include:

- Tenant
- User
- Role
- Permission
- Product
- Category
- Inventory
- Customer
- Sale
- Sale Item
- Payment
- Supplier

Relationships:

```
Tenant
   │
   ├── Users
   ├── Products
   ├── Customers
   ├── Sales
   ├── Inventory
   └── Categories
```

---

# API Modules

## Authentication

```
POST /api/auth/login
POST /api/auth/logout
```

---

## Products

```
GET    /api/products
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

---

## Inventory

```
GET    /api/inventory
POST   /api/inventory
PUT    /api/inventory/:id
```

---

## Sales

```
GET    /api/sales
POST   /api/sales
GET    /api/sales/:id
```

---

## Customers

```
GET    /api/customers
POST   /api/customers
PUT    /api/customers/:id
```

---

# Installation

## Clone Repository

```bash
git clone https://github.com/your-username/multi-tenant-pos.git

cd multi-tenant-pos
```

---

## Install Dependencies

```bash
npm install
```

---

## Configure Environment

Create a `.env` file.

```env
DATABASE_URL=

NEXTAUTH_URL=http://localhost:3000

NEXTAUTH_SECRET=

GOOGLE_CLIENT_ID=

GOOGLE_CLIENT_SECRET=
```

---

## Database

Generate Prisma Client

```bash
npx prisma generate
```

Run migrations

```bash
npx prisma migrate dev
```

Seed database

```bash
npm run seed
```

---

## Start Development Server

```bash
npm run dev
```

Visit:

```
http://localhost:3000
```

---

# Security

- Role-Based Access Control (RBAC)
- Tenant data isolation
- Secure password hashing
- Session authentication
- CSRF protection
- Input validation
- SQL injection prevention through Prisma
- Route protection using middleware

---

# Performance Optimizations

- Server Components
- Route Handlers
- Lazy Loading
- Image Optimization
- Prisma Query Optimization
- Database Indexing
- Pagination
- Caching

---

# Future Enhancements

- Multi-branch support
- Offline POS mode
- Barcode scanner integration
- Receipt printer support
- SMS notifications
- Email invoices
- Supplier portal
- Purchase management
- Expense tracking
- Accounting integration
- Analytics dashboard
- Mobile application
- Subscription billing (SaaS)

---

# Contributors

| Name | Role |
|------|------|
| Talha | Full Stack Developer |

---

# License

This project is licensed under the MIT License.

---

# Screenshots

Include screenshots of:

- Login
- Dashboard
- Product Management
- Inventory
- Sales Screen
- Customer Management
- Reports

---

# Acknowledgements

This project demonstrates the implementation of a scalable SaaS-based Multi-Tenant Point of Sale system using modern web technologies and best practices, including tenant isolation, secure authentication, and efficient data management.
