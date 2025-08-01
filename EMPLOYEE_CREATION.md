# Employee Account Creation Feature

## Overview

The Employee Account Creation feature allows administrators (OWNER and superAdmin roles) to create new employee accounts for their organization. This feature provides a user-friendly interface for adding cashiers and managers to the system.

## Features

### 🎯 **Role-Based Access Control**
- Only OWNER and superAdmin users can create employee accounts
- Employees can be assigned as either CASHIER or MANAGER roles
- Automatic permission assignment based on role

### 📝 **Comprehensive Form**
- **Employee Information**: Name, email, phone, address
- **Account Security**: Password creation with confirmation
- **Role Selection**: Visual role picker with permission descriptions
- **Form Validation**: Real-time validation with helpful error messages

### 🔐 **Security Features**
- Password hashing using bcryptjs
- Email uniqueness validation
- Password strength requirements (minimum 6 characters)
- Pre-verified accounts (no email verification required for admin-created accounts)

### 📧 **Email Notifications**
- Automatic welcome email sent to new employees
- Professional HTML email template
- Account details included in the email

## User Interface

### Create Employee Page (`/admin/create-employee`)

The page is divided into two main sections:

#### Left Panel - Employee Information Form
- **Basic Information**: Name, email, phone, address fields
- **Account Security**: Password and confirm password fields with show/hide toggles
- **Form Validation**: Real-time error messages and validation
- **Submit Button**: Creates the employee account

#### Right Panel - Role Selection & Permissions
- **Role Selection**: Visual cards for CASHIER and MANAGER roles
- **Permission Display**: Shows what each role can do
- **Interactive Selection**: Click to select role with visual feedback

### Success Flow
1. Admin fills out the form
2. Clicks "Create Employee Account"
3. System validates the data
4. Creates user account and tenant relationship
5. Sends welcome email to employee
6. Shows success dialog with options to create another or view all users

## API Endpoints

### POST `/api/admin/create-employee`
Creates a new employee account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@company.com",
  "password": "securepassword",
  "confirmPassword": "securepassword",
  "role": "CASHIER",
  "phone": "+1 (555) 123-4567",
  "address": "123 Main St, City, State"
}
```

**Response:**
```json
{
  "message": "Employee account created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john.doe@company.com",
    "role": "CASHIER",
    "isVerified": true
  }
}
```

### GET `/api/admin/users`
Fetches all users for the admin dashboard.

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name/email
- `role`: Filter by role
- `status`: Filter by status (active/inactive)

## Role Permissions

### CASHIER Role
- Process sales transactions
- Handle customer payments
- View product inventory
- Generate receipts

### MANAGER Role
- All cashier permissions
- Manage inventory
- View sales reports
- Manage products
- View analytics

## Database Schema

The feature uses the existing database schema:

- **User Model**: Stores basic user information
- **TenantUser Model**: Links users to tenants with specific roles
- **Tenant Model**: Organization/tenant information

## Security Considerations

1. **Authentication**: Only authenticated admins can access the feature
2. **Authorization**: Role-based access control (OWNER/superAdmin only)
3. **Input Validation**: Comprehensive server-side validation
4. **Password Security**: Bcrypt hashing with salt rounds
5. **Email Validation**: Proper email format validation
6. **Duplicate Prevention**: Email uniqueness check

## Error Handling

The system provides clear error messages for:
- Missing required fields
- Invalid email format
- Weak passwords
- Password mismatch
- Duplicate email addresses
- Insufficient permissions
- Server errors

## Email Templates

The welcome email includes:
- Professional HTML formatting
- Employee's name and account details
- Role and status information
- Login instructions
- Contact information for support

## Future Enhancements

Potential improvements for future versions:
- Bulk employee import
- Employee profile management
- Role permission customization
- Employee onboarding workflow
- Account activation/deactivation
- Password reset functionality
- Employee activity tracking

## Usage Instructions

1. **Access the Feature**: Navigate to Admin Dashboard → Users → Create Employee
2. **Fill Employee Details**: Enter name, email, and optional contact information
3. **Set Password**: Create a secure password and confirm it
4. **Select Role**: Choose between CASHIER or MANAGER role
5. **Review Permissions**: Check the permission list for the selected role
6. **Create Account**: Click "Create Employee Account" button
7. **Success**: Employee receives welcome email and can log in immediately

## Troubleshooting

### Common Issues:
- **Email already exists**: Use a different email address
- **Weak password**: Ensure password is at least 6 characters
- **Permission denied**: Ensure you have OWNER or superAdmin role
- **Email not sent**: Check SMTP configuration in environment variables

### Environment Variables Required:
- `SMTP_HOST`: SMTP server host
- `SMTP_PORT`: SMTP server port
- `SMTP_USER`: SMTP username
- `SMTP_PASS`: SMTP password
- `NEXTAUTH_URL`: Application URL for email links 