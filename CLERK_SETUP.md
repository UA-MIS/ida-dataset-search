# Clerk Authentication Setup - Admin Only

This project has been integrated with Clerk for user authentication with an **admin-only user management system**. Only administrators can create and manage users - there is no public sign-up functionality.

## 1. Environment Variables

Create a `.env.local` file in your project root and add the following Clerk environment variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key_here
CLERK_SECRET_KEY=your_secret_key_here
CLERK_WEBHOOK_SECRET=your_webhook_secret_here

# Database (if not already set)
DATABASE_URL="mysql://username:password@localhost:3306/database_name"
```

## 2. Get Clerk Keys

1. Go to [Clerk Dashboard](https://dashboard.clerk.com/)
2. Create a new application or select an existing one
3. Go to the "API Keys" section
4. Copy your `Publishable Key` and `Secret Key`

## 3. Set Up Webhook

1. In your Clerk Dashboard, go to "Webhooks"
2. Create a new webhook endpoint
3. Set the endpoint URL to: `https://your-domain.com/api/webhooks/clerk`
4. Select the following events:
   - `user.created`
   - `user.updated` (optional)
   - `user.deleted` (optional)
5. Copy the webhook signing secret and add it to your `.env.local` as `CLERK_WEBHOOK_SECRET`

## 4. Database Migration

Run the following command to ensure your database schema is up to date:

```bash
npx prisma db push
```

## 5. Features Implemented

### Authentication Flow

- **Login Page**: Uses Clerk's `SignIn` component with custom styling
- **No Public Sign-up**: Users cannot create accounts themselves
- **Protected Routes**: Admin routes are protected and require authentication
- **Admin User Management**: Only admins can create and manage users

### API Endpoints

- `POST /api/admin/users` - Create users (admin only)
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/webhooks/clerk` - Handle Clerk webhooks for user creation

### Components Updated

- **Navbar**: Shows different options based on authentication status
- **Admin Layout**: Protects admin routes with authentication
- **Admin Dashboard**: Added user management section
- **Login Page**: Integrated with Clerk's SignIn component

## 6. User Roles

To assign admin roles to users:

1. In Clerk Dashboard, go to "Users"
2. Select a user
3. Go to "Metadata" tab
4. Add a public metadata field: `role` with value `admin`

## 7. Admin User Management

### Creating Users

1. Sign in as an admin user
2. Go to the admin dashboard
3. Click on the "Users" tab
4. Click "Add New User"
5. Fill in the user details (email, first name, last name, role)
6. The user will be created in both Clerk and your database

### User Management Features

- Create new users with specific roles
- View all system users
- Assign admin or user roles
- Users are automatically synced between Clerk and your database

## 8. Testing

1. Start your development server: `npm run dev`
2. Visit `/login` to sign in (you'll need to create the first admin user in Clerk Dashboard)
3. Try accessing `/admin` - you should be redirected to login if not authenticated
4. After signing in as admin, you can access the user management section

## 9. Security Notes

- **No Public Sign-up**: Users cannot create accounts themselves
- **Admin-Only User Creation**: Only authenticated admins can create users
- **Role-Based Access**: API endpoints check for admin role
- **Webhook Validation**: All webhook requests are validated
- **Secure Authentication**: Passwords are handled by Clerk, not stored in your database

## 10. Initial Setup

To get started:

1. Set up your environment variables
2. Create your first admin user directly in the Clerk Dashboard
3. Assign the admin role to that user in Clerk Dashboard
4. Sign in with that user to access the admin panel
5. Use the admin panel to create additional users as needed

## 11. Customization

The authentication components are styled to match your existing design with red accents. You can customize the appearance by modifying the `appearance` prop in the SignIn component.
