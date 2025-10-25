# Admin & Role-Based Access Control Documentation

## Overview
The system now supports two user roles: **User** and **Admin** with role-based access control (RBAC).

## Roles

### 1. **User** (Default Role)
- Can register and login
- Can view their own profile
- Can update their own profile
- Can view all medicines
- Can view single medicine details
- **Cannot** create/edit/delete medicines
- **Cannot** view all users
- **Cannot** delete users

### 2. **Admin** (Privileged Role)
- All permissions of regular users
- **Can create medicines** (with images)
- **Can edit medicines** (update info, add/remove images)
- **Can delete medicines**
- **Can view all users**
- **Can delete users**
- Full system access

## Admin Credentials

### Default Admin Account
After running the admin seed script:

```
Email: admin@midivision.com
Password: Admin@123
Role: admin
```

## Setup Instructions

### 1. Run Migrations
First, apply the database migrations to add the role field:

```bash
npm run migration:run
```

This will:
- Add `role` enum column to users table
- Set default role as 'user' for all existing users

### 2. Create Admin User
Run the admin seed script:

```bash
npm run seed:admin
```

This will create the default admin account.

### 3. Create Additional Admins
To create more admin users, use the registration endpoint with role parameter:

```bash
POST /auth/register
Content-Type: multipart/form-data

Form Data:
- name: "Admin Name"
- email: "admin@example.com"
- password: "SecurePassword123!"
- role: "admin"  ← Add this field
- image: [optional file]
```

**Note:** In production, you should restrict who can create admin accounts!

## API Endpoints & Permissions

### Medicine Endpoints

#### ✅ Public Access (No Auth Required)
```
GET /medicines          - Get all medicines
GET /medicines/:id      - Get single medicine
```

#### 🔐 Admin Only
```
POST /medicines                        - Create medicine (with images)
PATCH /medicines/:id                   - Update medicine (add more images)
DELETE /medicines/:id                  - Delete medicine
DELETE /medicines/:id/images/:imageName - Delete medicine image
```

### User Endpoints

#### 🔐 Authenticated Users (Any Role)
```
GET /users/profile      - Get own profile
GET /users/:id          - Get user by ID
PUT /users/:id          - Update user profile (with image)
```

#### 🔐 Admin Only
```
GET /users              - Get all users
DELETE /users/:id       - Delete user
```

### Authentication Endpoints

#### ✅ Public Access
```
POST /auth/register     - Register new user (default role: user)
POST /auth/login        - Login (works for both users and admins)
POST /auth/logout       - Logout
```

## Usage Examples

### 1. Admin Login
```bash
POST http://localhost:3000/auth/login
Content-Type: application/json

{
  "email": "admin@midivision.com",
  "password": "Admin@123"
}
```

**Response:**
```json
{
  "user": {
    "id": "uuid",
    "name": "System Admin",
    "email": "admin@midivision.com",
    "phone": "+1234567890",
    "gender": "other",
    "image": null,
    "role": "admin"
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Create Medicine (Admin Only)
```bash
POST http://localhost:3000/medicines
Authorization: Bearer ADMIN_TOKEN
Content-Type: multipart/form-data

Form Data:
- name: "Aspirin"
- brand: "Bayer"
- details: "Pain reliever"
- origin: "Germany"
- sideEffects: "Nausea, stomach pain"
- usage: "For pain and fever"
- howToUse: "Take 1-2 tablets with water"
- images: [file1.jpg, file2.jpg]
```

### 3. View All Users (Admin Only)
```bash
GET http://localhost:3000/users
Authorization: Bearer ADMIN_TOKEN
```

**Response:**
```json
[
  {
    "id": "uuid1",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    ...
  },
  {
    "id": "uuid2",
    "name": "System Admin",
    "email": "admin@midivision.com",
    "role": "admin",
    ...
  }
]
```

### 4. Delete User (Admin Only)
```bash
DELETE http://localhost:3000/users/:userId
Authorization: Bearer ADMIN_TOKEN
```

### 5. Regular User Trying Admin Action (Forbidden)
```bash
POST http://localhost:3000/medicines
Authorization: Bearer USER_TOKEN
...

Response: 403 Forbidden
{
  "statusCode": 403,
  "message": "Forbidden resource",
  "error": "Forbidden"
}
```

## Testing

### Test Scenario 1: Regular User Access
1. Login as regular user
2. Try to create medicine → Should fail (403 Forbidden)
3. View medicines → Should succeed
4. View own profile → Should succeed

### Test Scenario 2: Admin Access
1. Login as admin
2. Create medicine → Should succeed
3. Edit medicine → Should succeed
4. Delete medicine → Should succeed
5. View all users → Should succeed
6. Delete user → Should succeed

## Security Notes

### 🔒 Important Security Considerations

1. **Protect Admin Registration**
   - In production, remove the ability to register as admin via public API
   - Use environment-based admin creation or secure admin panel

2. **Password Security**
   - Admin passwords are hashed using bcrypt
   - Change default admin password immediately

3. **JWT Token Security**
   - Tokens include user role in payload
   - Role is verified on every protected request
   - Use HTTPS in production

4. **Role Validation**
   - All admin endpoints use both `JwtAuthGuard` and `RolesGuard`
   - Role is checked against user's database role
   - Cannot be bypassed by token manipulation

## Implementation Details

### Files Modified/Created

**New Files:**
- `/src/auth/decorators/roles.decorator.ts` - Role decorator
- `/src/auth/guards/roles.guard.ts` - Role-based guard
- `/src/seed-admin.ts` - Admin seed script
- `/src/migrations/xxx-AddRoleToUsers.ts` - Migration

**Modified Files:**
- `/src/users/entities/user.entity.ts` - Added role field
- `/src/users/dto/register.dto.ts` - Added optional role field
- `/src/users/dto/user-response.dto.ts` - Include role in response
- `/src/medicines/medicines.controller.ts` - Added admin guards
- `/src/users/users.controller.ts` - Added admin guards
- `package.json` - Added seed:admin script

### Database Schema

```sql
-- Users table now has role column
ALTER TABLE users ADD COLUMN role users_role_enum DEFAULT 'user' NOT NULL;

-- Enum type
CREATE TYPE users_role_enum AS ENUM ('user', 'admin');
```

## Troubleshooting

### Issue: "Forbidden resource" even with admin login
**Solution:** Ensure migrations are run and role field exists in database

### Issue: Cannot create admin user
**Solution:** Check that role enum is properly created in database

### Issue: Regular users can access admin endpoints
**Solution:** Verify both `JwtAuthGuard` and `RolesGuard` are applied to endpoints

## Summary

✅ Role-based access control implemented
✅ Admin can manage medicines (create, edit, delete)
✅ Admin can view and delete users
✅ Regular users have limited permissions
✅ Secure authentication with role validation
✅ Admin seed script for easy setup
✅ Cookie-based authentication supported

All admin operations are now protected and only accessible by users with admin role!
