# Admin Setup Guide

## How to Assign Admin Privileges

To make a user an admin in the 4 Star Fragrance eCommerce platform, you need to update the `is_admin` field in the `profiles` table in your Supabase database.

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Navigate to **Table Editor** in the left sidebar
3. Select the **profiles** table
4. Find the user you want to make an admin
5. Click on the `is_admin` field for that user
6. Change the value from `false` to `true`
7. Save the changes

### Method 2: Using SQL Editor

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor** in the left sidebar
3. Run the following SQL command:

```sql
-- Replace 'user-uuid-here' with the actual user ID from auth.users table
UPDATE public.profiles
SET is_admin = true
WHERE id = 'user-uuid-here';
```

### Method 3: Finding the User ID

To find a user's ID:

1. Go to **Authentication** > **Users** in Supabase dashboard
2. Find the user by their email
3. Copy their UUID (it will be in the format: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
4. Use this UUID in Method 2 above

### Verifying Admin Access

After setting `is_admin = true`:

1. Have the user log out and log back in
2. They should now see an "Admin" link in the navigation bar
3. Clicking it will take them to the admin dashboard at `/admin`
4. They will have access to:
   - Dashboard overview with statistics
   - Product management
   - Order management
   - Category management

### Security Notes

- Only trusted users should be given admin privileges
- Admin users can view all orders, modify products, and manage the entire catalog
- The `is_admin` field is protected by Row Level Security (RLS) policies
- Regular users cannot promote themselves to admin
- Always use secure passwords for admin accounts

### Revoking Admin Access

To remove admin privileges:

```sql
UPDATE public.profiles
SET is_admin = false
WHERE id = 'user-uuid-here';
```

The user will need to log out and back in for changes to take effect.
