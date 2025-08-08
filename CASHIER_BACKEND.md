# Cashier Dashboard Backend Functionality

This document describes the backend functionality added to the cashier dashboard.

## Overview

The cashier dashboard now includes full backend integration with the following features:

- **Product Search**: Real-time product search with debouncing
- **Cart Management**: Add, remove, and update cart items with stock validation
- **Customer Management**: Search and create customers
- **Sales Processing**: Complete sales with payment processing and stock updates
- **State Management**: Centralized state management using React Context

## API Endpoints

### Product Search
- **GET** `/api/cashier/products/search?q={query}&tenantId={tenantId}`
  - Searches products by name, barcode, or category
  - Only returns products with stock > 0
  - Requires authentication and tenant ID

### Customer Management
- **GET** `/api/cashier/customers?q={query}&tenantId={tenantId}`
  - Searches customers by name, email, or phone
  - Requires authentication and tenant ID

- **POST** `/api/cashier/customers`
  - Creates a new customer
  - Body: `{ name, email?, phone?, tenantId }`
  - Requires authentication

### Sales Processing
- **POST** `/api/cashier/sales`
  - Processes a complete sale
  - Body: `{ items, total, paymentType, customerId?, tenantId }`
  - Updates product stock automatically
  - Creates sale and sale items in database
  - Requires authentication

### Tenant Information
- **GET** `/api/cashier/tenant`
  - Gets current user's tenant information
  - Returns: `{ tenantId, tenantName, role }`
  - Requires authentication

## Database Schema

The backend uses the existing Prisma schema with the following key models:

### Product
```prisma
model Product {
  id          String     @id @default(cuid())
  name        String
  price       Float
  stock       Int
  barcode     String?
  imageUrl    String?
  description String?
  category    String     @default("General")
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  saleItems   SaleItem[]
  createdAt   DateTime   @default(now())
}
```

### Customer
```prisma
model Customer {
  id        String   @id @default(cuid())
  name      String
  email     String?
  phone     String?
  tenantId  String
  createdAt DateTime @default(now())
  tenant    Tenant   @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  sales     Sale[]
}
```

### Sale
```prisma
model Sale {
  id          String     @id @default(cuid())
  total       Float
  paymentType String 
  createdAt   DateTime   @default(now())
  tenantId    String
  tenant      Tenant     @relation(fields: [tenantId], references: [id], onDelete: Cascade)
  userId      String
  user        User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  customerId  String?
  customer    Customer?  @relation(fields: [customerId], references: [id])
  items       SaleItem[]
}
```

## Frontend Components

### State Management
- **CashierContext**: Centralized state management for cart, customer, and payment
- **useCashier**: Hook to access cashier state and functions

### Key Components
1. **ProductSearch**: Real-time product search with dropdown results
2. **CartPanel**: Cart management with quantity controls and stock validation
3. **PaymentPanel**: Payment processing with customer selection
4. **CustomerQuickAdd**: Quick customer management

## Features

### Product Search
- Debounced search (300ms delay)
- Search by name, barcode, or category
- Stock validation
- Keyboard navigation (Enter to select first result)

### Cart Management
- Add products with automatic quantity merging
- Remove items
- Update quantities with validation
- Stock warnings for insufficient inventory
- Real-time total calculation with tax

### Customer Management
- Search existing customers
- Create new customers on-the-fly
- Customer selection for sales

### Sales Processing
- Payment type selection (Cash/Card)
- Customer association
- Stock validation and updates
- Transaction safety with database transactions
- Success/error handling

## Security

- All endpoints require authentication
- Tenant isolation (users can only access their tenant's data)
- Input validation and sanitization
- Database transaction safety for sales

## Error Handling

- Comprehensive error handling in all API endpoints
- User-friendly error messages
- Loading states for better UX
- Graceful fallbacks for network issues

## Usage Example

```typescript
// Search for products
const products = await searchProducts("iPhone", tenantId)

// Add to cart
addToCart({
  id: `${product.id}-${Date.now()}`,
  productId: product.id,
  name: product.name,
  price: product.price,
  quantity: 1,
  stock: product.stock
})

// Process sale
const result = await processSale({
  items: cartItems,
  total: getCartTotal(),
  paymentType: 'CASH',
  customerId: selectedCustomer?.id,
  tenantId: tenantId
})
```

## Testing

A test endpoint is available at `/api/cashier/test` to verify the API is working correctly.

## Future Enhancements

- Barcode scanning integration
- Receipt printing
- Discount/优惠券 support
- Multiple payment methods
- Sales history and reporting
- Inventory alerts
- Customer loyalty programs 